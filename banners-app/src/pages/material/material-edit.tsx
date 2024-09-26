import {Form, Input, message, Modal, Select, Skeleton} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useGetMaterialByIdQuery, useUpdateMaterialMutation} from "../../store/material/material.api";
import ModalPage from "../../components/modalPage";
import {MeasurementUnit} from "../../common/Measurement/MeasurementUnit.enum";

const {Option} = Select;

export default function MaterialEdit() {
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {data, isLoading} = useGetMaterialByIdQuery(id);
    const [updateMaterial] = useUpdateMaterialMutation();

    const confirmSubmit = () => {
        Modal.confirm({
            title: 'Are you sure you want to update this material?',
            content: 'This action will save the changes you made.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => form.submit(),
        });
    };

    const handleFormSubmit = async (values: any) => {
        try {
            await updateMaterial({id, ...values}).unwrap();
            message.success("Material successfully updated!");
            navigate("/materials");
        } catch (error) {
            message.error("Failed to update material.");
        }
    };

    if (data) {
        form.setFieldsValue({
            name: data.name,
            measurementUnit: data.measurementUnit,
        });
    }

    return (
        <ModalPage
            title={'Edit Material'}
            onOk={confirmSubmit}
            backUrl={`/materials/`}
        >
            <Skeleton loading={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        label="Material Name"
                        name="name"
                        rules={[{required: true, message: "Please input material name!"}]}
                    >
                        <Input placeholder="Enter material name"/>
                    </Form.Item>

                    <Form.Item
                        label="Measurement Unit"
                        name="measurementUnit"
                        rules={[{required: true, message: "Please select measurement unit!"}]}
                    >
                        <Select placeholder="Select measurement unit">
                            {Object.values(MeasurementUnit).map((unit) => (
                                <Option key={unit} value={unit}>
                                    {unit}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Skeleton>
        </ModalPage>
    );
}
