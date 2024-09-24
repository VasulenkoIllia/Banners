

import { create } from 'zustand'

export const useNotify = create<any>((set) => ({
	type: null,
	title: '',
	message: '',
	notify (type: string | null, data: any) {
		console.log(type, data);
		set((state: any) => ({
			type: type,
			title: data.title,
			message: data.message
	}));
	}
}))
