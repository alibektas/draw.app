<script lang="ts">
	import Tab from './Tab.svelte';
	import type { TabState } from './TabBase';
	import type { Writable } from 'svelte/store';
	import { groupSelector } from '$lib/stores/stores';
	export let state: Writable<TabState>;
</script>

<Tab title="Routes" {state}>
	{#key groupSelector}
		{#if Object.keys(groupSelector).length == 0}
			<div>{window.sessionConfig.ui_texts.Tab.Routes.NoObjectSelected}</div>
		{:else if Object.keys(groupSelector).length == 1}
			<h3>TODO!</h3>
		{:else}
			<div>Uzunluk {Object.keys(groupSelector).length}</div>
		{/if}
	{/key}
</Tab>
