import React, { Component } from 'react';
import { getLobby, setupGame } from './RequestService.js';
import './Lobby.css';


class Lobby extends Component {

    constructor(props) {
        super(props);

        this.state = ({players: " "});

        this.saveplayers = this.savePlayers.bind(this);
        this.makeplayerlist = this.makeplayerlist.bind(this);
        this.readyClicked = this.readyClicked.bind(this);
        this.listLobby = this.listLobby.bind(this);

        this.savePlayers();
    }

    componentDidMount() {
        this.interval = setInterval(() => this.savePlayers(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    savePlayers() {
        var lobby = this;
        this.makeplayerlist().then(function(data) {
            lobby.setState({players: data.players, gameready: data.gameready});

            if(lobby.state.gameready === "true") {
                clearInterval(lobby.interval);
                lobby.props.sendData();
            }
        });
    }

    makeplayerlist() {
        return new Promise(function(resolve, reject) {
            getLobby().then((data) => {
                resolve(data);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    listLobby() {
        var listItems = [];

        listItems = this.state.players.split("/");
        listItems.pop();
        
        const list = listItems.map((name) =>
            <li key={name.toString()}>
                {name}
            </li>
        );

        return <ul id="lobbylist">{list}</ul>
    }

    readyClicked() {
        setupGame(this.props.playername, this.props.playercode).then((data) => {
            this.props.sendData();
        });
    }

    render() {
        var admin = (this.props.admin === "true");

        return (
            <div id="lobby">
                {this.listLobby()}
                {admin &&
                    <button type="button" className="btn btn-secondary btn-lg" id="readybutton" onClick={this.readyClicked}>Ready</button>
                }
                {admin && <div><h6>Olet aulan admin.</h6></div>}
            </div>
        );
    }
}


export default Lobby;