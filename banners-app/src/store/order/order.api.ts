import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Config} from '../../config';

export const orderApi = createApi({
    reducerPath: 'orderApi',
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
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (data) => ({
                url: 'admin/order/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'Order', id: 'LIST'}],
        }),

        getAllOrders: builder.query({
            query: (params) => ({
                url: 'admin/order/findAll',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result?.orders
                    ? [
                        ...result.orders.map(({id}: { id: number }) => ({
                            type: 'Order' as const,
                            id,
                        })),
                        {type: 'Order', id: 'LIST'},
                    ]
                    : [{type: 'Order', id: 'LIST'}],
        }),

        getOrderById: builder.query({
            query: (id) => ({
                url: `admin/order/${id}`,
                method: 'GET',
            }),
            providesTags: (id) => [{type: 'Order', id}],
        }),

        updateOrder: builder.mutation({
            query: ({id, ...data}) => ({
                url: `admin/order/${id}/update`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ({id}) => [{type: 'Order', id}],
        }),

        deleteOrder: builder.mutation({
            query: (id) => ({
                url: `admin/order/${id}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'Order', id: 'LIST'}],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetAllOrdersQuery,
    useGetOrderByIdQuery,
    useUpdateOrderMutation,
    useDeleteOrderMutation,
} = orderApi;
