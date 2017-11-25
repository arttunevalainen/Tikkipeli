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

    this.plays = [];

    /** CONST ATTRIBUTES */
    this.maxplayers = 8;

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
        
        if(!nameTaken && name.length > 2 && tikki.players.length < tikki.maxplayers) {
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

        var gameready = 'false';
        if(tikki.gameready) {
            gameready = 'true';
        }

        tikki.listPlayers().then((players) =>  {
            var json = { players: players, gameready: gameready };
            resolve(json);
        });

    }).catch((err) => {
        console.log(err);
    });
}

/** Lists players */
Tikki.prototype.listPlayers = function() {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        var players = "";
        for(var i = 0; i < tikki.players.length; i++) {
            players = players + tikki.players[i].name + "/";
        }
        resolve(players);
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
            tikki.getHand(req.playername, req.playercode).then((hand) => {
                json.hand = hand;
                json.currentplayer = tikki.firstPlayer.name;
                tikki.listPlayers().then((players) =>  {
                    json.players = tikki.players;
                    resolve(json);
                });
            });
        }
        else {
            json.status = 'Error in getting the game';
            resolve(json)
        }
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.play = function(req) {

    var tikki = this;
    var json = {};

    return new Promise(function(resolve, reject) {
        if(tikki.gameready) {
            if(req.playercode === tikki.currentplayer.code) {
                var play = new Play();
            }
        }
        else {
            json.status = 'Error in sending play';
            resolve();
        }
    }).catch((err) => {
        console.log(err);
    });
}

/** Start game. Check admin, start round, select starting player, mark that game is ready */
Tikki.prototype.startGame = function(req) {

    var tikki = this;

    var playername = req.playername;
    var playercode = req.playercode;

    return new Promise(function(resolve, reject) {

        var status = "error in starting game";

        if(tikki.checkAdmin(playername, playercode)) {
            tikki.startRound().then((ok) => {
                if(ok === 'ok') {
                    tikki.randomPlayer().then((number) => {
                        tikki.firstPlayer = number;
                        tikki.gameready = true;

                        var json = { status: 'ok' };
                        resolve(json);
                    });
                }
                else {
                    var json = { status: status };
                    resolve(json)
                }
            });
        }
    }).catch((err) => {
        console.log(err);
    });
}

/** Check if player is Admin */
Tikki.prototype.checkAdmin = function(playername, playercode) {
    if(playername === this.adminplayer.name && playercode === this.adminplayer.code) {
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

/** Get player hand 
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

/** Select random player 
Tikki.prototype.randomPlayer = function() {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        var random = Math.floor((Math.random() * tikki.players.length));
        resolve(tikki.players[random]);
    }).catch((err) => {
        console.log(err);
    });
}

/** Deal hands for players 
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

/** Draw hands 
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

/** Initiate hands 
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
*/

module.exports = Tikki;