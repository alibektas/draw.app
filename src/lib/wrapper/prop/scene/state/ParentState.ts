import { groupSelector } from '$lib/stores/stores';
import type { Prop } from "$lib/wrapper/Base";
import { get } from 'svelte/store';
import { NullInnerStateError } from 'utils-ts';
import { ABCSceneState, type SceneStateInput } from './ABCSceneState';
import { SelectState } from './SelectState';

export class ParentState extends ABCSceneState {
	protected static override _instance: ParentState | null = null;

	static get instance(): ParentState {
		if (ParentState._instance === null) {
			ParentState._instance = new ParentState();
			return ParentState._instance;
		}

		return ParentState._instance;
	}

	constructor() {
		super('Parent');
	}

	override onEnter(inner: SceneStateInput): void {
		super.onEnter(inner);
		this.inner = inner;

		// The objects that are selected right before entering this state
		// need to be made invisible so that they are not selected.
		// Selecting an already selected object in this would otherwise
		// cause an error, since an object cannot be a child of itself.
		Object.values(get(groupSelector)).forEach((obj) => {
			obj.visible = false;
		});

		this.inner.scene.render();
	}

	override onPropSelected(obj: Prop): void {
		if (this.inner === null) throw new NullInnerStateError();
		const g = groupSelector;

		// obj.getWorldPosition(this.v2_buffer);
		// obj.getWorldQuaternion(this.q_buffer);

		Object.values(get(g)).forEach((child) => {

			obj.add(child);
		});

		SelectState.instance.onEnter(this.onExit());
	}

	override onExit(): SceneStateInput {
		if (this.inner === null) throw new NullInnerStateError();

		const scene_state_input: SceneStateInput = {
			scene: this.inner.scene
		};

		for (const child of Object.values(get(groupSelector))) {
			child.visible = true;
		}

		super.onExit();

		return scene_state_input;
	}

	override on_escape(e: Event): void {
		e.preventDefault();
		if (this.inner === null) throw new NullInnerStateError();
		SelectState.instance.onEnter(this.onExit());
	}
}
