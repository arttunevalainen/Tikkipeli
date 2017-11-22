const CardDeck = require('./CardDeck.js');
const Hand = require('./Hand.js');
const Card = require('./Card.js');
const Player = require('./Player.js');



function Tikki() {

    this.players = [];
    this.gameready = false;

    var adminplayer = undefined;

    var hand = new Hand();
    var deck = new CardDeck();

}

Tikki.prototype.addPlayer = function(name) {

    var tikki = this;

    return new Promise(function(resolve, reject) {

        var nameTaken = false;

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

Tikki.prototype.startGame = function(name, playercode) {

    var tikki = this;

    return new Promise(function(resolve, reject) {

        if(tikki.checkAdmin(name, playercode)) {
            tikki.startRound().then(() => {

            });
        }

        resolve();
    }).catch((err) => {
        console.log(err);
    });
}

Tikki.prototype.checkAdmin = function(name, playercode) {
    if(name === this.admin.name && playercode === this.admin.code) {
        return true;
    }
    return false;
}

Tikki.prototype.startRound = function() {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        deck.shuffle().then(() => {
            tikki.initiateHands(tikki.players.length).then((hands) => {
                tikki.drawHands(hands, deck).then(() => {
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

Tikki.prototype.getHand = function(name, playercode) {

    var tikki = this;

    return new Promise(function(resolve, reject) {
        for(var i = 0; i < tikki.players.length; i++) {
            if(tikki.players[i].name === name && tikki.players[i].code === playercode) {
                resolve(tikki.players[i].hand);
            }
        }
        resolve();
    }).catch((err) => {
        console.log(err);
    });
}

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