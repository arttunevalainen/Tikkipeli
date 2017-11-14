
import axios from 'axios';


export function setupGame() {
    
    axios.get('http://localhost:8081/setup')
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error)
        });
}


export function newPlayer(name) {

    console.log(name);

    axios.post('http://localhost:8081/addplayer', {
            params : name
        })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            console.log(error);
        });
}