import { combineReducers } from 'redux';
import alertsReducer from './alerts';
import authReducer from './auth';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    auth: authReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
