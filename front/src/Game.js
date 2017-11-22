import React, { Component } from 'react';
import { getGame } from './RequestService.js';


class Game extends Component {

    constructor(props) {
        super(props);

        this.state = ({seconds: 0});


        this.tick = this.tick.bind(this);
        this.getGame = this.getGame.bind(this);
    }

    tick() {
        this.setState({seconds: this.state.seconds + 1});
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    updateGame() {
        getGame().then((data) => {
            console.log(data);
        });
    }

    render() {

        if(this.state.seconds % 2 === 0) {
            this.updateGame();
        }


        return (
            <div>
                <h1>Game</h1>
            </div>
        );
    }
}


export default Game;