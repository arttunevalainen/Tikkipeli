const express = require('express');
const app = express();
const CardDeck = require('./CardDeck.js');


var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
   
    console.log("App running...");

    var deck = new CardDeck();
    //deck.printDeck();
    deck.shuffle().then(() => {
        //deck.printDeck();
    });
});


app.get('/', function (req, res) {
    res.send('Hello World');
});