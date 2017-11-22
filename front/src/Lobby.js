import React, { Component } from 'react';
import { getLobby } from './RequestService.js';
import './Lobby.css';


class Lobby extends Component {

    constructor(props) {
        super(props);

        this.state = ({players: " ", seconds: 0});

        this.saveplayers = this.savePlayers.bind(this);
        this.makeplayerlist = this.makeplayerlist.bind(this);
        this.readyClicked = this.readyClicked.bind(this);
        this.tick = this.tick.bind(this);

        this.savePlayers();
    }

    tick() {
        this.setState({seconds: this.state.seconds + 1});
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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

                data = data.players;

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
        console.log("ready clicked!");
    }

    render() {
        var admin = false;
        if(this.props.admin === "true") {
            admin = true;
        }

        if(this.state.seconds % 2 === 0) {
            this.savePlayers();
        }

        return (
            <div id="lobby">
                {this.listLobby()}
                {admin &&
                    <button type="button" className="btn btn-secondary btn-lg" id="readybutton" onClick={this.readyClicked}>Ready</button>
                }
            </div>
        );
    }
}


export default Lobby;