import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';  
import Home from './components/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Forgot from './components/Auth/Forgot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/auth/register" element={<Register />}/>
        <Route path="/auth/login" element={<Login />}/>
        <Route path="/auth/forgot" element={<Forgot />}/>
      </Routes>
    </Router>
  );
}

export default App;
