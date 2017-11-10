import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {

	constructor() {
		super();
		this.state = { data : "Loading..." };
	}

	getStuff() {
		var component = this;
		axios.get('http://localhost:8081/setup')
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
		return (<div>{JSON.stringify(this.state.data.tikkistatus)}</div>);
	}
}

export default App;
