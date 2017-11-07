import React, { Component } from 'react';
import Request from 'react-http-request';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <h1>Hellurei</h1>

        <Request
          url='http://localhost:8081'
          method='get'
          accept='application/json'
          verbose={true}
        >
          {
            ({error, result, loading}) => {
              if (loading) {
                return <div>loading...</div>;
              } else {
                return <div>{ JSON.stringify(result.text) }</div>;
              }
            }
          }
        </Request>
      </div>
    );
  }
}

export default App;
