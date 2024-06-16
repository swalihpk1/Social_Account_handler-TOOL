import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/user/Login';
import './index.css';
import Signup from './pages/user/Signup';
import Connect from './pages/user/Connect';


const Root: React.FC = () => (
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/connect' element={<Connect/>}></Route>
      </Routes>
    </Router>
  </React.StrictMode>
);

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
