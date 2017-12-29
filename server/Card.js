

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
        var card = "";
        var cardnumber = this.number;
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

    objectifyCard(card) {
        var c = this;

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

            c.number = cardObject.number;
            c.suit = cardObject.suit;

            resolve({status: 'ok'});
        }).catch((err) => {
            console.log(err);
        });
    }
}


module.exports = Card;