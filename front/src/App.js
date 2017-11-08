import React, { Component } from 'react';
import Request from 'react-http-request';
import axios from 'axios';
import './App.css';

class App extends Component {

	constructor() {
		super();
		this.state = { data : "Loading..." };
	}

	getStuff() {
		var component = this;

		axios.get('http://localhost:8081')
			.then(function (response) {
				component.setState({ data : response.data });
			})
			.catch(function (error) {
				console.log(error)
			});
	}

	componentDidMount() {
		this.getStuff();
	}

	render() {
		return (<div>{this.state.data}</div>);
	}
}

export default App;
