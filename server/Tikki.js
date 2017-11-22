const CardDeck = require('./CardDeck.js');
const Hand = require('./Hand.js');
const Card = require('./Card.js');
const Player = require('./Player.js');



function Tikki() {

    this.players = [];
    this.gameready = false;
    this.adminplayer = undefined;
    this.gameround = 0;

    this.firstPlayer;
    this.deck;

}

/** Add new player to the lobby */
Tikki.prototype.addPlayer = function(req) {

    var tikki = this;

    return new Promise(function(resolve, reject) {

        var nameTaken = false;
        var name =  req.playername;

        for(var i = 0; i < tikki.players.length; i++) {
            if(tikki.players[i].name === name) {
                nameTaken = true;
            }
        }

        if(!nameTaken && name.length > 2) {
            var a = new Player(name);

            var isadmin = "false";
            if(tikki.players.length === 0) {
                tikki.adminplayer = a;
                isadmin = "true";
            }

            tikki.players.push(a);
            
            a.makeid().then(() => {
                var json = {status: 'ok', name: name, playercode: a.code, admin: isadmin};
                resolve(json)
            });
        }
        else {
            var json = {status: 'Error creating player'};
            resolve(json);
        }
    }).catch((err) => {
        console.log(err);
    });
}

/** Get players in lobby */
Tikki.prototype.getLobby = function() {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        
        var players = "";
        for(var i = 0; i < tikki.players.length; i++) {
            players = players + tikki.players[i].name + "/";
        }

        var json = {players: players};

        resolve(json);

    }).catch((err) => {
        console.log(err);
    });
}

/** Get game status */
Tikki.prototype.getGame = function(req) {

    var tikki = this;
    var json = {};

    return new Promise(function(resolve, reject) {
        if(tikki.gameready) {
            tikki.getHand(req.name, req.playercode).then((hand) => {
                console.log(hand);
            });
            json = { startingplayer: tikki.firstPlayer.name };
        }
        else {
            json = {status: 'Error'};
            resolve(json)
        }
    }).catch((err) => {
        console.log(err);
    });
}

/** Start game. Check admin, start round, select starting player, mark that game is ready */
Tikki.prototype.startGame = function(name, playercode) {

    var tikki = this;

    return new Promise(function(resolve, reject) {

        if(tikki.checkAdmin(name, playercode)) {
            tikki.startRound().then((status) => {
                tikki.randomPlayer().then((number) => {
                    tikki.firstPlayer = number;
                    if(status === 'ok') {
                        tikki.gameready = true;
                    }
                });
            });
        }

        resolve();
    }).catch((err) => {
        console.log(err);
    });
}

/** Check if player is Admin */
Tikki.prototype.checkAdmin = function(name, playercode) {
    if(name === this.admin.name && playercode === this.admin.code) {
        return true;
    }
    return false;
}

/** Start round by creating deck, shuffling it, initiating player hands, draw hands, deal hands for players */
Tikki.prototype.startRound = function() {

    var tikki = this;
    tikki.deck = new CardDeck();

    return new Promise(function(resolve, reject) {
        tikki.deck.shuffle().then(() => {
            tikki.initiateHands(tikki.players.length).then((hands) => {
                tikki.drawHands(hands, tikki.deck).then((hands) => {
                    tikki.handsforplayers(hands).then(() => {
                        var status = "ok";
                        resolve(status);
                    });
                });
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

/** Get player hand */
Tikki.prototype.getHand = function(name, playercode) {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        for(var i = 0; i < tikki.players.length; i++) {
            if(tikki.players[i].name === name && tikki.players[i].code === playercode) {
                resolve(tikki.players[i].hand.stringHand());
            }
        }
        resolve();
    }).catch((err) => {
        console.log(err);
    });
}

/** Select random player */
Tikki.prototype.randomPlayer = function() {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        var random = Math.floor((Math.random() * tikki.players.length));
        resolve(tikki.players[random]);
    }).catch((err) => {
        console.log(err);
    });
}

/** Deal hands for players */
Tikki.prototype.handsforplayers = function(hands) {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        for(var i = 0; i < tikki.players.length; i++) {
            tikki.players[i].hand = hands[i];
        }
        resolve()
    }).catch((err) => {
        console.log(err);
    });
}

/** Draw hands */
Tikki.prototype.drawHands = function(hands, deck) {
    return new Promise(function(resolve, reject) {
        for(var k = 0; k < hands.length; k++) {
            for(var m = 0; m < 5; m++) {
                hands[k].addtoHand(deck.draw());
            }
        }
        resolve(hands)
    }).catch((err) => {
        console.log(err);
    });
}

/** Initiate hands */
Tikki.prototype.initiateHands = function(i) {
    return new Promise(function(resolve, reject) {
        var hands = [];
        for(var j = 0; j < i; j++) {
            hands.push(new Hand());
        }
        resolve(hands)
    }).catch((err) => {
        console.log(err);
    });
}


module.exports = Tikki;