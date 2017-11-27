import React, { Component } from 'react';
import { getGame } from './RequestService.js';


class Game extends Component {

    constructor(props) {
        super(props);

        this.state = {hand: ''};

        this.updateGame = this.updateGame.bind(this);

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
        getGame(this.props.playername, this.props.playercode).then((data) => {
            game.setState({ players: data.players,
                            hand: data.hand,
                            currentplayer: data.currentplayer
            });
        });
    }

    render() {

        return (
            <div>
                <h1>Tikki</h1>

                {this.state.hand}
            </div>
        );
    }
}


export default Game;