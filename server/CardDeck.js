
const Card = require('./Card.js');

var suits = ["hearts", "spades", "diamonds", "clubs"];

class CardDeck {
    
    constructor() {
        this.deck = [];
        this.tmpDeck = [];
        this.createDeck();
    }

    deckSize() {
        return this.deck.length;
    }

    topCard() {
        return this.deck[0];
    }

    draw() {
        return this.deck.splice(0, 1)[0];
    }

    drawCard(i) {
        if (i > -1 || i < 52) {
            return this.deck.splice(i, 1)[0];
        }
    }

    shuffle() {
        var deckClass = this;
        return new Promise(function(resolve, reject) {
            for (var i = 0; i < 1000; i++) {
                var random = Math.floor((Math.random() * deckClass.deck.length));
                deckClass.deck.push(deckClass.drawCard(random));
            }
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    newDeck(newDeck) {
        this.deck = newDeck;
    }

    createDeck() {
        for(var i = 2; i < 15; i++) {
            for(var j = 0; j < suits.length; j++) {
                var card = new Card(suits[j], i);
                this.deck.push(card);
            }
        }
    }

    printDeck() {
        return new Promise(function(resolve, reject) {
            for (var i = 0; i < this.deckSize(); i++) {
                console.log(this.deck[i].toString());
            }
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }
}










module.exports = CardDeck;