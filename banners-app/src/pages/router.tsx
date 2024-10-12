import {createBrowserRouter} from "react-router-dom";
import AppLayout from "./layout/app-layout";
import Materials from "./material/materials";
import MaterialEdit from "./material/material-edit";
import MaterialCreate from "./material/material-create";
import AddMaterialQuantity from "./material/material-quantity-add";
import Customers from "./customer/customers";
import CustomerCreate from "./customer/customer-create";
import Products from "./product/products";
import ProductCreate from "./product/product-create";
import ProductEdit from "./product/product-edit";
import Orders from "./order/orders";
import OrderCreate from "./order/order-create";
import OrderInfo from "./order/order-info";
import OrderEdit from "./order/order-edit";
import CustomerInfo from "./customer/customer-info";
import Expenses from "./expense/expenses";
import ExpenseCreate from "./expense/expense-create";
import ExpenseInfo from "./expense/expense-info";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout/>,
        children: [
            {
                path: "/materials",
                element: <Materials/>,
            },
            {
                path: "/materials/page/:pageId",
                element: <Materials/>,
            },
            {
                path: "/materials/:id/edit",
                element: <MaterialEdit/>,
            },
            {
                path: "/materials/create-material",
                element: <MaterialCreate/>,
            },
            {
                path: "/materials/add-material-quantity",
                element: <AddMaterialQuantity/>,
            },
            /////////////////////
            {
                path: "/customers",
                element: <Customers/>,
            },
            {
                path: "/customers/page/:pageId",
                element: <Customers/>,
            },
            {
                path: "/customers/create",
                element: <CustomerCreate/>,
            },
            {
                path: "/customers/:id/info",
                element: <CustomerInfo/>,
            },


            /////////////////////
            {
                path: "/products",
                element: <Products/>,
            },
            {
                path: "/products/page/:pageId",
                element: <Products/>,
            },
            {
                path: "/products/create",
                element: <ProductCreate/>,
            },
            {
                path: "/products/:id/edit",
                element: <ProductEdit/>,
            },

            /////////////////////
            {
                path: "/orders",
                element: <Orders/>,
            },
            {
                path: "/orders/page/:pageId",
                element: <Orders/>,
            },
            {
                path: "/orders/create",
                element: <OrderCreate/>,
            },
            {
                path: "/orders/:id/info",
                element: <OrderInfo/>,
            },
            {
                path: "/orders/:id/edit",
                element: <OrderEdit/>,
            },

            ///////////////////
            {
                path: "/expenses",
                element: <Expenses/>,
            },
            {
                path: "/expenses/page/:pageId",
                element: <Expenses/>,
            },
            {
                path: "/expenses/create",
                element: <ExpenseCreate/>,
            },
            {
                path: "/expenses/:id/info",
                element: <ExpenseInfo/>,
            },


        ]
    }
]);
