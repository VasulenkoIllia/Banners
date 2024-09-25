import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Config} from '../../config';

export const materialApi = createApi({
    reducerPath: 'materialApi',
    tagTypes: ['Material'],
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
        createMaterial: builder.mutation({
            query: (data) => ({
                url: 'admin/material/create',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'Material', id: 'LIST'}],
        }),

        getAllMaterials: builder.query({
            query: (params) => ({
                url: 'admin/material/findAll',
                method: 'GET',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.materials.map(({id}) => ({
                            type: 'Material',
                            id,
                        })),
                        {type: 'Material', id: 'LIST'},
                    ]
                    : [{type: 'Material', id: 'LIST'}],
        }),

        getMaterialById: builder.query({
            query: (id) => `admin/material/${id}`,
            providesTags: (id) => [{type: 'Material', id}],
        }),

        updateMaterialQuantity: builder.mutation({
            query: ({id, ...data}) => ({
                url: `admin/material/${id}/addQuantity`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'Material', id: 'LIST'}],
        }),

        updateMaterial: builder.mutation({
            query: ({id, ...data}) => ({
                url: `admin/material/${id}/update`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [{type: 'Material', id: 'LIST'}],
        }),

        deleteMaterial: builder.mutation({
            query: (id) => ({
                url: `admin/material/${id}/delete`,
                method: 'DELETE',
            }),
            invalidatesTags: [{type: 'Material', id: 'LIST'}],
        }),
    }),
});

export const {
    useCreateMaterialMutation,
    useGetAllMaterialsQuery,
    useGetMaterialByIdQuery,
    useUpdateMaterialQuantityMutation,
    useDeleteMaterialMutation,
    useUpdateMaterialMutation,
} = materialApi;
