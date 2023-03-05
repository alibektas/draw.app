<script lang="ts">
	import { scene_state } from '$lib/stores/stores';
	import Clickable from '$lib/ui/Clickable.svelte';
	import type { Prop } from "$lib/wrapper/Base";
	import { Scene } from "$lib/wrapper/prop/scene/Scene";
	import { SelectState } from "$lib/wrapper/prop/scene/state/SelectState";
	import { get } from 'svelte/store';

	export let obj: Prop;

	let isselected = false;
	let childrenVisible = false;
	let childRecentlyUpdated = false;
	
	obj.inner.addEventListener('update-children', () => {
		childRecentlyUpdated = !childRecentlyUpdated;
	});

	obj.inner.addEventListener('select' , () => {
		console.log("[HierarchyElement] object has been selected.");
		isselected = true;
	});
	
	obj.inner.addEventListener('unselect' , () => {
		console.log("[HierarchyElement] object has been unselected.");
		isselected = false;
	});
</script>


<div style="display:grid; grid-template-columns:20px 150px 20px;">
	{#if obj.props.length > 0}
		<Clickable let:style bind:clicked={childrenVisible}>
			<i class={childrenVisible ? 'fa-solid fa-angle-down' : 'fa-solid fa-angle-right'} {style} />
		</Clickable>
	{:else}
		<div />
	{/if}
	<div
		class="clickable {isselected ? "selected" : "" }"
		on:click={() => {
			if (get(scene_state) === 'Select') {
				if (obj instanceof Scene) {
					for (const child of obj.props) {
						
						console.log('Scene object touched in hierarchy view.');
						console.log("Selecting child: " + child.name);
						SelectState.instance.select_object(child , true);
					}
				} else {
					SelectState.instance.on_select_all();
				}
			}
		}}
		on:keydown={() => {
			/*FUT001*/
		}}
	>
		{obj.name}
	</div>
	<div>
		{#key childRecentlyUpdated}
			({obj.props.length})
		{/key}
	</div>
</div>

<div class="children">
	{#if childrenVisible}
		{#key childRecentlyUpdated}
			{#each obj.props as child }
				<svelte:self obj={child} />
			{/each}
		{/key}
	{/if}
</div>

<style lang="less">
	.children {
		padding-left: 25px;
	}

	.selected  {
		color: #f0f0f0;
	}
</style>
