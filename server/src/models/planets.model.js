const { parse } = require("csv-parse");
const fs = require("fs");
const path = require('path');

const planets = require('./planets.mongo');

const results = [];
// const habitablePlanets = [];

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
    .on("data", async (data) => {
      // console.log(data);
      results.push(data);
  
      if (isHabitablePlanet(data)) {
        // habitablePlanets.push(data);
        // insert + update = upsert;
        await savePlanet(data);
      }
    })
    .on("error", (err)=>{
      console.log(err);
      // console.log("done");
      reject(err)
    })
    .on("end", async ()=>{
      const countPlanetsFound = await getAllPlanets();
      console.log(`No of Habitable Plantes Found : ${countPlanetsFound?.length}`);
      // console.log(`No of Habitable Plantes Found : ${habitablePlanets?.length}`);
      resolve();
    })

  })
}

async function getAllPlanets() {
  return await planets.find({},{
    '_id':0, '__v' : 0,
  });


  // return planets.find({
  //   keplerName : 'Kepler-62 f'
  // } , 
  // // List of fields from Planet Document
  // { 'keplerName' : 1, }
  // // Or we could give a string
  // // 'keplerName -anotherField',
  // );
}

async function savePlanet (planet){
  try {
    await planets.updateOne({
      keplerName : planet.kepler_name,
      // ...data
    },{
      keplerName : planet.kepler_name,
    },{
      upsert : true,
    });
  } catch (error) {
    console.error(`Could not save planet ${error}`)
  }

}

module.exports = {
  getAllPlanets,
  loadPlanetsData,
};