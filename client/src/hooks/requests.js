const BASE_API_URL = 'http://localhost:8000';

async function httpGetPlanets() {
  // Load planets and return as JSON.
  const response = await fetch(`${BASE_API_URL}/planets`);
  // console.log(response);
  return response.json()
}

async function httpGetLaunches() {
  // Load launches, sort by flight number, and return as JSON.
  const response = await fetch(`${BASE_API_URL}/launches`);
  // console.log(response);
  const fetchedLaunches = await response.json()
  return fetchedLaunches.sort((a,b)=> a.flightNumber - b.flightNumber)
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};