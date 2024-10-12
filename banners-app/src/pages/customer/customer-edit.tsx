import {Form, Input, message} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {useGetCustomerByIdQuery, useUpdateCustomerMutation} from "../../store/customer/customer.api";
import ModalPage from "../../components/modalPage";

export default function CustomerEdit() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const {data: customer, isLoading} = useGetCustomerByIdQuery(id);
    const [updateCustomer] = useUpdateCustomerMutation();

    const handleFormSubmit = async (values: any) => {
        try {
            await updateCustomer({id, ...values}).unwrap();
            message.success("Customer successfully updated!");
            navigate("/customers");
        } catch (error) {
            message.error("Failed to update customer.");
        }
    };

    const confirmSubmit = () => {
        form.submit();
    };

    useEffect(() => {
        if (customer) {
            form.setFieldsValue({
                name: customer.name,
                address: customer.address,
                phone: customer.phone,
                instagram: customer.instagram,
                etsy: customer.etsy,
            });
        }
    }, [customer, form]);

    return (
        <ModalPage
            title="Edit Customer"
            onOk={confirmSubmit}
            backUrl={`/customers/`}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                initialValues={{
                    name: customer?.name,
                    address: customer?.address,
                    phone: customer?.phone,
                    instagram: customer?.instagram,
                    etsy: customer?.etsy,
                }}
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

                <Form.Item
                    label="Etsy"
                    name="etsy"
                    rules={[{required: false, message: "Please input Etsy handle!"}]}
                >
                    <Input placeholder="Enter Etsy handle (optional)"/>
                </Form.Item>
            </Form>
        </ModalPage>
    );
}
