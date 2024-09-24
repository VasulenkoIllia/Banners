import {Outlet} from "react-router-dom";
import {Modal} from "antd";
import ModalPage from "../../components/modalPage";

export default function MaterialCreate() {
    const confirmSubmit = () => {
        Modal.confirm({
            title: "Are you sure you want to create this task?",
            content: "Please confirm your submission.",
            okText: "Yes",
            cancelText: "No",
            // onOk: () => {
            //     form.submit();
            // },
        });
    };
    return (
        <ModalPage
            title={"Create material"}
            onOk={confirmSubmit}
            backUrl={`/materials/`}
        >
            <Outlet/>
        </ModalPage>
    );
}
