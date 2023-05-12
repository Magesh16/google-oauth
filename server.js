const express = require('express');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
require('./auth.js');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'client')));

function isLoggedIn (req,res,next){
    req.user ? next() : res.sendStatus(401);
}

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }))

app.use(passport.initialize());
app.use(passport.session());

app.get('/', async(req,res)=>{
    res.sendFile('index.html');
})


app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/auth/protected',
        failureRedirect: '/auth/google/failure'
}));


app.get('/auth/google/failure', isLoggedIn, (req,res)=>{
    res.send("Something went wrong!!")
})

app.get('/auth/protected', isLoggedIn, (req,res)=>{
    let name = req.user.displayName;
    res.send(`Hello yooooo ${name}!!`)
})

app.get('/auth/logout', (req,res)=>{
    req.session.destroy();
    res.send("Meet u soon");
})

app.listen(3000, ()=>{
    console.log("Server at port 3000");
})