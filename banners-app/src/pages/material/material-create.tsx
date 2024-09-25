import {Outlet, useNavigate} from "react-router-dom";
import {Form, Input, message, Modal, Select} from "antd";
import ModalPage from "../../components/modalPage";
import {useCreateMaterialMutation} from "../../store/material/material.api";
import {MeasurementUnit} from "../../common/Measurement/MeasurementUnit.enum";

const {Option} = Select;

export default function MaterialCreate() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [createMaterial] = useCreateMaterialMutation();

    const confirmSubmit = () => {
        Modal.confirm({
            title: "Are you sure you want to create this material?",
            content: "Please confirm your submission.",
            okText: "Yes",
            cancelText: "No",
            onOk: () => {
                form.submit();
            },
        });
    };

    const handleFormSubmit = async (values: any) => {
        try {
            await createMaterial(values).unwrap();
            message.success("Material successfully created!");
            navigate("/materials");
        } catch (error) {
            message.error("Failed to create material.");
        }
    };


    return (
        <ModalPage
            title={"Create Material"}
            onOk={confirmSubmit}
            backUrl={`/materials/`}
        >
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
                    label="Price Per Unit"
                    name="pricePerUnit"
                    rules={[{required: true, message: "Please input price per unit!"}]}
                >
                    <Input type="number" placeholder="Enter price per unit"/>
                </Form.Item>

                <Form.Item
                    label="Quantity"
                    name="quantity"
                    rules={[{required: true, message: "Please input quantity!"}]}
                >
                    <Input type="number" placeholder="Enter quantity"/>
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
            <Outlet/>
        </ModalPage>
    );
}
