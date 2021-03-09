var express = require('express');
const db = require('../models');
var router = express.Router();
const checkAuth = require('../checkAuth')

/* GET home page. */
router.get('/', checkAuth, function(req, res, next) {
    db.Game.findAll()
    .then(games => {
        res.render('games', {
            locals: {
                games: games
            }
        })
    })
});

module.exports = router;