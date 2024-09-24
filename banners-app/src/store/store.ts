import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {userApi} from "./user/user.api";
import {materialApi} from "./material/material.api";


export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [materialApi.reducerPath]: materialApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            materialApi.middleware,
        ),
})

setupListeners(store.dispatch)
