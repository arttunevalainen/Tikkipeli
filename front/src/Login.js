import { newPlayer } from './RequestService.js';
import React, { Component } from 'react';
import './Login.css';



class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {value : ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        newPlayer(this.state.value).then((data) => {
            this.props.sendData(data);
        });
    }

    render() {
        return (
            <div id="form">
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