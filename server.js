const express = require('express');
const app = express();
const CardDeck = require('./CardDeck.js');
const Hand = require('./Hand.js');

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

    for(var i = 0; i < 10; i++) {

        var deck = new CardDeck();
        
        hand.initiate().then((playerhand) => {
            deck.shuffle().then(() => {
                this.createHand(playerhand, deck).then(() => {
                    playerhand.getPoker().then(c => {
                        if(c === "Trips" || c === "Straigth" || c === "Flush" || c === "FullHouse" || c === "Quads" || c === "StraigthFlush") {
                            playerhand.printHand().then(() => {
                                console.log(c);
                            });
                        }
                    });
                });
            });
        });
    }
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