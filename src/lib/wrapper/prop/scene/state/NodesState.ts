import { ABCSceneState } from './ABCSceneState';

export class NodesState extends ABCSceneState {
	protected static override _instance: NodesState | null = null;

	static get instance(): NodesState {
		if (NodesState._instance === null) {
			NodesState._instance = new NodesState();
			return NodesState._instance;
		}

		return NodesState._instance;
	}

	/**
	 *
	 */
	constructor() {
		super('Nodes');
	}
}
