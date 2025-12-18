import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { setCredentials } from '../auth/authSlice';


export const updateUserProfile = createAsyncThunk(
    'user/updateProfile',
    async (userData, thunkAPI) => {
        try {
            const response = await api.put('/users/profile', userData);
            thunkAPI.dispatch(setCredentials({ ...response.data, accessToken: thunkAPI.getState().auth.accessToken }));
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Update failed');
        }
    }
);

// Upload profile image
export const uploadProfileImage = createAsyncThunk(
    'user/uploadImage',
    async (formData, thunkAPI) => {
        try {
            const response = await api.post('/users/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Upload failed');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: ''
    },
    reducers: {
        resetUser: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Profile updated successfully';
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(uploadProfileImage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(uploadProfileImage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = 'Image uploaded successfully';

            })
            .addCase(uploadProfileImage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
