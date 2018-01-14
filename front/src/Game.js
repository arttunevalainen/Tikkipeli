import React, { Component } from 'react';
import { getGame, sendPlay, changeCards, leaveGame } from './RequestService.js';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import './Game.css';


class Game extends Component {

    constructor(props) {
        super(props);

        this.state = { hand: '', gameEnded: false };

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
        let game = this;

        if(this.state.currentplayer !== this.props.playername) {
            getGame(this.props.playername, this.props.playercode, game.props.lobbycode).then((data) => {
                if(data.status === 'changephase') {
                    game.setState({ plays: '' });
                    if(data.changestatus === 'waiting') {
                        game.setState({ changecards: true });
                    }
                    else if(data.changestatus === 'done') {
                        game.setState({ changecards: false });
                    }
                    game.setState({ changephase: true,
                                    players: data.players,
                                    hand: data.hand
                    });
                }
                else if(data.status === 'ok') {
                    game.setState({ players: data.players,
                                    hand: data.hand,
                                    plays: data.plays,
                                    currentplayer: data.currentplayer,
                                    changephase: false
                    });
                }
                else if(data.status === 'round ended') {
                    console.log(data);
                    game.setState({ players: data.players,
                                    hand: data.hand,
                                    plays: data.plays,
                                    points: data.points });
                }
                else if(data.status === 'Game has ended') {
                    game.setState({ gameEnded: true,
                                    points: data.points,
                                    hand: '',
                                    plays: '' });
                }
                else if(data.status === 'notready') {
                    game.props.sendData();
                }
            });
        }
    }

    cardClick(event) {

        let game = this;
        let cards = this.getCards();

        if(this.state.changephase) {
            if(!game.cardstochange.includes(cards[parseInt(event.target.alt, 10)])) {
                game.cardstochange.push(cards[parseInt(event.target.alt, 10)]);
            }
            else {
                for(let i = 0; i < game.cardstochange.length; i++) {
                    if(game.cardstochange[i] === cards[parseInt(event.target.alt, 10)]) {
                        game.cardstochange.splice(i, 1);
                    }
                }
            }

            console.log(game.cardstochange);
        }
        else {
            if(this.state.currentplayer === this.props.playername) {
                this.setState({currentplayer: '', badplay: ''});
                
                sendPlay(this.props.playername, this.props.playercode, game.props.lobbycode, cards[parseInt(event.target.alt, 10)]).then((data) => {
                    if(data.status === 'wrongplay') {
                        game.setState({badplay: 'Bad play!'});
                    }
                    game.updateGame();
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

                let five = (cards[4]);
                let four = (cards[3]);
                let three = (cards[2]);
                let two = (cards[1]);
                let one = (cards[0]);

                return (
                    <div id="playingcards">
                        {one && <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[0] + '.png')} alt="0"/>}
                        {two && <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[1] + '.png')} alt="1"/>}
                        {three && <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[2] + '.png')} alt="2"/>}
                        {four && <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[3] + '.png')} alt="3"/>}
                        {five && <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[4] + '.png')} alt="4"/>}
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
                            {splitplay[0]} <img id="playedCard" src={require('./cards/' + splitplay[1] + '.png')} alt={splitplay[1]}/>
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
        
        const list = listItems.map((name) =>
            <ListGroupItem id="pointslistitem" key={name.toString()}>
                {name}
            </ListGroupItem>
        );

        return <ListGroup id="pointslist">{list}</ListGroup>
    }

    changeSelectedCards() {
        let game = this;

        game.stringifyCardArray(game.cardstochange).then((cardstring) => {
            changeCards(game.props.playername, game.props.playercode, game.props.lobbycode, cardstring).then((data) => {
                if(data.status === 'ok') {
                    game.cardstochange = [];
                    game.updateGame();
                }
                else if(data.status === 'badChange') {
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
        let game = this;

        leaveGame(this.props.playername, this.props.playercode, this.props.lobbycode).then((data) => {
            if(data.status === 'deleted') {
                game.props.sendData();
            }
        });
    }

    render() {

        let turn = this.state.currentplayer === this.props.playername;

        return (
            <div id="gameobjects">
                {this.state.badplay}
                {this.renderplayercards()}
                {this.state.changecards && <Button type="button" color="success" id="changecardsbutton" onClick={this.changeSelectedCards}>Vaihda kortit</Button>}
                {this.state.gameEnded && <Button type="button" color="success" id="changecardsbutton" onClick={this.leaveGameClicked}>Takaisin Aulatilaan</Button>}
                {turn && <p>Your turn!</p>}
                {this.renderPlays()}
                {this.renderPoints()}
            </div>
        );
    }
}


export default Game;