import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const PrivateRoute: React.FC = () => {
    const userInfo = useSelector((state: RootState) => state.auth.userInfo);
    console.log("PrivateRoute userInfo:", userInfo);
    return userInfo ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
 