import { configureStore } from "@reduxjs/toolkit";
import credSlice from "../features/auth/CredSlice";
import { apiSlice } from "../api/ApiSlice";

export const store = configureStore({
    reducer: {
        auth: credSlice,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
