<script lang="ts">
	import { problems } from '$lib/stores/stores';
	import type { Writable } from 'svelte/store';
	import Tab from './Tab.svelte';
	import type { TabState } from './TabBase';

	/**
	 * This tab is responsible for providing user a list of errors and warnings.
	 * Each warning or error should in principle be linked to an object, so that by clicking
	 * on it the object would be selected. In order for the sketch to be valid there
	 * should be no errors / warnings.
	 */
	export let state: Writable<TabState>;
</script>

<Tab title="Problems" {state}>
	{#each Object.entries($problems) as [uuid, problem]}
		<ul>
			{#each Object.entries(problem['errors']) as errs}
				{#if errs[1] !== undefined}
					<li>
						<span style="color:red;">
							{uuid.slice(0, 8)} --- {errs[0]} : {errs[1]}
						</span>
					</li>
				{/if}
			{/each}
			{#each Object.entries(problem['warnings']) as warns}
				{#if warns[1] !== undefined}
					<li>
						<span style="color:orange;">
							{warns[0]} : {warns[1]}
						</span>
					</li>
				{/if}
			{/each}
		</ul>
	{/each}
</Tab>
