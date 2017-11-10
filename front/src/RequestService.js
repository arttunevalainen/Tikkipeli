
import axios from 'axios';


/*function setupGame() {
    
    axios.get('http://localhost:8081/setup')
        .then(function (response) {
            component.setState({ data : response.data });
        })
        .catch(function (error) {
            console.log(error)
        });
}*/


export function newPlayer(name) {

    console.log(name);

    axios.post('http://localhost:8081/addplayer', {
            params : name
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
}