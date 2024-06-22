import { authSlice } from "../features/auth/AuthSlice";
import { AuthResponse, UserData } from "../types/Types";
const USER_URL = '/user';


export const userApiSlice = authSlice.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation<AuthResponse, UserData>({
            query: (data) => ({
                url: `${USER_URL}/signup`,
                method: 'POST',
                body: data,
            }),
        }),
        login: builder.mutation<AuthResponse, UserData>({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useSignUpMutation, useLoginMutation } = userApiSlice;
