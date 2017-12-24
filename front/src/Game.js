import React, { Component } from 'react';
import { getGame, sendPlay } from './RequestService.js';
import { ListGroup, ListGroupItem } from 'reactstrap';
import './Game.css';


class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {hand: ''};

        this.updateGame = this.updateGame.bind(this);
        this.renderplayercards = this.renderplayercards.bind(this);
        this.getCards = this.getCards.bind(this);
        this.cardClick = this.cardClick.bind(this);
        this.getListofPlays = this.getListofPlays.bind(this);
        this.renderPlays = this.renderPlays.bind(this);
        this.getListofPoints = this.getListofPoints.bind(this);
        this.renderPoints = this.renderPoints.bind(this);

        this.updateGame();
    }

    componentDidMount() {
        this.interval = setInterval(() => this.updateGame(), 3000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateGame() {
        var game = this;
        if(this.state.currentplayer === this.props.playername) {
            console.log("Your Turn");
        }
        if(this.state.currentplayer !== this.props.playername) {
            getGame(this.props.playername, this.props.playercode).then((data) => {
                if(data.status !== 'notready') {
                    game.setState({ players: data.players,
                                    hand: data.hand,
                                    plays: data.plays,
                                    currentplayer: data.currentplayer
                    });
                    if(data.points) {
                        game.setState({ points: data.points });
                    }
                }
                else {
                    game.props.sendData();
                }
            });
        }
    }

    cardClick(event) {

        var game = this;
        var cards = this.getCards();

        if(this.state.currentplayer === this.props.playername) {
            this.setState({currentplayer: '', badplay: ''});
            
            sendPlay(this.props.playername, this.props.playercode, cards[parseInt(event.target.alt, 10)]).then((data) => {
                console.log(data);
                if(data.status === 'wrongplay') {
                    game.setState({badplay: 'Bad play!'});
                }
                game.updateGame();
            });
        }
    }

    getCards() {
        var cards = this.state.hand;
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

                var cards = this.getCards();

                var five = (cards[4]);
                var four = (cards[3]);
                var three = (cards[2]);
                var two = (cards[1]);
                var one = (cards[0]);

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
        var list = []; 

        if(this.state.plays) {
            list = this.state.plays.split("/");
            list.pop();
        }
        
        return list;
    }

    renderPlays() {

        var listItems = this.getListofPlays();

        const list = listItems.map((name) =>
            <ListGroupItem id="playlistitem" key={name.toString()}>
                {name}
            </ListGroupItem>
        );

        return <ListGroup id="playlist">{list}</ListGroup>
    }

    getListofPoints() {
        var list = []; 
        
        if(this.state.points) {
            list = this.state.points.split("/");
            list.pop();
        }
        
        return list;
    }

    renderPoints() {
        var listItems = this.getListofPoints();
        
        const list = listItems.map((name) =>
            <ListGroupItem id="pointslistitem" key={name.toString()}>
                {name}
            </ListGroupItem>
        );

        return <ListGroup id="pointslist">{list}</ListGroup>
    }

    render() {

        var turn = this.state.currentplayer === this.props.playername;

        return (
            <div id="gameobjects">
                {this.state.badplay}
                {this.renderplayercards()}
                {turn && <p>Your turn!</p>}
                {this.renderPlays()}
                {this.renderPoints()}
            </div>
        );
    }
}


export default Game;