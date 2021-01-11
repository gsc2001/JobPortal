import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    // define reducers here
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
