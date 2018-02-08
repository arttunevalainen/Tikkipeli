import React, { Component } from 'react';
import Stats from './Stats.js';


class Tester extends Component {

    constructor() {
        super();

        this.state = { stats: {tikkiwinner: "dsad", pokerwinner: "wasd", winninghand: "TwoPairs" }};
    }

    render() {
        return (<Stats stats={this.state.stats}></Stats>);
    }

}

export default Tester;