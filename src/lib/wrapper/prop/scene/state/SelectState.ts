import { NullInnerStateError } from 'utils-ts';
import hotkeys from 'hotkeys-js';
import { ABCSceneState, type SceneStateInput } from './ABCSceneState';
import { LinkState } from './LinkState';
import { ExplodeState } from './ExplodeState';
import { TranslateState } from './TranslateState';
import { NodesState } from './NodesState';
import { RotateState } from './RotateState';
import { ParentState } from './ParentState';
import {
	lastKeyStroke,
	prefabs,
	errorCount,
	warningCount,
	groupSelector
} from '$lib/stores/stores';
import { get } from 'svelte/store';
import { PrimitivePrefab } from '$lib/wrapper/locked/prefab/Prefab';
import { Prop, Temporary, type Visual } from "$lib/wrapper/Base";
import { clone, fromJSON } from "$lib/wrapper/utils";
import { Address } from "../../nonphysical/address/Address";
import { Rack } from "../../physical/rack/Rack";
import { Group } from "../../nonphysical/group/Group";
import { Row } from "../../nonphysical/group/row/Row";
import { AxataCorridor } from "../../nonphysical/group/corridor/Corridor";

export class SelectState extends ABCSceneState {
	private clipboard_mode: 'none' | 'cut' | 'copy' = 'none';

	protected static override _instance: SelectState | null = null;

	static get instance(): SelectState {
		if (SelectState._instance === null) {
			SelectState._instance = new SelectState();
			return SelectState._instance;
		}

		return SelectState._instance;
	}

	/**
	 *
	 */
	constructor() {
		super('Select');

		this.event_listeners = [
			[
				'create/module',
				() => {
					this.create_module();
				}
			]
		];
	}

	override onEnter(inner: SceneStateInput): void {
		super.onEnter(inner);
		this.deselectAll();
	}

	protected override onNoPropSelected(): void {
		this.deselectAll();
	}

	override async on_copy(): Promise<void> {
		// const writePermission = "clipboard-write" as PermissionName;

		const selected =Object.values(get(groupSelector));

		if (selected.length === 0) {
			lastKeyStroke.set({ type: 'fail', text: 'Nothing to copy.' });
			return;
		}

		askUseClipboard().then(
			() => {
				
				
				const json = JSON.stringify({'objects' : selected.map( o => clone(o) ) }) ;
				// Clipboard.write is supported only by a few.
				// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText
				navigator.clipboard
					.write([
						new ClipboardItem({
							'text/plain': new Blob(
								[json],
								{ type: 'text/plain' } // TODO : Could this also have been application/json.
							)
						})
					])
					.then(
						() => lastKeyStroke.set({ type: 'success', text: 'Copy to clipboard.' }),
						(reason) =>
							console.error('Permission API write operation has failed. The reason is ', reason)
					);
			},
			() => {
				console.error('Copy to clipboard failed.');
			}
		);
	}

	override async on_paste(e: Event): Promise<void> {
		e.preventDefault();

		if (this.inner === null) throw new NullInnerStateError();

		const items = await askReadClipboard();
		for (const item of items) {
			item.getType('text/plain').then((blob) => {
				blob.text().then(
					(text) => {
						const parsed : { 'objects'? : Array< Prop > } = JSON.parse(text)
						
						
						if( parsed.objects === undefined ) {
							console.error("No objects found in clipboard.");
							return;
						}

						let obj : Prop;
						if ( parsed.objects.length > 1 ) {
							/**
							 * Before we copy an object or a multiple of objects, we need to wrap them in a group because
							 * TransformControls can attach to a single object at a time. 
							 * But the group will be a temporary prop, which means that at some point we can tell it to delete itself from the scene.
							 * To do so we need to define a guard() function that will be called by window.temp_objs every time the scene is rendered
							 * and when the guard() function returns true, the object will be deleted.
							 */
							obj = new Group();
							const tmp = new Temporary(
								obj , 
								( alpha ) => {
									if ( alpha.parent === null ) {
										return false;
									}
	
									if ( alpha.is_selected ) {
										return false;
									}
									return true;
								},
								( alpha ) => {
									( alpha as Group).ungroup();
									alpha.removeFromParent();
								}
							)
	
							obj.add(tmp);

							for ( const beta of parsed.objects ) {
								const obj_prop = fromJSON(beta);
								obj.add(obj_prop);
							}

							obj.select();
							obj.center();
						}
						else {
							obj = fromJSON(parsed.objects[0]);
						}
						
						obj.position.set(0,0,0);
						this.deselectAll();
						window.scene.add(obj);
						this.select_object(obj);
						window.scene.render()

					},
					(reject_reason) => {
						console.error('Blob to text error. ', reject_reason);
					}
				);
			});
		}

		if (this.clipboard_mode === 'cut') {
			// Empty the clipboard
			this.clipboard_mode = 'none';
		}
	}

