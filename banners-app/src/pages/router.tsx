import {createBrowserRouter} from "react-router-dom";
import AppLayout from "./layout/app-layout";
import Materials from "./material/materials";
import MaterialEdit from "./material/material-edit";
import MaterialCreate from "./material/material-create";


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
                path: "/materials/:materialId",
                element: <MaterialEdit/>,
            },
            {
                path: "/materials/create",
                element: <MaterialCreate/>,
            }

        ]
    }
]);
