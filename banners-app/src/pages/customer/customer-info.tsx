import {Col, Form, Input, Row, Table, Tabs, Typography} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useGetCustomerByIdQuery} from "../../store/customer/customer.api";
import ModalPage from "../../components/modalPage";

const {Text} = Typography;

const {TabPane} = Tabs;

export default function CustomerInfo() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {data: customerData, isLoading: customerLoading} = useGetCustomerByIdQuery(id);
    const [form] = Form.useForm();
    const ordersData = customerData?.orders;
    console.log(ordersData)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    const orderColumns = [
        {
            title: 'Order ID', dataIndex: 'id', key: 'id',
            render: (_, record) => (
                <Link to={`/orders/${record.id}/info`}>
                    Id
                </Link>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (_, record) => (
                <>
                    <Link to={`/orders/${record.id}/info`}>
                        <Text ellipsis style={{width: 100}}>
                            {record.description}
                        </Text>
                    </Link>
                </>
            ),
        },
        {title: 'Status', dataIndex: 'status', key: 'status'},
        {
            title: 'Completion Date',
            dataIndex: 'completionDate',
            key: 'completionDate',
            render: (dateString) => formatDate(dateString),
        },
        {title: 'Total Price', dataIndex: 'salePrice', key: 'salePrice'},
    ];


    return (
        <ModalPage
            title="Customer Information"
            onOk={() => navigate(`/customers/`)}
            backUrl={`/customers/`}
        >
            <Tabs defaultActiveKey="1">
                <TabPane tab="Customer Info" key="1">
                    {customerLoading ? (
                        <p>Loading customer details...</p>
                    ) : (
                        <Form
                            form={form}
                            layout="vertical"
                            initialValues={customerData}
                        >
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Name"
                                        name="name"
                                    >
                                        <Input value={customerData?.name} readOnly/>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Address"
                                        name="address"
                                    >
                                        <Input value={customerData?.address} readOnly/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Phone"
                                        name="phone"
                                    >
                                        <Input value={customerData?.phone} readOnly/>
                                    </Form.Item>
                                </Col>

                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Instagram"
                                        name="instagram"
                                    >
                                        <Input value={customerData?.instagram || "Not provided"} readOnly/>
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <Form.Item
                                        label="Etsy"
                                        name="etsy"
                                    >
                                        <Input value={customerData?.etsy || "Not provided"} readOnly/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </TabPane>

                <TabPane tab="Customer Orders" key="2">

                    <Table
                        columns={orderColumns}
                        dataSource={ordersData}
                        rowKey="id"
                        pagination={false}
                    />

                </TabPane>
            </Tabs>
        </ModalPage>
    );
}
