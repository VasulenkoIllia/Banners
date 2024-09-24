import {Button, Card, Form, Input, notification} from "antd";
import {useTranslation} from "react-i18next";
import {useGetMeQuery, useLoginMutation} from "../../store/user/user.api.ts";
import {useEffect} from "react";


export default function Login() {
	const {data: user, refetch,} = useGetMeQuery(null)

	const {t} = useTranslation();
	const [api, contextHolder] = notification.useNotification();

	const [login, {isLoading, data, error}] = useLoginMutation()

	const onFinish = (values: any) => {
		login(values);
	};

	useEffect(() => {
		if (error) {
			api.error({
				message: t`auth-error`,
				description: t`user-not-found`
			});
		}
		if (data) {
			console.log(data);
			localStorage.setItem('token', data.accessToken)
			refetch()
		}
	}, [data, error]);
	return (
			<div className={'flex w-full pt-20 align-items-center justify-center'}>
				<Card>
					<Form
							className={'w-full'}
							layout={'vertical'}
							onFinish={onFinish}
							autoComplete="on"
							style={{maxWidth: 800}}
					>
						<Form.Item
								className={'w-full'}
								label={t("Username")}
								name="login"
								rules={[{ required: true, message: 'Please input your username!' }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
								label={t("Password")}
								name="password"
								rules={[{ required: true, message: 'Please input your password!' }]}
						>
							<Input.Password />
						</Form.Item>


						<Form.Item >
							<Button type="primary" htmlType="submit" loading={isLoading}>
								{t`Login`}
							</Button>
						</Form.Item>
					</Form>
				</Card>
				{contextHolder}
			</div>
	)

}
