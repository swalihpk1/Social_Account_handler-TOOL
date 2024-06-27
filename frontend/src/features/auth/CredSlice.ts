import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../../types/Types";

interface AuthState {
    userInfo: UserInfo | null;
}

const initialState: AuthState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null,
};

const credSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserInfo>) => {
            console.log("Action", action);
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
        },
        updateUser: (state, action: PayloadAction<any>) => {
            if (state.userInfo) {
                state.userInfo = { ...state.userInfo, ...action.payload };
                localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
            }
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
    },
});

export const { setCredentials, updateUser, logout } = credSlice.actions;
export default credSlice.reducer;
