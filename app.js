const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const es6Renderer = require('express-es6-template-engine');
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./models');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const gamesRouter = require('./routes/games');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const store = new SequelizeStore({ db: db.sequelize });
app.use(
  session({
    secret: 'secret', //used to sign the cookie
    resave: false, //update session even with no changes
    saveUninitialized: true, //always create a session
    cookie: {
      secure: false, //true onnly accepts https req
      maxAge: 2592000 //time in seconds
    },
    store: store
  })
);
store.sync();

app.post('./login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  fakeFuncToGetUserData(username, password)
  .then((user) => {
    req.session.user = user;
    res.redirect('./dashboard')
  })
})

app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/games', gamesRouter);

module.exports = app;
