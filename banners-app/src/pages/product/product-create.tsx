import {useNavigate} from "react-router-dom";
import {Button, Form, Input, InputNumber, message, Modal, Select, Table} from "antd";
import {MinusCircleOutlined} from '@ant-design/icons';
import ModalPage from "../../components/modalPage";
import {useCreateProductMutation} from "../../store/product/product.api";
import {useGetAllMaterialsQuery} from "../../store/material/material.api";
import {useEffect, useState} from "react";

const {Option} = Select;

export default function ProductCreate() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [createProduct] = useCreateProductMutation();
    const {data: materialsData, isLoading: materialsLoading} = useGetAllMaterialsQuery();
    const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
    const [totalCost, setTotalCost] = useState<number>(0);

    useEffect(() => {
        const calculateTotalCost = () => {
            const total = selectedMaterials.reduce(
                (sum, material) => sum + material.pricePerUnit * material.quantity,
                0
            );
            setTotalCost(total);
            form.setFieldsValue({costPrice: total.toFixed(2)});
        };
        calculateTotalCost();
    }, [selectedMaterials, form]);

    const confirmSubmit = () => {
        Modal.confirm({
            title: "Are you sure you want to create this product?",
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
            const productData = {
                ...values,
                productMaterials: selectedMaterials.map((material) => ({
                    materialId: material.id,
                    quantity: material.quantity,
                })),
            };
            await createProduct(productData).unwrap();
            message.success("Product successfully created!");
            navigate("/products");
        } catch (error) {
            message.error("Failed to create product.");
        }
    };

    const handleAddMaterial = (materialId: number) => {
        const material = materialsData.materials.find((m: any) => m.id === materialId);

        if (selectedMaterials.find((m) => m.id === materialId)) {
            message.warning("Material has already been added.");
            return;
        }

        setSelectedMaterials((prev) => [...prev, {...material, quantity: 1}]);
    };

    const handleQuantityChange = (materialId: number, newQuantity: number) => {
        setSelectedMaterials((prev) =>
            prev.map((material) =>
                material.id === materialId ? {...material, quantity: newQuantity} : material
            )
        );
    };

    const handleRemoveMaterial = (materialId: number) => {
        setSelectedMaterials((prev) => prev.filter((material) => material.id !== materialId));
    };

    const columns = [
        {
            title: "Material",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            render: (text: any, record: any) => (
                <InputNumber
                    min={1}
                    value={record.quantity}
                    onChange={(value) => handleQuantityChange(record.id, value)}
                />
            ),
        },
        {
            title: "Price per Unit",
            dataIndex: "pricePerUnit",
            key: "pricePerUnit",
        },
        {
            title: "Total Cost",
            key: "totalCost",
            render: (_, record) => (record.pricePerUnit * record.quantity).toFixed(2),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button
                    icon={<MinusCircleOutlined style={{color: 'red'}}/>}
                    onClick={() => handleRemoveMaterial(record.id)}
                    type="text"
                />
            ),
        },
    ];

    return (
        <ModalPage
            title={"Create Product"}
            onOk={confirmSubmit}
            backUrl={`/products/`}
        >
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{required: true, message: "Please input product name!"}]}
                >
                    <Input placeholder="Enter product name"/>
                </Form.Item>

                <Form.Item
                    label="Product Description"
                    name="description"
                    rules={[{required: false, message: "Please input product description!"}]}
                >
                    <Input.TextArea placeholder="Enter product description"/>
                </Form.Item>

                <Form.Item
                    label="Sale Price"
                    name="salePrice"
                    rules={[{required: true, message: "Please input sale price!"}]}
                >
                    <Input type="number" placeholder="Enter sale price"/>
                </Form.Item>

                <Form.Item
                    label="Cost Price"
                    name="costPrice"
                    rules={[{required: true, message: "Cost price will be calculated automatically."}]}
                >
                    <Input type="number" placeholder="Cost price" readOnly/>
                </Form.Item>

                <h3>Materials</h3>
                <Form.Item label="Select Material">
                    <Select
                        showSearch
                        placeholder="Search material"
                        loading={materialsLoading}
                        onChange={handleAddMaterial}
                        optionFilterProp="children"
                    >
                        {materialsData?.materials.map((material: any) => (
                            <Option key={material.id} value={material.id}>
                                {material.name} (Price per unit: {material.pricePerUnit})
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Table
                    columns={columns}
                    dataSource={selectedMaterials}
                    rowKey="id"
                    pagination={false}
                    footer={() => <strong>Total Cost: {totalCost.toFixed(2)}</strong>}
                />
            </Form>
        </ModalPage>
    );
}
