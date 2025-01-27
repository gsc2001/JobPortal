import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import MainLayout from './layouts/MainLayout';
import { useTypedSelector } from './utils/hooks';
import Application from './views/Applications';
import Login from './views/Auth/Login';
import Register from './views/Auth/Register';
import Dashboard from './views/Dashboard';
import Employees from './views/Employees';
import Profile from './views/Profile';

const MainRoutes: React.FC = ({}) => {
    const isLoggedIn = useTypedSelector(state => state.auth.isLoggedIn);
    if (isLoggedIn) {
        return <Redirect to="/app/dashboard" />;
    }
    return (
        <MainLayout>
            <Switch>
                <Route exact path="/" component={() => <Redirect to="/login" />} />
                <Route exact path="/login" component={() => <Login />} />
                <Route exact path="/register" component={() => <Register />} />
            </Switch>
        </MainLayout>
    );
};

const DashboardRoutes: React.FC = ({}) => {
    const auth = useTypedSelector(state => state.auth);

    if (!auth.isLoggedIn) {
        return <Redirect to="/login" />;
    }
    return (
        <DashboardLayout>
            <Switch>
                <Route
                    exact
                    path="/app"
                    component={() => <Redirect to="/app/dashboard" />}
                />
                <Route exact path="/app/dashboard" component={() => <Dashboard />} />
                <Route exact path="/app/applications" component={() => <Application />} />
                <Route exact path="/app/profile" component={() => <Profile />} />
                {auth.user.role === 'recruiter' && (
                    <Route exact path="/app/employees" component={() => <Employees />} />
                )}
            </Switch>
        </DashboardLayout>
    );
};

// export default Routes;
export { MainRoutes, DashboardRoutes };
