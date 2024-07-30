import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, UserInfo, Page } from '../../types/Types';

const initialState: AuthState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
};

const credSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ userInfo: UserInfo, accessToken: string, refreshToken: string }>) => {
            state.userInfo = action.payload.userInfo;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            localStorage.setItem('userInfo', JSON.stringify(action.payload.userInfo));
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        updateUser: (state, action: PayloadAction<{ provider: string; profileName: string; profilePicture?: string; userPages?: Page[] }>) => {
            if (state.userInfo) {
                state.userInfo.socialAccounts = state.userInfo.socialAccounts || {};
                state.userInfo.socialAccounts[action.payload.provider] = {
                    profileName: action.payload.profileName,
                    profilePicture: action.payload.profilePicture,
                    userPages: action.payload.userPages || []
                };
                localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
            }
        },

        removeSocialAccount: (state, action: PayloadAction<string>) => {
            if (state.userInfo && state.userInfo.socialAccounts) {
                delete state.userInfo.socialAccounts[action.payload];
                localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
            }
        },
        logout: (state) => {
            state.userInfo = null;
            state.accessToken = null;
            state.refreshToken = null;
            localStorage.removeItem('userInfo');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        },
    },
});

export const { setCredentials, updateUser, removeSocialAccount, logout } = credSlice.actions;

export default credSlice.reducer;
