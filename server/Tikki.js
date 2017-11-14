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
        var a = new Player(name);
        players.push(a);
        
        a.makeid().then(() => {
            console.log(a.code);
            json = {status: 'ok', playercode: a.code};
            resolve(json)
        });
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.startGame = function() {

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