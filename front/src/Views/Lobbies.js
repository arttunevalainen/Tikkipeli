import React, { Component } from 'react';
import { getLobbies, createLobby, joinLobby } from '../Services/RequestService.js';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import '../css/Lobbies.css';


class Lobbies extends Component {

    constructor(props) {
        super(props);

        this.state = { lobs: '' };

        this.loadLobbies = this.loadLobbies.bind(this);
        this.createLobbyClicked = this.createLobbyClicked.bind(this);
        this.listLobbies = this.listLobbies.bind(this);
        this.getListofLobbies = this.getListofLobbies.bind(this);

        this.loadLobbies();
    }

    componentDidMount() {
        this.interval = setInterval(() => this.loadLobbies(), 3000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loadLobbies() {
        getLobbies(this.props.playername, this.props.playercode).then((response) => {
            if(response.data.lobs !== undefined) {
                this.setState({ lobs: response.data.lobs });
            }
        });
    }
    
    createLobbyClicked() {
        createLobby(this.props.playername, this.props.playercode).then((response) => {
            this.props.sendData(response.data);
        });
    }

    lobbyclicked(event) {
        joinLobby(this.props.playername, this.props.playercode, event).then((response) => {
            this.props.sendData(response.data);
        });
    }

    getListofLobbies() {
        let list = [];
        list = this.state.lobs;

        if(list !== undefined || list !== '') {
            list = list.split("/");
            list.pop();
        }

        return list;
    }

    listLobbies() {
        let listItems = this.getListofLobbies();

        if(listItems.length > 0) {
            let list = listItems.map((lobby) => {
                let lobbynumber = lobby.split("-");
                return( <ListGroupItem id="lobbiesitem" key={lobbynumber[0].toString()}>
                            <div id="lobbyline"><p id="lobbyname">{lobbynumber[0]}</p><p id="playernumber">Pelaajia: {lobbynumber[1]}</p><Button color="success" id="lobbyjoinbutton" onClick={(e) => this.lobbyclicked(lobbynumber[0])}>Liity</Button></div>
                        </ListGroupItem> );
            });

            return (<ListGroup id="lobbieslist">{list}</ListGroup>);
        }
        else {
            return (<div>Ei auloja</div>);
        }
    }

    render() {
        return (
                <div id="lobbies">
                    <h2>Aulatila</h2>
                    {this.listLobbies()}
                    <Button color="success" id="createlobbybutton" onClick={this.createLobbyClicked}>Luo aula</Button>
                </div>
                );
    }

}


export default Lobbies;