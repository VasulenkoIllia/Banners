import {Button, Input, message, Modal, Pagination, Skeleton, Table, TableProps} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDeleteProductMutation, useGetAllProductsQuery} from "../../store/product/product.api";
import {useEffect, useState} from "react";
import {Config} from "../../config";

const pageSize = Config.ITEM_PER_PAGE;

export default function Products() {
    const navigate = useNavigate();
    const {pageId} = useParams();
    const currentPage = pageId ? parseInt(pageId, 10) : 1;

    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);
    const [sortField] = useState<string | undefined>(undefined);
    const [sortOrder] = useState<'ascend' | 'descend' | undefined>(undefined);

    const {data, isLoading, refetch} = useGetAllProductsQuery({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        name: searchQuery,
        sortField,
        sortOrder,
    });

    const [deleteProduct] = useDeleteProductMutation();
    const products = data?.products || [];
    const total = data?.total || 0;

    useEffect(() => {
        refetch();
    }, [searchQuery, sortField, sortOrder, currentPage]);

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
                    refetch(); // Refresh the product list after deletion
                } catch (error) {
                    message.error('Failed to delete product');
                }
            },
        });
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        navigate('/products/page/1');
    };

    const onPageChange = (page: number) => {
        navigate(`/products/page/${page}`);
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
            sorter: true,
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
                    placeholder="Search by Name"
                    value={searchQuery}
                    onChange={handleSearch}
                    style={{width: 200, marginRight: 10}}
                />
                <Button type="primary">
                    <Link to="/products/create">Create Product</Link>
                </Button>
            </div>

            <Table
                columns={columns}
                loading={isLoading}
                pagination={false}
                dataSource={products.map((record) => ({...record, key: record.id}))}
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
