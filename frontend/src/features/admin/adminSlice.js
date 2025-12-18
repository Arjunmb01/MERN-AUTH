import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const getUsers = createAsyncThunk('admin/getUsers', async ({ keyword = '', pageNumber = '' }, thunkAPI) => {
    try {
        const response = await api.get(`/admin/users?keyword=${keyword}&pageNumber=${pageNumber}`);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Fetch users failed');
    }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (id, thunkAPI) => {
    try {
        await api.delete(`/admin/users/${id}`);
        return id;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Delete user failed');
    }
});

export const createUser = createAsyncThunk('admin/createUser', async (userData, thunkAPI) => {
    try {
        const response = await api.post('/admin/users', userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Create user failed');
    }
});

export const updateUser = createAsyncThunk('admin/updateUser', async ({ id, userData }, thunkAPI) => {
    try {
        const response = await api.put(`/admin/users/${id}`, userData);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update user failed');
    }
});

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        page: 1,
        pages: 1,
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: ''
    },
    reducers: {
        resetAdmin: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload.users;
                state.page = action.payload.page;
                state.pages = action.payload.pages;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter((user) => user._id !== action.payload);
                state.isSuccess = true;
                state.message = 'User deleted successfully';
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.users.push(action.payload);
                state.message = 'User created successfully';
            })
            .addCase(createUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.users.findIndex((user) => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.message = 'User updated successfully';
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
