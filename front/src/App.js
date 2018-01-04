import React, { Component } from 'react';
import Login from './Login';
import Lobby from './Lobby';
import Game from './Game';
import Lobbies from './Lobbies';



class App extends Component {

    constructor() {
        super();
        this.state = {playername: '', playercode: '', component : "Login"};

        this.getLoginData = this.getLoginData.bind(this);
        this.getLobbyData = this.getLobbyData.bind(this);
        this.gameNotReady = this.gameNotReady.bind(this);
        this.goToLobby = this.goToLobby.bind(this);
    }

    getLoginData(data) {
        if(data.status === "ok") {
            this.setState({playername: data.name, playercode: data.playercode, lobbycode: '', component: "Lobbies"});
        }
    }

    goToLobby(data) {
        if(data.status === "ok") {
            this.setState({ admin: data.admin, lobbycode: data.lobbycode, component: "Lobby"});
        }
    }

    getLobbyData() {
        this.setState({ component: "Game" });
    }

    gameNotReady() {
        this.setState({ lobbycode: '', component: "Lobbies" });
    }

	render() {

        if(this.state.component === "Login") {
            return (
                <Login sendData={this.getLoginData}/>
            );
        }
        else if(this.state.component === "Lobbies") {
            return (
                <Lobbies playername={this.state.playername}
                         playercode={this.state.playercode}
                         sendData={this.goToLobby}/>
            );
        }
        else if(this.state.component === "Lobby") {
            if(!this.state.gamestarted) {
                return (
                    <Lobby playername={this.state.playername}
                           playercode={this.state.playercode}
                           admin={this.state.admin}
                           lobbycode={this.state.lobbycode}
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
                      playercode={this.state.playercode}
                      lobbycode={this.state.lobbycode}
                      sendData={this.gameNotReady}/>
            );
        }
        else {
            return (<div>Error!</div>);
        }
	}
}

export default App;
