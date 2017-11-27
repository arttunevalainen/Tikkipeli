import React, { Component } from 'react';
import { getLobby, setupGame } from './RequestService.js';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import './Lobby.css';


class Lobby extends Component {

    constructor(props) {
        super(props);

        this.state = ({players: " ", playercount: 0});

        this.saveplayers = this.savePlayers.bind(this);
        this.makeplayerlist = this.makeplayerlist.bind(this);
        this.readyClicked = this.readyClicked.bind(this);
        this.listLobby = this.listLobby.bind(this);
        this.getListofPlayers = this.getListofPlayers.bind(this);

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

            var listlen = lobby.getListofPlayers().length;
            lobby.setState({playercount : listlen});

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

    getListofPlayers() {
        var list = []; 

        list = this.state.players.split("/");
        list.pop();

        return list;
    }

    listLobby() {
        var listItems = this.getListofPlayers();
        
        const list = listItems.map((name) =>
            <ListGroupItem id="listitem" key={name.toString()}>
                {name}
            </ListGroupItem>
        );

        return <ListGroup id="lobbylist">{list}</ListGroup>
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
                {this.state.playercount} / 8
                {this.listLobby()}
                {admin &&
                    <Button type="button" color="success" id="readybutton" onClick={this.readyClicked}>Pelaamaan</Button>
                }
                {admin && <div id="admininfo"><h6>Olet aulan admin. Kun painat "pelaamaan", koko aula siirtyy peliin.</h6></div>}
            </div>
        );
    }
}


export default Lobby;