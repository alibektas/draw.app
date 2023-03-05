<script lang="ts">
	import type { TabState } from '$lib/tabs/TabBase';
	import type { Writable } from 'svelte/store';
	export let state: Writable<TabState>;
</script>

{#if $state !== 'inactive'}
	<div id="indicator" class={$state} />
{/if}

<style>
	.open {
		background-color: white;
	}

	#indicator {
		background-color: black;
	}
</style>
