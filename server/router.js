var express = require('express');
var path = require('path');
var router = express.Router();
var Tikki = require('./Tikki.js');


var tikki = new Tikki();


router.post('/addplayer', function(req, res) {
    tikki.addPlayer(req.body).then((json) => {
        res.json({  status: json.status, 
                    name: json.name, playercode: 
                    json.playercode, 
                    admin: json.admin });
    });
});

router.get('/getlobby', function(req, res) {
    tikki.getLobby().then((json) => {
        res.json({ status: json.status, players: json.players, gameready: json.gameready });
    });
});

router.post('/setup', function(req, res) {
    tikki.startGame(req.body).then((json) => {
        res.json({ status: json.status });
    });
});

router.post('/getGame', function(req, res) {
    tikki.getGame(req.body).then((json) => {
        res.json({  status: json.status, 
                    currentplayer: json.currentplayer, 
                    hand: json.hand, 
                    players: json.players, 
                    plays: json.plays, 
                    points: json.points, 
                    changestatus: json.changestatus });
    });
});

router.post('/sendPlay', function(req, res) {
    tikki.play(req.body).then((json) => {
        res.json({  status: json.status, 
                    points: json.points,
                    tikkiwinner: json.tikkiwinner,
                    twoend: json.twoend,
                    pokerwinner: json.pokerwinner,
                    winninghand: json.winninghand,
                    winningcards: json.winningcards });
    })
});

router.post('/changeCards', function(req, res) {
    tikki.changeCards(req.body).then((json) => {
        res.json({ status: json.status });
    });
});



module.exports = router;