import {configureStore} from '@reduxjs/toolkit'
import {setupListeners} from '@reduxjs/toolkit/query'
import {userApi} from "./user/user.api";
import {materialApi} from "./material/material.api";
import {customerApi} from "./customer/customer.api";
import {productApi} from "./product/product.api";
import {orderApi} from "./order/order.api";
import {expenseApi} from "./expense/expense.api";


export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [materialApi.reducerPath]: materialApi.reducer,
        [customerApi.reducerPath]: customerApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
        [expenseApi.reducerPath]: expenseApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            userApi.middleware,
            materialApi.middleware,
            customerApi.middleware,
            productApi.middleware,
            orderApi.middleware,
            expenseApi.middleware,
        ),
})

setupListeners(store.dispatch)
