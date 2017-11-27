const CardDeck = require('./CardDeck.js');
const Hand = require('./Hand.js');
const Card = require('./Card.js');
const Player = require('./Player.js');



class Round {

    constructor(players) {
        this.players = players;

        this.startingplayer;
        this.currentplayer;
    }

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

    randomPlayer() {
        var round = this;
        
        return new Promise(function(resolve, reject) {
            var random = Math.floor((Math.random() * round.players.length));
            resolve(round.players[random]);
        }).catch((err) => {
            console.log(err);
        });
    }

    // Deal hands for players
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

    // Draw hands 
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

    // Initiate hands
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