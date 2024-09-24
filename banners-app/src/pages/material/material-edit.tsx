import ModalPage from "../../components/modalPage";
import {Modal} from "antd";

export default function MaterialEdit() {

    const confirmSubmit = () => {
        Modal.confirm({
            title: 'Are you sure you want to update this material?',
            content: 'This action will save the changes you made.',
            okText: 'Yes',
            cancelText: 'No',
            // onOk: () => form.submit(),
        });
    };
    return (
        <ModalPage
            title={('Edit material')}
            onOk={confirmSubmit}
            backUrl={`/materials/`}
        >
        </ModalPage>
    );
}
