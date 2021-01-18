import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MainRoutes, DashboardRoutes } from './Routes';

import store from './store';

function App() {
    return (
        <StoreProvider store={store}>
            <Router>
                <CssBaseline />
                <Switch>
                    <Route path="/app" component={() => <DashboardRoutes />} />
                    <Route path="/" component={() => <MainRoutes />} />
                </Switch>
            </Router>
        </StoreProvider>
    );
}

export default App;
