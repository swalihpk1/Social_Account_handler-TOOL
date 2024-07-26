// api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, CharacterLimits, UserData } from '../types/Types';

const USER_URL = 'api/user';
const POST_URL = 'api/post';

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
        removeSocialAccount: builder.mutation<UserData, { provider: string }>({
            query: (data) => ({
                url: `${USER_URL}/remove-social-account`,
                method: 'DELETE',
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
        getCharacterLimits: builder.query<CharacterLimits, void>({
            query: () => ({
                url: `${POST_URL}/charLimits`,
                method: 'GET',
            }),
        }),
        createPost: builder.mutation<void, FormData>({
            query: (data) => ({
                url: `${POST_URL}/create`,
                method: 'POST',
                body: data,
            }),
        }),
        getInstagramAccessToken: builder.query({
            query: (accessToken) => ({
                url: `connect/instagram/getUser`,
                method: 'GET',
                params: { access_token: accessToken },
            }),
        }),

    }),
});

export const { useSignUpMutation, useLoginMutation, useRemoveSocialAccountMutation, useGetCharacterLimitsQuery, useCreatePostMutation, useGetInstagramAccessTokenQuery } = apiSlice;
