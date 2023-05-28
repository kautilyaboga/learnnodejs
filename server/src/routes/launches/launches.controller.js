const {getAllLaunches, scheduleNewLaunch, removeLaunch, existsLaunchWithId} = require('../../models/launches.model');

async function httpGetAllLaunches(req,res) {
    // return res.status(200).json(Array.from(launches.values()))
    return res.status(200).json(await getAllLaunches())
}

async function httpPostLaunch(req, res) {
  const launch = req.body;

  const { mission, rocket, launchDate, target } = launch;

  // console.log(launchDate);
  // console.log(!mission || !rocket || !launchDate || !target);

  // Inputs Validation
  if (!mission || !rocket || !launchDate || !target) {
    return res.status(400).json({
      error: "Missing required launch property",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  // if (launch.launchDate.toString() === 'Invalid Date') {
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid Launch Date",
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpRemoveLaunch(req, res) {
  const flightNumber = Number(req.params.id);

  // console.log(flightNumber);
  const existsLaunch = await existsLaunchWithId(flightNumber);
  // console.log(existsLaunch);

  if (!existsLaunch) {
    return res.status(404).json({
      error: "Could not find the Launch. Please check.",
    });
  }
  const aborted = await removeLaunch(flightNumber);
  if (!aborted) {
    return res.status(400).json({
      error : "Launch not aborted"
    })
  }
  return res.status(200).json({
    message : "Launch aborted",
    ok : true,
  });
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpRemoveLaunch
}


