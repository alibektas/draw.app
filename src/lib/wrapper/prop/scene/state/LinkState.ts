import { groupSelector, lastKeyStroke } from '$lib/stores/stores';
import { get } from 'svelte/store';
import { NullInnerStateError } from 'utils-ts';
import { ABCSceneState } from './ABCSceneState';
import { SelectState } from './SelectState';
import type { Prop } from "$lib/wrapper/Base";
import { Address} from "../../nonphysical/address/Address";

export class LinkState extends ABCSceneState {
	protected static override _instance: LinkState | null = null;

	static get instance(): LinkState {
		if (LinkState._instance === null) {
			LinkState._instance = new LinkState();
			return LinkState._instance;
		}

		return LinkState._instance;
	}

	/**
	 *
	 */
	constructor() {
		super('Link');
	}

	override on_escape(e: Event): void {
		e.preventDefault();
		if (this.inner === null) throw new NullInnerStateError();
		lastKeyStroke.set({ type: 'success', text: 'Esc : Transition to select mode.' });
		SelectState.instance.onEnter(this.onExit());
	}

	override onPropSelected(obj: Prop): void {
		if (obj instanceof Address) {
			this.link(obj);
		}
	}

	link(alpha: Address): void {
		if (this.inner === null) throw new NullInnerStateError();

		const g = Object.values(get(groupSelector));

		for (const beta of g) {
			if (beta instanceof Address) {
				alpha.try_link( beta , "custom" );
				beta.try_link( alpha , "custom" );
			}
		} 

		this.inner.scene.render();
		SelectState.instance.onEnter(this.onExit());
	}
}
