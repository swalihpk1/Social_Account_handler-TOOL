import React from 'react';
import { createRoot } from 'react-dom/client';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
// import Login from './pages/user/Login';
// import Signup from './pages/user/Signup';
// import Connect from './pages/user/Connect';
// import PrivateRoute from './components/PrivateRoute';
// import SuccessPage from './pages/user/SuccessPage';
// import Create from './pages/user/Create';
// import Sidebar from './components/Sidebar';
import './index.css';
import App from './App';

// import { RedirectProvider } from './components/RedirectProvider';

const Root: React.FC = () => (
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider >
);

createRoot(document.getElementById('root')!).render(<Root />);
