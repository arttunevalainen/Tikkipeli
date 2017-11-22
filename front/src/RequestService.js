
import axios from 'axios';


const address = "http://localhost:8081/";


export function setupGame() {

    return new Promise(function(resolve, reject) {
        axios.get(address + 'setup')
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

export function getGame() {

    return new Promise(function(resolve, reject) {
        axios.get(address + 'getGame')
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

export function sendPlay(name, code, play) {
    
    return new Promise(function(resolve, reject) {
        axios.post(address + 'sendPlay', {
                playername : name,
                playercode : code,
                play : play
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