	override on_create_module() {
		if (this.inner === null) throw new NullInnerStateError();

		lastKeyStroke.set({ type: 'success', text: '⇧ + M : Create module.' });
		this.create_module();
	}

	override on_create_row() {
		if (this.inner === null) throw new NullInnerStateError();

		lastKeyStroke.set({ type: 'success', text: '⇧ + R : Create row.' });
		this.create_row();
	}

	override on_create_corridor() {
		if (this.inner === null) throw new NullInnerStateError();
		
		lastKeyStroke.set({ type: 'success', text: '⇧ + C : Create column.' });
		this.create_corridor();
	}	

	override on_create_address_sphere() {
		if (this.inner === null) {
			throw new NullInnerStateError();
		}
		lastKeyStroke.set({ type: 'success', text: '⇧ + K : Create address sphere.' });
		this.inner.scene.add(new Address());
		this.inner.scene.render();
	}

	override on_escape(e: Event) {
		e.preventDefault();

		if (this.inner === null) {
			throw new NullInnerStateError();
		}
		this.deselectAll();
	}

	override on_delete() {
		if (this.inner === null) {
			throw new NullInnerStateError();
		}

		const g = Object.values(get(groupSelector));

		if (g.length === 0) {
			lastKeyStroke.set({ type: 'success', text: '⌫ : No object to delete.' });
			return;
		}

		for (const child of g) {
			child.parent?.remove(child);
			child.onUnmountHierarchy();
		}

		this.deselectAll();
		lastKeyStroke.set({ type: 'success', text: `⌫ : ${g.length} deleted.` });
		this.inner.scene.render();
	}

	override on_explode() {
		if (this.inner === null) throw new NullInnerStateError();
		const g = Object.values(get(groupSelector));

		if (g.length === 0) {
			lastKeyStroke.set({ type: 'success', text: 'e : Explode mode on.' });
			ExplodeState.instance.onEnter(this.onExit());
		} else {
			for (const child of g) {
				child.explode();
			}

			lastKeyStroke.set({ type: 'success', text: 'e : Explode.' });
			this.deselectAll();
		}
	}

	override on_translate() {
		if (this.inner === null) throw new NullInnerStateError();

		const g = Object.values(get(groupSelector));

		if (g.length == 0) {
			lastKeyStroke.set({ type: 'fail', text: 'Translate : No object selected' });
		} else {
			lastKeyStroke.set({ type: 'success', text: 'T : translate' });
			TranslateState.instance.onEnter(this.onExit());
		}
	}

	override on_parent() {
		if (this.inner === null) throw new NullInnerStateError();

		/**
		 * Rule for parenting : You must have at least one child candidate. So when key p is pressed
		 * we have at least one selected object. Otherwise we log a message and continue.
		 */
		const g = Object.values(get(groupSelector));
		if (g.length === 0) {
			lastKeyStroke.set({ type: 'fail', text: 'P : Select one object.' });
		} else {
			lastKeyStroke.set({ type: 'success', text: 'P : parent' });
			ParentState.instance.onEnter(this.onExit());
		}
	}

