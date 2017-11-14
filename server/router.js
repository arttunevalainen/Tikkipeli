var express = require('express');
var path = require('path');
var router = express.Router();
const Tikki = require('./Tikki.js');


var tikki = new Tikki();


router.post('/addplayer', function(req, res) {
    tikki.addPlayer(req.body.playername).then((json) => {
        res.json({ namestatus: json.status, playercode: json.playercode });
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



module.exports = router;