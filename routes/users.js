var express = require('express');
var router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.User.findAll()
  .then(users => {
    res.json(users)
  })
});

router.post('/', (req, res) => {
  db.User.create({
    name: req.body.name,
    email: req.body.email,
    gamerTag: req.body.gamerTag
  })
  .then(user => {
    res.json(user)
  })
  .catch(error => {
    if (error.errors) {
      res.json(error.errors.map(e => e.message))
    } else {
      res.json({error: 'failed to create user'})
    }
  })
})

router.post('/register', async (req, res) => {
  const users = await db.User.findAll({
    where: {
      email: req.body.email
    }
  })
  //checking to see if email is taken
  if (users.length) {
    res.status(422).json({error: 'email already in use'});
  }
  //if all data is not included then send error
  if (!req.body.email || !req.body.name || !req.body.gamerTag || !req.body.password) {
    return res.status(422).json({error: 'please include all required fields'})
  } 
  // hash password
  const hash = await bcrypt.hash(req.body.password, 10);

  // create new user and send it back
  const newUser = await db.User.create({
    email: req.body.email,
    name: req.body.name,
    gamerTag: req.body.gamerTag,
    password: hash
  })

  res.json(newUser);
})

router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(422).render('error', {
      locals: {
        error: 'please include all required fields'
      }
    })
  }
  //assign user to variable 
  const user = await db.User.findOne({
    where: {
      email: req.body.email
    }
  })
  // check if user exists
  if (!user) {
    return res.status(404).render('error', {
      locals: { error: 'could not find user with that email'}
    })
  }
  //compare user input and password
  const match = await bcrypt.compare(req.body.password, user.password)
  //throw error if wrong
  if (!match) {
    return res.status(401).render('error', {
      locals: { error: 'incorrect password'}
    })
  }
  //set user data on session
  req.session.user = user;

  res.redirect('/games');
})

router.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/');
})


module.exports = router;