	override on_unlink() {
		lastKeyStroke.set({ type: 'success', text: 'u : unlink' });
		if (this.inner === null) throw new NullInnerStateError();
	}

	override on_nodes() {
		if (this.inner === null) throw new NullInnerStateError();
		lastKeyStroke.set({ type: 'success', text: 'N : Nodes mode on.' });
		NodesState.instance.onEnter(this.onExit());
	}

	override on_link() {
		if (this.inner === null) throw new NullInnerStateError();

		let only_addresses = true;
		const g = Object.values(get(groupSelector));

		if (g.length === 0) {
			lastKeyStroke.set({ type: 'fail', text: 'Select at least one address.' });
		}

		for (const o of g) {
			if (!(o instanceof Address)) {
				only_addresses = false;
			}
		}

		if (only_addresses) {
			lastKeyStroke.set({ type: 'success', text: 'L : Link mode on.' });
			LinkState.instance.onEnter(this.inner);
		} else {
			lastKeyStroke.set({ type: 'fail', text: 'Only addresses must be selected.' });
		}
	}

	override on_rotate() {
		if (this.inner === null) throw new NullInnerStateError();

		const g = Object.values(get(groupSelector));

		if (g.length === 1) {
			lastKeyStroke.set({ type: 'success', text: 'R : Rotate mode on.' });
			RotateState.instance.onEnter(this.onExit());
		} else if (g.length == 0) {
			lastKeyStroke.set({ type: 'fail', text: 'R : Select an object to rotate first.' });
		} else {
			lastKeyStroke.set({ type: 'fail', text: 'R : Cannot rotate multiple objects.' });
		}
	}

	private create_module() {
		if (this.inner === null) throw new Error('State cannot be null when this is called.');

		const mod = Rack.default;
		this.inner.scene.add(mod);
		this.inner.scene.render();
	}

	private create_row() {
		if (this.inner === null) throw new Error('State cannot be null when this is called.');

		const row = new Row();
		this.inner.scene.add(row);
		this.inner.scene.render();
		
	}
	private create_corridor() {
		if (this.inner === null) throw new Error('State cannot be null when this is called.');

		const col = new AxataCorridor();
		this.inner.scene.add(col);
		this.inner.scene.render();
	}

	override onPropSelected(obj: Prop): void {
		if (this.inner === null) throw new NullInnerStateError();

		this.select_object(obj);
	}

	override on_prefab(): void {
		if (this.inner === null) throw new NullInnerStateError();

		const g = Object.values(get(groupSelector));

		if (g.length === 1) {
			const obj: Prop = g[0];

			prefabs.update((dict) => {
				if (dict[obj.uuid] !== undefined) {
					// TODO new prefab overwrites the old one
					return dict;
				} else {
					dict[obj.uuid] = new PrimitivePrefab( clone(obj) );
				}

				return dict;
			});

			lastKeyStroke.set({ type: 'success', text: 'Prefab added.' });
		} else {
			lastKeyStroke.set({ type: 'fail', text: 'Prefab exactly one object.' });
		}
	}

	/**
	 *
	 * @param o Object to be selected.
	 * @param virtual_shift Whether we should emulate a shift key press
	 */
	select_object(o: Prop | Visual, virtual_shift = false) {
		if ( o.type === "visual" ) {
			this.consoleError("Visuals cannot be selected.");
			return;
		}
		
		const root = o.root; // Just in case :)


		if (root.parent === null) {
			throw new Error('Logic Error : Object is supposed have a parent.');
		}

		/**
		 * If the shift key is not pressed then
		 * the user can only select a single object at
		 * a time.
		 */
		if (!hotkeys.shift && !virtual_shift) {
			this.deselectAll();
		}

		groupSelector.update((group) => {
			if (root instanceof Prop) {
				group[root.uuid] = root;
				root.select();
			} else {
				throw new Error('Logic Error : Object is supposed to be a Prop.');
			}

			return group;
		});

		this.inner?.scene.render();
	}

