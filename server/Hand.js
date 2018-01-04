
const Card = require('./Card.js');
const pokerHandCalc = require('./PokerHandCalc.js');


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
        var h = this;
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
        var h = this;

        return new Promise(function(resolve) {
            var copy = [];
            for(var i = 0; i < h.hand.length; i++) {
                var c = new Card(h.hand[i].getSuit(), h.hand[i].getNumber());
                copy.push(c);
            }

            resolve(copy);
        }).catch((err) => {
            console.log(err);
        });
    }

    deleteCard(card) {
        var hand = this;

        return new Promise(function(resolve) {

            hand.objectifyCard(card).then((card) => {
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
        var hand = this;

        return new Promise(function(resolve, reject) {

            var json = {};

            hand.objectifyCard(card).then((card) => {
                hand.searchforcard(card).then((index) => {
                    var a = hand.hand.splice(index, 1);
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

    stringifyHand() {
        var hand = this.hand;
        
        return new Promise(function(resolve, reject) {
            var string = ""
            for (var i = 0; i < hand.length; i++) {
                string = string + hand[i].toString() + "/";
            }
            resolve(string);
        }).catch((err) => {
            console.log(err);
        });
    }

    stringifyPlayedCards() {
        var hand = this;
        
        return new Promise(function(resolve, reject) {
            var string = ""
            for (var i = 0; i < hand.playedCards.length; i++) {
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