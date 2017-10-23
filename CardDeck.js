
const Card = require('./Card.js');

var suits = ["hearts", "spades", "diamonds", "clubs"];

function CardDeck() {
    this.deck = [];
    this.tmpDeck = []

    this.createDeck();
}

CardDeck.prototype.deckSize = function() {
    return this.deck.length;
}

CardDeck.prototype.topCard = function() {
    return this.deck[0];
}

CardDeck.prototype.draw = function() {
    return this.deck.splice(0, 1)[0];
}

CardDeck.prototype.drawCard = function(i) {
    if(i > -1 || i < 52) {
        //console.log(this.deck.splice(i, 1));
        return this.deck.splice(i, 1)[0];
    }
}

CardDeck.prototype.shuffle = function() {
    deckClass = this;
    return new Promise(function(resolve, reject) {
        for(i = 0; i < 1000; i++) {
            var random = Math.floor((Math.random() * 52));
            deckClass.deck.push(deckClass.drawCard(random));
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

    for(i = 2; i < 15; i++) {
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