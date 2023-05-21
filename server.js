const express = require('express');
const app = express();
const PORT = 3001;

const friendsRouter = require('./routes/friends.router')
const messagesRouter = require('./routes/messages.router')

app.use(express.json())

app.listen(PORT,()=>{
  console.log(`Listening on ${PORT}`);
})


app.use((req,res,next)=>{
  const start = Date.now()
  next();
  // actions happen after this and comes back
  const delta = Date.now()-start
  console.log(`${req.method} ${req.baseUrl} ${delta}ms`);

})


app.use('/friends',friendsRouter); // Mounting the router on to app object.
app.use('/messages',messagesRouter);

