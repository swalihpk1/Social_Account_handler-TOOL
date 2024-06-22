import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { UserInfo } from "../../types/Types";

interface AuthState {
    userInfo: UserInfo | null
}

const initialState: AuthState = {

    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') as string) : null
}

const credSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<UserInfo>) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        }
    }
})

export const { setCredentials } = credSlice.actions;
export default credSlice.reducer