const CardDeck = require('./CardDeck.js');
const Hand = require('./Hand.js');
const Card = require('./Card.js');
const Player = require('./Player.js');



class Round {

    constructor(players) {
        this.players = players;

        this.plays = [];

        this.startingplayer;
        this.currentplayer;
    }

    /** Start round */
    initiateRound() {

        var round = this;
        this.deck = new CardDeck();

        return new Promise(function(resolve, reject) {
            round.randomPlayer().then((player) => {
                round.startingplayer = player;
                round.currentplayer = round.startingplayer;
                round.deck.shuffle().then(() => {
                    round.initiateHands().then((hands) => {
                        round.drawHands(hands).then((hands) => {
                            round.handsforplayers(hands).then(() => {
                                resolve('ok');
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Get game for response */
    getGame(req) {
        
        var round = this;
        var json = {};
    
        return new Promise(function(resolve, reject) {
            round.getHand(req.playername, req.playercode).then((hand) => {
                json.hand = hand;
                json.currentplayer = round.currentplayer.name;
                round.listPlayers().then((players) =>  {
                    json.players = round.players;
                    json.status = 'ok';
                    resolve(json);
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Player tries to play */
    savePlay(req) {

        var round =  this;

        return new Promise(function(resolve, reject) {
            round.getPlayerObject(req.playername, req.playercode).then((player) => {
                if(player !== "error") {
                    round.iscurrentplayer(req).then((iscurrent) => {
                        if(iscurrent) {
                            player.cardPlayed(req.playedcard).then((json) => {
                                if(json.status === 'ok') {
                                    round.nextPlayerToPlay().then(() => {
                                        round.plays.push({ player: req.playername, card: req.playedcard });
                                        console.log(round.plays);
                                        resolve({ status : 'ok', currentplayer: round.currentplayer.name });
                                    });
                                }
                                else {
                                    resolve("error");
                                }
                            });
                        }
                        else {
                            resolve("error");
                        }
                    });
                }
                else {
                    resolve("error");
                }
            })
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Check if player who tries to play is really current player */
    iscurrentplayer(req) {

        var round = this;

        return new Promise(function(resolve, reject) {
            if(round.currentplayer.name === req.playername && round.currentplayer.code === req.playercode) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Get next player in playing queue */
    nextPlayerToPlay() {

        var round =  this;

        return new Promise(function(resolve, reject) {
            round.getPlayerIndex(round.currentplayer).then((index) => {
                if(index+1 === round.players.length) {
                    round.currentplayer = round.players[0];
                    resolve();
                }
                else {
                    round.currentplayer = round.players[index+1];
                    resolve();
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Returns index of player in players[] */
    getPlayerIndex(player) {

        var round = this;

        return new Promise(function(resolve, reject) {
            for (var i = 0; i < round.players.length; i++) {
                if(round.players[i].name === player.name && round.players[i].code === player.code) {
                    resolve(i);
                }
            }
            resolve("error");
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Returns player object from players[] */
    getPlayerObject(name, code) {
        var round =  this;
        
        return new Promise(function(resolve, reject) {
            for(var i = 0; i < round.players.length; i++) {
                if(round.players[i].name === name && round.players[i].code === code) {
                    resolve(round.players[i]);
                }
            }
            resolve("error");
        }).catch((err) => {
            console.log(err);
        });
    }

    /** List players as string for response */
    listPlayers() {
        
        var round = this;
    
        return new Promise(function(resolve, reject) {
            var players = "";
            for(var i = 0; i < round.players.length; i++) {
                players = players + round.players[i].name + "/";
            }
            resolve(players);
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Get players hand */
    getHand(name, playercode) {
        var round = this;
        
        return new Promise(function(resolve, reject) {
            for(var i = 0; i < round.players.length; i++) {
                if(round.players[i].name === name && round.players[i].code === playercode) {
                    resolve(round.players[i].hand.stringHand());
                }
            }
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Select random player */
    randomPlayer() {
        var round = this;
        
        return new Promise(function(resolve, reject) {
            var random = Math.floor((Math.random() * round.players.length));
            resolve(round.players[random]);
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Deal hands for players */
    handsforplayers(hands) {
        var round = this;
        
        return new Promise(function(resolve, reject) {
            for(var i = 0; i < round.players.length; i++) {
                round.players[i].hand = hands[i];
            }
            resolve()
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Draw hands */
    drawHands(hands) {

        var round = this;

        return new Promise(function(resolve, reject) {
            for(var k = 0; k < hands.length; k++) {
                for(var m = 0; m < 5; m++) {
                    hands[k].addtoHand(round.deck.draw());
                }
            }
            resolve(hands)
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Initiate hands */
    initiateHands() {

        var round = this;

        return new Promise(function(resolve, reject) {
            var hands = [];
            for(var j = 0; j < round.players.length; j++) {
                hands.push(new Hand());
            }
            resolve(hands)
        }).catch((err) => {
            console.log(err);
        });
    }
    
}



module.exports = Round;