var CardDeck = require('./CardDeck.js');
var Hand = require('./Hand.js');
var Card = require('./Card.js');
var Player = require('./Player.js');
var pokerhandcalc = require('./PokerHandCalc.js');

var promiseWhile = require('while-promise')(Promise)



class Round {

    constructor(players) {
        this.players = players;

        this.plays = [];

        this.changePhase = true;
        this.roundOver = false;

        this.startingplayer;
        this.currentplayer;
    }

    /** Start round */
    initiateRound() {

        var round = this;
        this.deck = new CardDeck();

        round.plays = [];

        return new Promise(function(resolve) {
            round.getStarterPlayer().then((player) => {
                round.startingplayer = player;
                round.currentplayer = round.startingplayer;
                round.deck.shuffle().then(() => {
                    round.initiateHands().then((hands) => {
                        round.drawHands(hands).then((hands) => {
                            round.handsforplayers(hands).then(() => {
                                round.newChangeRound().then((status) => {
                                    if(status === 'ok') {
                                        resolve('ok');
                                    }
                                })
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    newChangeRound() {
        var round = this;
        
        return new Promise(function(resolve) {
            for(var i = 0; i < round.players.length; i++) {
                round.players[i].changedCards = false;
            }
            resolve('ok');
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Get game for response */
    getGame(req) {
        
        var round = this;
        var json = {};
    
        return new Promise(function(resolve) {
            round.getHand(req.playername, req.playercode).then((hand) => {
                json.hand = hand;
                round.listPlayers().then((players) =>  {
                    json.players = players;
                    if(round.changePhase) {
                        round.allPlayersChanged().then((ready) => {
                            if(ready) {
                                round.changePhase = false;
                            }
                            json.status = 'changephase';
                            round.playerHasChanged(req.playername, req.playercode).then((changed) => {
                                if(changed) {
                                    json.changestatus = 'done';
                                    resolve(json);
                                }
                                else {
                                    json.changestatus = 'waiting';
                                    resolve(json);
                                }
                            });
                        });
                    }
                    else {
                        json.currentplayer = round.currentplayer.name;
                        round.readyPlaysForSending(req.playername).then((plays) => {
                            json.plays = plays;
                            json.status = 'ok';
                            resolve(json);
                        });
                    }
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Check if all players have played all their cards */
    isRoundOver() {

        var allEmpty = true;
        var round = this;

        return new Promise(function(resolve) {
            for(var i = 0; i < round.players.length; i++) {
                if(!round.players[i].hand.isEmpty()) {
                    allEmpty = false;
                }
            }
            round.roundOver = allEmpty;

            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Ready recent plays for response */
    readyPlaysForSending(playername) {

        var recentPlays = "";
        var round = this;

        return new Promise(function(resolve) {
            for(var i = 0; i < round.plays.length; i++) {
                //if(round.plays[i].player !== playername) {
                    recentPlays = recentPlays + round.plays[i].player + " " + round.plays[i].card + "/";
                /*}
                else {
                    resolve(recentPlays);
                }*/
            }
            resolve(recentPlays);
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Player tries to play */
    savePlay(req) {
        var round =  this;

        return new Promise(function(resolve) {
            round.getPlayerObject(req.playername, req.playercode).then((player) => {
                if(player !== "error") {
                    round.iscurrentplayer(req).then((iscurrent) => {
                        if(iscurrent) {
                            round.checkRules(req.playedcard, player).then((goodplay) => {
                                if(goodplay) {
                                    if(player.hand.poker === '') {
                                        player.hand.setPoker().then(() => {
                                            console.log(player.hand.poker);
                                            player.cardPlayed(req.playedcard).then((json) => {
                                                if(json.status === 'ok') {
                                                    round.plays.unshift({ player: req.playername, card: req.playedcard });
                                                    round.nextPlayerToPlay().then(() => {
                                                        resolve({ status : 'ok', currentplayer: round.currentplayer.name });
                                                    });
                                                }
                                                else {
                                                    resolve({ status: "error" });
                                                }
                                            });
                                        });
                                    }
                                    else {
                                        player.cardPlayed(req.playedcard).then((json) => {
                                            if(json.status === 'ok') {
                                                round.plays.unshift({ player: req.playername, card: req.playedcard });
                                                round.nextPlayerToPlay().then(() => {
                                                    resolve({ status : 'ok', currentplayer: round.currentplayer.name });
                                                });
                                            }
                                            else {
                                                resolve({ status: "error" });
                                            }
                                        });
                                    }
                                }
                                else {
                                    resolve({ status: "wrongplay" });
                                }
                            });
                        }
                        else {
                            resolve({ status: "error" });
                        }
                    });
                }
                else {
                    resolve({ status: "error" });
                }
            })
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Play by tikki rules */
    checkRules(card, player) {
        var round = this;

        return new Promise(function(resolve) {

            var a = new Card('', '');
            var b = new Card('', '');

            a.objectifyCard(card).then(() => {
                if(round.startingplayer.name === player.name) {
                    resolve(true);
                }
                else {
                    round.searchStarterPlayerPlay().then((startingplay) => {
                        if(startingplay) {
                    
                            b.objectifyCard(startingplay.card).then(() => {
                                if(a.suit === b.suit) {
                                    round.compareCards(player, a, b).then(() => {
                                        resolve(true);
                                    });
                                }
                                else {
                                    round.playerHasPlayableCards(player, b.suit).then((playable) => {
                                        if(playable) {
                                            resolve(false);
                                        }
                                        else {
                                            resolve(true);
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            resolve({status: 'error'});
                        }
                    });
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Compare cards and change startingplayer if needed */
    compareCards(player, a, b) {
        var round = this;

        return new Promise(function(resolve) {
            if(a.number > b.number) {
                round.startingplayer = player;
            }
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Return true if player has playable cards left in hand */
    playerHasPlayableCards(player, suit) {

        return new Promise(function(resolve) {

            for(var i = 0; i < player.hand.hand.length; i++) {
                if(player.hand.hand[i].suit === suit) {
                    resolve(true);
                }
            }

            resolve(false);

        }).catch((err) => {
            console.log(err);
        });
    }

    /** Find startingplayer latest play */
    searchStarterPlayerPlay() {
        var round = this;

        return new Promise(function(resolve) {

            for(var i = 0; i < round.plays.length; i++) {
                if(round.plays[i].player === round.startingplayer.name) {
                    resolve(round.plays[i]);
                }
            }
            resolve(undefined);
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Count points after last play is made */
    countPoints() {
        var round = this;

        return new Promise(function(resolve) {
            round.getPlayerIndex(round.startingplayer.name).then((index) => {
                round.players[index].points = round.players[index].points + 3;
                var tikkiwinner = round.players[index].name;

                round.endingWithTwo().then((twoend) => {
                    round.checkHands().then((status) => {
                        var cards = round.players[status.winner].hand.playedCards.stringHand();
                        var pokerwinner = round.players[status.winner].name;
                        resolve({ status: 'ok',
                                  tikkiwinner: tikkiwinner,
                                  twoend: twoend,
                                  pokerwinner: pokerwinner,
                                  hand: round.players[status.winner].hand.poker.hand,
                                  cards: cards });
                    });
                });
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Get best pokerhand */
    checkHands() {
        var round = this;

        return new Promise(function(resolve) {
            var besthand = {comparable: 0};
            var ownerofbesthand = 0;

            for(var i = 0; i < round.players.length; i++) {
                var playerhand = round.players[i].hand;
                if(playerhand.poker.comparable > besthand.comparable) {
                    besthand = playerhand.poker;
                    ownerofbesthand = i;
                }
                else if(playerhand.poker.comparable === besthand.comparable && besthand.comparable !== 0) {
                    if(playerhand.poker.handhigh > besthand.handhigh) {
                        besthand = playerhand.poker;
                        ownerofbesthand = i;
                    }
                    else if(playerhand.poker.hand === "TwoPairs") {
                        if(playerhand.poker.handlow > besthand.handlow) {
                            besthand = playerhand.poker;
                            ownerofbesthand = i;
                        }
                    }
                    else if(playerhand.poker.hand === "Pair") {
                        if(playerhand.poker.high > besthand.high) {
                            besthand = playerhand.poker;
                            ownerofbesthand = i;
                        }
                        else if(playerhand.poker.mid > besthand.mid) {
                            besthand = playerhand.poker;
                            ownerofbesthand = i;
                        }
                        else if(playerhand.poker.low > besthand.low) {
                            besthand = playerhand.poker;
                            ownerofbesthand = i;
                        }
                    }
                }
            }

            /**
             * VÄRISUORA 10p
             * NELOSET 10p
             * TÄYSIKÄSI 6p
             * VÄRI 5p
             * SUORA 4p
             * KOLMOSET 3p
             * KAKSIPARIA 2p
             * PARI 1p
             */
            var owner = round.players[ownerofbesthand];
            if(besthand.hand === "StraightFlush") {
                owner.points = owner.points + 10;
            }
            else if(besthand.hand === "Quads") {
                owner.points = owner.points + 10;
            }
            else if(besthand.hand === "FullHouse") {
                owner.points = owner.points + 6;
            }
            else if(besthand.hand === "Flush") {
                owner.points = owner.points + 5;
            }
            else if(besthand.hand === "Straigth") {
                owner.points = owner.points + 4;
            }
            else if(besthand.hand === "Trips") {
                owner.points = owner.points + 3;
            }
            else if(besthand.hand === "TwoPairs") {
                owner.points = owner.points + 2;
            }
            else if(besthand.hand === "Pair") {
                owner.points = owner.points + 1;
            }

            resolve({ status: 'ok', winner: ownerofbesthand });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** End round with 2 - rule */
    endingWithTwo() {
        var round = this;

        return new Promise(function(resolve) {
            round.getPlayerIndex(round.startingplayer.name).then((index) => {
                if(round.players[index].hand.playedCards[0].getNumber() === 2) {
                    for(var i = 0; i < round.players.length; i++) {
                        if(i !== index) {
                            round.players[i].points = round.players[i].points - 3;
                        }
                    }
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    /**Check if player who tries to play is really current player */
    iscurrentplayer(req) {
        var round = this;

        return new Promise(function(resolve) {
            if(round.currentplayer.name === req.playername && round.currentplayer.code === req.playercode) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Get next player in playing queue or startingplayer to play */
    nextPlayerToPlay() {
        var round =  this;

        return new Promise(function(resolve) {

            if(round.plays.length % round.players.length !== 0) {
                if(round.plays[0].player === round.currentplayer.name) {
                    round.getPlayerIndex(round.currentplayer.name).then((index) => {
                        if(index + 1 === round.players.length) {
                            round.currentplayer = round.players[0];
                            resolve();
                        }
                        else {
                            round.currentplayer = round.players[index + 1];
                            resolve();
                        }
                    });
                }
            }
            else {
                round.currentplayer = round.startingplayer;
                resolve();
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Returns index of player in players[] */
    getPlayerIndex(playername) {
        var round = this;

        return new Promise(function(resolve) {
            for (var i = 0; i < round.players.length; i++) {
                if(round.players[i].name === playername) {
                    resolve(i);
                }
            }
            resolve("error");
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Returns player object from players[] */
    getPlayerObject(name, code) {
        var round =  this;
        
        return new Promise(function(resolve) {
            for(var i = 0; i < round.players.length; i++) {
                if(round.players[i].name === name && round.players[i].code === code) {
                    resolve(round.players[i]);
                }
            }
            resolve("error");
        }).catch((err) => {
            console.log(err);
        });
    }

    /** List players as string for response */
    listPlayers() {
        var round = this;
    
        return new Promise(function(resolve) {
            var players = "";
            for(var i = 0; i < round.players.length; i++) {
                players = players + round.players[i].name + "/";
            }
            resolve(players);
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Get players hand */
    getHand(name, playercode) {
        var round = this;
        
        return new Promise(function(resolve) {
            for(var i = 0; i < round.players.length; i++) {
                if(round.players[i].name === name && round.players[i].code === playercode) {
                    resolve(round.players[i].hand.stringHand());
                }
            }
            resolve();
        }).catch((err) => {
            console.log(err);
        });
    }

    getStarterPlayer() {
        var round = this;

        return new Promise(function(resolve) {
            for(var i = 0; i < round.players.length; i++) {
                if(round.players[i].starter) {
                    resolve(round.players[i]);
                }
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Deal hands for players */
    handsforplayers(hands) {
        var round = this;
        
        return new Promise(function(resolve) {
            for(var i = 0; i < round.players.length; i++) {
                round.players[i].hand = hands[i];
            }
            resolve()
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Draw hands */
    drawHands(hands) {
        var round = this;

        return new Promise(function(resolve) {
            for(var k = 0; k < hands.length; k++) {
                for(var m = 0; m < 5; m++) {
                    hands[k].addtoHand(round.deck.draw());
                }
            }
            resolve(hands)
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Initiate hands */
    initiateHands() {
        var round = this;

        return new Promise(function(resolve) {
            var hands = [];
            for(var j = 0; j < round.players.length; j++) {
                hands.push(new Hand());
            }
            resolve(hands)
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Players change cards before round start */
    changeCards(req) {
        var round = this;

        var playername = req.playername;
        var playercode = req.playercode;

        return new Promise(function(resolve) {
            round.getPlayerObject(playername, playercode).then((player) => {
                if(!player.changedCards) {
                    var stringcards = req.cards;
                    var cards = stringcards.split("/");
                    cards.pop();
        
                    if(cards.length === 0) {
                        player.changedCards = true;
                        resolve({status: 'ok'});
                    }
                    else {
                        if(cards.length < 5) {

                            for(var i = 0; i < cards.length; i++) {
                                player.hand.addtoHand(round.deck.draw());
                            }

                            cards.reduce((chain, card) => {
                                return chain.then(() => player.hand.deleteCard(card));
                            }, Promise.resolve());

                            player.changedCards = true;
                            resolve({ status: 'ok' });
                        }
                        else if(cards.length === 5) {
                            if(round.legalCardChange(stringcards)) {
                                player.hand.hand = [];

                                for(var j = 0; j < 5; j++) {
                                    player.hand.addtoHand(round.deck.draw());
                                }

                                player.changedCards = true;
                                resolve({ status: 'ok' });
                            }
                            else {
                                resolve({ status: 'badChange' });
                            }
                        }
                    }
                }
                else {
                    resolve({ status: 'allreadychanged' });
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    /** Check for legal five card change */
    legalCardChange(cards) {
        if(cards.includes('A') || cards.includes('K') || cards.includes('Q') || cards.includes('J') || cards.includes('T')) {
            return(false);
        }
        else {
            return(true);
        }
    }

    /** Check if all players have changed cards */
    allPlayersChanged() {
        var round = this;

        return new Promise(function(resolve) {
            for(var i = 0; i < round.players.length; i++) {
                if(!round.players[i].changedCards) {
                    resolve(false);
                }
            }
            //round.changePhase = false;
            resolve(true);
        }).catch((err) => {
            console.log(err);
        });
    }

    playerHasChanged(playername, playercode) {
        var round = this;

        return new Promise(function(resolve)  {
            round.getPlayerObject(playername, playercode).then((player) => {
                if(player.changedCards) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        }).catch((err) => {
            console.log(err);
        });
    }
}



module.exports = Round;