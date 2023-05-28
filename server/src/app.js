const path = require('path');
const express = require('express')
const cors = require ('cors');
const morgan = require('morgan');

const v1api = require('./routes/v1api')

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


app.use('/v1', v1api)
// app.use('/v2', v2api)

// This code needs to be at the bottom of the app middleware.
// Code works without below code in local but to make sure it runs in every environment
// it is better to be included. 
app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'../public/index.html'))
})

module.exports = app;