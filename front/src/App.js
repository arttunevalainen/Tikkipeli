import React, { Component } from 'react';
import Login from './Login';
import Lobby from './Lobby';
import Game from './Game';
import Lobbies from './Lobbies';

// REDUX KOKEILUA
import { createStore } from 'redux';
import counter from './reducers.js';
import { Provider } from 'react-redux'
const store = createStore(counter);



class App extends Component {

    constructor() {
        super();
        this.state = {};

        this.getLoginData = this.getLoginData.bind(this);
        this.getLobbyData = this.getLobbyData.bind(this);
        this.goToLobby = this.goToLobby.bind(this);
        this.backToLobby = this.backToLobby.bind(this);


        //REDUX KOKEILUA
        let originalState = { playername: '', playercode: '', component: "Login" };
        console.log(store.getState());
        store.dispatch({ type: 'NEWPLAYER', name: originalState.playername, code: originalState.playercode, component: originalState.component });
    }

    componentDidMount() {
        this.setState(store.getState());
        console.log(store.getState());
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

    backToLobby() {
        this.setState({ lobbycode: '', component: "Lobbies" });
    }

	render() {

        //<Provider store={store}>TÄHÄN VÄLIIN KAIKKI MUOKATTAVA</Provider>

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
                           sendData={this.getLobbyData}
                           goBack={this.backToLobby}/>
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
                      sendData={this.backToLobby}/>
            );
        }
        else {
            return (<div>Error!</div>);
        }
	}
}

export default App;
