import React, { Component } from 'react';
import { getGame, sendPlay } from './RequestService.js';
import './Game.css';


class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {hand: ''};

        this.updateGame = this.updateGame.bind(this);
        this.playercards = this.playercards.bind(this);
        this.getCards = this.getCards.bind(this);
        this.cardClick = this.cardClick.bind(this);

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
        if(this.state.currentplayer !== this.props.playername) {
            getGame(this.props.playername, this.props.playercode).then((data) => {
                game.setState({ players: data.players,
                                hand: data.hand,
                                currentplayer: data.currentplayer
                });
            });
        }
    }

    cardClick(event) {
        console.log(parseInt(event.target.alt, 10));
        this.setState({currentplayer: ''});

        var cards = this.getCards();

        sendPlay(this.props.playername, this.props.playercode, cards[parseInt(event.target.alt, 10)]).then((data) => {
            console.log(data);
        });
    }

    getCards() {
        var cards = this.state.hand.split("/");
        cards.pop();

        return cards;
    }

    playercards() {

        if(this.state.hand !== '') {

            var cards = this.getCards();

            return (
                <div>
                    <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[0] + '.png')} alt="0"/>
                    <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[1] + '.png')} alt="1"/>
                    <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[2] + '.png')} alt="2"/>
                    <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[3] + '.png')} alt="3"/>
                    <img id="playingcard" onClick={this.cardClick} src={require('./cards/' + cards[4] + '.png')} alt="4"/>
                </div>
            );
        }
        else {
            return (<div>Waiting...</div>);
        }
    }

    render() {
        return (
            <div>
                <h1>Tikki</h1>
                {this.playercards()}
            </div>
        );
    }
}


export default Game;