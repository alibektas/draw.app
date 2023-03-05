import { ABCSceneState } from './ABCSceneState';

export class ExplodeState extends ABCSceneState {
	static get instance(): ExplodeState {
		if (ExplodeState._instance === null) {
			ExplodeState._instance = new ExplodeState();
			return ExplodeState._instance;
		}

		return ExplodeState._instance;
	}

	/**
	 *
	 */
	private constructor() {
		super('Explode');
	}
}
