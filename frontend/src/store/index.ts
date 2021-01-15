import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()] // add custom middleware here
});

export default store;
export type AppDispatch = typeof store.dispatch;
