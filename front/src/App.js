import React, { Component } from 'react';
import Login from './Login';
import Lobby from './Lobby';



class App extends Component {

    constructor() {
        super();
        this.state = {name: '', playercode: '', component : "Login"};

        this.getLoginData = this.getLoginData.bind(this);
    }

    getLoginData(val) {
        if(val.status === "ok") {
            this.setState({name: val.name, playercode: val.playercode, component: "Lobby"});
        }
    }

	render() {

        if(this.state.component === "Login") {
            return ( 
                <Login sendData = {this.getLoginData}/>
            );
        }
        else if(this.state.component === "Lobby") {
            return (<Lobby/>);
        }
        else if(this.state.component === "Game") {
            return (<div>Game</div>);
        }
        else {
            return (<div>Error!</div>);
        }
	}
}

export default App;
