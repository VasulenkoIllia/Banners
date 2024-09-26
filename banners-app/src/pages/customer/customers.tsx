import {Button, Input, message, Modal, Pagination, Skeleton, Table, TableProps} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDeleteCustomerMutation, useGetAllCustomersQuery} from "../../store/customer/customer.api";
import {useState} from "react";
import {Config} from "../../config";

const pageSize = Config.ITEM_PER_PAGE;

export default function Customers() {
    const navigate = useNavigate();
    const {pageId} = useParams();
    const currentPage = pageId ? parseInt(pageId, 10) : 1;

    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);


    const {data, isLoading} = useGetAllCustomersQuery({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        search: searchQuery,
    });

    const [deleteCustomer] = useDeleteCustomerMutation();
    const customers = data?.customers || [];
    const count = data?.total || 0;

    const handleEdit = (id: number) => {
        navigate(`/customers/${id}/edit`);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this customer?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteCustomer(id).unwrap();
                    message.success('Customer deleted successfully');
                } catch (error) {
                    message.error('Failed to delete customer');
                }
            },
        });
    };

    const onPageChange = (page: number) => {
        navigate('/customers/page/' + page);
    };

    const columns: TableProps['columns'] = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Instagram',
            dataIndex: 'instagram',
            key: 'instagram',
        },
        {
            title: 'Phone Number',
            dataIndex: 'phone',
            key: 'phone',
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
            <Input
                placeholder="Search by Name, Phone or Instagram"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{width: 300, marginBottom: 16}}
            />

            <Button type="primary" htmlType="submit"
                    style={{width: 150, marginLeft: 10}}>
                <Link className={'mr-2'} to={'/customers/create'}>{`Create Customer`}</Link>
            </Button>

            <Table
                columns={columns}
                loading={isLoading}
                pagination={false}
                dataSource={customers.map((record) => ({...record, key: record.id}))}
            />

            <div className="mt-6">
                <Pagination
                    align="center"
                    onChange={onPageChange}
                    defaultPageSize={pageSize}
                    current={currentPage}
                    total={count}
                />
            </div>
        </Skeleton>
    );
}
