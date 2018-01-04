var Tikki = require('./Tikki.js');
var Player = require('./Player.js');


function Lobbies() {

    this.players = [];
    this.lobbies = [];
}

Lobbies.prototype.newPlayer = function(req) {
    let lobbies = this;

    return new Promise(function(resolve) {
        let nameTaken = false;
        let name =  req.playername;

        for(let i = 0; i < lobbies.players.length; i++) {
            if(lobbies.players[i].name === name) {
                nameTaken = true;
            }
        }
        
        if(!nameTaken && name.length > 2) {
            let a = new Player(name);
            lobbies.players.push(a);
            
            a.makeid().then(() => {
                let json = {status: 'ok', name: name, playercode: a.code};
                resolve(json)
            });
        }
        else {
            let json = {status: 'Error creating player'};
            resolve(json);
        }
    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.createNewLobby = function(req) {
    let lobbies = this;

    return new Promise(function(resolve) {
        let tikki = new Tikki();

        tikki.makeid().then(() => {
            lobbies.getPlayerObject(req.playername, req.playercode).then((player) => {
                tikki.addPlayer(player).then((status) => {
                    if(status.status === 'ok') {
                        lobbies.lobbies.push(tikki);
                        resolve({ status: 'ok', admin: status.admin, lobbycode: tikki.code });
                    }
                });
            });
        });

    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.joinLobby = function(req) {
    let lobbies = this;

    return new Promise(function(resolve) {
        lobbies.getPlayerObject(req.playername, req.playercode).then((player) => {
            let lobbyid = req.lobbyid.split("Tikki");
            lobbyid.shift();
            let lobby = lobbies.lobbies[lobbyid - 1];

            lobby.addPlayer(player).then((status) => {
                if(status.status === 'ok') {
                    resolve({ status: 'ok', admin: status.admin, lobbycode: lobby.code });
                }
                else {
                    resolve({ status: status.status });
                }
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.getLobbies = function() {
    let lobbies = this;

    return new Promise(function(resolve) {
        lobbies.listLobbies().then((lobs) =>  {
            resolve({ lobs: lobs });
        });

    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.listLobbies = function() {
    let lobbies = this;

    return new Promise(function(resolve) {
        let lobs = "";
        for(let i = 0; i < lobbies.lobbies.length; i++) {
            if(!lobbies.lobbies[i].gameready) {
                lobs = lobs + "Tikki" + (i + 1) + "-" + lobbies.lobbies[i].players.length + "/";
            }
        }
        resolve(lobs);
    }).catch((err) => {
        console.log(err);
    });
}

/** Returns player object from players[] */
Lobbies.prototype.getPlayerObject = function(name, code) {
    let lobbies =  this;
    
    return new Promise(function(resolve) {
        for(let i = 0; i < lobbies.players.length; i++) {
            if(lobbies.players[i].name === name && lobbies.players[i].code === code) {
                resolve(lobbies.players[i]);
            }
        }
        resolve("error");
    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.getLobby = function(req) {
    let lobbies = this;

    return new Promise(function(resolve) {
        lobbies.findLobby(req.lobbycode).then((lobby) => {
            lobby.getLobby().then((json) => {
                resolve(json);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.startGame = function(req) {
    let lobbies = this;

    return new Promise(function(resolve) {
        lobbies.findLobby(req.lobbycode).then((lobby) => {
            lobby.startGame(req).then((json) => {
                resolve(json);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.getGame = function(req) {
    let lobbies = this;

    return new Promise(function(resolve) {
        lobbies.findLobby(req.lobbycode).then((lobby) => {
            lobby.getGame(req).then((json) => {
                resolve(json);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.play = function(req) {
    let lobbies = this;

    return new Promise(function(resolve) {
        lobbies.findLobby(req.lobbycode).then((lobby) => {
            lobby.play(req).then((json) => {
                resolve(json);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.changeCards = function(req) {
    let lobbies = this;

    return new Promise(function(resolve) {
        lobbies.findLobby(req.lobbycode).then((lobby) => {
            lobby.changeCards(req).then((json) => {
                resolve(json);
            });
        });
    }).catch((err) => {
        console.log(err);
    });
}

Lobbies.prototype.findLobby = function(lobbycode) {
    let lobbies = this;

    return new Promise(function(resolve) {
        for(let i = 0; i < lobbies.lobbies.length; i++) {
            if(lobbies.lobbies[i].code === lobbycode) {
                resolve(lobbies.lobbies[i]);
            }
        }
        resolve();
    }).catch((err) => {
        console.log(err);
    });
}

module.exports = Lobbies;