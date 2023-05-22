const path = require('path');
const express = require('express')
const cors = require ('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.router')
const launchesRouter = require('./routes/launches/launches.router')

const app = express();

app.use(cors({
  origin : 'http://localhost:3000',
}));

app.use(
  morgan(
    "combined",
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  )
);

app.use(express.json());
app.use(express.static(path.join(__dirname,'../public')))
// app.use(express.static('../public')) // Doesn't work

app.use('/planets',planetsRouter)
app.use('/launches',launchesRouter)

// This code needs to be at the bottom of the app middleware.
// Code works without below code in local but to make sure it runs in every environment
// it is better to be included. 
app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'../public/index.html'))
})

module.exports = app;