<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { TabState } from './TabBase';
	export let state: Writable<TabState>;
	export let title: string;
</script>

{#if $state == 'open'}
	<div class="tab">
		<div class="title">{title}</div>
		<div class="content">
			<slot />
		</div>
	</div>
{/if}

<style>
	.tab {
		display: grid;
		grid-template-rows: 40px 1fr;
		margin: 20px;
		width: inherit;
		height: inherit;
	}

	.title {
		font-size: large;
		margin-bottom: 20px;
		border-bottom: 2px solid;
	}

	.content {
		overflow: hidden;
	}
</style>
