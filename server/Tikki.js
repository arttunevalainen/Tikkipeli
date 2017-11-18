const CardDeck = require('./CardDeck.js');
const Hand = require('./Hand.js');
const Card = require('./Card.js');
const Player = require('./Player.js');


var hand = new Hand();
var deck = new CardDeck();

function Tikki() {

    this.players = [];
}

Tikki.prototype.addPlayer = function(name) {

    var players = this.players;

    return new Promise(function(resolve, reject) {

        var nameTaken = false;

        for(var i = 0; i < players.length; i++) {
            if(players[i].name === name) {
                nameTaken = true;
            }
        }

        if(!nameTaken && name.length > 2) {
            var a = new Player(name);
            players.push(a);
            
            a.makeid().then(() => {
                var json = {status: 'ok', name: name, playercode: a.code};
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

Tikki.prototype.getLobby = function() {

    var tikki = this;

    console.log(this.players);

    return new Promise(function(resolve, reject) {
        var players = "";
        for(var i = 0; i < tikki.players.length; i++) {
            players = players + tikki.players[i].name + " - " + tikki.players[i].lobbyReady + " /";
        }

        var json = {players: players};

        resolve(json);
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.setReady = function(req) {

    var players = this.players;
    
    return new Promise(function(resolve, reject) {
        var name = req.body.playername;
        var playercode = req.body.playercode;
        var status = 'Error finding player';

        for(var i = 0; i < players.length; i++) {
            if(players[i].name === name) {
                if(players[i].code === playercode) {
                    if(players[i].lobbyReady) {
                        players[i].lobbyReady = false;
                    }
                    else {
                        players[i].lobbyReady = true;
                    }

                    status = 'ok';
                }
            }
        }

        var json = {status: status};

        resolve(json);
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.startGame = function() {
    return new Promise(function(resolve, reject) {
        resolve();
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.startRound = function() {

    var players = this.players.length;
    var tikki = this;

    return new Promise(function(resolve, reject) {
        deck.shuffle().then(() => {
            tikki.initiateHands(players).then((hands) => {
                tikki.drawHands(hands, deck).then(() => {
                    var status = "ok";
                    resolve(status);
                });
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.drawHands = function(hands, deck) {
    return new Promise(function(resolve, reject) {
        for(var k = 0; k < hands.length; k++) {
            for(var m = 0; m < 5; m++) {
                hands[k].addtoHand(deck.draw());
            }
        }
        resolve(hands)
    }).catch((err) => {
        console.log(err);
    });
}
    
Tikki.prototype.initiateHands = function(i) {
    return new Promise(function(resolve, reject) {
        var hands = [];
        for(var j = 0; j < i; j++) {
            hands.push(new Hand());
        }
        resolve(hands)
    }).catch((err) => {
        console.log(err);
    });
}


module.exports = Tikki;