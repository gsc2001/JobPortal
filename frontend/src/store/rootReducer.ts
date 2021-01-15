import { combineReducers } from 'redux';
import alertsReducer from "./alerts";

const rootReducer = combineReducers({
    alerts: alertsReducer
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
