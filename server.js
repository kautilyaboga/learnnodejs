const express = require('express');
const path = require('path')

const app = express();
const PORT = 3001;

app.set('view engine','hbs');
app.set('views', path.join(__dirname,'views'));

const friendsRouter = require('./routes/friends.router')
const messagesRouter = require('./routes/messages.router')


app.listen(PORT,()=>{
  console.log(`Listening on ${PORT}`);
})


app.use((req,res,next)=>{
  const start = Date.now()
  next();
  // actions happen after this and comes back
  const delta = Date.now()-start
  console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);

})

app.use('/site',express.static('public'));
app.use(express.json())

app.get('/',(req,res)=>{
  res.render('index',{
    title : "My Friend are very cleve",
    caption : "Lets Go"
  })
})
app.use('/friends',friendsRouter); // Mounting the router on to app object.
app.use('/messages',messagesRouter);

