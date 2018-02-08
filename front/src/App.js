import React, { Component } from 'react';
import Login from './Views/Login';
import Lobby from './Views/Lobby';
import Game from './Views/Game';
import Lobbies from './Views/Lobbies';

// REDUX KOKEILUA
import { createStore } from 'redux';
import counter from './Services/reducers.js';
import { Provider } from 'react-redux'
const store = createStore(counter);



class App extends Component {

    constructor() {
        super();
        this.state = { playername: '', playercode: '', component: "Login" };

        this.getLoginData = this.getLoginData.bind(this);
        this.getLobbyData = this.getLobbyData.bind(this);
        this.goToLobby = this.goToLobby.bind(this);
        this.backToLobby = this.backToLobby.bind(this);

        /*REDUX KOKEILUA
        let originalState = { playername: '', playercode: '', component: "Login" };
        console.log(store.getState());
        store.dispatch({ type: 'NEWPLAYER', name: originalState.playername, code: originalState.playercode, component: originalState.component });*/
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
        let login = (this.state.component === "Login");
        let lobbies = (this.state.component === "Lobbies");
        let lobby = (this.state.component === "Lobby");
        let game = (this.state.component === "Game");

        return (
            <div>
                {login && <Login        sendData={this.getLoginData}></Login>}
                {lobbies && <Lobbies    playername={this.state.playername}
                                        playercode={this.state.playercode}
                                        sendData={this.goToLobby}></Lobbies>}
                {game && <Game          playername={this.state.playername}
                                        playercode={this.state.playercode}
                                        lobbycode={this.state.lobbycode}
                                        sendData={this.backToLobby}/>}
                {!this.state.gamestarted &&
                    <div>
                        {lobby && <Lobby    playername={this.state.playername}
                                            playercode={this.state.playercode}
                                            admin={this.state.admin}
                                            lobbycode={this.state.lobbycode}
                                            sendData={this.getLobbyData}
                                            goBack={this.backToLobby}></Lobby>}
                    </div>}
            </div>
        );
	}
}

export default App;
