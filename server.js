const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const {Strategy} = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

require('dotenv').config();

const PORT = 3000;

const config = {
  CLIENT_ID : process.env.CLIENT_ID,
  CLIENT_SECRET : process.env.CLIENT_SECRET,
  COOKIE_KEY_1 : process.env.COOKIE_KEY_1,
  COOKIE_KEY_2 : process.env.COOKIE_KEY_2,
}

const AUTH_OPTIONS = {
  callbackURL : '/auth/google/callback',
  clientID : config.CLIENT_ID,
  clientSecret : config.CLIENT_SECRET,
}


function verifyCallBack(accessToken, refreshToken, profile, done) {
  console.log('Google Profile', profile);
  done(null,profile);// Data from there is being sent to the session
}

//Saving the session to the cookie
passport.serializeUser((user,done)=>{
  // Choose properties to be sent to the client
  done(null, user.id);
});

// Data in user / Profile
// Google Profile {
//   id: '112581046993381290112',
//   displayName: undefined,
//   emails: [ { value: 'kautilyaboga@gmail.com', verified: true } ],
//   photos: [
//     {
//       value: 'https://lh3.googleusercontent.com/a-/AD_cMMTqoDGStCSDmN0q1v6gFZF25VTnwYJyitUaXVjCq7o=s96-c'
//     }
//   ],
//   provider: 'google',
//   _raw: '{\n' +
//     '  "sub": "112581046993381290112",\n' +
//     '  "picture": "https://lh3.googleusercontent.com/a-/AD_cMMTqoDGStCSDmN0q1v6gFZF25VTnwYJyitUaXVjCq7o\\u003ds96-c",\n' +
//     '  "email": "kautilyaboga@gmail.com",\n' +
//     '  "email_verified": true\n' +
//     '}',
//   _json: {
//     sub: '112581046993381290112',
//     picture: 'https://lh3.googleusercontent.com/a-/AD_cMMTqoDGStCSDmN0q1v6gFZF25VTnwYJyitUaXVjCq7o=s96-c',
//     email: 'kautilyaboga@gmail.com',
//     email_verified: true
//   }
// }

//Read the session from the cookie
passport.deserializeUser((obj,done)=>{
  done(null,obj);
});

// (config options, callback once user is authenticated)
passport.use(new Strategy(AUTH_OPTIONS,verifyCallBack))

const app = express();

app.use(helmet());

app.use(cookieSession({
  name : 'session',
  maxAge : 24 * 60 * 60 * 1000,
  keys : [config.COOKIE_KEY_2,config.COOKIE_KEY_1] // secret key
}));

app.use(passport.initialize()); // Sets passport session
app.use(passport.session()); // Sets passport session


function checkLoggedIn(req,res,next) {
  console.log('Current user id is', req.user);
  const isLoggedIn = req.isAuthenticated() && req.user;
  // const isLoggedIn = req.user;

  if (!isLoggedIn) {
    return res.status(401).json({
      error : "You must log in!"
    });
  }
  next();
}

app.get('/auth/google', 
passport.authenticate('google',{
  scope : ['email']
  // scope : ['email','profile']
}))

// This call back takes authorization code and gets token from the oauth server
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
  }),
  (req, res) => {
    console.log('Google called us back');
  }
);


app.get('/auth/logout',(req,res)=>{
  req.logout(); // Removes req.user and clears any logged in session
  return res.redirect('/'); 
})


app.get('/secret', checkLoggedIn, (req, res) => { // req.user
  return res.send('Your personal secret value is 42!');
});

app.get('/failure',(req,res)=>{
  return res.send('Failed to Login') 
})


app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','index.html'))
})


https.createServer({
  cert : fs.readFileSync('cert.pem'),
  key : fs.readFileSync('key.pem'),
}, app).listen(PORT, ()=>{
  console.log(`Listening to PORT : ${PORT}...`);
})

// https.createServer({
//   key: fs.readFileSync('key.pem'),
//   cert: fs.readFileSync('cert.pem'),
// }, app).listen(PORT, () => {
//   console.log(`Listening on port ${PORT}...`);
// });