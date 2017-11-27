import { newPlayer } from './RequestService.js';
import React, { Component } from 'react';
import { Button } from 'reactstrap';
import './Login.css';



class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {value : '', error: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.errorMessage = this.errorMessage.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        newPlayer(this.state.value).then((data) => {
            if(data.status === "ok") {
                this.props.sendData(data);
            }
            else {
                this.setState({error: 'Name must be over 2 chars or name already taken!'})
            }
        });
    }

    errorMessage() {
        return this.state.error;
    }

    render() {
        return (
            <div id="form">
                <form onSubmit={this.handleSubmit}>
                    <label>
                        <h2>Nimi:</h2>
                        <input id="nameinput" type="text" value={this.state.value} onChange={this.handleChange}></input>
                    </label>
                    <br/>
                    <label id="errormessage">{this.errorMessage()}</label>
                    <br/><br/>
                    <Button color="success" id="formbutton" type="submit">Valmis</Button>
                </form>
            </div>
        );
    }
}

export default Login;