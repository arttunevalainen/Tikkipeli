
const Card = require('./Card.js');


/** Pokerhand calculator. Give array of five (5) Card objects and this will calculate pokerhand for it with highcards ect */
function pokerHandCalc(hand) {
    return new Promise(function(resolve, reject) {
        sortHand(hand).then(() => {
            var json = {};

            isStraightFlush(hand).then((sf) => {
                if(sf.status) {
                    json.hand = "StraightFlush";
                    json.handhigh = sf.handhigh;
                    resolve(json);
                }
                else {
                    isQuads(hand).then((qds) => {
                        if(qds.status) {
                            json.hand = "Quads";
                            json.handhigh = qds.handhigh;
                            resolve(json);
                        }
                        else {
                            isFullHouse(hand).then((fh) => {
                                if(fh.status) {
                                    json.hand = "FullHouse";
                                    json.handhigh = fh.handhigh;
                                    json.handhighcount = fh.handhighcount;
                                    json.handlow = fh.handlow;
                                    resolve(json);
                                }
                                else {
                                    isFlush(hand).then((flush) => {
                                        if(flush.status) {
                                            json.hand = "Flush";
                                            json.handhigh = flush.handhigh;
                                            resolve(json);
                                        }
                                        else {
                                            isStraigth(hand).then((stra) => {
                                                if(stra.status) {
                                                    json.hand = "Straigth";
                                                    json.handhigh = stra.handhigh;
                                                    resolve(json);
                                                }
                                                else {
                                                    isTrips(hand).then((trips) => {
                                                        if(trips.status) {
                                                            json.hand = "Trips";
                                                            json.handhigh = trips.handhigh;
                                                            resolve(json);
                                                        }
                                                        else {
                                                            isTwopairs(hand).then((twopairs) => {
                                                                if(twopairs.status) {
                                                                    json.hand = "TwoPairs";
                                                                    json.handhigh = twopairs.handhigh;
                                                                    json.handlow = twopairs.handlow;
                                                                    resolve(json);
                                                                }
                                                                else {
                                                                    isPairs(hand).then((pairs) => {
                                                                        if(pairs.status) {
                                                                            json.hand = "Pair";
                                                                            json.handhigh = pairs.handhigh;
                                                                            json.high = pairs.high;
                                                                            json.middle = pairs.middle;
                                                                            json.low = pairs.low;
                                                                            resolve(json);
                                                                        }
                                                                        else {
                                                                            json.hand = "Highcard + " + getHighest(hand);
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
                        resolve({ status: true });
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
            resolve({ status: true });
        }
        else if(hand[1].getNumber() === hand[2].getNumber() && hand[1].getNumber() === hand[3].getNumber() && hand[1].getNumber() === hand[4].getNumber()) {
            resolve({ status: true });
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
            resolve({ status: true });
        }
        else if(hand[2].getNumber() === hand[3].getNumber() && hand[2].getNumber() === hand[4].getNumber() && hand[0].getNumber() === hand[1].getNumber()) {
            resolve({ status: true });
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
            resolve({ status: true, handhigh: hand[4].getSuit() });
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
                resolve({ status: true, handhigh: 5 });
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
            resolve({ status: true, handhigh: hand[0].getNumber()});
        }
        else if(hand[1].getNumber() === hand[2].getNumber() && hand[1].getNumber() === hand[3].getNumber()) {
            resolve({ status: true, handhigh: hand[1].getNumber()});
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
        var number = hand[0].getNumber();
        var stopped = 0;
        var low = 0;
        for(var i = 1; i < hand.length; i++) {
            if(hand[i].getNumber() === number) {
                number = hand[i].getNumber();
                stopped = i+1;
                i = hand.length;
                low = number;
            }
            else {
                number = hand[i].getNumber();
            }
        }
        for(var j = stopped; j < hand.length; j++) {
            if(hand[j].getNumber() === number) {
                resolve({ status: true, handhigh: number, handlow: number });
            }
            else {
                number = hand[j].getNumber();
            }
        }
        resolve({ status: false });
    }).catch((err) => {
        console.log(err);
    });
}

function isPairs(hand) {
    return new Promise(function(resolve, reject) {
        var number = hand[0].getNumber();
        for(var i = 1; i < hand.length; i++) {
            if(hand[i].getNumber() === number) {
                resolve({ status: true, handhigh: number });
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
        for(var i = 0; i < hand.length-1; i++) {
            for(var j = i+1; j < hand.length; j++) {
                if(hand[i].getNumber() > hand[j].getNumber()) {
                    var c = hand[i];
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