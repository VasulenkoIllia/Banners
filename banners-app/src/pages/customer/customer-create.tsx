import {Form, Input, message} from "antd";
import {useNavigate} from "react-router-dom";
import {useCreateCustomerMutation} from "../../store/customer/customer.api";
import ModalPage from "../../components/modalPage";

export default function CustomerCreate() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [createCustomer] = useCreateCustomerMutation();

    const handleFormSubmit = async (values: any) => {
        try {
            await createCustomer(values).unwrap();
            message.success("Customer successfully created!");
            navigate("/customers");
        } catch (error) {
            message.error("Failed to create customer.");
        }
    };

    const confirmSubmit = () => {
        form.submit();
    };

    return (
        <ModalPage
            title="Create Customer"
            onOk={confirmSubmit}
            backUrl={`/customers/`}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{required: true, message: "Please input customer name!"}]}
                >
                    <Input placeholder="Enter customer name"/>
                </Form.Item>

                <Form.Item
                    label="Address"
                    name="address"
                    rules={[{required: true, message: "Please input address!"}]}
                >
                    <Input placeholder="Enter customer address"/>
                </Form.Item>

                <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[{required: true, message: "Please input phone number!"}]}
                >
                    <Input placeholder="Enter customer phone number"/>
                </Form.Item>

                <Form.Item
                    label="Instagram"
                    name="instagram"
                    rules={[{required: false, message: "Please input Instagram handle!"}]}
                >
                    <Input placeholder="Enter Instagram handle (optional)"/>
                </Form.Item>

            </Form>
        </ModalPage>
    );
}
