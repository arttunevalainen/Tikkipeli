

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

    isSameCard(card) {

        if(card.suit === this.suit && card.number === this.number) {
            return(true);
        }
        else {
            return(false);
        }
    }

    toString() {
        let card = "";
        let cardnumber = this.number;
        if(this.number === 10) {
            cardnumber = 'T';
        }
        else if(this.number === 11) {
            cardnumber = 'J';
        }
        else if(this.number === 12) {
            cardnumber = 'Q';
        }
        else if(this.number === 13) {
            cardnumber = 'K';
        }
        else if(this.number === 14) {
            cardnumber = 'A';
        }

        card = this.suit + "" + cardnumber;
        return card;
    }
}


module.exports = Card;