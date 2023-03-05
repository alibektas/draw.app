import type { Job } from './Job';
import type { JobGroup } from './JobGroup';

export class JobStack {
	private stack: Array<Job | JobGroup>;
	private capacity: number;
	private count: number;

	/**
	 *
	 */
	constructor() {
		this.capacity = 50;
		this.count = 0;
		this.stack = [];
	}

	push(j: Job | JobGroup) {
		this.count += 1; //update count
		if (this.count === this.capacity) {
			this.stack.shift();
			if (this.stack === undefined) {
				throw new Error('There is something completely wrong.');
			} else {
				this.count -= 1;
			}
		}

		this.stack.push(j);
		this.count += 1;
	}

	pop(): Job | JobGroup | undefined {
		const elem = this.stack.pop();

		if (elem !== undefined) {
			this.count -= 1; // update count
		}

		return elem;
	}
}
