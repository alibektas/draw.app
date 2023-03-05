<script lang="ts">
	import type { Writable } from 'svelte/store';
	import Tab from '../Tab.svelte';
	import type { TabState } from '../TabBase';
	import HierarchyElement from './HierarchyElement.svelte';
	export let state: Writable<TabState>;

	let childRecentlyUpdated = false;

	$: {
		window.scene?.addEventListener('update-children', () => {
			childRecentlyUpdated = !childRecentlyUpdated;
		});
	}
</script>

<Tab title="Hierarchy" {state}>
	{#key childRecentlyUpdated}
		<HierarchyElement obj={window.scene} />
	{/key}
</Tab>
