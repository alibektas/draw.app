
import { NullInnerStateError } from 'utils-ts';
import type { TransformControls } from "../../../visual/Visual";
import { ABCSceneState, type SceneStateInput } from './ABCSceneState';
import { SelectState } from './SelectState';

export type TransformSubStates = 'Translate' | 'Rotate';
export abstract class TransformState extends ABCSceneState {
	protected override inner: SceneStateInput | null = null;

	/**
	 *
	 */
	constructor(protected override state_name: TransformSubStates) {
		super(state_name);
	}

	override onEnter(inner: SceneStateInput): void {
		super.onEnter(inner);
		this.inner = inner;
		this.enableTransformControls();
	}

	override onExit(): SceneStateInput {
		if (this.inner === null) throw new NullInnerStateError();

		this.disableTransformControls();
		return super.onExit();
	}

	override on_escape(e: Event): void {
		e.preventDefault();
		if (this.inner === null) throw new NullInnerStateError();
		SelectState.instance.onEnter(this.onExit());
	}

	transform_controls_on_change(
		event: THREE.Event & { type: string } & { target?: TransformControls }
	) {
		const o = event.target.object; // Get the target object. Do the type casting.
		if (o === undefined) return;
		o.userData['wrapper'].onMove();
	}

	enableTransformControls() {
		if (this.inner === null) throw new NullInnerStateError();

		this.inner.scene.transformControls.addEventListener(
			'change',
			this.transform_controls_on_change
		);
		this.inner.scene.transformControls.enabled = true;
		this.inner.scene.transformControls.visible = true;
		this.inner.scene.orbitControls.enabled = false;
	}

	disableTransformControls() {
		if (this.inner === null) throw new NullInnerStateError();
		this.inner.scene.transformControls.detach();
		this.inner.scene.transformControls.enabled = false;
		this.inner.scene.transformControls.removeEventListener(
			'change',
			this.transform_controls_on_change
		);
		this.inner.scene.orbitControls.enabled = true;
		this.inner.scene.transformControls.showZ = true;
		this.inner.scene.transformControls.visible = false;
	}

	protected override onNoPropSelected(): void {
		if (this.inner?.scene.transformControls.dragging) {
			return;
		}

		super.onNoPropSelected();
	}
}
