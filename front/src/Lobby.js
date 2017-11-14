import React, { Component } from 'react';
import { getLobby } from './RequestService.js';


class Lobby extends Component {

    constructor() {
        super();

        this.getListofplayers = this.getListofplayers.bind(this);
        this.makeplayerlist = this.makeplayerlist.bind(this);
    }

    getListofplayers() {
        this.makeplayerlist().then((playerlist) => {
            /*const listed = playerlist.map((player) =>
                <li>{player}</li>
            );
            return (<ul>{listed}</ul>);*/
        });
    }

    makeplayerlist() {

        return new Promise(function(resolve, reject) {
            getLobby().then((data) => {
                var playerlist = [];
                returnable = {};
                
                playerlist = data.players.split(" /");
                
                resolve(playerlist);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <div>
                {this.getListofplayers()}
                kek
            </div>
        );
    }

}


export default Lobby;