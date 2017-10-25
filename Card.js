

class Card {

    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }

    getSuit() {
        return this.suit;
    }

    getNumber() {
        return this.number;
    }

    toString() {
        var card = "";
        var suitStr = this.number;

        if (this.number == 10) {suitStr = "T";}
        else if (this.number == 11) {suitStr = "J";}
        else if (this.number == 12) {suitStr = "Q";}
        else if (this.number == 13) {suitStr = "K";}
        else if (this.number == 14) {suitStr = "A";}
        
        card = card + suitStr + " of " + this.suit;
        return card;
    }
}




module.exports = Card;