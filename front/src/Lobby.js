import React, { Component } from 'react';
import { getLobby } from './RequestService.js';
import { readyInLobby } from './RequestService.js';
import './Lobby.css';


class Lobby extends Component {

    constructor(props) {
        super(props);

        this.state = ({players: " "});

        this.saveplayers = this.savePlayers.bind(this);
        this.makeplayerlist = this.makeplayerlist.bind(this);
        this.readyClicked = this.readyClicked.bind(this);

        this.savePlayers();
    }

    savePlayers() {

        var lobby = this;

        this.makeplayerlist().then(function(playernames) {
            lobby.setState({players: playernames});
        });
    }

    makeplayerlist() {

        return new Promise(function(resolve, reject) {
            getLobby().then((data) => {

                data = data.players.split(" /");
                data.pop();
                //console.log(data);

                resolve(data);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    listLobby() {
        var listItems = [];

        for(var i = 0; i < this.state.players.length; i++) {
            var a = this.state.players[i].split(" - ");
            listItems.push(a[0]);
        }

        
        
        const list = listItems.map((name) =>
            <li key={name.toString()}>
                {name} {this.getReadyState(name)}
            </li>
        );

        return <ul id="lobbylist">{list}</ul>
    }

    getReadyState(name) {
        for(var i = 0; i < this.state.players.length; i++) {
            var a = this.state.players[i].split(" - ");
            if(a[0] === name) {
                if(a[1] === "false") {
                    return "not ready";
                }
                else {
                    return "ready";
                }
            }
        }
    }

    readyClicked() {
        readyInLobby(this.props.playername, this.props.playercode).then((data) => {
            this.savePlayers();
            this.listLobby();
        });
    }

    render() {

        return (
            <div id="lobby">
                {this.listLobby()}
                <button type="button" className="btn btn-secondary btn-lg" id="readybutton" onClick={this.readyClicked}>Ready</button>
            </div>
        );
    }
}


export default Lobby;