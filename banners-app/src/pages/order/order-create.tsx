import {Button, DatePicker, Form, Input, InputNumber, message, Modal, Select, Table} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useGetAllCustomersQuery} from "../../store/customer/customer.api";
import {useCreateOrderMutation} from "../../store/order/order.api";
import ModalPage from "../../components/modalPage";
import {useGetAllProductsQuery} from "../../store/product/product.api";
import {MinusCircleOutlined} from "@ant-design/icons";

const {Option} = Select;

export default function OrderCreate() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const location = useLocation();
    const [createOrder] = useCreateOrderMutation();
    const {data: customersData, isLoading: customersLoading} = useGetAllCustomersQuery();
    const {data: productsData, isLoading: productsLoading} = useGetAllProductsQuery();

    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [totalCost, setTotalCost] = useState<number>(0);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    useEffect(() => {
        if (location.state?.customerId && customersData?.customers) {
            const customer = customersData.customers.find((c: any) => c.id === location.state.customerId);
            if (customer) {
                setSelectedCustomer(customer);
                form.setFieldsValue({address: customer.address, customer: customer.name});
            }
        }
    }, [location.state, customersData, form]);

    useEffect(() => {
        const calculateTotalCost = () => {
            const total = selectedProducts.reduce((sum, product) => {
                const productCost = parseFloat(product.costPrice) || 0;
                return sum + productCost;
            }, 0);
            setTotalCost(total);
            form.setFieldsValue({costPrice: total.toFixed(2)});
        };
        calculateTotalCost();
    }, [selectedProducts, form]);

    const confirmSubmit = () => {
        Modal.confirm({
            title: "Are you sure you want to create this order?",
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
            const orderData = {
                ...values,
                customerId: selectedCustomer?.id,
                products: selectedProducts.map((product) => ({
                    productId: product.id,
                })),
                completionDate: values.completionDate ? values.completionDate.toISOString() : null,
            };
            await createOrder(orderData).unwrap();
            message.success("Order successfully created!");
            navigate("/orders");
        } catch (error) {
            message.error("Failed to create order.");
        }
    };

    const handleAddProduct = (productId: number) => {
        const product = productsData.products.find((p: any) => p.id === productId);

        if (selectedProducts.find((p) => p.id === productId)) {
            message.warning("Product has already been added.");
            return;
        }

        const productCopy = JSON.parse(JSON.stringify(product));
        setSelectedProducts((prev) => [...prev, productCopy]);
    };

    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts((prev) => prev.filter((product) => product.id !== productId));
    };

    const handleCustomerSelect = (customerId: number) => {
        const customer = customersData.customers.find((c: any) => c.id === customerId);
        setSelectedCustomer(customer);
        form.setFieldsValue({address: customer.address});
    };

    const handleNewCustomer = async () => {
        navigate("/customers/create", {state: {fromOrderCreate: true}});
    };

    const productColumns = [
        {title: "Product Name", dataIndex: "name", key: "name"},
        {title: "Cost Price", dataIndex: "costPrice", key: "costPrice"},
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    icon={<MinusCircleOutlined style={{color: 'red'}}/>}
                    onClick={() => handleRemoveProduct(record.id)}
                    type="text"
                />
            ),
        },
    ];

    return (
        <ModalPage title={"Create Order"} onOk={confirmSubmit} backUrl={`/orders/`}>
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item label="Order Description" name="description">
                    <Input.TextArea placeholder="Enter order description"/>
                </Form.Item>

                <Form.Item label="Customer" name="customer"
                           rules={[{required: true, message: "Please select a customer!"}]}>
                    <Select
                        showSearch
                        placeholder="Search customer"
                        loading={customersLoading}
                        onChange={handleCustomerSelect}
                        optionFilterProp="children"
                        dropdownRender={(menu) => (
                            <>
                                {menu}
                                <Button type="link" onClick={handleNewCustomer}>+ Add New Customer</Button>
                            </>
                        )}
                    >
                        {customersData?.customers.map((customer: any) => (
                            <Option key={customer.id} value={customer.id}>{customer.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item label="Address" name="address" rules={[{required: true, message: "Address is required!"}]}>
                    <Input readOnly placeholder="Customer address will be filled automatically"/>
                </Form.Item>

                <Form.Item label="Completion Date" name="completionDate">
                    <DatePicker style={{width: '100%'}} placeholder="Select Completion Date"/>
                </Form.Item>

                <h3>Products</h3>
                <Form.Item label="Select Product">
                    <Select
                        showSearch
                        placeholder="Search product"
                        loading={productsLoading}
                        onChange={handleAddProduct}
                        optionFilterProp="children"
                    >
                        {productsData?.products.map((product: any) => (
                            <Option key={product.id} value={product.id}>{product.name} (Cost
                                Price: {product.costPrice})</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Table
                    columns={productColumns}
                    dataSource={selectedProducts}
                    rowKey="id"
                    pagination={false}
                    footer={() => <strong>Total Cost Price: {totalCost.toFixed(2)}</strong>}
                />

                <Form.Item label="Sale Price" name="salePrice"
                           rules={[{required: true, message: "Please input sale price!"}]}>
                    <InputNumber min={totalCost} placeholder="Enter sale price"
                                 onChange={(value) => form.setFieldsValue({profit: (value - totalCost).toFixed(2)})}/>
                </Form.Item>

                <Form.Item label="Profit" name="profit"
                           rules={[{required: true, message: "Profit will be calculated automatically."}]}>
                    <Input readOnly placeholder="Profit will be calculated automatically"/>
                </Form.Item>
            </Form>
        </ModalPage>
    );
}
