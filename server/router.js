var express = require('express');
var path = require('path');
var router = express.Router();
var Tikki = require('./Tikki.js');
var Lobbies = require('./Lobbies.js');


var tikki = new Tikki();
var lobbies = new Lobbies();


router.post('/addplayer', function(req, res) {
    lobbies.newPlayer(req.body).then((json) => {
        res.json({  status: json.status, 
                    name: json.name, playercode: 
                    json.playercode });
    });
});

router.get('/getLobbies', function(req, res) {
    lobbies.getLobbies().then((json) => {
        res.json({ status: json.status, lobs: json.lobs });
    });
});

router.post('/leaveLobby', function(req, res) {
    lobbies.deletePlayerFromLobby(req.body).then((json) => {
        res.json({ status: json.status });
    });
});

router.post('/createLobby', function(req, res) {
    lobbies.createNewLobby(req.body).then((json) => {
        res.json({ status: json.status, admin: json.admin, lobbycode: json.lobbycode });
    });
});

router.post('/joinLobby', function(req, res) {
    lobbies.joinLobby(req.body).then((json) => {
        res.json({ status: json.status, admin: json.admin, lobbycode: json.lobbycode });
    });
});

router.post('/getlobby', function(req, res) {
    lobbies.getLobby(req.body).then((json) => {
        res.json({ status: json.status, admin: json.isadmin, players: json.players, gameready: json.gameready });
    });
});

router.post('/setup', function(req, res) {
    lobbies.startGame(req.body).then((json) => {
        res.json({ status: json.status });
    });
});

router.post('/getGame', function(req, res) {
    lobbies.getGame(req.body).then((json) => {
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
    lobbies.play(req.body).then((json) => {
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
    lobbies.changeCards(req.body).then((json) => {
        res.json({ status: json.status });
    });
});



module.exports = router;