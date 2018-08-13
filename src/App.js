import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFoundError from './views/errors/NotFoundError';
import Tokens from './views/tokens/Tokens'
import Header from './views/widgets/Header'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header/>
        <Switch>
          <Route exact path="/tokens" component={Tokens}/>
          <Route component={NotFoundError}/>
        </Switch>
      </div>
    );
  }
}

export default App;
