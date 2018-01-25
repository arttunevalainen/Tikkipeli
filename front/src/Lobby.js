import React, { Component } from 'react';
import { getLobby, setupGame, leaveLobby } from './RequestService.js';
import { Card, CardBody, Button, ListGroup, ListGroupItem } from 'reactstrap';
import './Lobby.css';


class Lobby extends Component {

    constructor(props) {
        super(props);

        this.state = ({ players: " ", playercount: 0, admin: this.props.admin, status: '' });

        this.saveplayers = this.savePlayers.bind(this);
        this.makeplayerlist = this.makeplayerlist.bind(this);
        this.readyClicked = this.readyClicked.bind(this);
        this.listLobby = this.listLobby.bind(this);
        this.getListofPlayers = this.getListofPlayers.bind(this);
        this.backClicked = this.backClicked.bind(this);

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

        this.makeplayerlist().then((data) => {
            let amIAdmin = false;
            if(data.admin === lobby.props.playername) {
                amIAdmin = true;
            }

            lobby.setState({ players: data.players, gameready: data.gameready, admin: amIAdmin });

            let listlen = lobby.getListofPlayers().length;
            if(lobby.state.playercount !== listlen) {
                lobby.setState({ playercount : listlen, status: '' });
            }

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
            if(data.status === 'ok') {
                lobby.props.sendData();
            }
            else {
                lobby.setState({ status: data.status });
            }
        });
    }

    backClicked() {
        let lobby = this;
        clearInterval(this.interval);
        leaveLobby(this.props.playername, this.props.playercode, this.props.lobbycode).then((data) => {
            lobby.props.goBack();
        });
    }

    render() {
        let admin = (this.state.admin === true);

        return (
            <div id="lobby">
                {this.state.playercount} / 6
                <br/>{this.state.status}
                {this.listLobby()}
                
                {admin &&
                    <Button type="button" color="success" id="readybutton" onClick={this.readyClicked}>Pelaamaan</Button>
                }
                <Button type="button" color="danger" id="readybutton" onClick={this.backClicked}>Takasin</Button>

                {admin && <div id="admininfo"><h6>Olet aulan admin. Kun painat "pelaamaan", koko aula siirtyy peliin.</h6></div>}

                <Card id="rules">
                    <CardBody id="cardbody">
                        <h4>Tikkipokeri</h4>
                        Pelataan kunnes joku pelaajista ylittää 20 pistettä. Pelaajille jaetaan kortit, jonka jälkeen he voivat vaihtaa 0-4 korttia tai kaikki jos kaikki kortien arvot ovat alle 10.
                        Tikin voittamisesta saa 3 pistettä ja parhaasta pokerikäsistä: pari 1, kaksiparia 2, kolmoset 3, suora 4, väri 5, täysikäsi 6, neloset ja värisuora 10 pistettä.
                        Jos tikin voittaja lopettaa kakkosella, menettävät muut pelaajat 3 pistettä.
                    </CardBody>
                </Card>
            </div>
        );
    }
}


export default Lobby;