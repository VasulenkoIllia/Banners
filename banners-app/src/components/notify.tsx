import {notification} from "antd";
import {useNotify} from "../store/notify.state";
import {useEffect} from "react";


export default function Notify() {

	const [api, contextHolder] = notification.useNotification();
	const {type, title, message} = useNotify()

	useEffect(() => {
		console.log(notification);
		//@ts-ignore
		if (type !== null && api[type as string]) {
			//@ts-ignore
			api[type]({
				message: title,
				description: message
			})
		}
	}, [type]);

	return (
			<>
				{contextHolder}
			</>
	)

}
