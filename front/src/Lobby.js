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
            const listed = playerlist.map((player) =>
                <li>{player}</li>
            );
            return (<ul>{listed}</ul>);
        });
    }

    makeplayerlist() {

        var lobby = this;

        return new Promise(function(resolve, reject) {
            getLobby().then((data) => {
                var playerlist = [];
                var playernames = []

                lobby.setState({players: data});

                playerlist = data.players.split(" /");

                for(var i in playerlist) {
                    playernames.push(i[0]);
                }

                console.log(playernames);

                resolve(playernames);
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