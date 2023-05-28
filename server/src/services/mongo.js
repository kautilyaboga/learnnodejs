const mongoose = require('mongoose');


const MONGO_URL = process.env.MONGO_URL;


mongoose.connection.once('open', ()=>{
  console.log('MongoDb connection is ready!');
})

mongoose.connection.on('error', (err)=>{
  console.log(err)
})
