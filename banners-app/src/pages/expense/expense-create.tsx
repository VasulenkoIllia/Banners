import {Form, Input, InputNumber, message} from "antd";
import {useNavigate} from "react-router-dom";
import {useCreateExpenseMutation} from "../../store/expense/expense.api";
import ModalPage from "../../components/modalPage";

export default function ExpenseCreate() {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [createExpense] = useCreateExpenseMutation();

    const handleFormSubmit = async (values: any) => {
        try {
            const expenseData = {
                ...values,
                amount: parseFloat(values.amount),
            };
            await createExpense(expenseData).unwrap();
            message.success("Expense successfully created!");
            navigate("/expenses");
        } catch (error) {
            message.error("Failed to create expense.");
        }
    };

    const confirmSubmit = () => {
        form.submit();
    };

    return (
        <ModalPage title="Create Expense" onOk={confirmSubmit} backUrl={`/expenses/`}>
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{required: true, message: "Please input expense name!"}]}
                >
                    <Input placeholder="Enter expense name"/>
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{required: true, message: "Please input expense description!"}]}
                >
                    <Input.TextArea placeholder="Enter expense description"/>
                </Form.Item>

                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{required: true, message: "Please input expense amount!"}]}
                >
                    <InputNumber
                        placeholder="Enter expense amount"
                        style={{width: "100%"}}
                        min={0}
                        step={0.01}
                        precision={2}
                    />
                </Form.Item>
            </Form>
        </ModalPage>
    );
}
