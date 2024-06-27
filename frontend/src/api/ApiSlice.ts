import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, UserData } from '../types/Types';

const USER_URL = 'api/user';

const baseQuery = fetchBaseQuery({ baseUrl: '' });

export const apiSlice = createApi({
    baseQuery,
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
        facebookLogin: builder.mutation<void, void>({
            queryFn: () => {
                window.location.href = 'http://localhost:3001/connect/facebook';
                return { data: {} as unknown as void };
            }
        })

    }),
});

export const { useSignUpMutation, useLoginMutation, useFacebookLoginMutation } = apiSlice;