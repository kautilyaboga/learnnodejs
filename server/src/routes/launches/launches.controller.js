const {getAllLaunches, addNewLaunch, removeLaunch, existsLaunchWithId} = require('../../models/launches.model');

function httpGetAllLaunches(req,res) {
    // return res.status(200).json(Array.from(launches.values()))
    return res.status(200).json(getAllLaunches())
}

function httpPostLaunch(req,res) {
  const launch = req.body;

  const {mission, rocket, launchDate, target } = launch;

  console.log(launchDate);
  console.log(!mission || !rocket || !launchDate || !target);

  // Inputs Validation
  if (!mission || !rocket || !launchDate || !target) {
    return res.status(400).json({
      error :"Missing required launch property",
    })
  }

  launch.launchDate = new Date(launch.launchDate);

  // if (launch.launchDate.toString() === 'Invalid Date') {
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error :"Invalid Launch Date",
    })
  } 

  addNewLaunch(launch);
  return res.status(201).json(launch)
}

function httpRemoveLaunch(req, res) {
  const flightNumber = Number(req.params.id);

  console.log(flightNumber);

  if (!existsLaunchWithId(flightNumber)) {
    return res.status(404).json({
      error: "Could not find the Launch. Please check.",
    });
  }
  const response = removeLaunch(flightNumber);
  return res.status(200).json(response);
}

module.exports = {
  httpGetAllLaunches,
  httpPostLaunch,
  httpRemoveLaunch
}


