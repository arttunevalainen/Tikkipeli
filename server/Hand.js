let Card = require('./Card.js');
let pokerHandCalc = require('./PokerHandCalc.js');
let objectifyCard = require('./Utilities.js');


class Hand {

    constructor() {
        this.hand = [];
        this.played = [];

        this.playedCards = [];
        this.poker = '';
    }

    isEmpty() {
        return this.hand.length === 0;
    }

    addtoHand(card) {
        this.hand.push(card);
    }

    getHand() {
        return this.hand;
    }

    setPoker() {
        let h = this;

        return new Promise(function(resolve) {
            h.copyHandForPoker().then((copy) => {
                pokerHandCalc(copy).then((poker) => {
                    h.poker = poker;
                    resolve();
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    copyHandForPoker() {
        let h = this;

        return new Promise(function(resolve) {
            let copy = [];
            for(let i = 0; i < h.hand.length; i++) {
                let c = new Card(h.hand[i].getSuit(), h.hand[i].getNumber());
                copy.push(c);
            }

            resolve(copy);
        }).catch((err) => {
            console.log(err);
        });
    }

    deleteCard(card) {
        let hand = this;

        return new Promise(function(resolve) {

            objectifyCard(card).then((card) => {
                hand.searchforcard(card).then((index) => {
                    hand.hand.splice(index, 1);
                    resolve({status: 'ok'});
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    cardPlayed(card) {
        let hand = this;

        return new Promise(function(resolve, reject) {
            let json = {};

            objectifyCard(card).then((card) => {
                hand.searchforcard(card).then((index) => {
                    let a = hand.hand.splice(index, 1);
                    hand.playedCards.push(a[0]);
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
        let hand = this;

        return new Promise(function(resolve, reject) {
            for (let i = 0; i < hand.hand.length; i++) {
                if(hand.hand[i].isSameCard(card)) {
                    resolve(i);
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    stringifyHand() {
        let hand = this.hand;
        
        return new Promise(function(resolve, reject) {
            let string = ""
            for(let i = 0; i < hand.length; i++) {
                string = string + hand[i].toString() + "/";
            }
            resolve(string);
        }).catch((err) => {
            console.log(err);
        });
    }

    stringifyPlayedCards() {
        let hand = this;
        
        return new Promise(function(resolve, reject) {
            let string = ""
            for (let i = 0; i < hand.playedCards.length; i++) {
                string = string + hand.playedCards[i].toString() + "/";
            }
            resolve(string);
        }).catch((err) => {
            console.log(err);
        });
    }

    getFirstCard() {
        return this.hand[0];
    }
}

module.exports = Hand;