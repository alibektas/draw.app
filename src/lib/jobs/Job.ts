import type { Prop, Visual } from "$lib/wrapper/Base";



export abstract class Job {
	inverse(): Job {
		throw new Error('NotImplemented');
	}
}

export abstract class ObjectJob extends Job {
	_object: Prop | Visual ;

	get object(): Prop | Visual {
		return this.object;
	}

	/**
	 * A job that modifies an object.
	 * @param o The object to be modified.
	 */
	constructor(o: Prop | Visual) {
		super();
		this._object = o;
	}
}
