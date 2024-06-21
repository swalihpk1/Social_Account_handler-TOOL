import { apiSlice } from "../Slices";
const USER_URL = '/users';

interface SignUpData {
    username: string;
    password: string;
}

interface LoginData {
    username: string;
    password: string;
}

interface AuthResponse {
    token: string;
}

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signUp: builder.mutation<AuthResponse, SignUpData>({
            query: (data) => ({
                url: `${USER_URL}/signup`,
                method: 'POST',
                body: data,
            }),
        }),
        login: builder.mutation<AuthResponse, LoginData>({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: 'POST',
                body: data,
            }),
        }),
    }),
});

export const { useSignUpMutation, useLoginMutation } = userApiSlice;
