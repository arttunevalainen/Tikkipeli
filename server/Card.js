

class Card {

    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }

    getSuit() {
        return this.suit;
    }

    getNumber() {
        return parseInt(this.number);
    }

    toString() {
        var card = "";
        card = this.number + " " + this.suit;
        return card;
    }
}




module.exports = Card;