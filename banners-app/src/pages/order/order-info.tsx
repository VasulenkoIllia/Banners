import {DatePicker, Form, Input, Table} from "antd";
import dayjs from 'dayjs';
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useGetOrderByIdQuery} from "../../store/order/order.api";
import ModalPage from "../../components/modalPage";

const {TextArea} = Input;

export default function OrderInfo() {
    const {id} = useParams<{ id: number }>();
    const navigate = useNavigate();
    const {data: orderData, isLoading: orderLoading} = useGetOrderByIdQuery(id);
    console.log(id);

    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    console.log(orderData)

    useEffect(() => {
        if (orderData) {
            const customer = orderData.customer
            if (customer) {
                setSelectedCustomer(customer);
            }
        }
    }, [orderData]);

    const productColumns = [
        {title: "Product Name", dataIndex: "name", key: "name"},
        {title: "Cost Price", dataIndex: "costPrice", key: "costPrice"},
    ];

    const formattedCompletionDate = orderData?.completionDate ? dayjs(orderData.completionDate) : null;
    const totalCostPrice = Number(orderData?.costPrice).toFixed(2)

    return (
        <ModalPage title={"Order Information"} backUrl={`/orders/`}>
            {orderLoading ? (
                <p>Loading order details...</p>
            ) : (
                <Form layout="vertical">
                    <Form.Item label="Order Description">
                        <TextArea value={orderData?.description} readOnly/>
                    </Form.Item>

                    <Form.Item label="Customer">
                        <Input value={selectedCustomer?.name} readOnly/>
                    </Form.Item>

                    <Form.Item label="Address">
                        <Input value={selectedCustomer?.address} readOnly/>
                    </Form.Item>

                    <Form.Item label="Completion Date">
                        <DatePicker value={formattedCompletionDate} disabled/>
                    </Form.Item>

                    <h3>Products</h3>
                    <Table
                        columns={productColumns}
                        dataSource={orderData?.products}
                        rowKey="id"
                        pagination={false}
                        footer={() => <strong>Total Cost Price: {totalCostPrice}</strong>}
                    />

                    <Form.Item label="Sale Price">
                        <Input value={orderData?.salePrice} readOnly/>
                    </Form.Item>

                    <Form.Item label="Profit">
                        <Input value={orderData?.profit} readOnly/>
                    </Form.Item>
                </Form>
            )}
        </ModalPage>
    );
}
