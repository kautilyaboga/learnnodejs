const { parse } = require("csv-parse");
const fs = require("fs");
const path = require('path');

const results = [];
const habitablePlanets = [];

// fs.createReadStream(path.)

function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
  &&  planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
  && planet['koi_prad'] < 1.6;
}

function loadPlanetsData () {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname,'../..','data',"kepler_data.csv"))
    .pipe(parse({
      comment : "#",
      columns : true,
    }))
    .on("data", (data) => {
      // console.log(data);
      results.push(data);
  
      if (isHabitablePlanet(data)) {
        habitablePlanets.push(data);
      }
    })
    .on("error", (err)=>{
      console.log(err);
      // console.log("done");
      reject(err)
    })
    .on("end", ()=>{
      // console.log(results);
      console.log(`No of Habitable Plantes Found : ${habitablePlanets?.length}`);
      console.log("done");
      resolve();
    })

  })

}

module.exports = {
  planets: habitablePlanets,
  loadPlanetsData,
};