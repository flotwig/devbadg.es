import React, { Component } from 'react';
import Header from './views/widgets/Header'
import Routes from './Routes'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <Header/>
        </header>
        <main>
          <Routes/>
        </main>
      </div>
    );
  }
}

export default App;
