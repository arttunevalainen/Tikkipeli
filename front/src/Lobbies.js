import React, { Component } from 'react';
import { getLobbies, createLobby, joinLobby } from './RequestService.js';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';


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
        let lobbyhall = this;

        getLobbies().then((data) => {
            if(data.lobs !== undefined) {
                lobbyhall.setState({ lobs: data.lobs });
            }
        });
    }

    createLobbyClicked() {
        let lobbyhall = this;
        createLobby(this.props.playername, this.props.playercode).then((data) => {
            lobbyhall.props.sendData(data);
        })
    }

    lobbyclicked(event) {
        let lobbyhall = this;
        joinLobby(this.props.playername, this.props.playercode, event).then((data) => {
            lobbyhall.props.sendData(data);
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
                            <div>{lobbynumber[0]}   :   Pelaajia {lobbynumber[1]}<Button color="success" id="lobbyjoinbutton" onClick={(e) => this.lobbyclicked(lobbynumber[0])}>Liity</Button></div>
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
                <div>
                    <h3>Aulatila</h3>
                    {this.listLobbies()}
                    <Button color="success" id="formbutton" onClick={this.createLobbyClicked}>Luo aula</Button>
                </div>
                );
    }

}


export default Lobbies;