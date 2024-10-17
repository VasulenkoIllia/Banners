import React, {useState} from 'react';
import {Card, Col, DatePicker, Row, Skeleton, Statistic, Table, Tabs} from 'antd';
import moment from 'moment';
import {useGetStatisticsQuery} from "../../store/statistic/statistic.api";

const {TabPane} = Tabs;
const {RangePicker} = DatePicker;

export const Dashboard = () => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const {data, error, isLoading} = useGetStatisticsQuery({
        startDate: startDate ? moment(startDate).format('YYYY-MM-DD') : undefined,
        endDate: endDate ? moment(endDate).format('YYYY-MM-DD') : undefined,
        sortField: 'createdAt',
        sortOrder: 'ASC',
    });

    const handleDateRangeChange = (dates: any) => {
        if (dates) {
            setStartDate(dates[0]);
            setEndDate(dates[1]);
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    };

    const orderColumns = [
        {title: 'Order ID', dataIndex: 'id', key: 'id'},
        {title: 'Customer', dataIndex: ['customer', 'name'], key: 'customer'},
        {title: 'Cost Price', dataIndex: 'costPrice', key: 'costPrice'},
        {title: 'Sale Price', dataIndex: 'salePrice', key: 'salePrice'},
        {title: 'Profit', dataIndex: 'profit', key: 'profit'},
        {
            title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => {
                let color = '';
                let statusText = '';

                switch (status) {
                    case 'ordered':
                        color = 'blue';
                        statusText = 'Ordered';
                        break;
                    case 'in progress':
                        color = 'orange';
                        statusText = 'In Progress';
                        break;
                    case 'completed':
                        color = 'green';
                        statusText = 'Completed';
                        break;
                    case 'cancellation':
                        color = 'red';
                        statusText = 'Cancelled';
                        break;
                    default:
                        color = 'gray';
                        statusText = 'Unknown';
                }

                return <span style={{color}}>{statusText}</span>;
            }
        },
    ];

    const materialColumns = [
        {title: 'Material Name', dataIndex: 'name', key: 'name'},
        {title: 'Quantity', dataIndex: 'quantity', key: 'quantity'},
        {title: 'Price per Unit', dataIndex: 'pricePerUnit', key: 'pricePerUnit'},
    ];

    const expenseColumns = [
        {title: 'Expense Name', dataIndex: 'name', key: 'name'},
        {title: 'Description', dataIndex: 'description', key: 'description'},
        {title: 'Amount', dataIndex: 'amount', key: 'amount'},
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => moment(date).format('YYYY-MM-DD')
        },
    ];

    return (
        <div>
            <RangePicker
                onChange={handleDateRangeChange}
                style={{marginBottom: 20}}
                defaultValue={[moment().startOf('year'), moment()]}
                ranges={{
                    'Today': [moment(), moment()],
                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                    'This Year': [moment().startOf('year'), moment().endOf('year')],
                }}
            />
            <Tabs defaultActiveKey="1">
                <TabPane tab="General statistics" key="1">
                    {isLoading ? (
                        <Skeleton active/>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <Row gutter={16}>
                            <Col span={8}>
                                <Card>
                                    <Statistic title="Total income" value={data.summary.totalProfit}
                                               precision={2}/>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic title="Total expenses" value={data.summary.totalExpenses}
                                               precision={2}/>
                                </Card>
                            </Col>
                            <Col span={8}>
                                <Card>
                                    <Statistic title="Net income" value={data.summary.netProfit} precision={2}/>
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card>
                                    <Statistic title="Total Orders" value={data.summary.totalOrders}/>
                                </Card>
                            </Col>
                            <Col span={5}>
                                <Card>
                                    <Statistic title="Completed" value={data.orders.totalCompletedOrders}
                                               valueStyle={{color: 'green'}}/>
                                </Card>
                            </Col>

                            <Col span={5}>
                                <Card>
                                    <Statistic title="Cancellation" value={data.orders.numberOfCancelledOrders}
                                               valueStyle={{color: 'red'}}/>
                                </Card>
                            </Col>

                            <Col span={4}>
                                <Card>
                                    <Statistic
                                        title={
                                            <span>
                                                <span className={`fi fi-ua`}/>
                                            </span>
                                        }
                                        value={data.summary.totalOrdersFromUA}
                                        valueStyle={{color: 'green'}}
                                    />
                                </Card>
                            </Col>
                            <Col span={4}>
                                <Card>
                                    <Statistic
                                        title={
                                            <span>
                                                <span className={`fi fi-eu`}/>
                                            </span>
                                        }
                                        value={data.summary.totalOrdersFromEU}
                                        valueStyle={{color: 'green'}}
                                    />
                                </Card>
                            </Col>


                            <Col span={8}>
                                <Card>
                                    <Statistic title="Total materials cost"
                                               value={data.materials.totalMaterialValue} precision={2}/>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </TabPane>

                <TabPane tab="Orders" key="2">
                    {isLoading ? (
                        <Skeleton active/>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <Table
                            columns={orderColumns}
                            dataSource={data.orders.orderList}
                            rowKey="id"
                            pagination={false}
                        />
                    )}
                </TabPane>

                <TabPane tab="Materials" key="3">
                    {isLoading ? (
                        <Skeleton active/>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <Table
                            columns={materialColumns}
                            dataSource={data.materials.materialList}
                            rowKey="id"
                            pagination={false}
                        />
                    )}
                </TabPane>

                <TabPane tab="Expenses" key="4">
                    {isLoading ? (
                        <Skeleton active/>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <Table
                            columns={expenseColumns}
                            dataSource={data.expenses.expenseList}
                            rowKey="id"
                            pagination={false}
                        />
                    )}
                </TabPane>
            </Tabs>
        </div>
    );
};
