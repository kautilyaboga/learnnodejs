const launches = new Map();

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber : 100,
  mission : "Kepler Exploration X",
  rocket : 'Explorer IS1',
  launchDate : new Date('December 27, 2030'),
  target : 'Kepler-442 b',
  customers : ['Kautilya', 'NASA'],
  upcoming : true,
  success : true ,
};

// launches.set(launch.flightNumber,launch);
saveLaunch(launch);

async function existsLaunchWithId(flightNumber) {
  console.log(flightNumber);
  const doesLaunchExist = await launchesDatabase.findOne({flightNumber : flightNumber});
  console.log(doesLaunchExist);
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


async function getAllLaunches() {
  return await launchesDatabase.find({})
  // return Array.from(launches.values()).filter((launch)=>launch.upcoming)
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName : launch.target,
  })

  if (!planet) {
    throw new Error('No Matching Planet is Found.')
  }

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
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  removeLaunch,
};