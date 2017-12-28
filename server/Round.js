var CardDeck = require('./CardDeck.js');
var Hand = require('./Hand.js');
var Card = require('./Card.js');
var Player = require('./Player.js');
var pokerhandcalc = require('./PokerHandCalc.js');

var promiseWhile = require('while-promise')(Promise)



class Round {

    constructor(players) {
        this.players = players;

        this.plays = [];

        this.changePhase = true;
        this.roundOver = false;

        this.startingplayer;
        this.currentplayer;
    }

    /** Start round */
    initiateRound() {

        var round = this;
        this.deck = new CardDeck();

        round.plays = [];

        return new Promise(function(resolve, reject) {
            round.getStarterPlayer().then((player) => {
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
                if(hand) {
                    json.hand = hand;
                    round.listPlayers().then((players) =>  {
                        json.players = players;
                        if(round.changePhase) {
                            round.allPlayersChanged().then((ready) => {
                                if(ready) {
                                    round.changePhase = false;
                                }
                                json.status = 'changephase';
                                round.playerHasChanged(req.playername, req.playercode).then((changed) => {
                                    if(changed) {
                                        json.changestatus = 'done';
                                        resolve(json);
                                    }
                                    else {
                                        json.changestatus = 'waiting';
                                        resolve(json);
                                    }
                                });
                            });
                        }
                        else {
                            json.currentplayer = round.currentplayer.name;
                            round.readyPlaysForSending(req.playername).then((plays) => {
                                json.plays = plays;
                                json.status = 'ok';
                                resolve(json);
                            });
                        }
                    });
                }
                else {
                    resolve({ status: 'error' });
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Check if all players have played all their cards */
    isRoundOver() {

        var allEmpty = true;
        var round = this;

        return new Promise(function(resolve, reject) {
            for(var i = 0; i < round.players.length; i++) {
                if(!round.players[i].hand.isEmpty()) {
                    allEmpty = false;
                }
            }
            round.roundOver = allEmpty;

            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Ready recent plays for response */
    readyPlaysForSending(playername) {

        var recentPlays = "";
        var round = this;

        return new Promise(function(resolve, reject) {
            for(var i = 0; i < round.plays.length; i++) {
                //if(round.plays[i].player !== playername) {
                    recentPlays = recentPlays + round.plays[i].player + " " + round.plays[i].card + "/";
                /*}
                else {
                    resolve(recentPlays);
                }*/
            }
            resolve(recentPlays);
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
                            round.checkRules(req.playedcard, player).then((goodplay) => {
                                if(goodplay) {
                                    player.cardPlayed(req.playedcard).then((json) => {
                                        if(json.status === 'ok') {
                                            round.plays.unshift({ player: req.playername, card: req.playedcard });
                                            round.nextPlayerToPlay().then(() => {
                                                resolve({ status : 'ok', currentplayer: round.currentplayer.name });
                                            });
                                        }
                                        else {
                                            resolve({ status: "error" });
                                        }
                                    });
                                }
                                else {
                                    resolve({ status: "wrongplay" });
                                }
                            });
                        }
                        else {
                            resolve({ status: "error" });
                        }
                    });
                }
                else {
                    resolve({ status: "error" });
                }
            })
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Play by tikki rules */
    checkRules(card, player) {
        var round = this;

        return new Promise(function(resolve, reject) {

            var a = new Card('', '');
            var b = new Card('', '');

            a.objectifyCard(card).then(() => {
                if(round.startingplayer.name === player.name) {
                    resolve(true);
                }
                else {
                    round.searchStarterPlayerPlay().then((startingplay) => {
                        if(startingplay) {
                    
                            b.objectifyCard(startingplay.card).then(() => {
                                if(a.suit === b.suit) {
                                    round.compareCards(player, a, b).then(() => {
                                        resolve(true);
                                    });
                                }
                                else {
                                    round.playerHasPlayableCards(player, b.suit).then((playable) => {
                                        if(playable) {
                                            resolve(false);
                                        }
                                        else {
                                            resolve(true);
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            resolve({status: 'error'});
                        }
                    });
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Compare cards and change startingplayer if needed */
    compareCards(player, a, b) {

        var round = this;

        return new Promise(function(resolve, reject) {
            if(a.number > b.number) {
                round.startingplayer = player;
            }
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Return true if player has playable cards left in hand */
    playerHasPlayableCards(player, suit) {

        return new Promise(function(resolve, reject) {

            for(var i = 0; i < player.hand.hand.length; i++) {
                if(player.hand.hand[i].suit === suit) {
                    resolve(true);
                }
            }

            resolve(false);

        }).catch((err) => {
            console.log(err);
        });
    }

    /** Find startingplayer latest play */
    searchStarterPlayerPlay() {

        var round = this;
        return new Promise(function(resolve, reject) {

            for(var i = 0; i < round.plays.length; i++) {
                if(round.plays[i].player === round.startingplayer.name) {
                    resolve(round.plays[i]);
                }
            }
            resolve(undefined);
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Count tikki points after last play is made */
    countPoints() {
        var round = this;

        return new Promise(function(resolve, reject) {

            round.getPlayerIndex(round.startingplayer.name).then((index) => {
                round.players[index].points = round.players[index].points + 3;

                //BUGI
                /*round.checkHands().then((winner) => {
                    console.log(winner);
                    if(winner.playername) {
                        round.getPlayerIndex(winner.playername).then((player) => {
                            if(winner.points !== undefined) {
                                console.log("points");
                                player.points = player.points + winner.handpoints;
                                var response = { status: 'ok', winner: besthand };
                                resolve(response);
                            }
                            else {
                                console.log("nopoints");
                                var response = { status: 'nopoints' };
                                resolve(response);
                            }
                        });
                    }
                    else {
                        console.log("no winners");
                        resolve();
                    }
                });*/

                resolve({status: 'ok'});
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Get best pokerhand */
    checkHands() {
        var round = this;

        return new Promise(function(resolve, reject) {
            var besthand = "";
            var points = 0;
            var name = "";

            var i = 0;
            
            promiseWhile(function() { return i < round.players.length },
                function() {
                    return new Promise(function(resolve, reject) {
                        setTimeout(function() {
                            pokerhandcalc(round.players[i].hand.playedCards).then((card) => {
                                if(card.handpoints > points) {
                                    name = round.players[i].name;
                                    points = card.handpoints;
                                    besthand = card.hand;
                                }
                                resolve(i++)
                            });
                        }, 1000)
                    })
                })
            .then(function() {
                var json = { besthand: besthand, handpoints: points, playername: name };
                resolve(json);
            });
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

    /** Get next player in playing queue or startingplayer to play */
    nextPlayerToPlay() {
        var round =  this;

        return new Promise(function(resolve, reject) {

            if(round.plays.length % round.players.length !== 0) {
                if(round.plays[0].player === round.currentplayer.name) {
                    round.getPlayerIndex(round.currentplayer.name).then((index) => {
                        if(index+1 === round.players.length) {
                            round.currentplayer = round.players[0];
                            resolve();
                        }
                        else {
                            round.currentplayer = round.players[index+1];
                            resolve();
                        }
                    });
                }
            }
            else {
                round.currentplayer = round.startingplayer;
                resolve();
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Returns index of player in players[] */
    getPlayerIndex(playername) {
        var round = this;

        return new Promise(function(resolve, reject) {
            for (var i = 0; i < round.players.length; i++) {
                if(round.players[i].name === playername) {
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

    getStarterPlayer() {
        var round = this;

        return new Promise(function(resolve, reject) {
            for(var i = 0; i < round.players.length; i++) {
                if(round.players[i].starter) {
                    resolve(round.players[i]);
                }
            }
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

    /** Players change cards before round start */
    changeCards(req) {

        var round = this;

        var playername = req.playername;
        var playercode = req.playercode;

        return new Promise(function(resolve, reject) {
            round.getPlayerObject(playername, playercode).then((player) => {
                if(!player.changedCards) {
                    var cards = req.cards;
                    var cards = cards.split("/");
                    cards.pop();
        
                    if(cards.length === 0) {
                        player.changedCards = true;
                        resolve({status: 'ok'});
                    }
                    else {
                        if(cards.length < 5) {

                            for(var i = 0; i < cards.length; i++) {
                                player.hand.deleteCard(cards[i]);
                                player.hand.addtoHand(round.deck.draw());
                            }

                            player.changedCards = true;
                            resolve({ status: 'ok' });
                        }
                        else if(cards.length === 5) {
                            if(round.legalCardChange(cards)) {
                                player.hand.hand = [];

                                for(var j = 0; j < 5; j++) {
                                    player.hand.addtoHand(round.deck.draw());
                                }

                                player.changedCards = true;
                                resolve({ status: 'ok' });
                            }
                            else {
                                resolve({ status: 'badChange' });
                            }
                        }
                    }
                }
                else {
                    resolve({ status: 'allreadychanged' });
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Check for legal five card change */
    legalCardChange(cards) {
        if(cards.includes('A') || cards.includes('K') || cards.includes('Q') || cards.includes('J') || cards.includes('T')) {
            return(false);
        }
        else {
            return(true);
        }
    }

    /** Check if all players have changed cards */
    allPlayersChanged() {

        var round = this;

        return new Promise(function(resolve, reject) {
            for(var i = 0; i < round.players.length; i++) {
                if(!round.players[i].changedCards) {
                    resolve(false);
                }
            }
            //round.changePhase = false;
            resolve(true);
        }).catch((err) => {
            console.log(err);
        });
    }

    playerHasChanged(playername, playercode) {
        var round = this;

        return new Promise(function(resolve, reject)  {
            round.getPlayerObject(playername, playercode).then((player) => {
                console.log(player);
                if(player.changedCards) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}



module.exports = Round;