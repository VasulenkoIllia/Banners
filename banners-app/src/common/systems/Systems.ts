import {ISystem} from "./System.ts";
import {Stripe} from "./apis/stripe.ts";


export class Systems {


	private readonly systems: ISystem[] = [new Stripe];

	static instance: Systems;

	static setup() {
		if (!Systems.instance) {
			Systems.instance = new Systems();
		}

		return Systems.instance;
	}

	getAll() {
		return this.systems;
	}

	getByKey(key: string) {
		return this.systems.find(item => item.key === key)
	}

	getForSelect() {
		return this.systems.map(system => ({
			value: system.key,
			label: system.name
		}))
	}

}
