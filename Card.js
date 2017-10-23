

function Card(suit, number) {
    this.suit = suit;
    this.number = number;
}

Card.prototype.getSuit = function() {
    return this.suit;
}

Card.prototype.getNumber = function() {
    return this.number;
}

module.exports = Card;