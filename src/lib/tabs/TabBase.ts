import Hierarchy from './hierarchy/Hierarchy.svelte';
import Inspect from './Inspect.svelte';
import PrefabExplorer from './PrefabExplorer.svelte';
import Route from './Route.svelte';
import ProblemsTab from './ProblemsTab.svelte';

import type { TabType } from '$lib/common';
import { writable, type Writable } from 'svelte/store';

export type TabState =
	/** Tab is active yet it not currently a visible UI element.*/
	| 'closed'
	/** Tab is active for this panel and it is a visible UI element.*/
	| 'open'
	/** Tab is not active for this panel. */
	| 'inactive';

export type TabProperties = {
	state: Writable<TabState>;
	button_text: string;
	button_icon: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	component: any;
	type: 'overlay' | 'panel_view';
};

export const tablist: { [tab_type in TabType]: TabProperties } = {
	hierarchy: {
		state: writable('inactive'),
		button_text: 'Hierarchy',
		button_icon: 'fas fa-2x fa-sitemap',
		component: Hierarchy,
		type: 'panel_view'
	},
	inspect: {
		state: writable('inactive'),
		button_text: 'Inspect',
		button_icon: 'fas fa-2x fa-pen',
		component: Inspect,
		type: 'panel_view'
	},
	prefab_explorer: {
		state: writable('inactive'),
		button_text: 'Prefabs',
		button_icon: 'fa-2x fa-solid fa-building',
		component: PrefabExplorer,
		type: 'panel_view'
	},
	problems: {
		state: writable('inactive'),
		button_text: 'Problems',
		button_icon: 'fas fa-2x fa-triangle-exclamation',
		component: ProblemsTab,
		type: 'panel_view'
	},
	route: {
		state: writable('inactive'),
		button_text: 'Routes',
		button_icon: 'fas fa-2x fa-road',
		component: Route,
		type: 'panel_view'
	},
	controls: {
		state: writable('inactive'),
		button_text: 'Controls',
		button_icon: 'fas fa-2x fa-gamepad',
		component: null,
		type: 'panel_view'
	}
};
