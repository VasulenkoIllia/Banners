import {notification} from "antd";
import {useNotify} from "../store/notify.state";
import {useEffect} from "react";
import type {ArgsProps} from 'antd/lib/notification';

export default function Notify() {
    const [api, contextHolder] = notification.useNotification();
    const {type, title, message} = useNotify();

    useEffect(() => {
        if (type && api[type as keyof typeof api]) {
            const args: ArgsProps = {
                message: title,
                description: message,
                placement: 'topRight',
            };

            const notificationFn = api[type as keyof typeof api] as (args: ArgsProps) => void;

            notificationFn(args);
        }
    }, [type, title, message, api]);

    return <>{contextHolder}</>;
}
