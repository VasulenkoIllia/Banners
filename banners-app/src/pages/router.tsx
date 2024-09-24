import {createBrowserRouter} from "react-router-dom";
import AppLayout from "./layout/app-layout";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout/>,
        children: []
    }
]);
