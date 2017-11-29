
const Card = require('./Card.js');
const pokerHandCalc = require('./PokerHandCalc.js');


class Hand {

    constructor() {
        this.hand = [];
        this.played = [];
    }

    addtoHand(card) {
        this.hand.push(card);
    }

    getHand() {
        return this.hand;
    }

    getPoker() {
        var h = this;
        return new Promise(function(resolve, reject) {
            pokerHandCalc(this.hand).then((hand) => {
                resolve(hand);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    deleteCard(card) {
        var hand = this;

        return new Promise(function(resolve, reject) {

            var json = {}

            hand.objectifyCard(card).then((card) => {
                hand.searchforcard(card).then((index) => {
                    var a = hand.hand.splice(index, 1);
                    json.status = 'ok';
                    resolve(json);
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Returns index of card in this hand */
    searchforcard(card) {

        var hand = this;

        return new Promise(function(resolve, reject) {
            for (var i = 0; i < hand.hand.length; i++) {
                if(hand.hand[i].isSameCard(card)) {
                    resolve(i);
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    objectifyCard(card) {
        return new Promise(function(resolve, reject) {
            var suit = "";
            var number = "";
            var cardObject;
            for(var i = 0; i < card.length - 1; i++) {
                suit = suit + card[i];
                if(suit === 'ruutu' || suit === 'pata' || suit === 'risti' || suit === 'hertta') {
                    number = card[i+1];
                }
            }

            if(parseInt(number)) {
                cardObject = new Card(suit, parseInt(number));
            }
            else {
                if(number === 'T') {
                    cardObject = new Card(suit, 10);
                }
                else if(number === 'J') {
                    cardObject = new Card(suit, 11);
                }
                else if(number === 'Q') {
                    cardObject = new Card(suit, 12);
                }
                else if(number === 'K') {
                    cardObject = new Card(suit, 13);
                }
                else if(number === 'A') {
                    cardObject = new Card(suit, 14);
                }
            }
            resolve(cardObject);
        }).catch((err) => {
            console.log(err);
        });
    }

    stringHand() {
        var hand = this.hand;
        return new Promise(function(resolve, reject) {
            var stringhand = ""
            for (var i = 0; i < hand.length; i++) {
                stringhand = stringhand + hand[i].toString() + "/";
            }
            resolve(stringhand);
        }).catch((err) => {
            console.log(err);
        });
    }

    getFirstCard() {
        return this.hand[0];
    }
}







module.exports = Hand;