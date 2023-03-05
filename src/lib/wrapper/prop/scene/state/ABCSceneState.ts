/* eslint-disable @typescript-eslint/no-unused-vars */
import { lastKeyStroke, scene_state } from '$lib/stores/stores';
import { Prop , Visual  } from "$lib/wrapper/Base";
import { ComponentState } from 'component-utils-ts';
import type { Intersection } from 'three';
import type { Scene } from '../Scene';
import { SelectState } from './SelectState';

export type SceneStateInput = {
	scene: Scene;
};

export type SceneStateName =
	| 'Select'
	| 'Translate'
	| 'Link'
	| 'Unlink'
	| 'Rotate'
	| 'Parent'
	| 'Explode'
	| 'Nodes';

/**
 * Abstract Base Class for all scene states.
 */
export abstract class ABCSceneState extends ComponentState<SceneStateName, SceneStateInput> {
	protected static _instance: ABCSceneState | null = null;

	protected constructor(protected override state_name: SceneStateName) {
		super(state_name);

		this.keypress_events = [
			[
				'ctrl+r,cmd+r',
				this.state_name,
				(e) => {
					e.preventDefault();
				}
			],
			[
				'ctrl+shift+e,cmd+shift+e',
				this.state_name,
				(e) => {
					this.on_export(e);
				}
			],
			[
				'e',
				this.state_name,
				(e) => {
					this.on_explode(e);
				}
			],
			[
				't',
				this.state_name,
				(e) => {
					this.on_translate(e);
				}
			],
			[
				'p',
				this.state_name,
				(e) => {
					this.on_parent(e);
				}
			],
			[
				'cmd+a,ctrl+a',
				this.state_name,
				(e) => {
					e.preventDefault();
					this.on_select_all(e);
				}
			],
			[
				'cmd+g,ctrl+g',
				this.state_name,
				(e) => {
					e.preventDefault();
					this.on_group(e);
				}
			],
			[
				'cmd+i,ctrl+i',
				this.state_name,
				(e) => {
					this.on_inspect(e);
				}
			],
			[
				'cmd+h,ctrl+h',
				this.state_name,
				(e) => {
					this.on_hierarchy(e);
				}
			],
			[
				'cmd+Shift+g,ctrl+Shift+g',
				this.state_name,
				(e) => {
					e.preventDefault();
					this.on_ungroup(e);
				}
			],
			[
				'ctrl+p,cmd+p',
				this.state_name,
				(e) => {
					e.preventDefault();
					this.on_prefab_explorer(e);
				}
			],
			[
				'ctrl+shift+p,cmd+shift+p',
				this.state_name,
				(e) => {
					e.preventDefault();
					this.on_prefab(e);
				}
			],
			[
				'shift+l',
				this.state_name,
				(e) => {
					this.on_unlink(e);
				}
			],
			[
				'n',
				this.state_name,
				(e) => {
					this.on_nodes(e);
				}
			],
			[
				'l',
				this.state_name,
				(e) => {
					this.on_link(e);
				}
			],
			[
				'r',
				this.state_name,
				(e) => {
					this.on_rotate(e);
				}
			],
			[
				'cmd+m,ctrl+m',
				this.state_name,
				(e) => {
					e.preventDefault();
					this.on_create_module(e);
				}
			],
			[
				'shift+r',
				this.state_name,
				(e) => {
					e.preventDefault();
					this.on_create_row(e);
				}
			],
			[
				'shift+c',
				this.state_name,
				(e) => {
					e.preventDefault();
					this.on_create_corridor(e);
				}
			],
			[
				'cmd+k,ctrl+k',
				this.state_name,
				(e) => {
					e.preventDefault();
					this.on_create_address_sphere(e);
				}
			],
			[
				'y',
				this.state_name,
				(e) => {
					this.on_lock(e);
				}
			],
			[
				'cmd+shift+y,ctrl+shift+y',
				this.state_name,
				(e) => {
					this.on_unlock(e);
				}
			],
			[
				'ctrl+x, command+x',
				this.state_name,
				(e) => {
					this.on_cut(e);
				}
			],
			[
				'ctrl+c, command+c',
				this.state_name,
				(e) => {
					this.on_copy(e);
				}
			],
			[
				'ctrl+v , command+v',
				this.state_name,
				(e) => {
					console.log(`${this.state_name} Paste key combination pressed.`);
					this.on_paste(e);
				}
			],
			[
				'escape',
				this.state_name,
				(e) => {
					this.on_escape(e);
				}
			],
			[
				'backspace',
				this.state_name,
				(e) => {
					this.on_delete(e);
				}
			]
		];

		this.keypress_events.forEach((e) => {
			this.create_hotkey(e[0], e[2]);
		});
	}

	/**
	 * In order to access the elements like the scene object we provide them
	 * over the inner parameter. By doing so we can follow which state does what.
	 * @param inner The input to this state. One such input is the scene object.
	 *
	 */
	override onEnter(inner: SceneStateInput): void {
		super.onEnter(inner);
		scene_state.set(this.state_name);
	}

