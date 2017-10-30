
const Card = require('./Card.js');



function pokerHandCalc(hand) {
    return new Promise(function(resolve, reject) {
        sortHand(hand).then(() => {

            if(isStraightFlush(hand)) {
                resolve("StraightFlush");
            }
            else if(isQuads(hand)) {
                resolve("Quads");
            }
            else if(isFullHouse(hand)) {
                resolve("FullHouse");
            }
            else if(isFlush(hand)) {
                resolve("Flush");
            }
            else if(isStraigth(hand)) {
                resolve("Straigth");
            }
            else if(isTrips(hand)) {
                resolve("Trips");
            }
            else if(isTwopairs(hand)) {
                resolve("TwoPairs");
            }
            else if(isPairs(hand)) {
                resolve("Pair");
            }
            else {
                resolve(getHighest(hand));
            }
        });
    }).catch((err) => {
        console.log(err);
    });
}

function isStraightFlush(hand) {
    if(isFlush(hand) && isStraigth(hand)) {
        return true;
    }
    return false;
}

function isQuads(hand) {
    if(hand[0].getNumber() === hand[1].getNumber() === hand[2].getNumber() === hand[3].getNumber()) {
        return true;
    }
    else if(hand[1].getNumber() === hand[2].getNumber() === hand[3].getNumber() === hand[4].getNumber()) {
        return true;
    }
    else {
        return false;
    }
}

function isFullHouse(hand) {
    if(hand[0].getNumber() === hand[1].getNumber() === hand[2].getNumber() && hand[3].getNumber() === hand[4].getNumber()) {
        return true;
    }
    else if(hand[2].getNumber() === hand[3].getNumber() === hand[4].getNumber() && hand[0].getNumber() === hand[1].getNumber()) {
        return true;
    }
    else {
        return false;
    }
}

function isFlush(hand) {

    if(hand[0].getSuit() === hand[1].getSuit() === hand[2].getSuit() === hand[3].getSuit() === hand[4].getSuit()) {
        return true;
    }
    else {
        return false;
    }
}

function isStraigth(hand) {
    if(hand[0].getNumber() === hand[1].getNumber()+1 === hand[2].getNumber()+2 === hand[3].getNumber()+3 === hand[4].getNumber()+4) {
        return true;
    }
    else if(hand[4].getNumber() === 14) {
        if(hand[0].getNumber() === 2 && hand[1].getNumber() === 3 && hand[2].getNumber() === 4 && hand[3].getNumber() === 5) {
            return true;
        }
    }
    else {
        return false;
    }
}

function isTrips(hand) {
    if(hand[0].getNumber() === hand[1].getNumber() === hand[2].getNumber()) {
        return true;
    }
    else if(hand[1].getNumber() === hand[2].getNumber() === hand[3].getNumber()) {
        return true;
    }
    else if(hand[2].getNumber() === hand[3].getNumber() === hand[4].getNumber()) {
        return true;
    }
    else {
        return false;
    }
}

function isTwopairs(hand) {
    var number = hand[0].getNumber();
    var stopped = 0;
    for(var i = 1; i < hand.length; i++) {
        if(hand[i].getNumber() === number) {
            number = hand[i].getNumber();
            stopped = i+1;
            i = hand.length;
        }
        else {
            number = hand[i].getNumber();
        }
    }
    for(var j = stopped; j < hand.length; j++) {
        if(hand[j].getNumber() === number) {
            return true;
        }
        else {
            number = hand[j].getNumber();
        }
    }

    return false;
}

function isPairs(hand) {
    var number = hand[0].getNumber();
    for(var i = 1; i < hand.length; i++) {
        if(hand[i].getNumber() === number) {
            return true;
        }
        else {
            number = hand[i].getNumber();
        }
    }
    return false;
}

function getHighest(hand) {
    return hand[4].getNumber();
}

function sortHand(handd) {
    var hand = handd;
    return new Promise(function(resolve, reject) {
        for(var i = 0; i < hand.length-1; i++) {
            for(var j = i+1; j < hand.length; j++) {
                if(hand[i].getNumber() > hand[j].getNumber()) {
                    var c = hand[i];
                    hand[i] = hand[j];
                    hand[j] = c;
                }
            }
        }
        resolve();
    }).catch((err) => {
        console.log(err);
    });
}


module.exports = pokerHandCalc;