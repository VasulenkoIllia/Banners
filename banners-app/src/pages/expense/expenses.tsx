import {Button, Input, message, Modal, Pagination, Skeleton, Table, TableProps,} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDeleteExpenseMutation, useGetAllExpensesQuery} from "../../store/expense/expense.api";
import {useState} from "react";
import {Config} from "../../config";
import {formatDate} from "../../common/helpers/formatDate";

const pageSize = Config.ITEM_PER_PAGE;

export default function Expenses() {
    const navigate = useNavigate();
    const {pageId} = useParams();
    const currentPage = pageId ? parseInt(pageId, 10) : 1;

    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

    const {data, isLoading} = useGetAllExpensesQuery({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        search: searchQuery,
    });

    const [deleteExpense] = useDeleteExpenseMutation();
    const expenses = data?.expenses || [];
    const count = data?.total || 0;

    const handleInfo = (id: number) => {
        navigate(`/expenses/${id}/info`);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this expense?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteExpense(id).unwrap();
                    message.success('Expense deleted successfully');
                } catch (error) {
                    message.error('Failed to delete expense');
                }
            },
        });
    };

    const onPageChange = (page: number) => {
        navigate('/expenses/page/' + page);
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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: string) => {
                const formattedDate = formatDate(createdAt);
                return <span>{formattedDate}</span>;
            },
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <>
                    <Button
                        type="link"
                        danger
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                    <Button
                        type="link"
                        onClick={() => handleInfo(record.id)}
                        style={{marginRight: 8}}
                    >
                        Info
                    </Button>
                </>
            ),
        },
    ];

    return (
        <Skeleton loading={isLoading}>
            <Input
                placeholder="Search by Name or Description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{width: 300, marginBottom: 16}}
            />

            <Button type="primary" htmlType="submit" style={{width: 150, marginLeft: 10}}>
                <Link className={'mr-2'} to={'/expenses/create'}>{`Create Expense`}</Link>
            </Button>

            <Table
                columns={columns}
                loading={isLoading}
                pagination={false}
                dataSource={expenses.map((record) => ({...record, key: record.id}))}
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
