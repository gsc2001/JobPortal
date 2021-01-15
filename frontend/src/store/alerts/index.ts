import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '..';

export interface Alert {
    id?: number;
    text: string;
    type: 'error' | 'success';
}

const initialState: Alert[] = [];

let alertId = 0;
const alertSlice = createSlice({
    name: 'alerts',
    initialState: initialState,
    reducers: {
        addAlert: (state, action: PayloadAction<Alert>) => {
            const { id, text, type } = action.payload;
            state.push({ id, text, type });
        },
        removeAlert: (state, action: PayloadAction<number>) => {
            const idx = state.findIndex(alt => alt.id === action.payload);
            state.splice(idx, 1);
        }
    }
});

const { addAlert, removeAlert } = alertSlice.actions;

export default alertSlice.reducer;

export const pushAlert = (alert: Alert, timeout = 3000): AppThunk => async dispatch => {
    const id = alertId++;
    dispatch(addAlert({ id, text: alert.text, type: alert.type }));
    await new Promise(r => setTimeout(r, timeout));
    dispatch(removeAlert(id));
};
