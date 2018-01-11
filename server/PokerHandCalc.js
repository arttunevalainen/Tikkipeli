
const Card = require('./Card.js');


/** Pokerhand calculator. Give array of five (5) Card objects and this will calculate pokerhand for it with highcards ect 
 * Needs refactoring!?
*/
function pokerHandCalc(hand) {
    return new Promise(function(resolve, reject) {
        sortHand(hand).then(() => {
            var json = {};

            isStraightFlush(hand).then((sf) => {
                if(sf.status) {
                    json.hand = "StraightFlush";
                    json.comparable = 8;
                    json.handhigh = sf.handhigh;
                    resolve(json);
                }
                else {
                    isQuads(hand).then((qds) => {
                        if(qds.status) {
                            json.hand = "Quads";
                            json.comparable = 7;
                            json.handhigh = qds.handhigh;
                            resolve(json);
                        }
                        else {
                            isFullHouse(hand).then((fh) => {
                                if(fh.status) {
                                    json.hand = "FullHouse";
                                    json.comparable = 6;
                                    json.handhigh = fh.handhigh;
                                    json.handlow = fh.handlow;
                                    resolve(json);
                                }
                                else {
                                    isFlush(hand).then((flush) => {
                                        if(flush.status) {
                                            json.hand = "Flush";
                                            json.comparable = 5;
                                            json.handhigh = flush.handhigh;
                                            resolve(json);
                                        }
                                        else {
                                            isStraigth(hand).then((stra) => {
                                                if(stra.status) {
                                                    json.hand = "Straigth";
                                                    json.comparable = 4;
                                                    json.handhigh = stra.handhigh;
                                                    resolve(json);
                                                }
                                                else {
                                                    isTrips(hand).then((trips) => {
                                                        if(trips.status) {
                                                            json.hand = "Trips";
                                                            json.comparable = 3;
                                                            json.handhigh = trips.handhigh;
                                                            resolve(json);
                                                        }
                                                        else {
                                                            isTwopairs(hand).then((twopairs) => {
                                                                if(twopairs.status) {
                                                                    json.hand = "TwoPairs";
                                                                    json.comparable = 2;
                                                                    json.handhigh = twopairs.handhigh;
                                                                    json.handlow = twopairs.handlow;
                                                                    json.high = twopairs.high;
                                                                    resolve(json);
                                                                }
                                                                else {
                                                                    isPair(hand).then((pairs) => {
                                                                        if(pairs.status) {
                                                                            json.hand = "Pair";
                                                                            json.comparable = 1;
                                                                            json.handhigh = pairs.handhigh;
                                                                            json.high = pairs.high;
                                                                            json.mid = pairs.mid;
                                                                            json.low = pairs.low;
                                                                            resolve(json);
                                                                        }
                                                                        else {
                                                                            json.hand = "Highcard + " + getHighest(hand);
                                                                            json.comparable = 0;
                                                                            resolve(json);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

function isStraightFlush(hand) {
    return new Promise(function(resolve, reject) {
        isFlush(hand).then((flush) => {
            if(flush.status) {
                isStraigth(hand).then((straight) => {
                    if(straight.status) {
                        resolve({ status: true, handhigh: straight.handhigh });
                    }
                    else {
                        resolve({ status: false });
                    }
                });
            }
            else {
                resolve({ status: false });
            }
        });
    }).catch((err) => {
        console.log(err);
    });
}

function isQuads(hand) {
    return new Promise(function(resolve, reject) {
        if(hand[0].getNumber() === hand[1].getNumber() && hand[0].getNumber() === hand[2].getNumber() && hand[0].getNumber() === hand[3].getNumber()) {
            resolve({ status: true, handhigh: hand[0].getNumber() });
        }
        else if(hand[1].getNumber() === hand[2].getNumber() && hand[1].getNumber() === hand[3].getNumber() && hand[1].getNumber() === hand[4].getNumber()) {
            resolve({ status: true, handhigh: hand[1].getNumber() });
        }
        else {
            resolve({ status: false });
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isFullHouse(hand) {
    return new Promise(function(resolve, reject) {
        if(hand[0].getNumber() === hand[1].getNumber() && hand[0].getNumber() === hand[2].getNumber() && hand[3].getNumber() === hand[4].getNumber()) {
            resolve({ status: true, handhigh: hand[3].getNumber(), handlow: hand[0].getNumber() });
        }
        else if(hand[2].getNumber() === hand[3].getNumber() && hand[2].getNumber() === hand[4].getNumber() && hand[0].getNumber() === hand[1].getNumber()) {
            resolve({ status: true, handhigh: hand[2].getNumber(), handlow: hand[0].getNumber() });
        }
        else {
            resolve({ status: false });
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isFlush(hand) {
    return new Promise(function(resolve, reject) {
        if(hand[0].getSuit() === hand[1].getSuit() && hand[0].getSuit() === hand[2].getSuit() && hand[0].getSuit() === hand[3].getSuit() && hand[0].getSuit() === hand[4].getSuit()) {
            resolve({ status: true, handhigh: hand[4].getNumber() });
        }
        else {
            resolve({ status: false });
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isStraigth(hand) {
    return new Promise(function(resolve, reject) {
        if(hand[0].getNumber() === hand[1].getNumber()-1 && hand[0].getNumber() === hand[2].getNumber()-2 && hand[0].getNumber() === hand[3].getNumber()-3 && hand[0].getNumber() === hand[4].getNumber()-4) {
            resolve({ status: true, handhigh: hand[4].getNumber() });
        }
        else if(hand[4].getNumber() === 14) {
            if(hand[0].getNumber() === 2 && hand[1].getNumber() === 3 && hand[2].getNumber() === 4 && hand[3].getNumber() === 5) {
                resolve({ status: true, handhigh: hand[3].getNumber() });
            }
            else {
                resolve({ status: false });
            }
        }
        else {
            resolve({ status: false });
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isTrips(hand) {
    return new Promise(function(resolve, reject) {
        if(hand[0].getNumber() === hand[1].getNumber() && hand[0].getNumber() === hand[2].getNumber()) {
            resolve({ status: true, handhigh: hand[0].getNumber() });
        }
        else if(hand[1].getNumber() === hand[2].getNumber() && hand[1].getNumber() === hand[3].getNumber()) {
            resolve({ status: true, handhigh: hand[1].getNumber() });
        }
        else if(hand[2].getNumber() === hand[3].getNumber() && hand[2].getNumber() === hand[4].getNumber()) {
            resolve({ status: true, handhigh: hand[2].getNumber() });
        }
        else {
            resolve({ status: false });
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isTwopairs(hand) {
    return new Promise(function(resolve, reject) {
        let number = hand[0].getNumber();
        let stopped = 0;
        let low = 0;
        let highcard;

        for(let i = 1; i < hand.length; i++) {
            if(hand[i].getNumber() === number) {
                number = hand[i].getNumber();
                stopped = i+1;
                i = hand.length;
                low = number;
            }
            else {
                highcard = hand[i-1].getNumber();
                number = hand[i].getNumber();
            }
        }
        for(let j = stopped; j < hand.length; j++) {
            if(hand[j].getNumber() === number) {
                if(highcard === undefined) {
                    highcard = hand[5].getNumber();
                }
                
                resolve({ status: true, handhigh: number, handlow: low, high: highcard });
            }
            else {
                highcard = hand[j-1].getNumber();
                number = hand[j].getNumber();
            }
        }
        resolve({ status: false });
    }).catch((err) => {
        console.log(err);
    });
}

function isPair(hand) {
    return new Promise(function(resolve, reject) {
        let number = hand[0].getNumber();
        for(let i = 1; i < hand.length; i++) {
            if(hand[i].getNumber() === number) {
                let other = [];
                for(let j = 0; j < hand.length; j++) {
                    if(hand[j].getNumber() !== number) {
                        other.push(hand[j].getNumber());
                    }
                    if(j + 1 === hand.length) {
                        other.sort(function(a, b) {
                            return a - b;
                        });
                        resolve({ status: true, handhigh: number, high: other[2], mid: other[1], low: other[0] });
                    }
                }
            }
            else {
                number = hand[i].getNumber();
            }
        }
        resolve({ status: false });
    }).catch((err) => {
        console.log(err);
    });
}

function getHighest(hand) {
    return hand[4].getNumber();
}

function sortHand(hand) {
    return new Promise(function(resolve) {
        for(let i = 0; i < hand.length-1; i++) {
            for(let j = i+1; j < hand.length; j++) {
                if(hand[i].getNumber() > hand[j].getNumber()) {
                    let c = hand[i];
                    hand[i] = hand[j];
                    hand[j] = c;
                }
            }
        }
        resolve(hand);
    }).catch((err) => {
        console.log(err);
    });
}


module.exports = pokerHandCalc;