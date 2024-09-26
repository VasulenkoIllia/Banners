import {Button, Input, message, Modal, Pagination, Skeleton, Table, TableProps} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDeleteProductMutation, useGetAllProductsQuery} from "../../store/product/product.api";
import {useState} from "react";
import {Config} from "../../config";

const pageSize = Config.ITEM_PER_PAGE;

export default function Products() {
    const navigate = useNavigate();
    const {pageId} = useParams();
    const currentPage = pageId ? parseInt(pageId, 10) : 1;

    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
    const [sortField, setSortField] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | undefined>(undefined);

    const {data, isLoading} = useGetAllProductsQuery({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        search: searchQuery,
        sortField,
        sortOrder,
    });

    const [deleteProduct] = useDeleteProductMutation();
    const products = data?.products || [];
    const count = data?.total || 0;

    const handleEdit = (id: number) => {
        navigate(`/products/${id}/edit`);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this product?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteProduct(id).unwrap();
                    message.success('Product deleted successfully');
                } catch (error) {
                    message.error('Failed to delete product');
                }
            },
        });
    };

    const onPageChange = (page: number) => {
        navigate('/products/page/' + page);
    };

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setSortField(sorter.field);
        setSortOrder(sorter.order);
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
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Cost Price',
            dataIndex: 'costPrice',
            key: 'costPrice',
            sorter: (a, b) => a.costPrice - b.costPrice,
        },
        {
            title: 'Sale Price',
            dataIndex: 'salePrice',
            key: 'salePrice',
            sorter: (a, b) => a.salePrice - b.salePrice,
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
                placeholder="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{width: 150, marginBottom: 16}}
            />

            <Button type="primary" htmlType="submit" style={{width: 150, marginLeft: 10}}>
                <Link className={'mr-2'} to={'/products/create'}>{`Create Product`}</Link>
            </Button>

            <Table
                columns={columns}
                loading={isLoading}
                pagination={false}
                dataSource={products.map((record) => ({...record, key: record.id}))}
                onChange={handleTableChange}
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
