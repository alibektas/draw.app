

import type { Prop, Visual } from "$lib/wrapper/Base";
import { Job, ObjectJob } from './Job';

export class HideJob extends ObjectJob {
	override _object: Prop | Visual;

	constructor(o: Prop | Visual) {
		super(o);
		this._object = o;
	}

	override inverse(): Job {
		return new UnhideJob(this._object);
	}
}

export class UnhideJob extends ObjectJob {
	override _object: Prop | Visual;

	constructor(o: Prop | Visual) {
		super(o);
		this._object = o;
	}

	override inverse(): Job {
		return new HideJob(this._object);
	}
}
