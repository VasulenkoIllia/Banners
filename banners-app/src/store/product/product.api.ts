import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Config} from '../../config';

export const productApi = createApi({
    reducerPath: 'productApi',
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
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        createProduct: builder.mutation({
            query: (data) => ({
                url: 'admin/product/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'Product', id: 'LIST'}],
        }),

        getAllProducts: builder.query({
            query: (params) => ({
                url: 'admin/product/findAll',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.products.map(({id}: { id: number }) => ({
                            type: 'Product' as const,
                            id,
                        })),
                        {type: 'Product', id: 'LIST'},
                    ]
                    : [{type: 'Product', id: 'LIST'}],
        }),

        getProductById: builder.query({
            query: (id) => ({
                url: `admin/product/${id}`,
                method: 'GET',
            }),
            providesTags: (id) => [{type: 'Product', id}],
        }),

        updateProduct: builder.mutation({
            query: ({id, ...data}) => ({
                url: `admin/product/${id}/update`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ({id}) => [{type: 'Product', id}],
        }),

        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `admin/product/${id}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'Product', id: 'LIST'}],
        }),
    }),
});

export const {
    useCreateProductMutation,
    useGetAllProductsQuery,
    useGetProductByIdQuery,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;
