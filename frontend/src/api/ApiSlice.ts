import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthResponse, CharacterLimits, UserData, UserInfo } from '../types/Types';

const USER_URL = 'user';
const POST_URL = 'post';
const ANALYTICS_URL = 'analytics';

const baseUrl = 'https://backend.frostbay.online';
// const baseUrl = 'http://localhost:3001';
const baseQuery = fetchBaseQuery({
    baseUrl
});

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
        createPost: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: '/post/create',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),
        shedulePost: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: '/post/schedule',
                method: 'POST',
                body: formData,
                formData: true,
            }),
        }),
        getInstagramAccessToken: builder.query({
            query: (accessToken) => ({
                url: `connect/instagram/getUser`,
                method: 'GET',
                params: { access_token: accessToken },
            }),
        }),
        fetchHashtags: builder.query<{ data: string[] }, string>({
            query: (keyword) => ({
                url: `${POST_URL}/hashtags`,
                method: 'GET',
                params: { keyword },
            }),
        }),
        updateUserName: builder.mutation<UserInfo, { name: string }>({
            query: ({ name }) => ({
                url: `${USER_URL}/update-username`,
                method: 'PATCH',
                body: { name },
            }),
        }),
        fetchPosts: builder.query<any, void>({
            query: () => ({
                url: `${POST_URL}/fetch-all-posts`,
                method: 'GET',
            }),
        }),
        reschedulePost: builder.mutation<void, { jobId: string, reScheduleTime: string }>({
            query: ({ jobId, reScheduleTime }) => ({
                url: `${POST_URL}/re-schedule-posts`,
                method: 'PUT',
                body: { jobId, scheduledTime: reScheduleTime },
            }),
        }),
        deleteShedulePost: builder.mutation<void, { jobId: string }>({
            query: ({ jobId }) => ({
                url: `${POST_URL}/delete-schedule-post`,
                method: 'DELETE',
                body: { jobId }
            }),
        }),
        editPost: builder.mutation<void, { jobId: string; formData: FormData; platforms: string[] }>({
            query: ({ jobId, formData, platforms }) => {
                platforms.forEach(platform => formData.append('platforms[]', platform));
                return {
                    url: `${POST_URL}/edit/${jobId}`,
                    method: 'PUT',
                    body: formData,
                };
            },
        }),
        fetchAnalytics: builder.mutation<any, void>({
            query: () => ({
                url: `${ANALYTICS_URL}`,
                method: 'GET',
            }),
        }),
        fetchBestPosts: builder.query<any, void>({
            query: () => ({
                url: `${ANALYTICS_URL}/best-posts`,
            }),
        }),
    }),
});

export const {
    useSignUpMutation,
    useLoginMutation,
    useRemoveSocialAccountMutation,
    useGetCharacterLimitsQuery,
    useCreatePostMutation,
    useShedulePostMutation,
    useGetInstagramAccessTokenQuery,
    useFetchHashtagsQuery,
    useUpdateUserNameMutation,
    useFetchPostsQuery,
    useReschedulePostMutation,
    useDeleteShedulePostMutation,
    useEditPostMutation,
    useFetchAnalyticsMutation,
    useFetchBestPostsQuery,
} = apiSlice;
