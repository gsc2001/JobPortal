import React from 'react';
import { Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './views/Home';
import Profile from './views/Profile';

interface RoutesProps {}

const Routes: React.FC<RoutesProps> = ({}) => {
    return (
        <MainLayout>
            <Route exact path="/" component={Home} />
            <Route exact path="/profile" component={Profile} />
        </MainLayout>
    );
};

export default Routes;
