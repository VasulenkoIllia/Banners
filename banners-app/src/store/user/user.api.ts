import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import {Config} from "../../config";

export const userApi = createApi({
    reducerPath: 'userApi',
    tagTypes: ['user'],
    baseQuery: fetchBaseQuery({
        baseUrl: Config.API_URL,
        prepareHeaders: (headers) => {
            headers.set('authorization', `Bearer ${localStorage.getItem('token')}`)
            return headers
        }
    }),
    endpoints: (builder) => ({
        login: builder.mutation<any, any>({
            query: (data) => ({
                url: `/auth/login`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['user']
        }),
        getMe: builder.query<any, any>({
            query: () => `/user/me`,
            providesTags: ['user']
        }),
    }),
})

export const {useGetMeQuery, useLoginMutation} = userApi
