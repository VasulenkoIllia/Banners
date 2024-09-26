import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Config} from '../../config';

export const customerApi = createApi({
    reducerPath: 'customerApi',
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
    tagTypes: ['Customer'],
    endpoints: (builder) => ({
        createCustomer: builder.mutation({
            query: (data) => ({
                url: 'admin/customer/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'Customer', id: 'LIST'}],
        }),

        getAllCustomers: builder.query({
            query: (params) => ({
                url: 'admin/customer/findAll',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.customers.map(({id}) => ({
                            type: 'Customer',
                            id,
                        })),
                        {type: 'Customer', id: 'LIST'},
                    ]
                    : [{type: 'Customer', id: 'LIST'}],
        }),

        getCustomerById: builder.query({
            query: (id) => `admin/customer/${id}`,
            providesTags: (id) => [{type: 'Customer', id}],
        }),

        updateCustomer: builder.mutation({
            query: ({id, ...data}) => ({
                url: `admin/customer/${id}/update`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ({id}) => [{type: 'Customer', id}],
        }),

        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `admin/customer/${id}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'Customer', id: 'LIST'}],
        }),
    }),
});

export const {
    useCreateCustomerMutation,
    useGetAllCustomersQuery,
    useGetCustomerByIdQuery,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customerApi;
