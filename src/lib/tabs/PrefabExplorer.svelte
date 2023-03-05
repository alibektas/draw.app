<script lang="ts">
	import { prefabs } from '$lib/stores/stores';
	import type { PrimitivePrefab } from "$lib/wrapper/locked/prefab/Prefab";

	import { get, type Writable } from 'svelte/store';
	import Tab from './Tab.svelte';
	import type { TabState } from './TabBase';
	export let state: Writable<TabState>;

	/**
	 * Called when a prefab's name is changed in the explorer.
	 * @param e - The event that triggered this function.
	 * @param prefab The prefab that is being changed.
	 */
	function onPrefabNameChange( e : Event , prefab : PrimitivePrefab ) {
		const text = (e.target as HTMLDivElement).innerText;
		// If the name is blank , set it to "Untitled Prefab".

		if ( text === "" ) {
			prefab.input_name.set("Untitled Prefab");
			return;
		}
		
		// Set the name of the prefab.
		prefab.input_name.set(text);
	}

	/**
	 * Called when a prefab is double clicked in the explorer.
	 * @param e - The event that triggered this function.
	 * @param prefab The prefab that is being changed.
	 */
	function onPrefabElementDoubleClick( _e : Event , prefab : PrimitivePrefab ) {
		// Make a new instance of the prefab.
		const inst = prefab.instantiate();
		// Add it to the scene view.
		window.scene.add( inst );
		window.scene.render();
	}

	/**
	 * Called when a prefab is blurred in the explorer.
	 * @param e - The event that triggered this function.
	 * @param prefab The prefab that is being changed.
	 */
	function onPrefabElementBlur( e : Event , prefab : PrimitivePrefab ) {
		// Make sure the name is not blank.
		if ( get(prefab.input_name) === "" ) {
			prefab.input_name.set("Untitled Prefab");
		}

		(e.target as HTMLInputElement).innerText = get(prefab.input_name);
	}
</script>


<Tab {state} title="Prefabs">
	<ul>
		{#each Object.values($prefabs) as prefab }
		<!-- Divs must be `contenteditable` so that the user can change its name. -->
			<li>
				<div
					on:input={ e => onPrefabNameChange(e , prefab)}
					on:dblclick={ e => onPrefabElementDoubleClick(e , prefab)}
					on:blur={ e => onPrefabElementBlur(e , prefab)}
					contenteditable="true" 
					style:width="150px"
				>	
					{get(prefab.input_name)}
				</div>
			</li>
		{/each}
	</ul>
</Tab>

<style lang="less">
	div {
		border: 1px solid black;
		cursor: pointer;
	}
</style>

