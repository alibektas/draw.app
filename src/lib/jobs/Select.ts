
import type { Prop } from "$lib/wrapper/Base.js";
import { Job, ObjectJob } from './Job.js';

export class SelectJob extends ObjectJob {
	override _object: Prop;

	constructor(selected: Prop ) {
		super(selected);
		this._object = selected;
	}

	override inverse(): Job {
		return new DeselectJob(this._object);
	}
}

export class DeselectJob extends ObjectJob {
	override _object: Prop;

	constructor(selected: Prop) {
		super(selected);
		this._object = selected;
	}

	override inverse(): Job {
		return new SelectJob(this._object);
	}
}
