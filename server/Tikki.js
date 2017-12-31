var CardDeck = require('./CardDeck.js');
var Hand = require('./Hand.js');
var Card = require('./Card.js');
var Player = require('./Player.js');
var Round = require('./Round.js');


function Tikki() {

    this.players = [];
    this.gameready = false;
    this.roundJustEnded = false;
    this.adminplayer = undefined;

    this.currentRound;

    /** CONST ATTRIBUTES */
    this.maxplayers = 6;

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
        
        if(!nameTaken && name.length > 2 && tikki.players.length <= tikki.maxplayers) {
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

    tikki.startNoConnectionTimer();
    return new Promise(function(resolve, reject) {
        tikki.gameShouldEnd().then((end) => {
            if(!end) {
                if(tikki.currentRound) {
                    if(!tikki.roundJustEnded) {
                        tikki.currentRound.getGame(req).then((json) => {
                            if(json.status === 'ok' || json.status === 'changephase') {
                                resolve(json);
                            }
                            else {
                                json.status = 'error getting gameinfo';
                                resolve(json);
                            }
                        });
                    }
                    else {
                        tikki.getPoints().then((points) => {
                            resolve({ status: "round ended", points: points });
                        });
                    }
                }
                else {
                    resolve({ status: 'error' });
                }
            }
            else {
                tikki.getPoints().then((points) => {
                    resolve({ status: "Game has ended", points: points });
                });
            }
        });
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
                            tikki.getPoints().then((points) => {
                                tikki.setGameEndTimer();
                                resolve({
                                            status: "round ended",
                                            points: points,
                                            tikkiwinner: response.tikkiwinner,
                                            twoend: response.twoend,
                                            pokerwinner: response.pokerwinner,
                                            winninghand: response.hand,
                                            winningcards: response.cards
                                        });
                            });
                        });
                    }
                    else {
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

/** Functions to create space between old and new round */
Tikki.prototype.setGameEndTimer = function() {
    this.roundJustEnded = true;
    setTimeout(this.endGameEndTimer, 5000, this);
}
Tikki.prototype.endGameEndTimer = function(tikki) {
    tikki.roundJustEnded = false;
    tikki.startNewRound();
}

/** Functions to set timer for restarting tikki because of no connections */
Tikki.prototype.startNoConnectionTimer = function() {
    clearTimeout(this.connectionTimer);
    this.connectionTimer = setTimeout(this.noConnections, 60000, this);
}
Tikki.prototype.noConnections = function(tikki) {
    console.log("Tikki restored");
    tikki.players = [];
    tikki.gameready = false;
    tikki.roundJustEnded = false;
    tikki.adminplayer = undefined;
    tikki.currentRound = undefined;
}

/** Start game. Check admin, start round, select starting player, mark that game is ready */
Tikki.prototype.startGame = function(req) {
    var tikki = this;

    var playername = req.playername;
    var playercode = req.playercode;

    return new Promise(function(resolve, reject) {

        if(tikki.players.length > 1) {
            if(tikki.checkAdmin(playername, playercode)) {
                tikki.startRound().then((ok) => {
                    if(ok === 'ok') {
                        tikki.gameready = true;
                        resolve({ status: 'ok' });
                    }
                    else {
                        resolve({ status: 'error in starting game' });
                    }
                });
            }
        }
        else {
            resolve({ status: 'not enough players' });
        }
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.startNewRound = function() {
    var tikki = this;

    return new Promise(function(resolve, reject) {
        if(tikki.currentRound.roundOver) {
            tikki.currentRound = new Round(tikki.players);
            tikki.setNextStarter().then(() => {
                tikki.currentRound.initiateRound().then((status) => {
                    resolve(status);
                });
            });
        }

    }).catch((err) => {
        console.log(err);
    });
}

/** Set next startingplayer */
Tikki.prototype.setNextStarter = function() {
    var tikki = this;
    
    return new Promise(function(resolve, reject) {

        tikki.currentRound.getStarterPlayer().then((player) => {
            player.starter = false;
            
            tikki.currentRound.getPlayerIndex(player.name).then((index) => {
                if(index+1 === tikki.players.length) {
                    tikki.players[0].starter = true;
                }
                else {
                    tikki.players[index+1].starter = true;
                }

                resolve();
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

/** Select random player to start game */
Tikki.prototype.getRandomPlayer = function() {
    var tikki = this;
    
    return new Promise(function(resolve, reject) {
        var random = Math.floor((Math.random() * tikki.players.length));
        tikki.players[random].starter = true;
        resolve(tikki.players[random]);
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
        tikki.getRandomPlayer().then((player) => {
            tikki.currentRound.initiateRound().then((status) => {
                resolve(status);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

/** Return player points as string */
Tikki.prototype.getPoints = function() {
    var tikki = this;

    return new Promise(function(resolve, reject) {
        var points = "";

        for(var i = 0; i < tikki.players.length; i++) {
            points = points + tikki.players[i].name + " - " + tikki.players[i].points + "/";
        }

        resolve(points);
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.changeCards = function(req) {
    var tikki = this;

    return new Promise(function(resolve, reject) {
        tikki.currentRound.changeCards(req).then((status) => {
            resolve(status);
        });
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.gameShouldEnd = function() {
    var tikki = this;

    return new Promise(function(resolve, reject) {
        for(var i = 0; i < tikki.players.length; i++) {
            if(tikki.players[i].points >= 20) {
                resolve(true);
            }
        }
        resolve(false);
        
    }).catch((err) => {
        console.log(err);
    });
}




module.exports = Tikki;