
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

    bestHand(pokerhands) {
    }

    printHand() {
        console.log("Players hand:");
        for (i = 0; i < this.hand.length; i++) {
            console.log(this.hand[i].toString());
        }
    }
}







module.exports = Hand;