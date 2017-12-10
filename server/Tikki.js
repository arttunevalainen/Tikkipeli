var CardDeck = require('./CardDeck.js');
var Hand = require('./Hand.js');
var Card = require('./Card.js');
var Player = require('./Player.js');
var Round = require('./Round.js');



function Tikki() {

    this.players = [];
    this.gameready = false;
    this.adminplayer = undefined;

    this.currentRound;

    /** CONST ATTRIBUTES */
    this.maxplayers = 8;

}

/** Add new player to the lobby */
Tikki.prototype.addPlayer = function(req) {

    var tikki = this;

    return new Promise(function(resolve, reject) {

        var nameTaken = false;
        var name =  req.playername;

        for(var i = 0; i < tikki.players.length; i++) {
            if(tikki.players[i].name === name) {
                nameTaken = true;
            }
        }
        
        if(!nameTaken && name.length > 2 && tikki.players.length < tikki.maxplayers) {
            var a = new Player(name);

            var isadmin = "false";
            if(tikki.players.length === 0) {
                tikki.adminplayer = a;
                isadmin = "true";
            }

            tikki.players.push(a);
            
            a.makeid().then(() => {
                var json = {status: 'ok', name: name, playercode: a.code, admin: isadmin};
                resolve(json)
            });
        }
        else {
            var json = {status: 'Error creating player'};
            resolve(json);
        }
    }).catch((err) => {
        console.log(err);
    });
}

/** Get players in lobby */
Tikki.prototype.getLobby = function() {

    var tikki = this;

    return new Promise(function(resolve, reject) {

        var gameready = 'false';
        if(tikki.gameready) {
            gameready = 'true';
        }

        tikki.listPlayers().then((players) =>  {
            var json = { players: players, gameready: gameready };
            resolve(json);
        });

    }).catch((err) => {
        console.log(err);
    });
}

/** Lists players */
Tikki.prototype.listPlayers = function() {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        var players = "";
        for(var i = 0; i < tikki.players.length; i++) {
            players = players + tikki.players[i].name + "/";
        }
        resolve(players);
    }).catch((err) => {
        console.log(err);
    });
}

/** Get game status */
Tikki.prototype.getGame = function(req) {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        if(tikki.currentRound) {
            tikki.currentRound.isRoundOver().then(() => {
                if(!tikki.currentRound.roundOver) {
                    tikki.currentRound.getGame(req).then((json) => {
                        if(json.status === 'ok') {
                            resolve(json);
                        }
                        else {
                            json.status = 'error getting gameinfo';
                            resolve(json);
                        }
                    });
                }
                else {
                    tikki.currentRound.getPoints().then((points) => {
                        console.log("endgame get");
                        resolve({ status: "game ended", points: points });
                    });
                }
            });
        }
        else {
            resolve({ status: 'notready' });
        }
    }).catch((err) => {
        console.log(err);
    });
}

/** Make a play */
Tikki.prototype.play = function(req) {

    var tikki = this;
    var json = {};

    return new Promise(function(resolve, reject) {
        tikki.currentRound.savePlay(req).then((json) => {
            if(json.status === 'ok') {
                tikki.currentRound.isRoundOver().then(() => {
                    if(tikki.currentRound.roundOver) {
                        tikki.currentRound.countPoints().then((response) => {
                            console.log(response);
                            tikki.currentRound.getPoints().then((points) => {
                                console.log("endgame play");
                                resolve({ status: "game ended", points: points });
                            })
                        });
                    }
                    else {
                        console.log(json.status);
                        resolve(json);
                    }
                });
            }
            else {
                resolve({ status: json.status });
            }
        });
    }).catch((err) => {
        console.log(err);
    });
}

/** Start game. Check admin, start round, select starting player, mark that game is ready */
Tikki.prototype.startGame = function(req) {

    var tikki = this;

    var playername = req.playername;
    var playercode = req.playercode;

    return new Promise(function(resolve, reject) {

        var status = "error in starting game";

        if(tikki.checkAdmin(playername, playercode)) {
            tikki.startRound().then((ok) => {
                if(ok === 'ok') {
                    tikki.gameready = true;

                    var json = { status: 'ok' };
                    resolve(json);
                }
                else {
                    var json = { status: status };
                    resolve(json)
                }
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}

/** Check if player is Admin */
Tikki.prototype.checkAdmin = function(playername, playercode) {
    if(playername === this.adminplayer.name && playercode === this.adminplayer.code) {
        return true;
    }
    return false;
}

/** Start round */
Tikki.prototype.startRound = function() {

    var tikki = this;
    tikki.currentRound = new Round(this.players);

    return new Promise(function(resolve, reject) {
        tikki.currentRound.initiateRound().then((status) => {
            resolve(status);
        });
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = Tikki;