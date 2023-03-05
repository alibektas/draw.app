import { ABCSceneState } from './ABCSceneState';

export class UnlinkState extends ABCSceneState {
	static get instance(): UnlinkState {
		if (UnlinkState._instance === null) {
			UnlinkState._instance = new UnlinkState();
			return UnlinkState._instance;
		}

		return UnlinkState._instance;
	}

	/**
	 *
	 */
	constructor() {
		super('Unlink');
	}
}
