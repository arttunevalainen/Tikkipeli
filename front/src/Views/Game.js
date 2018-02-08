import React, { Component } from 'react';
import { getGame, sendPlay, changeCards, leaveGame } from '../Services/RequestService.js';
import { Button, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import Stats from './components/Stats.js';
import '../css/Game.css';


class Game extends Component {

    constructor(props) {
        super(props);

        this.state = { hand: '', gameStatus: '', changecards: false, first: false, second: false, third:false, fourth: false, fifth: false };

        this.cardstochange = [];

        this.createUpdateInterval = this.createUpdateInterval.bind(this);
        this.updateGame = this.updateGame.bind(this);
        this.renderplayercards = this.renderplayercards.bind(this);
        this.getCards = this.getCards.bind(this);
        this.cardClick = this.cardClick.bind(this);
        this.getListofPlays = this.getListofPlays.bind(this);
        this.renderPlays = this.renderPlays.bind(this);
        this.getListofPoints = this.getListofPoints.bind(this);
        this.renderPoints = this.renderPoints.bind(this);
        this.changeSelectedCards = this.changeSelectedCards.bind(this);
        this.leaveGameClicked = this.leaveGameClicked.bind(this);
        this.renderSelected = this.renderSelected.bind(this);

        this.updateGame();
    }

    componentDidMount() {
        this.createUpdateInterval();
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    createUpdateInterval() {
        this.interval = setInterval(() => this.updateGame(), 3000);
    }

    updateGame() {
        if(this.state.currentplayer !== this.props.playername) {
            getGame(this.props.playername, this.props.playercode, this.props.lobbycode).then((response) => {
                let data = response.data;
                if(data.status === 'changephase') {
                    if(data.changestatus === 'waiting') {
                        this.setState({ changecards: true });
                    }
                    else if(data.changestatus === 'done') {
                        this.setState({ changecards: false });
                    }
                    this.setState({ gameStatus: 'change',
                                    players: data.players,
                                    hand: data.hand,
                                    plays: '' });
                }
                else if(data.status === 'ok') {
                    this.setState({ gameStatus: 'play',
                                    players: data.players,
                                    hand: data.hand,
                                    plays: data.plays,
                                    currentplayer: data.currentplayer });
                }
                else if(data.status === 'round ended') {
                    console.log(data);
                    this.setState({ gameStatus: 'roundend',
                                    players: data.players,
                                    hand: data.hand,
                                    plays: data.plays,
                                    points: data.points,
                                    stats: data.stats });
                }
                else if(data.status === 'Game has ended') {
                    this.setState({ gameStatus: 'end',
                                    points: data.points,
                                    hand: '',
                                    plays: '' });
                }
                else if(data.status === 'notready') {
                    this.props.sendData();
                }
            });
        }
    }

    cardClick(event) {
        let game = this;
        let cards = this.getCards();
        let changephase = (this.state.gameStatus === 'change');

        if(changephase && this.state.changecards) {

            let numberofcard = parseInt(event.target.alt, 10);
            if(!game.cardstochange.includes(cards[numberofcard])) {
                game.cardstochange.push(cards[numberofcard]);

                if(numberofcard === 0) { game.setState({ first: true }); }
                else if(numberofcard === 1) { game.setState({ second: true }); }
                else if(numberofcard === 2) { game.setState({ third: true }); }
                else if(numberofcard === 3) { game.setState({ fourth: true }); }
                else if(numberofcard === 4) { game.setState({ fifth: true }); }
            }
            else {
                for(let i = 0; i < game.cardstochange.length; i++) {
                    if(game.cardstochange[i] === cards[numberofcard]) {
                        game.cardstochange.splice(i, 1);

                        if(numberofcard === 0) { game.setState({ first: false }); }
                        else if(numberofcard === 1) { game.setState({ second: false }); }
                        else if(numberofcard === 2) { game.setState({ third: false }); }
                        else if(numberofcard === 3) { game.setState({ fourth: false }); }
                        else if(numberofcard === 4) { game.setState({ fifth: false }); }
                    }
                }
            }
        }
        else {
            if(this.state.currentplayer === this.props.playername) {
                this.setState({currentplayer: '', badplay: ''});
                
                sendPlay(this.props.playername, this.props.playercode, this.props.lobbycode, cards[parseInt(event.target.alt, 10)]).then((response) => {
                    if(response.data.status === 'wrongplay') {
                        this.setState({badplay: 'Bad play!'});
                    }
                    this.updateGame();
                });
            }
        }
    }

    getCards() {
        let cards = this.state.hand;
        if(cards !== '') {
            if(cards !== undefined) {
                cards = cards.split("/");
                cards.pop();
            }
        }

        return cards;
    }

    renderplayercards() {

        if(this.state.hand !== '') {
            if(this.state.hand !== undefined) {
                let cards = this.getCards();

                return (
                    <div id="playingcards">
                        {cards[0] && <img id="playingcard" onClick={this.cardClick} src={require('../static/cards/' + cards[0] + '.png')} alt="0"/>}
                        {cards[1] && <img id="playingcard" onClick={this.cardClick} src={require('../static/cards/' + cards[1] + '.png')} alt="1"/>}
                        {cards[2] && <img id="playingcard" onClick={this.cardClick} src={require('../static/cards/' + cards[2] + '.png')} alt="2"/>}
                        {cards[3] && <img id="playingcard" onClick={this.cardClick} src={require('../static/cards/' + cards[3] + '.png')} alt="3"/>}
                        {cards[4] && <img id="playingcard" onClick={this.cardClick} src={require('../static/cards/' + cards[4] + '.png')} alt="4"/>}
                    </div>
                );
            }
            else {
                return (<div>Waiting...</div>);
            }
        }
        else {
            return (<div>Waiting...</div>);
        }
    }

    renderSelected() {
        return (
            <div>
                <Row id="cardsselected">
                    <Col id="selectedrow">{this.state.first && <h4>Valittu</h4>}</Col>
                    <Col id="selectedrow">{this.state.second && <h4>Valittu</h4>}</Col>
                    <Col id="selectedrow">{this.state.third && <h4>Valittu</h4>}</Col>
                    <Col id="selectedrow">{this.state.fourth && <h4>Valittu</h4>}</Col>
                    <Col id="selectedrow">{this.state.fifth && <h4>Valittu</h4>}</Col>
                </Row>
            </div>
        );
    }

    getListofPlays() {
        let list = []; 

        if(this.state.plays) {
            list = this.state.plays.split("/");
            list.pop();
        }
        
        return list;
    }

    renderPlays() {

        let listItems = this.getListofPlays();

        const list = listItems.map((play) => {
            let splitplay = play.split(" ");
            return (    <ListGroupItem id="playlistitem" key={play.toString()}>
                            {splitplay[0]} <img id="playedCard" src={require('../static/cards/' + splitplay[1] + '.png')} alt={splitplay[1]}/>
                        </ListGroupItem> );
        });

        return <ListGroup id="playlist">{list}</ListGroup>
    }

    getListofPoints() {
        let list = []; 
        
        if(this.state.points) {
            list = this.state.points.split("/");
            list.pop();
        }
        
        return list;
    }

    renderPoints() {
        let listItems = this.getListofPoints();
        
        let list = listItems.map((name) =>
            <ListGroupItem id="pointslistitem" key={name.toString()}>
                {name}
            </ListGroupItem>
        );

        return <ListGroup id="pointslist">{list}</ListGroup>
    }

    changeSelectedCards() {
        this.stringifyCardArray(this.cardstochange).then((cardstring) => {
            changeCards(this.props.playername, this.props.playercode, this.props.lobbycode, cardstring).then((response) => {
                if(response.data.status === 'ok') {
                    this.setState({ first: false, second: false, third:false, fourth: false, fifth: false });
                    this.cardstochange = [];
                    this.updateGame();
                }
                else if(response.data.status === 'badChange') {
                    console.log("bad change!");
                }
            });
        });
    }

    stringifyCardArray(cardarray) {
        return new Promise(function(resolve, reject) {
            let cards = "";
            for(let i = 0; i < cardarray.length; i++) {
                cards = cards + cardarray[i] + "/";
            }
            resolve(cards);
        }).catch((err) => {
            console.log(err);
        });
    }

    leaveGameClicked() {
        leaveGame(this.props.playername, this.props.playercode, this.props.lobbycode).then((response) => {
            if(response.data.status === 'deleted') {
                this.props.sendData();
            }
        });
    }

    render() {
        let turn = this.state.currentplayer === this.props.playername;
        let gameEnded = (this.state.gameStatus === 'end');
        let roundEnded = (this.state.gameStatus === 'roundend');

        return (
            <div id="gameobjects">
                {this.state.badplay}
                <div id="cardobjects">
                    {this.renderplayercards()}
                    {this.renderSelected()}
                </div>
                {this.state.changecards && <Button type="button" color="success" id="changecardsbutton" onClick={this.changeSelectedCards}>Vaihda valitut kortit</Button>}
                {gameEnded && <Button type="button" color="success" id="changecardsbutton" onClick={this.leaveGameClicked}>Takaisin Aulatilaan</Button>}
                {turn && <p>Your turn!</p>}
                {this.renderPlays()}
                {this.renderPoints()}
                {roundEnded && <Stats stats={this.state.stats}></Stats>}
            </div>
        );
    }
}


export default Game;