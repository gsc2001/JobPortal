import CssBaseline from '@material-ui/core/CssBaseline';
import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { MainRoutes, DashboardRoutes } from './Routes';

import store from './store';

function App() {
    return (
        <StoreProvider store={store}>
            <Router>
                <CssBaseline />
                <Route exact path="/" component={() => <MainRoutes />} />
                <Route exact path="/app" component={() => <DashboardRoutes />} />
            </Router>
        </StoreProvider>
    );
}

export default App;
