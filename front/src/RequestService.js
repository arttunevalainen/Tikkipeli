
import axios from 'axios';


const address = "http://localhost:8081/";


export function setupGame(name, code) {

    return new Promise(function(resolve, reject) {
        axios.post(address + 'setup', {
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

export function newPlayer(name) {

    return new Promise(function(resolve, reject) {
        axios.post(address + 'addplayer', {
                playername : name
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

export function getLobby() {

    return new Promise(function(resolve, reject) {
        axios.get(address + 'getlobby')
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

export function getGame(name, code) {

    return new Promise(function(resolve, reject) {
        axios.post(address + 'getGame', {
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

export function sendPlay(name, code, playedcard) {
    
    return new Promise(function(resolve, reject) {
        axios.post(address + 'sendPlay', {
                playername : name,
                playercode : code,
                playedcard : playedcard
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

export function changeCards(name, code, cards) {
    return new Promise(function(resolve, reject) {
        axios.post(address + 'changeCards', {
                playername : name,
                playercode : code,
                cards : cards
            })
            .then(function (response) {
                console.log(response.data);
                resolve(response.data);
            })
            .catch(function (error) {
                console.log(error)
            });
    }).catch((err) => {
        console.log(err);
    });
}