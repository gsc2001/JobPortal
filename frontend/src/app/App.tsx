import React from 'react';
import { Provider as StoreProvider } from 'react-redux';

import store from './store';

function App() {
    return (
        <StoreProvider store={store}>
            <div className="App">
                <h1>App!</h1>
            </div>
        </StoreProvider>
    );
}

export default App;
