
import React, { Component } from 'react';
import './Login.css';
import { newPlayer } from './RequestService.js';


class Login extends Component {

    constructor() {
        super();
        this.state = {value : ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        //alert(this.state.value);
        event.preventDefault();
        newPlayer(this.state.value);
    }

	render() {
        return ( 
            <div id="kek">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <p>Nimi:</p>
                        <input type="text" value={this.state.value} onChange={this.handleChange}></input>
                    </label><br></br><br></br>
                    <input type="submit" value="Submit"></input>
                </form>
            </div>
        );
	}
}

export default Login;