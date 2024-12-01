import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';  
import Home from './components/Home';
import Register from './components/Auth/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/auth/register" element={<Register />}/>
      </Routes>
    </Router>
  );
}

export default App;
