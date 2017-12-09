
const Card = require('./Card.js');



function pokerHandCalc(hand) {
    return new Promise(function(resolve, reject) {
        sortHand(hand).then(() => {
            var json = {};

            isStraightFlush(hand).then((sf) => {
                if(sf) {
                    json.handpoints = 10;
                    json.hand = "StraightFlush";
                    resolve(json);
                }
                isQuads(hand).then((qds) => {
                    if(qds) {
                        json.handpoints = 10;
                        json.hand = "Quads";
                        resolve(json);
                    }
                    isFullHouse(hand).then((fh) => {
                        if(fh) {
                            json.handpoints = 6;
                            json.hand = "FullHouse";
                            resolve(json);
                        }
                        isFlush(hand).then((flush) => {
                            if(flush) {
                                json.handpoints = 5;
                                json.hand = "Flush";
                                resolve(json);
                            }
                            isStraigth(hand).then((stra) => {
                                if(stra) {
                                    json.handpoints = 4;
                                    json.hand = "Straigth";
                                    resolve(json);
                                }
                                isTrips(hand).then((trips) => {
                                    if(trips) {
                                        json.handpoints = 3;
                                        json.hand = "Trips";
                                        resolve(json);
                                    }
                                    isTwopairs(hand).then((twopairs) => {
                                        if(twopairs) {
                                            json.handpoints = 2;
                                            json.hand = "TwoPairs";
                                            resolve(json);
                                        }
                                        isPairs(hand).then((pairs) => {
                                            if(pairs) {
                                                json.handpoints = 1;
                                                json.hand = "Pair";
                                                resolve(json);
                                            }
                                            else {
                                                json.handpoints = 0;
                                                json.hand = "Highcard + " + getHighest(hand);
                                                resolve(json);
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

function isStraightFlush(hand) {
    return new Promise(function(resolve, reject) {
        isFlush(hand).then((flush) => {
            if(flush) {
                isStraigth(hand).then((straight) => {
                    if(straight) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
            }
            else {
                resolve(false);
            }
        });
    }).catch((err) => {
        console.log(err);
    });
}

function isQuads(hand) {
    return new Promise(function(resolve, reject) {
        if(hand[0].getNumber() === hand[1].getNumber() && hand[0].getNumber() === hand[2].getNumber() && hand[0].getNumber() === hand[3].getNumber()) {
            resolve(true);
        }
        else if(hand[1].getNumber() === hand[2].getNumber() && hand[1].getNumber() === hand[3].getNumber() && hand[1].getNumber() === hand[4].getNumber()) {
            resolve(true);
        }
        else {
            resolve(false);
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isFullHouse(hand) {
    return new Promise(function(resolve, reject) {
        if(hand[0].getNumber() === hand[1].getNumber() && hand[0].getNumber() === hand[2].getNumber() && hand[3].getNumber() === hand[4].getNumber()) {
            resolve(true);
        }
        else if(hand[2].getNumber() === hand[3].getNumber() && hand[2].getNumber() === hand[4].getNumber() && hand[0].getNumber() === hand[1].getNumber()) {
            resolve(true);
        }
        else {
            resolve(false);
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isFlush(hand) {

    return new Promise(function(resolve, reject) {
        if(hand[0].getSuit() === hand[1].getSuit() && hand[0].getSuit() === hand[2].getSuit() && hand[0].getSuit() === hand[3].getSuit() && hand[0].getSuit() === hand[4].getSuit()) {
            resolve(true);
        }
        else {
            resolve(false);
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isStraigth(hand) {

    return new Promise(function(resolve, reject) {
        if(hand[0].getNumber() === hand[1].getNumber()-1 && hand[0].getNumber() === hand[2].getNumber()-2 && hand[0].getNumber() === hand[3].getNumber()-3 && hand[0].getNumber() === hand[4].getNumber()-4) {
            resolve(true);
        }
        else if(hand[4].getNumber() === 14) {
            if(hand[0].getNumber() === 2 && hand[1].getNumber() === 3 && hand[2].getNumber() === 4 && hand[3].getNumber() === 5) {
                resolve(true);
            }
        }
        else {
            resolve(false);
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isTrips(hand) {
    return new Promise(function(resolve, reject) {
        if(hand[0].getNumber() === hand[1].getNumber() && hand[0].getNumber() === hand[2].getNumber()) {
            resolve(true);
        }
        else if(hand[1].getNumber() === hand[2].getNumber() && hand[1].getNumber() === hand[3].getNumber()) {
            resolve(true);
        }
        else if(hand[2].getNumber() === hand[3].getNumber() && hand[2].getNumber() === hand[4].getNumber()) {
            resolve(true);
        }
        else {
            resolve(false);
        }
    }).catch((err) => {
        console.log(err);
    });
}

function isTwopairs(hand) {
    return new Promise(function(resolve, reject) {
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
                resolve(true);
            }
            else {
                number = hand[j].getNumber();
            }
        }
        resolve(false);
    }).catch((err) => {
        console.log(err);
    });
}

function isPairs(hand) {
    return new Promise(function(resolve, reject) {
        var number = hand[0].getNumber();
        for(var i = 1; i < hand.length; i++) {
            if(hand[i].getNumber() === number) {
                resolve(true);
            }
            else {
                number = hand[i].getNumber();
            }
        }
        resolve(false);
    }).catch((err) => {
        console.log(err);
    });
}

function getHighest(hand) {
    return hand[4].getNumber();
}

function sortHand(hand) {

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
        resolve(hand);
    }).catch((err) => {
        console.log(err);
    });
}


module.exports = pokerHandCalc;