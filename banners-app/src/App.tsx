import './App.css'
import {RouterProvider} from "react-router-dom";
import {router} from "./pages/router";
import {useGetMeQuery} from "./store/user/user.api";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import Login from "./components/login/login";
import Notify from "./components/notify";


function App() {

    const {data, isLoading} = useGetMeQuery(null)


    if (isLoading) {
        return <div className={'w-full h-[100vh] flex items-center justify-center'}>
            <Spin indicator={<LoadingOutlined spin/>} size="large"/>
        </div>
    }

    if (!data) {
        return <Login/>
    }

    return (
        <>
            <RouterProvider router={router}/>
            <Notify/>
        </>
    )
}

export default App
