const mongoose = require('mongoose');


const MONGO_URL = 'mongodb+srv://kautilyab:7gdhlv2HYQgTaCZb@nasa-db.s3mceoa.mongodb.net/nasa?retryWrites=true&w=majority';


mongoose.connection.once('open', ()=>{
  console.log('MongoDb connection is ready!');
})

mongoose.connection.on('error', (err)=>{
  console.log(err)
})
