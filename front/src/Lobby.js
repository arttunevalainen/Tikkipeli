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
        let lobby = this;

        this.makeplayerlist().then(function(data) {
            lobby.setState({players: data.players, gameready: data.gameready});

            let listlen = lobby.getListofPlayers().length;
            lobby.setState({playercount : listlen});

            if(lobby.state.gameready === "true") {
                clearInterval(lobby.interval);
                lobby.props.sendData();
            }
        });
    }

    makeplayerlist() {
        let lobby = this;

        return new Promise(function(resolve, reject) {
            getLobby(lobby.props.playername, lobby.props.playercode, lobby.props.lobbycode).then((data) => {
                resolve(data);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    getListofPlayers() {
        let list = []; 

        list = this.state.players.split("/");
        list.pop();

        return list;
    }

    listLobby() {
        let listItems = this.getListofPlayers();
        
        const list = listItems.map((name) =>
            <ListGroupItem id="listitem" key={name.toString()}>
                {name}
            </ListGroupItem>
        );

        return <ListGroup id="lobbylist">{list}</ListGroup>
    }

    readyClicked() {
        let lobby = this;
        setupGame(this.props.playername, this.props.playercode, this.props.lobbycode).then((data) => {
            lobby.props.sendData();
        });
    }

    backClicked() {
        console.log("kek");
    }

    render() {
        let admin = (this.props.admin === "true");

        return (
            <div id="lobby">
                {this.state.playercount} / 6
                {this.listLobby()}
                {admin &&
                    <Button type="button" color="success" id="readybutton" onClick={this.readyClicked}>Pelaamaan</Button>
                }
                <Button type="button" color="danger" id="readybutton" onClick={this.backClicked}>Takasin</Button>
                {admin && <div id="admininfo"><h6>Olet aulan admin. Kun painat "pelaamaan", koko aula siirtyy peliin.</h6></div>}
                <div>
                    
                </div>
            </div>
        );
    }
}


export default Lobby;