	/**
	 * Exit this state.
	 * @returns SceneStateInput that should be used by the next state
	 */
	override onExit(): SceneStateInput {
		lastKeyStroke.set({ type: 'success', text: `Exit ${this.name}.` });
		return super.onExit();
	}

	/**
	 * This function is called by the `ABCSceneState.__on_intersect` method every time an prop is clicked on.
	 * Every state can override this method to define what should happen when a prop is clicked on.
	 * For the strict opposite case ( where zero object is clicked on ), the `onNoPropSelected` method is called.
	 * @param _obj The object that is clicked on.
	 */
	protected onPropSelected( _obj: Prop ) {
		console.log(`[${this.state_name}] onPropSelected`);
	}

	/**
	 * Called when no object is selected even though
	 * StateMachine notifies others that there has been a touch event.
	 */
	protected onNoPropSelected() {
		console.log(`${this.state_name} No prop selected transition to SelectStata.instance`);
		SelectState.instance.onEnter(this.onExit());
	}

	private try_select(obj: Prop | Visual ): boolean {
		if (obj instanceof Prop ) {
			this.onPropSelected(obj);
		} 
		else if ( obj instanceof Visual ) {
			return false;
		}
		else {
			throw new Error("Impossible case. An prop's child cannot be of type " + typeof obj);
		}

		return true;
	}

	__on_intersects(intersects: Intersection<THREE.Object3D>[]): void {
		let anObjectSelected = false;

		for (const isect of intersects.map((i) => i.object)) {
			let child = isect;

			// eslint-disable-next-line no-constant-condition
			while (true) {
				if (child.userData['wrapper'] !== undefined) {
					const wr = child.userData['wrapper'] as Prop | Visual;
					const root = wr.root;
					console.log(`${this.state_name} onIntersects`);
					if (this.try_select(root)) anObjectSelected = true;
					break;
				} else if (child.parent === null) {
					break;
				} else {
					child = child.parent;
				}
			}
		}

		if (!anObjectSelected) {
			this.onNoPropSelected();
		}
	}

	protected on_explode(_e: Event): void {
		lastKeyStroke.set({ type: 'fail', text: 'E' });
	}

	protected on_translate(_e: Event): void {
		lastKeyStroke.set({ type: 'fail', text: 'T' });
	}

	protected on_parent(_e: Event): void {
		lastKeyStroke.set({ type: 'fail', text: 'P' });
	}
	protected on_unlink(_e: Event): void {
		lastKeyStroke.set({ type: 'fail', text: 'Shift+L unlink only in select mode.' });
	}

	protected on_nodes(_e: Event): void {
		lastKeyStroke.set({ type: 'fail', text: 'N' });
	}

	protected on_link(_e: Event): void {
		lastKeyStroke.set({ type: 'fail', text: 'L' });
	}
	protected on_rotate(_e: Event): void {
		lastKeyStroke.set({ type: 'fail', text: 'R' });
	}

	protected on_create_module(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: '⇧ + M' });
	}

	protected on_create_row(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: '⇧ + R' });
	}

	protected on_create_corridor(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: '⇧ + C' });
	}

	protected on_create_address_sphere(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: '⇧ + K' });
	}

	protected on_escape(_e: Event) {
		lastKeyStroke.set({ type: 'success', text: 'ESC' });
	}
	protected on_delete(_e: Event) {
		//
	}

	protected on_cut(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: 'Cut only allowed in select mode.' });
	}

	protected on_copy(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: 'Copy only allowed in select mode.' });
	}

	protected on_paste(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: 'Paste only allowed in select mode.' });
	}

	protected on_prefab( _e: Event ) {
		lastKeyStroke.set({ type: 'fail', text: 'Introduce prefabs in select mode.' });
	}

	protected on_export(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: 'Mode needs to be select to export.' });
	}

	protected on_lock(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: 'Unlocking only allowed in select mode.' });
	}

	protected on_unlock(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: 'Locking only allowed in select mode.' });
	}

	protected on_group(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: 'Groups are created in select mode.' });
	}

	protected on_ungroup(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: 'Ungroup only in select mode.' });
	}

	protected on_inspect(_e: Event) {
		_e.preventDefault();
		window.dispatchEvent(new Event('toggle-inspect'));
		lastKeyStroke.set({ type: 'success', text: 'Toggle inspect menu.' });
	}

	protected on_hierarchy(_e: Event) {
		_e.preventDefault();
		window.dispatchEvent(new Event('toggle-hierarchy'));
		lastKeyStroke.set({ type: 'success', text: 'Toggle hierarchy menu.' });
	}

	protected on_prefab_explorer ( _e : Event ) {
		_e.preventDefault();
		window.dispatchEvent(new Event('toggle-prefab'));
		lastKeyStroke.set({ type: 'success', text: 'Toggle prefab menu.' });
	}

	protected on_select_all(_e: Event) {
		lastKeyStroke.set({ type: 'fail', text: 'Select all only in select mode.' });
	}

	consoleLog( msg : string ) {
		console.log(`[${this.state_name}] ${msg}`)
	}

	consoleError( msg : string ) {
		console.error(`[${this.state_name}] ${msg}`)
	}
}
