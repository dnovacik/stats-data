import React, { Component } from 'react';
import './App.css';

import MapContainer from './components/MapContainer';

class App extends Component {
  render() {
    return (
      <div className="App">
      <h1>_stats</h1>
        <MapContainer />
      </div>
    );
  }
}

export default App;
