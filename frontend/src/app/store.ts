import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/AuthSlice";
import authReducer from '../features/auth/credSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authSlice.reducerPath]: authSlice.reducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authSlice.middleware),
    devTools: true
});

export type RootState = ReturnType<typeof store.getState>
