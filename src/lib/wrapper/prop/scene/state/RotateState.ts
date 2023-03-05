import { groupSelector, lastKeyStroke } from '$lib/stores/stores';
import { get } from 'svelte/store';
import { NullInnerStateError } from 'utils-ts';
import { SelectState } from './SelectState';
import { TransformState } from './TransformState';
import { TranslateState } from "./TranslateState";

export class RotateState extends TransformState {
	protected static override _instance: RotateState | null = null;

	static get instance(): RotateState {
		if (RotateState._instance === null) {
			RotateState._instance = new RotateState();
			return RotateState._instance;
		}

		return RotateState._instance;
	}

	constructor() {
		super('Rotate');
	}

	override enableTransformControls() {
		super.enableTransformControls();

		if (this.inner === null) throw new NullInnerStateError();

		const g = Object.values(get(groupSelector));

		if (g.length === 0) {
			console.warn('Transform cannot be enabled as there are not any objects selected.');
			return;
		} else if (g.length > 1) {
			lastKeyStroke.set({ type: 'fail', text: 'Cannot rotate multiple objects.' });
			SelectState.instance.onEnter(this.onExit());
		} else {
			this.inner.scene.transformControls.attach(g[0]);
			this.inner.scene.transformControls.setMode('rotate');
			// We want to restrict the use of Z axis when it comes to rotation.
			// For this reason we will just deactivate transform control's z-axis gizmos.
			this.inner.scene.transformControls.showZ = false;
		}
	}

	override on_rotate(_e: Event): void {
		SelectState.instance.onEnter(this.onExit());
	}

	protected override on_translate(_e: Event): void {
		TranslateState.instance.onEnter(this.onExit());
	}
}
