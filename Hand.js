
const Card = require('./Card.js');
const pokerHandCalc = require('./PokerHandCalc.js');

class Hand {

    constructor() {
        this.hand = [];
    }

    addtoHand(card) {
        this.hand.push(card);
    }

    setHand(card1, card2, card3, card4, card5) {
        this.hand.push(card1);
        this.hand.push(card2);
        this.hand.push(card3);
        this.hand.push(card4);
        this.hand.push(card5);
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

Hand.prototype.initiate = function() {
    return new Promise(function(resolve, reject) {
        resolve(new Hand());
    }).catch((err) => {
        console.log(err);
    });
}







module.exports = Hand;