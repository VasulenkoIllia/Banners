import {Col, Form, Input, Row, Skeleton} from "antd";
import {useNavigate, useParams} from "react-router-dom";
import {useGetExpenseByIdQuery} from "../../store/expense/expense.api";
import ModalPage from "../../components/modalPage";


export default function ExpenseInfo() {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {data: expenseData, isLoading: expenseLoading} = useGetExpenseByIdQuery(id);
    const [form] = Form.useForm();


    return (
        <ModalPage
            title="Expense Information"
            onOk={() => navigate(`/expenses/`)}
            backUrl={`/expenses/`}
        >
            <Skeleton loading={expenseLoading}>
                {expenseData ? (
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={expenseData}
                    >
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Name"
                                    name="name"
                                >
                                    <Input value={expenseData?.name} readOnly/>
                                </Form.Item>
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                >
                                    <Input value={expenseData?.description || "No description provided"} readOnly/>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Amount"
                                    name="amount"
                                >
                                    <Input value={expenseData?.amount} readOnly/>
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                ) : (
                    <p>No expense data found</p>
                )}
            </Skeleton>
        </ModalPage>
    );
}
