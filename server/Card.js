

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
        var numberStr = this.number;

        if (this.number == 10) {numberStr = "T";}
        else if (this.number == 11) {numberStr = "J";}
        else if (this.number == 12) {numberStr = "Q";}
        else if (this.number == 13) {numberStr = "K";}
        else if (this.number == 14) {numberStr = "A";}
        
        card = numberStr + " of " + this.suit;
        return card;
    }
}




module.exports = Card;