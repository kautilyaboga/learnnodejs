const express = require('express');

const app = express();

function delay(durationInSeconds) {
  const startTime = Date.now();
  while (Date.now() - startTime < durationInSeconds) {
    //event loop is blocked
  }
  return
}

app.get('/',(req,res)=>{
  res.send(`Performance example: ${process.pid}`);
})

app.get('/timer',(req,res)=>{
 //delay the response
 delay(9000)
 res.send(`Beep Ding Ding!  ${process.pid}`)
})


console.log(`Worker  ${process.pid} process started..`);
app.listen(3000);