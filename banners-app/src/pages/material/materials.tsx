import {Button, Input, message, Modal, Pagination, Select, Skeleton, Table, TableProps} from "antd";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import {useDeleteMaterialMutation, useGetAllMaterialsQuery} from "../../store/material/material.api";
import {useState} from "react";
import {Config} from "../../config";
import {MeasurementUnit} from "../../common/Measurement/MeasurementUnit.enum";

const {Option} = Select;
const pageSize = Config.ITEM_PER_PAGE;

export default function Materials() {
    const navigate = useNavigate();
    const {pageId} = useParams();
    const currentPage = pageId ? parseInt(pageId, 10) : 1;

    const [selectedSortUnit, setSelectedSortUnit] = useState<string | undefined>(undefined);
    const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);


    const {data, isLoading} = useGetAllMaterialsQuery({
        skip: pageSize * (currentPage - 1),
        take: pageSize,
        measurementUnit: selectedSortUnit,
        search: searchQuery,
        sortField: selectedSortUnit ? 'measurementUnit' : undefined,
        sortOrder: 'ASC',
    });


    const [deleteMaterial] = useDeleteMaterialMutation();
    const materials = data?.materials || [];
    const count = data?.total || 0;

    const handleEdit = (id: number) => {
        navigate(`/materials/${id}/edit`);
    };

    const handleDelete = async (id: number) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            content: 'Are you sure you want to delete this Material?',
            okText: 'Yes',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await deleteMaterial({id}).unwrap();
                    message.success('Material deleted successfully');
                } catch (error) {
                    message.error('Failed to delete Material');
                }
            },
        });
    };

    const onPageChange = (page: number) => {
        navigate('/materials/page/' + page);
    };

    const handleSortChange = (value: string) => {
        setSelectedSortUnit(value);
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
            title: 'Measurement Unit',
            dataIndex: 'measurementUnit',
            key: 'measurementUnit',
        },
        {
            title: 'Price Per Unit',
            dataIndex: 'pricePerUnit',
            key: 'pricePerUnit',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
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
            <Select
                style={{width: 200, marginBottom: 16}}
                placeholder="Sort by Measurement Unit"
                onChange={handleSortChange}
                allowClear
            >
                {Object.values(MeasurementUnit).map((unit) => (
                    <Option key={unit} value={unit}>
                        {unit}
                    </Option>
                ))}
            </Select>

            <Input
                placeholder="Search by Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={() => {
                }}
                style={{width: 200, marginBottom: 16}}
            />


            <Table
                columns={columns}
                loading={isLoading}
                pagination={false}
                dataSource={materials.map((record) => ({...record, key: record.id}))}
            />

            <Button type="primary" htmlType="submit">
                <Link to="create">Add Material</Link>
            </Button>

            <div className="mt-6">
                <Pagination
                    align="center"
                    onChange={onPageChange}
                    defaultPageSize={pageSize}
                    current={currentPage}
                    total={count}
                />
            </div>
            <Outlet/>
        </Skeleton>
    );
}
