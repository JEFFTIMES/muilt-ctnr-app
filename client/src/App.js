import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Fibonacci from './Fib';


function App() {
  const [status, setStatus] = useState('111');

  console.log(status);
  
  return (
    <Router>
      <div className="App">
        <header>
          <Link to="/">Home</Link>
        </header>
        <div>
          <Routes>
            <Route 
              exact path="/" 
              element={
                <Fibonacci 
                  setStatus = { setStatus }
                  getStatus = { () => status }
                />
              }
            />
          </Routes>
          
        </div>
      </div>
    </Router>
    
  );
}

export default App;
