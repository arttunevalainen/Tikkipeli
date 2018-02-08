
import axios from 'axios';


const address = "http://localhost:8081/";


export function newPlayer(name) {
    return axios.post(address + 'addplayer', {
            playername: name
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function getLobbies(name, code) {
    return axios.post(address + 'getLobbies', {
            playername: name,
            playercode: code
        }).catch(function (error) {
            console.log(error);
        });
}

export function setupGame(name, code, lobbycode) {
    return axios.post(address + 'setup', {
            playername: name,
            playercode: code,
            lobbycode: lobbycode
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function leaveLobby(name, code, lobbycode) {
    return axios.post(address + 'leaveLobby', {
            playername: name,
            playercode: code,
            lobbycode: lobbycode
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function leaveGame(name, code, lobbycode) {
    return axios.post(address + 'leaveGame', {
            playername: name,
            playercode: code,
            lobbycode: lobbycode
        })
        .catch(function (error) {
            console.log(error)
        });
}

export function getLobby(name, code, lobbycode) {
    return axios.post(address + 'getlobby', {
            playername: name,
            playercode: code,
            lobbycode: lobbycode
        })
        .catch(function (error) {
            console.log(error)
        });
}

export function createLobby(name, code) {
    return axios.post(address + 'createLobby', {
            playername: name,
            playercode: code
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function joinLobby(name, code, lobbyid) {
    return axios.post(address + 'joinLobby', {
            playername: name,
            playercode: code,
            lobbyid: lobbyid  
        })
        .catch(function (error) {
            console.log(error);
        });
}

export function getGame(name, code, lobbycode,) {
    return axios.post(address + 'getGame', {
            playername: name,
            playercode: code,
            lobbycode: lobbycode
        })
        .catch(function (error) {
            console.log(error)
        });
}

export function sendPlay(name, code, lobbycode, playedcard) {
    return axios.post(address + 'sendPlay', {
            playername : name,
            playercode : code,
            playedcard : playedcard,
            lobbycode: lobbycode
        })
        .catch(function (error) {
            console.log(error)
        });
}

export function changeCards(name, code, lobbycode, cards) {
    return axios.post(address + 'changeCards', {
            playername : name,
            playercode : code,
            cards : cards,
            lobbycode: lobbycode
        })
        .catch(function (error) {
            console.log(error)
        });
}