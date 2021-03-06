import { newPlayer } from '../Services/RequestService.js';
import React, { Component } from 'react';
import { Button } from 'reactstrap';
import '../css/Login.css';
import Tester from './components/Tester.js';



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
        newPlayer(this.state.value).then((response) => {
            if(response.data.status === "ok") {
                this.props.sendData(response.data);
            }
            else {
                this.setState({error: 'Error!'});
            }
        });
    }

    errorMessage() {
        return this.state.error;
    }

    render() {
        return (
            <div id="loginpage">
                <Tester></Tester>
                <h1>Tikki</h1>
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
            </div>
        );
    }
}

export default Login;