import React, { Component } from 'react';
import Login from './Login';
import Lobby from './Lobby';



class App extends Component {

    constructor() {
        super();
        this.state = {component : "Login"};

        this.getLoginData = this.getLoginData.bind(this);
    }

    getLoginData(val) {
        if(val.namestatus === "ok") {
            this.setState({component: "Lobby"});
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
