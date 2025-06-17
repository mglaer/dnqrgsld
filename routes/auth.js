var express = require('express');
const fs = require('fs');
var router = express.Router();
const cors = require('cors');
const { makeHash, makeToken } = require('../lib/auth_tools');

const { pdb } = require('../lib/postgress');

//------------------------------------------------------------------------------------
/*
const passport=require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(username, password, done) {
      if(username === "admin" && password === "admin"){
          return done(null, username);
      } else {
          return done("unauthorized access", false);
      }
  }
));
passport.serializeUser(function(user, done) {
  if(user) done(null, user);
});

passport.deserializeUser(function(id, done) {
  done(null, id);
});
//passport.deserializeUser((id, done)=>{
//  passport.deserializeUser((id, done) => {
    //User.findById(id).then((user) => {
//      done(null, user);
    //}).catch(done);
  //});
//});

router.use(passport.initialize());
router.use(passport.session());

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
      return next()
  }
  return res.status(400).json({"statusCode" : 400, "message" : "not authenticated"})
}
//
router.use(require('cookie-parser')());
router.use(require('body-parser').urlencoded({ extended: true }));
router.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
*/
//------------------------------------------------------------------------------------
router.use(cors({
  credentials: true,
  origin: true
}));

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
//-----------------------------------------------------------------------------------
//router.get('/protected', passport.authenticate('jwt', {session:false}),function (req,res) {
router.get('/protected', cors(), function (req, res) {

  res.status(200).json({ success: true, msg: 'authorized' });
});
//-----------------------------------------------------------------------------------
/*router.post('/signin', cors(),
  function (req, res) {
    console.log('login request');
    res.send({ username: 'anikolaev', password: '123' });

  });*/

//----------------------------------------------------------------------------------
router.post('/login', cors(),
  //passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    //res.redirect('/');
    console.log('login request mglaer');

    var _sql_str = 'SELECT * FROM "Security"."Users" WHERE "Users"."Login" = \'' + req.body.Login + '\';    ';
    pdb.any(_sql_str)
      .then(data => {
        if (data.length > 0) {
          if (data[0].Password === makeHash(req.body.Password)) {
            //---            
            let _token = makeToken(data[0].ID);
            //---

            res.send({ jwt: _token, result: data[0], error: null });
          }
          else {
            res.send({ result: null, error: 'Неправильный пароль' });
          }
        }
        else {
          res.send({ result: null, error: 'Пользователь не найден' });
        }
        //res.send(data[0]);
      })
      .catch(error => {
        console.log(error);
        res.send(error);
      });

    //res.send({ username: 'anikolaev', password: '123' });
  });
//-----------------------------------------------------------------------------------
router.get('/logout', cors(),
  function (req, res) {
    req.logout();
    res.redirect('/');
  });
//-----------------------------------------------------------------------------------    




module.exports = router;
