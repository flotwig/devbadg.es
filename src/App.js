import React, { Component } from 'react';
import Header from './views/widgets/Header'
import Router from './Router'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Header/>
        </header>
        <main>
          <Router/>
        </main>
      </div>
    );
  }
}

export default App;
