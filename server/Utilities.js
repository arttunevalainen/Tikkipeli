let Card = require('./Card.js');


function objectifyCard(card) {
    return new Promise(function(resolve, reject) {
        let suit = "";
        let number = "";
        let cardObject;
        for(let i = 0; i < card.length - 1; i++) {
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


module.exports = objectifyCard;