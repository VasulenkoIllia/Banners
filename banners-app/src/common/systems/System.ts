import {IField} from "./field.ts";

export interface ISystem {

	name: string;
	key: string;

	getFields: () => IField[]

}
