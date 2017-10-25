const express = require('express');
const app = express();
const CardDeck = require('./CardDeck.js');
const Hand = require('./Hand.js');

var tikki = new Tikki();




function Tikki() {
    var deck = new CardDeck();
    var playerhand = new Hand();

    var server = app.listen(8081, function () {
        var host = server.address().address
        var port = server.address().port
       
        console.log("App running...");
        
    });

    app.get('/', function (req, res) {
        res.send('Hello World');
    });

    deck.shuffle().then(() => {
        for(i = 0; i < 5; i++) {
            playerhand.addtoHand(deck.draw());
        }
        playerhand.printHand();
        console.log(playerhand.getPoker());
    });
}