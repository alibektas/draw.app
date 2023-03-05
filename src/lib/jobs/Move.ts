
import type { Prop, Visual } from "$lib/wrapper/Base.js";
import { ObjectJob } from './Job.js';

export class ParentJob extends ObjectJob {
	_from: Prop | Visual | null;
	_to: typeof this._from;

	/**
	 * Move an object from one parent to another.
	 * `from` and `to` can be null, in which case the object is added to or removed from the scene.
	 * @param o Object to move
	 * @param from the parent to move from
	 * @param to  the parent to move to
	 */
	constructor(o: Prop | Visual, from: Prop | Visual | null, to: Prop | Visual | null) {
		super(o);
		this._from = from;
		this._to = to;
	}

	override inverse(): ParentJob {
		return new ParentJob(this._object, this._to, this._from);
	}
}

export class CreateJob extends ParentJob {
	override _from: null;

	/**
	 *
	 */
	constructor(o: Prop | Visual , parent: Prop | Visual  | null) {
		super(o, null, parent);
		this._from = null;
		this._to = parent;
	}

	override inverse(): ParentJob {
		return new ParentJob(this._object, this._to, window.graveyard);
	}
}
