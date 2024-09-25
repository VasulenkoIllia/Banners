import {createBrowserRouter} from "react-router-dom";
import AppLayout from "./layout/app-layout";
import Materials from "./material/materials";
import MaterialEdit from "./material/material-edit";
import MaterialCreate from "./material/material-create";
import AddMaterialQuantity from "./material/material-quantity-add";


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
            }

        ]
    }
]);
