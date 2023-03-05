import { groupSelector, lastKeyStroke } from '$lib/stores/stores';
import { get } from 'svelte/store';
import { NullInnerStateError } from 'utils-ts';
import { RotateState } from "./RotateState";
import { SelectState } from './SelectState';
import { TransformState } from './TransformState';

export class TranslateState extends TransformState {
	protected static override _instance: TranslateState | null = null;

	static get instance(): TranslateState {
		if (TranslateState._instance === null) {
			TranslateState._instance = new TranslateState();
			return TranslateState._instance;
		}

		return TranslateState._instance;
	}

	constructor() {
		super('Translate');
	}

	override enableTransformControls() {
		super.enableTransformControls();

		if (this.inner === null) throw new NullInnerStateError();

		const g = Object.values(get(groupSelector));

		if (g.length === 0) {
			console.warn('Transform cannot be enabled as there are not any objects selected.');
			return;
		} else if (g.length === 1) {
			this.inner.scene.transformControls.attach(g[0]);
			this.inner.scene.transformControls.setMode('translate');
			this.inner.scene.transformControls.addEventListener(
				'change',
				this.transform_controls_on_change
			);
			this.inner.scene.transformControls.enabled = true;
			this.inner.scene.orbitControls.enabled = false;
			this.inner.scene.render();
		} else {
			lastKeyStroke.set({ type: 'fail', text: 'Transforming multiple object not allowed.' });
			SelectState.instance.onEnter(this.onExit());
		}
	}

	override on_translate(_e: Event): void {
		SelectState.instance.onEnter(this.onExit());
	}

	protected override on_rotate(_e: Event): void {
		RotateState.instance.onEnter(this.onExit());
	}
}
