import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import Login from './views/Auth/Login';
import Dashboard from './views/Dashboard';
import Home from './views/Home';
import Profile from './views/Profile';

const MainRoutes: React.FC = ({}) => {
    return (
        <MainLayout>
            <Route exact path="/" component={() => <Redirect to="/login" />} />
            <Route exact path="/login" component={Login} />
        </MainLayout>
    );
};

const DashboardRoutes: React.FC = ({}) => {
    return (
        <DashboardLayout>
            <Route exact path="/app/dashboard" component={() => <Dashboard />} />
        </DashboardLayout>
    );
};

// export default Routes;
export { MainRoutes, DashboardRoutes };
