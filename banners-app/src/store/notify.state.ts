import {create} from 'zustand';

interface NotificationState {
    type: string | null;
    title: string;
    message: string;
    notify: (type: string | null, data: { title: string; message: string }) => void;
}

export const useNotify = create<NotificationState>((set) => ({
    type: null,
    title: '',
    message: '',
    notify(type: string | null, data: { title: string; message: string }) {
        console.log(type, data);
        set(() => ({
            type: type,
            title: data.title,
            message: data.message,
        }));
    },
}));
