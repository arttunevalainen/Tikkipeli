var express = require('express');
var path = require('path');
var router = express.Router();
const Tikki = require('./Tikki.js');


var tikki = new Tikki();


router.post('/addplayer', function(req, res) {
    tikki.addPlayer(req.name).then((json) => {
        res.json({ namestatus: json.status, playercode: json.code });
    });
})


router.get('/setup', function (req, res) {
    tikki.startRound().then((status) => {
        res.json({ tikkistatus: status });
    });
})



module.exports = router;