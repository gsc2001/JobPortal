import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './views/Auth/Login';
import Home from './views/Home';
import Profile from './views/Profile';

interface RoutesProps {}

const Routes: React.FC<RoutesProps> = ({}) => {
    return (
        <MainLayout>
            <Route exact path="/" component={() => <Redirect to="/login" />} />
            <Route exact path="/login" component={Login} />
        </MainLayout>
    );
};

export default Routes;
