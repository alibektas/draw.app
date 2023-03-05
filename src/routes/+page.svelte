<script lang="ts">
	import BottomBar from '$lib/BottomBar.svelte';
	import MainView from '$lib/MainView.svelte';
	import { preload } from '$lib/preload';
	import { getConfiguration } from '$lib/session';
</script>

{#await getConfiguration()}
	<div>Configuring User Settings...</div>
{:then}
	{#await preload()}
		<div>Loading props...</div>
	{:then}
		<div id="editor">
			<MainView />
			<BottomBar />
		</div>
	{/await}
{/await}

<style>
	#editor {
		display: grid;
		height: 100vh;
		width: 100vw;
		grid-template-rows: 1fr 20px;
	}

	/* :global(div) {
        height: 100%;
        width: 100%;
    } */

	:global(*) {
		margin: 0;
		box-sizing: content-box;
	}
</style>
