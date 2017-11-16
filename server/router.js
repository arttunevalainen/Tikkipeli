var express = require('express');
var path = require('path');
var router = express.Router();
var Tikki = require('./Tikki.js');


var tikki = new Tikki();


router.post('/addplayer', function(req, res) {
    tikki.addPlayer(req.body.playername).then((json) => {
        res.json({ status: json.status, name: json.name, playercode: json.playercode });
    });
})


router.get('/setup', function(req, res) {
    tikki.startRound().then((status) => {
        res.json({ tikkistatus: status });
    });
})

router.get('/getlobby', function(req, res) {
    tikki.getLobby().then((json) => {
        res.json({ players: json.players });
    });
});

router.post('/readyinlobby', function(req, res) {
    tikki.setReady(req.body).then((json) => {
        res.json({ status: json.status });
    });
});



module.exports = router;