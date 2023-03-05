<script lang="ts">
	import Tab from './Tab.svelte';
	import type { TabState } from './TabBase';
	import type { Writable } from 'svelte/store';
	import { controlsText } from '$lib/stores/stores';
	export let state: Writable<TabState>;
</script>

<Tab title={$controlsText.title} {state}>
	{#key controlsText}
		{#if Object.keys(controlsText).length == 0}
			<div>{window.sessionConfig.ui_texts.Tab.Routes.NoObjectSelected}</div>
		{:else if Object.keys(controlsText).length == 1}
			<h3>TODO!</h3>
		{:else}
			<div>Uzunluk {Object.keys(controlsText).length}</div>
		{/if}
	{/key}
</Tab>
