import { writable, type Writable } from 'svelte/store';
import type { TabPositioning, TabType } from '$lib/common';
import type { TabState } from '$lib/tabs/TabBase';

export type PanelStore = { [tab_name in TabType]: [TabPositioning, Writable<TabState>] };

export const panelStore: PanelStore = {
	hierarchy: ['inactive', writable('inactive')],
	inspect: ['inactive', writable('inactive')],
	prefab_explorer: ['inactive', writable('inactive')],
	route: ['inactive', writable('inactive')],
	problems: ['inactive', writable('inactive')],
	controls: ['inactive', writable('inactive')]
};
