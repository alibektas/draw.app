import type { ProblemsObject } from '$lib/common';
import type { Prop } from "$lib/wrapper/Base";
import type { PrimitivePrefab } from '$lib/wrapper/locked/prefab/Prefab';
import type { SceneStateName } from "$lib/wrapper/prop/scene/state/ABCSceneState";
import type { Edge } from "$lib/wrapper/visual/Visual";
import { writable, type Writable } from 'svelte/store';

export const currentTime: Writable<string> = writable('');
export const mostRecentLogType: Writable<'INFO' | 'WARNING' | 'ERROR'> = writable('INFO');

export const problems: Writable<{
	[uuid: string]: ProblemsObject<string, string>;
}> = writable({});

/**
 * Error and Warning Counts are used at the bottom bar.
 * We require user to fix all the errors before being able to export the sketch.
 */
export const errorCount: Writable<number> = writable(0);
export const warningCount: Writable<number> = writable(0);

export const lastKeyStroke: Writable<{
	type: 'empty' | 'success' | 'fail';
	text: string;
}> = writable({
	type: 'empty',
	text: ''
});

export type PrefabProperties = {
	name: string; // A non-unique na me for the prefab.
	// 'type' :  'module' | 'corridor' | 'row' | 'restricted-area', // some types that makes grouping of prefabs easier.
	object: Prop; // The base prefab object.
};

export const prefabs: Writable<{ [name: string]: PrimitivePrefab }> = writable({});

export const scene_state: Writable<SceneStateName> = writable('Select');

/**
 * It is crucial that user is able to select multiple objects to move them around.
 * We create a dummy element which will act as a temporary parent for these objects.
 * When the objects are deselected we assign them back the parent they had prior to the selection.
 */
export const groupSelector: Writable<{ [uuid: string]: Prop }> = writable({});

export const addressNodeHelper: Writable<{ [uuid: string]: Edge }> = writable({});

type KeyStroke = string;
type KeyStrokeDescription = string;

export const controlsText: Writable<{
	title: string;
	keys: Array<[KeyStroke, KeyStrokeDescription]>;
}> = writable({
	title: 'Controls',
	keys: []
});
