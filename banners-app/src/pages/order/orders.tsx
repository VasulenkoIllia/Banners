import {Button, Input, message, Modal, Pagination, Skeleton, Table, TableProps} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDeleteOrderMutation, useGetAllOrdersQuery} from "../../store/order/order.api";
import {useEffect, useState} from "react";
import {Config} from "../../config";

const pageSize = Config.ITEM_PER_PAGE;

export default function Orders() {
    const navigate = useNavigate();
    const {pageId} = useParams();
    const currentPage = pageId ? parseInt(pageId, 10) : 1;

    const [customerQuery, setCustomerQuery] = useState<string | undefined>(undefined);
    const [sortField, setSortField] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>(undefined);

    const {data, isLoading, refetch} = useGetAllOrdersQuery({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        customer: customerQuery,
        sortField,
        sortOrder,
    });

    const [deleteOrder] = useDeleteOrderMutation();

    const orders = data?.orders || [];
    const total = data?.total || 0;

    useEffect(() => {
        refetch();
    }, [customerQuery, sortField, sortOrder, currentPage]);

    const handleEdit = (id: number) => {
        navigate(`/orders/${id}/edit`);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this order?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteOrder(id).unwrap();
                    message.success('Order deleted successfully');
                    refetch();
                } catch (error) {
                    message.error('Failed to delete order');
                }
            },
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomerQuery(e.target.value);
        navigate('/orders/page/1');
    };

    const onPageChange = (page: number) => {
        navigate(`/orders/page/${page}`);
    };

    const handleTableChange: TableProps<any>['onChange'] = (pagination, filters, sorter) => {
        const {field, order} = sorter;

        const sortField = field;
        const sortOrder = order === 'ascend' ? 'ASC' : order === 'descend' ? 'DESC' : undefined;

        setSortField(sortField);
        setSortOrder(sortOrder);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    const isDatePast = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        return date < today;
    };

    const columns: TableProps['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            render: (status: string) => {
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
            },
        },

        {
            title: 'Cost Price',
            dataIndex: 'costPrice',
            key: 'costPrice',
            sorter: true,
        },
        {
            title: 'Sale Price',
            dataIndex: 'salePrice',
            key: 'salePrice',
            sorter: true,
        },
        {
            title: 'Profit',
            dataIndex: 'profit',
            key: 'profit',
            sorter: true,
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Completion Date',
            dataIndex: 'completionDate',
            key: 'completionDate',
            sorter: true,
            render: (completionDate: string) => {
                const formattedDate = formatDate(completionDate);
                const color = isDatePast(completionDate) ? 'red' : 'green';
                return <span style={{color}}>{formattedDate}</span>;
            },
        },
        {
            title: 'Customer',
            dataIndex: ['customer', 'name'],
            key: 'customer',
            render: (_, record) => (
                <Link to={`/customers/${record.customer.id}/info`}>
                    {record.customer.name}
                </Link>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        onClick={() => handleEdit(record.id)}
                        style={{marginRight: 8}}
                    >
                        Edit
                    </Button>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Skeleton loading={isLoading}>
            <div style={{marginBottom: 16}}>
                <Input
                    placeholder="Search by Customer"
                    value={customerQuery}
                    onChange={handleSearch}
                    style={{width: 200, marginRight: 10}}
                />
                <Button type="primary">
                    <Link to="/orders/create">Create Order</Link>
                </Button>
            </div>

            <Table
                columns={columns}
                loading={isLoading}
                pagination={false}
                dataSource={orders.map((record) => ({...record, key: record.id}))}
                onChange={handleTableChange}
            />

            <div className="mt-6">
                <Pagination
                    current={currentPage}
                    align="center"
                    pageSize={pageSize}
                    total={total}
                    onChange={onPageChange}
                />
            </div>
        </Skeleton>
    );
}
