import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import Connect from './pages/user/Connect';
import PrivateRoute from './components/PrivateRoute';
import SuccessPage from './pages/user/SuccessPage';
import CreatePost from './pages/user/CreatePost';
import './index.css';
import SidebarLayout from './components/layouts/SidebarLayout';
import Dashboard from './pages/user/Dashboard';
import Planner from './pages/user/Planner';
import Analytics from './pages/user/Analytics';
import Search from './pages/user/Search';


// import { RedirectProvider } from './components/RedirectProvider';

const App: React.FC = () => (

    <Router>
        {/* <RedirectProvider> */}
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<PrivateRoute />}>
                <Route path="/connect" element={<Connect />} />
                <Route path="/success" element={< SuccessPage />} />
                <Route element={< SidebarLayout />} >
                    <Route path='/create' element={< CreatePost />} />
                    <Route path='/dashboard' element={< Dashboard />} />
                    <Route path='/planner' element={< Planner />} />
                    <Route path='/analytics' element={< Analytics />} />
                    <Route path='/search' element={< Search />} />
                </Route>
            </Route>
        </Routes>
        {/* </RedirectProvider> */}
    </Router>

);

export default App;
