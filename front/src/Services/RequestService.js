
import axios from 'axios';


const address = "http://localhost:8081/";


export function getLobbies(name, code) {
    return new Promise(function(resolve, reject) {
        axios.post(address + 'getLobbies', {
                playername: name,
                playercode: code
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function setupGame(name, code, lobbycode) {
    return new Promise(function(resolve) {
        axios.post(address + 'setup', {
                playername: name,
                playercode: code,
                lobbycode: lobbycode
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function leaveLobby(name, code, lobbycode) {
    return new Promise(function(resolve) {
        axios.post(address + 'leaveLobby', {
                playername: name,
                playercode: code,
                lobbycode: lobbycode
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function leaveGame(name, code, lobbycode) {
    return new Promise(function(resolve) {
        axios.post(address + 'leaveGame', {
                playername: name,
                playercode: code,
                lobbycode: lobbycode
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function newPlayer(name) {
    return new Promise(function(resolve) {
        axios.post(address + 'addplayer', {
                playername: name
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error);
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function getLobby(name, code, lobbycode) {
    return new Promise(function(resolve) {
        axios.post(address + 'getlobby', {
                playername: name,
                playercode: code,
                lobbycode: lobbycode
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function createLobby(name, code) {
    return new Promise(function(resolve) {
        axios.post(address + 'createLobby', {
                playername: name,
                playercode: code
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function joinLobby(name, code, lobbyid) {
    return new Promise(function(resolve) {
        axios.post(address + 'joinLobby', {
                playername: name,
                playercode: code,
                lobbyid: lobbyid  
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function getGame(name, code, lobbycode,) {
    return new Promise(function(resolve) {
        axios.post(address + 'getGame', {
                playername: name,
                playercode: code,
                lobbycode: lobbycode
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function sendPlay(name, code, lobbycode, playedcard) {
    return new Promise(function(resolve) {
        axios.post(address + 'sendPlay', {
                playername : name,
                playercode : code,
                playedcard : playedcard,
                lobbycode: lobbycode
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}

export function changeCards(name, code, lobbycode, cards) {
    return new Promise(function(resolve) {
        axios.post(address + 'changeCards', {
                playername : name,
                playercode : code,
                cards : cards,
                lobbycode: lobbycode
            })
            .then(function (response) {
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}