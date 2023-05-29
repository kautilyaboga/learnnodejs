const axios = require('axios');
const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
//   flightNumber : 100, //flight_number
//   mission : "Kepler Exploration X", // name
//   rocket : 'Explorer IS1', // rocket.name
//   launchDate : new Date('December 27, 2030'), //date_utc
//   target : 'Kepler-442 b', // NA
//   customers : ['Kautilya', 'NASA'], // payload.customers for each payload
//   upcoming : true, //upcoming
//   success : true , //success
// };

// launches.set(launch.flightNumber,launch);
// saveLaunch(launch);

async function findLaunch(filter) {
try {
  return await launchesDatabase.findOne(filter);

} catch (error) {
 console.error(error); 
}
}

async function existsLaunchWithId(flightNumber) {
  console.log(flightNumber);
  const doesLaunchExist = findLaunch({flightNumber : flightNumber});
  return doesLaunchExist
  // return  launches.has(launchId)
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne()
    .sort('-flightNumber');
    if (!latestLaunch) {
      return DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber
}


const SPACRX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log('Downloading SpaceX Launch Data');
  const response = await axios.post(SPACRX_API_URL, {
    query : {},
    options: {
        pagination : false,
        populate : [
            {
                path : 'rocket',
                select: {
                    name : 1
                }
            },
            {
              path : 'payloads',
              select: {
                  customers : 1
              }
          }
        ]
    }
  });

  if (response?.status !== 200) {
    console.log("Problem Downloading Launch Data");
    throw new Error(response)
  }

  const launchDocs = response.data.docs;
  
  // const spaceXLaunches = launchDocs.map((launchDoc)=>{
  launchDocs.forEach(async (launchDoc)=>{
    const payloads = launchDoc?.payloads;
    const customers = payloads.flatMap((payload)=>{
      return payload['customers']
    });

    const launch = {
      flightNumber : launchDoc?.flight_number,
      mission : launchDoc?.name,
      rocket : launchDoc?.rocket?.name,
      launchDate : new Date(launchDoc?.date_utc),
      upcoming : launchDoc?.upcoming,
      success : launchDoc?.success,
      customers,
    }
    console.log(`${launch?.flightNumber} ${launch?.success}`);
    await saveLaunch(launch);
    // return launch
  });

  // console.log(spaceXLaunches);

  // const dataAddedResponse = await launchesDatabase.insertMany(spaceXLaunches);
}


async function loadLaunchData() {

  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log('Launch data already loaded.');
    return;
  }
  else{
    console.log('Launch data not loaded. Triggering populateLaunches()');
    await populateLaunches();
  }

  // await populateLaunches()
}


async function getAllLaunches(limit,skip) {
  return await launchesDatabase
  .find({}, {'_id' : 0, '_v' : 0})
  .sort({flightNumber: 1 }) //-1 for descending
  .skip(skip)
  .limit(limit);
  // return Array.from(launches.values()).filter((launch)=>launch.upcoming)
}

async function saveLaunch(launch) {
  try {
    await launchesDatabase.findOneAndUpdate({
      flightNumber: launch.flightNumber,
    },launch, {
      upsert : true,
    });
  } catch (error) {
    console.error(error);
  }

}

async function scheduleNewLaunch(launch) {

  const planet = await planets.findOne({
    keplerName : launch.target,
  })

  if (!planet) {
    throw new Error('No Matching Planet is Found.')
  }

  const newFlightNumber = await getLatestFlightNumber() + 1;

  const newLaunch = Object.assign(launch, {
    flightNumber: newFlightNumber,
    customers: ["Kautilya", "NASA"],
    upcoming: true,
    success: true,
  });

  await saveLaunch(newLaunch)
}

async function removeLaunch(flightNumber) {
  try {
    const aborted = await launchesDatabase.updateOne({
      flightNumber : flightNumber
    },{
      upcoming : false,
      success : false,
    })
    console.log(aborted);
    return aborted.acknowledged && aborted.modifiedCount === 1;
  } catch (error) {
    console.error(`Could not abort launch ${error}`);
  }
}

module.exports = {
  findLaunch,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  removeLaunch,
  loadLaunchData,
};