import {Modal, ModalProps} from "antd";
import {ReactNode} from "react";
import {useNavigate} from "react-router-dom";


export default function ModalPage({title, children, backUrl, onOk, onCancel, ...props}: {
	title: string,
	backUrl: string,
	onOk?: () => void,
	onCancel?: () => void,
	children: ReactNode
} & ModalProps) {

	const navigate = useNavigate();

	const handleCancel = () => {
		onCancel ? onCancel() : navigate(backUrl);
	}

	return (
			<Modal title={title} open={true} onOk={() => onOk ? onOk() : navigate(backUrl)}
						 onCancel={handleCancel} {...props}>
				{children}
			</Modal>)
}