	__deselect_object(obj: Prop) {
		const root = obj.root;
		groupSelector.update((group) => {
			delete group[root.uuid];
			return group;
		});
		obj.unselect();
	}

	deselectAll(): void {
		if (this.inner === null) throw new NullInnerStateError();
		const objs = Object.values(get(groupSelector));
		for (const obj of objs) {
			this.__deselect_object(obj);
		}

		groupSelector.set({});
		this.inner.scene.render();
	}

	override on_export(): void {
		if (this.inner === null) throw new NullInnerStateError();

		if (get(errorCount) === 0) {
			if (get(warningCount) === 0) {
				const json = this.inner.scene.toJSON();
				// Download the json file to client.
				const blob = new Blob([
					JSON.stringify(
						{
							"scene" : json,
							"prefabs" : get(prefabs)
						}
					)], 
					{ type: 'application/json' }
				);
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'scene.json';
				a.click();
			} else {
				alert(`You still have ${get(warningCount)} many warnings. Still proceeding...`);
			}
		}
	}

	override on_group(): void {
		if (this.inner === null) throw new NullInnerStateError();

		this.inner.scene.add(new Group());
		this.inner.scene.render();
		lastKeyStroke.set({ type: 'success', text: 'Group created' });
	}

	override on_lock(): void {
		if (this.inner === null) throw new NullInnerStateError();

		const g = get(groupSelector);
		const objs = Object.values(g);

		if (objs.length === 0) {
			lastKeyStroke.set({ type: 'fail', text: 'No object is selected to lock' });
		} else {
			for (const child of objs) {
				for (const grandchild of child.props) {
					grandchild.is_root = false;
				}
			}

			lastKeyStroke.set({ text: 'Lock', type: 'success' });
		}
	}

	override on_unlock(): void {
		if (this.inner === null) throw new NullInnerStateError();

		const g = get(groupSelector);
		const objs = Object.values(g);

		if (objs.length === 0) {
			lastKeyStroke.set({ type: 'fail', text: 'No object is selected to lock' });
		} else {
			for (const obj of objs) {
				for (const child of obj.props) {
					child.is_root = true;
				}
			}

			lastKeyStroke.set({ text: 'Lock', type: 'success' });
		}
	}

	override on_ungroup(): void {
		if (this.inner === null) throw new NullInnerStateError();

		const g = Object.values(get(groupSelector));

		if (g.length === 0) {
			lastKeyStroke.set({ type: 'fail', text: 'No object is selected to ungroup' });
		} else if (g.length === 1) {
			const child = g[0];
			if (child instanceof Group) {
				child.ungroup();
				lastKeyStroke.set({ text: 'Ungrouped 1 group object.', type: 'success' });
			} else {
				lastKeyStroke.set({ text: 'You can only ungroup a group.', type: 'fail' });
			}
		} else {
			lastKeyStroke.set({ text: 'You cannot ungroup multiple groups.', type: 'fail' });
		}
	}

	override on_select_all(): void {
		if (this.inner === null) throw new NullInnerStateError();

		for (const child of this.inner.scene.props) {
			this.select_object(child, true);
		}
	}
}

async function askUseClipboard(): Promise<void> {
	const readPermission = 'clipboard-read' as PermissionName;

	await navigator.permissions.query({ name: readPermission }).then(
		(p) => {
			if (p.state == 'granted') {
				return;
			} else if (p.state == 'prompt') {
				throw new Error("Permission API status is prompt. Copy operation couldn't be executed.");
			} else {
				throw new Error('ClipboardAPI permission is denied. Copy operation is not allowed.');
			}
		},
		(reason) => {
			console.error('Permission API failed. The reason  given by the PermissionAPI is ', reason);
			lastKeyStroke.set({ type: 'fail', text: 'Permission Error.' });
			throw new Error('ClipboardAPI read permission is not granted.');
		}
	);
}

async function askReadClipboard(): Promise<ClipboardItems> {
	return await navigator.clipboard.read();
}



