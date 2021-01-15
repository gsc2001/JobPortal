import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

import store from './store';

function App() {
    return (
        <StoreProvider store={store}>
            <Router>
                <Routes />
            </Router>
        </StoreProvider>
    );
}

export default App;
