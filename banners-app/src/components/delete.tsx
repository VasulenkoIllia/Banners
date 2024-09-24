import {Button, Modal} from "antd";
import {useTranslation} from "react-i18next";
import {ExclamationCircleFilled} from "@ant-design/icons";

const {confirm} = Modal;

export default function DeleteBtn({onDelete, description = ''}: { onDelete: Function, description?: string }) {
    const {t} = useTranslation();

    const onClick = () => {
        confirm({
            title: t('Are you sure delete this item?'),
            icon: <ExclamationCircleFilled/>,
            content: description,
            okText: t('Yes'),
            okType: 'danger',
            cancelText: t('No'),
            onOk() {
                onDelete()
            },
        });
    }

    return (
        <div className={'flex justify-end'}>
            <Button type={'link'} danger onClick={onClick}>{t`Delete`}</Button>

        </div>
    )

}
