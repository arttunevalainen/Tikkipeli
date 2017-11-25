
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