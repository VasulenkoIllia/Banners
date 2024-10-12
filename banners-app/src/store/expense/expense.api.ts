import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Config} from "../../config";

export const expenseApi = createApi({
    reducerPath: 'expenseApi',
    tagTypes: ['Expenses'],
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
        createExpense: builder.mutation({
            query: (newExpense) => ({
                url: 'admin/expense/create',
                method: 'POST',
                body: newExpense,
            }),
            invalidatesTags: ['Expenses'],
        }),

        getAllExpenses: builder.query({
            query: (params) => ({
                url: 'admin/expense/findAll',
                method: 'GET',
                params,
            }),
            providesTags: ['Expenses'],
        }),

        getExpenseById: builder.query({
            query: (id) => ({
                url: `admin/expense/${id}`,
                method: 'GET',
            }),
            providesTags: (id) => [{type: 'Expenses', id}],
        }),

        deleteExpense: builder.mutation({
            query: (id) => ({
                url: `admin/expense/${id}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Expenses'],
        }),
    }),
});

export const {
    useCreateExpenseMutation,
    useGetAllExpensesQuery,
    useGetExpenseByIdQuery,
    useDeleteExpenseMutation,
} = expenseApi;
