import React, { Component } from 'react';
import Login from './Login';
import Lobby from './Lobby';
import Game from './Game';



class App extends Component {

    constructor() {
        super();
        this.state = {playername: '', playercode: '', component : "Login"};

        this.getLoginData = this.getLoginData.bind(this);
        this.getLobbyData = this.getLobbyData.bind(this);
    }

    getLoginData(data) {
        if(data.status === "ok") {
            this.setState({playername: data.name, playercode: data.playercode, admin: data.admin, component: "Lobby"});
        }
    }

    getLobbyData() {
        this.setState({component: "Game"});
    }

	render() {

        if(this.state.component === "Login") {
            return (
                <Login sendData={this.getLoginData}/>
            );
        }
        else if(this.state.component === "Lobby") {
            if(!this.state.gamestarted) {
                return (
                    <Lobby playername={this.state.playername}
                           playercode={this.state.playercode}
                           admin={this.state.admin}
                           sendData={this.getLobbyData}/>
                );
            }
            else {
                return (<div>Game has already started</div>);
            }
        }
        else if(this.state.component === "Game") {
            return (
                <Game playername={this.state.playername}
                      playercode={this.state.playercode}/>
            );
        }
        else {
            return (<div>Error!</div>);
        }
	}
}

export default App;
