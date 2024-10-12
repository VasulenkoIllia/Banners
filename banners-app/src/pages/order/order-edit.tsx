import {DatePicker, Form, Input, message, Modal, Select} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {useGetOrderByIdQuery, useUpdateOrderMutation} from "../../store/order/order.api";
import ModalPage from "../../components/modalPage";
import {OrderStatus} from "../../common/Order/OrderStatus.enum";
import dayjs from "dayjs";

const {Option} = Select;

export default function OrderEdit() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {data: orderData, isLoading: orderLoading} = useGetOrderByIdQuery(id);
    const [updateOrder] = useUpdateOrderMutation();
    const [form] = Form.useForm();

    useEffect(() => {
        if (orderData) {
            form.setFieldsValue({
                completionDate: orderData?.completionDate ? dayjs(orderData.completionDate) : null,
                status: orderData?.status,
                description: orderData?.description,
            });
        }
    }, [orderData, form]);

    const confirmSubmit = () => {
        Modal.confirm({
            title: "Are you sure you want to update this order?",
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
            const orderUpdateData = {
                completionDate: values.completionDate ? values.completionDate.toISOString() : null,
                status: values.status,
                description: values.description,
            };
            console.log(orderUpdateData);
            await updateOrder({id, ...orderUpdateData}).unwrap();
            message.success("Order successfully updated!");
            navigate("/orders");
        } catch (error) {
            message.error("Failed to update order.");
        }
    };

    return (
        <ModalPage title={"Edit Order"} onOk={confirmSubmit} backUrl={`/orders/`}>
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                {orderLoading ? (
                    <p>Loading order details...</p>
                ) : (
                    <>
                        <Form.Item label="Completion Date" name="completionDate">
                            <DatePicker
                                style={{width: '100%'}}
                                placeholder="Select Completion Date"
                            />
                        </Form.Item>

                        <Form.Item label="Description" name="description"
                                   rules={[{required: true, message: "Please input address!"}]}
                        >
                            <Input placeholder="Enter description"/>
                        </Form.Item>

                        <Form.Item
                            label="Status"
                            name="status"
                            rules={[{required: true, message: "Please select a status!"}]}
                        >
                            <Select placeholder="Select order status">
                                <Option value={OrderStatus.IN_PROGRESS}>{OrderStatus.IN_PROGRESS}</Option>
                                <Option value={OrderStatus.COMPLETED}>{OrderStatus.COMPLETED}</Option>
                                <Option value={OrderStatus.CANCELLATION}>{OrderStatus.CANCELLATION}</Option>
                            </Select>
                        </Form.Item>
                    </>
                )}
            </Form>
        </ModalPage>
    );
}
