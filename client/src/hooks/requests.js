const BASE_API_URL = 'http://localhost:8000/v1';

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
  // console.log(launch);
  // Submit given launch data to launch system.  
  try {
    const response = await fetch(`${BASE_API_URL}/launches`,{
      method : "post",
      headers : {
        "Content-Type": 'application/json',
      },
      body : JSON.stringify(launch),
    });
  return response
  } 
  catch (error) {
    console.error(error);
    return {ok:false}
  }
}

async function httpAbortLaunch(id) {
  // Delete launch with given ID.
  try {
    const response = await fetch(`${BASE_API_URL}/launches/${id}`,{
      method : "DELETE",
      headers : {
        "Content-Type": 'application/json',
      },
    });
  return response
  } 
  catch (error) {
    console.error(error);
    return {ok:false}
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};