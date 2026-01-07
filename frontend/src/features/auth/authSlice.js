import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async Thunks
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/auth/login', userData);
        console.log("Response....",response)
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error(error);
    }
});

export const verifyAuth = createAsyncThunk('auth/verify', async (_, thunkAPI) => {
    try {
        const response = await api.get('/auth/refresh');
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue('Not authenticated');
    }
});

const initialState = {
    user: null,
    accessToken: null,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
    isAuthChecked: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
        setCredentials: (state, action) => {
            const { accessToken, ...user } = action.payload; 
            state.user = user;
        },
        updateAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        logoutUserLocal: (state) => {
            state.user = null;
            state.accessToken = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.accessToken = null;
            })
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
                state.accessToken = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
            })
            .addCase(verifyAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(verifyAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthChecked = true;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
            })
            .addCase(verifyAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuthChecked = true;
                state.user = null;
                state.accessToken = null;
            });
    },
});

export const { reset, setCredentials, updateAccessToken, logoutUserLocal } = authSlice.actions;
export default authSlice.reducer;
