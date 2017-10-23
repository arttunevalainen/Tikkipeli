
const Card = require('./Card.js');

var suits = ["hearts", "spades", "diamonds", "clubs"];

function CardDeck() {
    this.deck = [];
    this.tmpDeck = []

    this.createDeck();
}

CardDeck.prototype.topCard = function() {
    return this.deck[0];
}

CardDeck.prototype.draw = function() {
    return this.deck.splice(0, 1);
}

CardDeck.prototype.drawCard = function(i) {
    console.log(i);
    if(i > -1 || i < 52) {
        //console.log(this.deck.splice(i, 1));
        return this.deck.splice(i, 1);
    }
}

CardDeck.prototype.shuffle = function() {
    var c = this.deck;
    return new Promise(function(resolve, reject) {
        console.log(c);
        for(i = 0; i < 10; i++) {
            var random = Math.floor((Math.random() * 52));
        }
        resolve();
    }).catch((err) => {
        console.log(err);
    });
}

CardDeck.prototype.newDeck = function(newDeck) {
    this.deck = newDeck;
}

CardDeck.prototype.createDeck = function() {

    for(i = 1; i < 15; i++) {
        for(j = 0; j < 4; j++) {
            var card = new Card(suits[j], i);
            this.deck.push(card);
        }
    }
}

CardDeck.prototype.printDeck = function() {
    console.log(this.deck);
}


module.exports = CardDeck;