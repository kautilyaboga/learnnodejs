const http = require('http');
const mongoose = require('mongoose');
const app = require('./app')

const {loadPlanetsData} = require('./models/planets.model')

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://kautilyab:7gdhlv2HYQgTaCZb@nasa-db.s3mceoa.mongodb.net/nasa?retryWrites=true&w=majority';


const server  = http.createServer(app);

mongoose.connection.once('open', ()=>{
  console.log('MongoDb connection is ready!');
})

mongoose.connection.on('error', (err)=>{
  console.log(err)
})

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsData();

  server.listen(PORT,()=>{
    console.log(`Listening to Port : ${PORT}`);
  })
}

startServer();