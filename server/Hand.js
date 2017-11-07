
const Card = require('./Card.js');
const pokerHandCalc = require('./PokerHandCalc.js');


class Hand {

    constructor() {
        this.hand = [];
    }

    addtoHand(card) {
        this.hand.push(card);
    }

    getHand() {
        return this.hand;
    }

    getPoker() {
        return pokerHandCalc(this.hand);
    }

    printHand() {
        var hand = this.hand;
        return new Promise(function(resolve, reject) {
            console.log("Players hand:");
            for (var i = 0; i < hand.length; i++) {
                console.log(hand[i].toString());
            }
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }
}







module.exports = Hand;