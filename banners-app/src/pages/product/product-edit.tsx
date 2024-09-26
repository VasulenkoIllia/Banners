import {Button, Form, Input, message, Modal, Select, Skeleton, Table} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useGetProductByIdQuery, useUpdateProductMutation} from "../../store/product/product.api";
import {useGetAllMaterialsQuery} from "../../store/material/material.api";
import {useEffect, useState} from "react";
import ModalPage from "../../components/modalPage";

const {Option} = Select;

export default function ProductEdit() {
    const {id} = useParams();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {data: product, isLoading} = useGetProductByIdQuery(id);
    const [updateProduct] = useUpdateProductMutation();
    const {data: materialsData, isLoading: materialsLoading} = useGetAllMaterialsQuery();

    const [selectedMaterials, setSelectedMaterials] = useState<any[]>([]);
    const [newMaterials, setNewMaterials] = useState<any[]>([]);
    const [removedMaterials, setRemovedMaterials] = useState<number[]>([]);
    const [totalCost, setTotalCost] = useState<number>(0);

    useEffect(() => {
        if (product?.productMaterials) {
            setSelectedMaterials(
                product.productMaterials
                    .map((pm) => {
                        if (pm.material) {
                            return {
                                id: pm.material.id,
                                materialId: pm.material.id,
                                name: pm.material.name,
                                pricePerUnit: pm.material.pricePerUnit,
                                quantity: pm.quantity,
                            };
                        }
                        return null;
                    })
                    .filter(Boolean)
            );
        }
    }, [product]);

    useEffect(() => {
        const newTotalCost = calculateTotalCost();
        setTotalCost(newTotalCost);
    }, [selectedMaterials, newMaterials]);

    const calculateTotalCost = () => {
        const existingMaterialsCost = selectedMaterials.reduce(
            (total, material) => total + material.pricePerUnit * material.quantity,
            0
        );
        const newMaterialsCost = newMaterials.reduce(
            (total, material) => total + material.pricePerUnit * material.quantity,
            0
        );
        return existingMaterialsCost + newMaterialsCost;
    };

    const handleAddMaterial = (materialId: number) => {
        const material = materialsData?.materials.find((m: any) => m.id === materialId);

        if (material) {
            const existingNewMaterial = newMaterials.find((m) => m.id === materialId);
            if (existingNewMaterial) {
                setNewMaterials((prevMaterials) =>
                    prevMaterials.map((m) => (m.id === materialId ? {...m, quantity: m.quantity + 1} : m))
                );
            } else {
                setNewMaterials((prevMaterials) => [
                    ...prevMaterials,
                    {
                        materialId: material.id,
                        name: material.name,
                        pricePerUnit: material.pricePerUnit,
                        quantity: 1,
                    },
                ]);
            }
        }
    };

    const handleUpdateQuantity = (materialId: number, quantity: number, isNew: boolean = false) => {
        if (isNew) {
            setNewMaterials((prevMaterials) =>
                prevMaterials.map((m) => (m.materialId === materialId ? {...m, quantity} : m))
            );
        } else {
            setSelectedMaterials((prevMaterials) =>
                prevMaterials.map((m) => (m.materialId === materialId ? {...m, quantity} : m))
            );
        }
    };

    const handleRemoveMaterial = (materialId: number, isNew: boolean = false) => {
        if (isNew) {
            setNewMaterials((prevMaterials) => prevMaterials.filter((m) => m.materialId !== materialId));
        } else {
            setRemovedMaterials((prevRemoved) => [...prevRemoved, materialId]);
            setSelectedMaterials((prevMaterials) => prevMaterials.filter((m) => m.materialId !== materialId));
        }
    };

    const handleFormSubmit = async (values: any) => {
        try {
            const productData = {
                ...values,
                productMaterials: [
                    ...selectedMaterials.map((material) => ({
                        materialId: material.materialId,
                        quantity: material.quantity,
                    })),
                    ...newMaterials.map((material) => ({
                        materialId: material.materialId,
                        quantity: material.quantity,
                    })),
                ],
                removedMaterials,
            };

            await updateProduct({id, ...productData}).unwrap();

            message.success("Product successfully updated!");
            navigate("/products");
        } catch (error) {
            message.error("Failed to update product.");
        }
    };

    const confirmSubmit = () => {
        Modal.confirm({
            title: "Are you sure you want to update this product?",
            content: "This action will save the changes you made.",
            okText: "Yes",
            cancelText: "No",
            onOk: () => form.submit(),
        });
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
            render: (text, record) => (
                <Input
                    type="number"
                    value={record.quantity}
                    onChange={(e) => handleUpdateQuantity(record.materialId, Number(e.target.value), record.isNew)}
                    min={1}
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
                <Button danger onClick={() => handleRemoveMaterial(record.materialId, record.isNew)}>
                    Remove
                </Button>
            ),
        },
    ];

    return (
        <ModalPage title={"Edit Product"} onOk={confirmSubmit} backUrl={`/products/`}>
            <Skeleton loading={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        name: product?.name,
                        description: product?.description,
                        costPrice: product?.costPrice,
                        salePrice: product?.salePrice,
                    }}
                    onFinish={handleFormSubmit}
                >
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
                        <Input value={totalCost.toFixed(2)} readOnly/>
                    </Form.Item>

                    <h3>Materials</h3>
                    <Form.Item label="Select Material">
                        <Select
                            placeholder="Select material"
                            loading={materialsLoading}
                            onChange={(materialId) => handleAddMaterial(materialId, 1)}
                            showSearch
                            optionFilterProp="children"
                            value={newMaterials.length ? newMaterials.map((m) => m.materialId) : undefined} // Ensure correct value
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
                        dataSource={[
                            ...selectedMaterials.map((m, index) => ({
                                ...m,
                                isNew: false,
                                key: `selected-${m.materialId}-${index}`
                            })),
                            ...newMaterials.map((m, index) => ({
                                ...m,
                                isNew: true,
                                key: `new-${m.materialId}-${index}`
                            }))
                        ]}
                        pagination={false}
                        footer={() => <strong>Total Cost: {totalCost.toFixed(2)}</strong>}
                    />

                </Form>
            </Skeleton>
        </ModalPage>
    );
}
