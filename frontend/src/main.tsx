import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import Connect from './pages/user/Connect';
import PrivateRoute from './components/PrivateRoute';
import './index.css';
import { RedirectProvider } from './components/RedirectProvider';

const Root: React.FC = () => (
  <Provider store={store}>
    <React.StrictMode>
      <Router>
        <RedirectProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
              <Route path="/connect" element={<Connect />} />
            </Route>
          </Routes>
        </RedirectProvider>
      </Router>
    </React.StrictMode>
  </Provider>
);

createRoot(document.getElementById('root')!).render(<Root />);
