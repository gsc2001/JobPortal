import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { AppThunk } from '..';

interface User {
    name: string;
    email: string;
    role: 'applicant' | 'recruiter';
}

interface authStateType {
    token: string;
    isLoggedIn: boolean;
    user?: User;
}

const initialState: authStateType = {
    token: '',
    isLoggedIn: false,
    user: undefined
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.user = action.payload.user;
            localStorage.setItem('GSC_JOBP', state.token);
            axios.defaults.headers.common['Authorization'] = state.token;
        },
        authReset: state => {
            state.token = '';
            state.isLoggedIn = false;
            state.user = undefined;
            localStorage.removeItem('GCS_JOBP');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
});
