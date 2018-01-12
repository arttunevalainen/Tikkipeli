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
    this.code;

    /** CONST ATTRIBUTES */
    this.maxplayers = 6;
    this.MAXPOINTS = 5;
}

/** Add new player to the lobby */
Tikki.prototype.addPlayer = function(player) {
    let tikki = this;

    return new Promise(function(resolve) {
        if(!tikki.gameready) {

            tikki.players.push(player);

            let isadmin = "false";
            if(tikki.players.length === 1) {
                tikki.adminplayer = player;
                isadmin = "true";
            }

            resolve({ status: 'ok', admin: isadmin });
        }
        else {
            resolve({ status: 'gamestarted' });
        }
    }).catch((err) => {
        console.log(err);
    });
}

/** Make id for tikkigame */
Tikki.prototype.makeid = function() {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        let text = "";
        let possible = "0123456789";
    
        for (let i = 0; i < 4; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        tikki.code = text;
        resolve();
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.leaveLobby = function(player) {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        if(player.name === tikki.adminplayer.name && player.code === tikki.adminplayer.code) {
            tikki.getPlayerIndex(player.name, player.code).then((index) => {
                if(index !== "error") {
                    if(index+1 === tikki.players.length) {
                        tikki.adminplayer = tikki.players[0];
                    }
                    else {
                        tikki.adminplayer = tikki.players[index+1];
                    }
                    tikki.players.splice(index, 1);
                    resolve({ status: 'deleted' });
                }
                else {
                    resolve("error");
                }
            });
        }
        else {
            tikki.getPlayerIndex(player.name, player.code).then((index) => {
                if(index !== "error") {
                    tikki.players.splice(index, 1);
                    resolve({ status: 'deleted' });
                }
                else {
                    resolve("error");
                }
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}

/** Returns player object from players[] */
Tikki.prototype.getPlayerIndex = function(name) {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        for (let i = 0; i < tikki.players.length; i++) {
            if(tikki.players[i].name === name) {
                resolve(i);
            }
        }
        resolve("error");
    }).catch((err) => {
        console.log(err);
    });
}

/** Get players in lobby */
Tikki.prototype.getLobby = function() {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        let gameready = 'false';
        if(tikki.gameready) {
            gameready = 'true';
        }

        let adminname = tikki.adminplayer.name;

        tikki.listPlayers().then((players) =>  {
            let json = { players: players, isadmin: adminname, gameready: gameready };
            resolve(json);
        });

    }).catch((err) => {
        console.log(err);
    });
}

/** Lists players */
Tikki.prototype.listPlayers = function() {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        let players = "";
        for(let i = 0; i < tikki.players.length; i++) {
            players = players + tikki.players[i].name + "/";
        }
        resolve(players);
    }).catch((err) => {
        console.log(err);
    });
}

/** Get game status */
Tikki.prototype.getGame = function(req) {
    let tikki = this;

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
                        tikki.currentRound.readyPlaysForSending(req.playername).then((plays) => {
                            tikki.getEndOfRoundStats().then((stats) => {
                                tikki.getPoints().then((points) => {
                                    resolve({ status: "round ended", plays: plays, points: points, stats: stats });
                                });
                            });
                        });
                    }
                }
                else {
                    resolve({ status: 'error' });
                }
            }
            else {
                tikki.getEndOfGameStats().then((stats) => {
                    tikki.getPoints().then((points) => {
                        resolve({ status: "Game has ended",
                                  points: points,
                                  stats: stats
                                });
                    });
                });
            }
        });
    }).catch((err) => {
        console.log(err);
    });
}

/** Make a play */
Tikki.prototype.play = function(req) {
    let tikki = this;
    let json = {};

    return new Promise(function(resolve, reject) {
        tikki.currentRound.savePlay(req).then((json) => {
            if(json.status === 'ok') {
                tikki.currentRound.isRoundOver().then(() => {
                    if(tikki.currentRound.roundOver) {
                        tikki.currentRound.countPoints().then((response) => {
                            tikki.getPoints().then((points) => {
                                tikki.setGameEndTimer();
                                resolve({ status: "round ended" });
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

/** Start game. Check admin, start round, select starting player, mark that game is ready */
Tikki.prototype.startGame = function(req) {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        if(tikki.players.length > 1) {
            if(tikki.checkAdmin(req.playername, req.playercode)) {
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
    let tikki = this;

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
    let tikki = this;
    
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
    let tikki = this;
    
    return new Promise(function(resolve, reject) {
        let random = Math.floor((Math.random() * tikki.players.length));
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
    let tikki = this;
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
    let tikki = this;

    return new Promise(function(resolve, reject) {
        let points = "";
        for(let i = 0; i < tikki.players.length; i++) {
            points = points + tikki.players[i].name + " - " + tikki.players[i].points + "/";
        }
        resolve(points);
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.changeCards = function(req) {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        tikki.currentRound.changeCards(req).then((status) => {
            resolve(status);
        });
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.gameShouldEnd = function() {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        for(let i = 0; i < tikki.players.length; i++) {
            if(tikki.players[i].points >= tikki.MAXPOINTS) {
                resolve(true);
            }
        }
        resolve(false);
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.getEndOfRoundStats = function() {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        if(tikki.currentRound.roundOver) {
            resolve({ 
                      tikkiwinner: tikki.currentRound.tikkiwinner, 
                      twoend: tikki.currentRound.twoend, 
                      pokerwinner: tikki.currentRound.pokerwinner,
                      winninghand: tikki.currentRound.winninghand
                    });
        }
        else {
            resolve('error');
        }
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.getEndOfGameStats = function() {
    let tikki = this;

    return new Promise(function(resolve, reject) {
        tikki.gameShouldEnd().then((end) => {
            if(end) {
                resolve({});
            }
            else {
                resolve('error');
            }
        });
    }).catch((err) => {
        console.log(err);
    });
}




module.exports = Tikki;