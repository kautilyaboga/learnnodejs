const path = require('path');
const express = require('express')
const cors = require ('cors');

const planetsRouter = require('./routes/planets/planets.router')

const app = express();


app.use(cors({
  origin : 'http://localhost:3000',
}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'../public')))
// app.use(express.static('../public')) // Doesn't work
app.use('/planets',planetsRouter)
// Code works without below code in local but to make sure it runs in every environment
// it is better to be included. 
app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'../public/index.html'))
})


module.exports = app;