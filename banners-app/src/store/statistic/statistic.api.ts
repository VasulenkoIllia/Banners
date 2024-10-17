import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Config} from "../../config";

export const statisticsApi = createApi({
    reducerPath: 'statisticsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: Config.API_URL,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getStatistics: builder.query({
            query: ({startDate, endDate, sortField, sortOrder}) => ({
                url: 'admin/get-statistic',
                method: 'GET',
                params: {startDate, endDate, sortField, sortOrder},
            }),
        }),
    }),
});

// Генеруємо хуки для використання в компонентах
export const {useGetStatisticsQuery} = statisticsApi;
