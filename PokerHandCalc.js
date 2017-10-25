

function pokerHandCalc(hand) {
    if(isStraightFlush(hand)) {
        return "StraightFlush";
    }
    else if(isQuads(hand)) {
        return "Quads";
    }
    else if(isFullHouse(hand)) {
        return "FullHouse";
    }
    else if(isFlush(hand)) {
        return "Flush";
    }
    else if(isStraight(hand)) {
        return "Straight";
    }
    else if(isTrips(hand)) {
        return "Trips";
    }
    else if(isTwopairs(hand)) {
        return "TwoPairs";
    }
    else if(isPairs(hand)) {
        return "Pairs";
    }
    else {
        return getHighest(hand);
    }
}

function isStraightFlush(hand) {
    return false;
}

function isQuads(hand) {
    return false;
}

function isFullHouse(hand) {
    return false;
}

function isFlush(hand) {
    return false;
}

function isStraight(hand) {
    return false;
}

function isTrips(hand) {
    return false;
}

function isTwopairs(hand) {
    return false;
}

function isPairs(hand) {
    return false;
}

function getHighest(hand) {
    var highest = 0;
    for(i = 0; i < hand.length; i++) {
        if(hand[i].getNumber() > highest) {
            highest = hand[i].getNumber();
        }
    }
    return highest;
}


module.exports = pokerHandCalc;