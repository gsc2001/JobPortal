import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

import { AppThunk } from '..';

interface User {
    name: string;
    email: string;
    avatarImage: string;
    role: 'applicant' | 'recruiter';
    id: string;
}

interface authStateType {
    token: string;
    isLoggedIn: boolean;
    user: User;
}

const initialState: authStateType = {
    token: '',
    isLoggedIn: false,
    user: {
        name: '',
        email: '',
        role: 'applicant',
        avatarImage: '',
        id: ''
    }
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token;
            state.isLoggedIn = true;
            state.user = action.payload.user;
            axios.defaults.headers.common['Authorization'] = state.token;
        },
        authReset: state => {
            state.token = '';
            state.isLoggedIn = false;
            state.user = {
                name: '',
                email: '',
                role: 'applicant',
                avatarImage: '',
                id: ''
            };
            localStorage.removeItem('GCS_JOBP');
            delete axios.defaults.headers.common['Authorization'];
        }
    }
});

const { authReset, authSuccess } = authSlice.actions;

export default authSlice.reducer;

export { authReset, authSuccess };
