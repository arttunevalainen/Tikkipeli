const express = require('express');
const app = express();
const CardDeck = require('./CardDeck.js');
const Hand = require('./Hand.js');
const Card = require('./Card.js');

var tikki = new Tikki();




function Tikki() {

    var hand = new Hand();

    var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port
       
        console.log("App running...");
        
    });

    app.get('/', function (req, res) {
        res.send('Hello World');
    });

    var deck = new CardDeck();

    deck.shuffle().then(() => {
        this.initiateHands(5).then((hands) => {
            this.drawHands(hands, deck).then(() => {
                for(var i = 0; i < hands.length; i++) {
                    console.log(hands[i]);
                }
            });
        });
    });
}

Tikki.prototype.createHand = function(hand, deck) {
    return new Promise(function(resolve, reject) {
        for(var i = 0; i < 5; i++) {
            hand.addtoHand(deck.draw());
        }
        resolve();
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