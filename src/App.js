import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Portfolio from './Portfolio'; // Make sure this path is correct
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Portfolio />
      </div>
    </Router>
  );
}

export default App;
