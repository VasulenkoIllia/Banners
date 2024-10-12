import {Col, Form, Input, message, Modal, Row, Select, Skeleton} from "antd";
import {useNavigate} from "react-router-dom";
import {useGetAllMaterialsQuery, useUpdateMaterialQuantityMutation} from "../../store/material/material.api";
import {useState} from "react";
import ModalPage from "../../components/modalPage";

const {Option} = Select;

export default function AddMaterialQuantity() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [updateMaterial] = useUpdateMaterialQuantityMutation();
    const {data, isLoading} = useGetAllMaterialsQuery({});
    const materials = data?.materials || [];

    const [selectedMaterial, setSelectedMaterial] = useState<any | undefined>(undefined);
    const [addQuantity, setAddQuantity] = useState<number | undefined>(undefined);
    const [newPrice, setNewPrice] = useState<number | undefined>(undefined);
    const [totalSum, setTotalSum] = useState<number | undefined>(undefined);

    const handleMaterialSelect = (materialId: number) => {
        const selected = materials.find((material) => material.id === materialId);
        setSelectedMaterial(selected);

        if (selected) {
            setNewPrice(selected.pricePerUnit);
            setAddQuantity(undefined);
            setTotalSum(undefined);
            form.setFieldsValue({
                newPrice: selected.pricePerUnit,
                addQuantity: undefined,
                totalSum: undefined
            });
        }
    };
    const handleQuantityChange = (value: number) => {
        setAddQuantity(value);

        if (newPrice !== undefined && newPrice > 0) {
            const calculatedSum = value * newPrice;
            setTotalSum(calculatedSum);
            form.setFieldsValue({totalSum: calculatedSum.toFixed(2)});
        } else if (totalSum !== undefined && totalSum > 0) {
            const calculatedPrice = totalSum / value;
            setNewPrice(calculatedPrice);
            form.setFieldsValue({newPrice: calculatedPrice.toFixed(2)});
        }
    };

    const handlePriceChange = (value: number) => {
        setNewPrice(value);

        if (addQuantity !== undefined && addQuantity > 0) {
            const calculatedSum = value * addQuantity;
            setTotalSum(calculatedSum);
            form.setFieldsValue({totalSum: calculatedSum.toFixed(2)});
        } else if (totalSum !== undefined && totalSum > 0) {
            const calculatedQuantity = totalSum / value;
            setAddQuantity(calculatedQuantity);
            form.setFieldsValue({addQuantity: calculatedQuantity.toFixed(2)});
        }
    };

    const handleSumChange = (value: number) => {
        setTotalSum(value);

        if (newPrice !== undefined && newPrice > 0) {
            const calculatedQuantity = value / newPrice;
            setAddQuantity(calculatedQuantity);
            form.setFieldsValue({addQuantity: calculatedQuantity.toFixed(2)});
        } else if (addQuantity !== undefined && addQuantity > 0) {
            const calculatedPrice = value / addQuantity;
            setNewPrice(calculatedPrice);
            form.setFieldsValue({newPrice: calculatedPrice.toFixed(2)});
        }
    };


    const handleFormSubmit = async () => {
        try {
            const values = form.getFieldsValue();

            if (!selectedMaterial || !addQuantity || !newPrice) {
                message.error("Please select a material and fill out the quantity and price.");
                return;
            }

            const result = await updateMaterial({
                id: selectedMaterial.id,
                quantity: +values.addQuantity,
                pricePerUnit: +values.newPrice,
            }).unwrap();

            if (result) {
                message.success('Material quantity successfully updated!');
                navigate(-1);
            } else {
                message.error('Failed to update material.');
            }
        } catch (error) {
            message.error('Error updating material.');
        }
    };

    const confirmSubmit = () => {
        Modal.confirm({
            title: 'Are you sure you want to update this material?',
            content: 'This action will update the material with the new values.',
            okText: 'Yes',
            cancelText: 'No',
            onOk: () => form.submit(),
        });
    };

    return (
        <ModalPage
            title="Add Material Quantity"
            onOk={confirmSubmit}
            backUrl="/materials"
        >
            <Skeleton loading={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Row gutter={24}>
                        <Col span={16}>
                            <Form.Item label="Select Material" required>
                                <Select
                                    style={{width: 300}}
                                    placeholder="Select a material"
                                    onChange={handleMaterialSelect}
                                    value={selectedMaterial?.id}
                                    optionLabelProp="label"
                                >
                                    {materials.map((material) => (
                                        <Option
                                            key={material.id}
                                            value={material.id}
                                            label={`${material.name} (${material.measurementUnit})`}
                                        >
                                            {material.name} ({material.measurementUnit})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Quantity to Add"
                                name="addQuantity"
                                rules={[{required: true, message: 'Please enter quantity to add'}]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter quantity to add"
                                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                                    value={addQuantity}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="New Price (if higher)"
                                name="newPrice"
                                rules={[{required: true, message: 'Please enter new price'}]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter new price"
                                    onChange={(e) => handlePriceChange(Number(e.target.value))}
                                    value={newPrice}
                                />
                            </Form.Item>
                        </Col>

                        <Col span={12}>
                            <Form.Item
                                label="Total Sum (Quantity * Price)"
                                name="totalSum"
                            >
                                <Input
                                    type="number"
                                    placeholder="Total sum"
                                    value={totalSum}
                                    onChange={(e) => handleSumChange(Number(e.target.value))}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Skeleton>
        </ModalPage>
    );
}
