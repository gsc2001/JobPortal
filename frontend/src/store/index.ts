import {
    Action,
    configureStore,
    getDefaultMiddleware,
    ThunkAction
} from '@reduxjs/toolkit';
import rootReducer, { RootState } from './rootReducer';

const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware()] // add custom middleware here
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
