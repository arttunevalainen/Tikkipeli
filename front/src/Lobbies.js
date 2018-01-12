import React, { Component } from 'react';
import { getLobbies, createLobby, joinLobby } from './RequestService.js';
import { Collapse, Card, CardBody, Button, ListGroup, ListGroupItem } from 'reactstrap';


class Lobbies extends Component {

    constructor(props) {
        super(props);

        this.state = { lobs: '', collapse: false };

        this.toggle = this.toggle.bind(this);

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

    toggle() {
        this.setState({ collapse: !this.state.collapse });
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
                            <div>{lobbynumber[0]}:Pelaajia {lobbynumber[1]}<Button color="success" id="lobbyjoinbutton" onClick={(e) => this.lobbyclicked(lobbynumber[0])}>Liity</Button></div>
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
                    <Button color="primary" id="rulesbutton" onClick={this.toggle}>Säännöt</Button>
                    <Collapse isOpen={this.state.collapse}>
                        <Card>
                            <CardBody>
                                Tikkipokeri<br></br>
                                Pelataan kunnes joku pelaajista ylittää 20 pistettä. Pelaajille jaetaan kortit, jonka jälkeen he voivat vaihtaa 0-4 korttia tai kaikki jos kaikki kortien arvot ovat alle 10.
                                Tikin voittamisesta saa 3 pistettä ja parhaasta pokerikäsistä: pari 1, kaksiparia 2, kolmoset 3, suora 4, väri 5, täysikäsi 6, neloset ja värisuora 10 pistettä.
                                Jos tikin voittaja lopettaa kakkosella, menettävät muut pelaajat 3 pistettä.
                            </CardBody>
                        </Card>
                    </Collapse>
                </div>
                );
    }

}


export default Lobbies;