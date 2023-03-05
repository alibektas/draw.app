<script lang="ts">
	import RackField from '$lib/fields/RackField/RackField.svelte';
	import Tab from './Tab.svelte';
	import type { TabState } from './TabBase';
	import AddressField from '$lib/fields/Prop/AddressField/AddressField.svelte';
	import { groupSelector as selected } from '$lib/stores/stores';
	import GroupField from '$lib/fields/Prop/GroupField/GroupField.svelte';
	import type { Writable } from 'svelte/store';
	import type { Prop } from "$lib/wrapper/Base";
	import { Rack } from "$lib/wrapper/prop/physical/rack/Rack";
	import { Address } from "$lib/wrapper/prop/nonphysical/address/Address";
	import { Group } from "$lib/wrapper/prop/nonphysical/group/Group";
	import RowField from "$lib/fields/Prop/GroupField/RowField/RowField.svelte";
	import { Corridor } from "$lib/wrapper/prop/nonphysical/group/corridor/Corridor";
	import CorridorField from "$lib/fields/Prop/GroupField/CorridorField/CorridorField.svelte";
	import { Row } from "$lib/wrapper/prop/nonphysical/group/row/Row";
	export let state: Writable<TabState>;
		
	let vs: Array<Prop>;
	$: {
		vs = Object.values($selected);
	}
</script>

<Tab title="Inspect" {state}>
	{#key vs}
		{#if vs.length == 0}
			<div>{window.sessionConfig.ui_texts.Tab.Inspect.NoObjectSelected}</div>
		{:else if vs.length == 1}
			{@const single = vs[0]}
			{#if single instanceof Rack}
				<RackField obj={single} />
			{:else if single instanceof Address}
				<AddressField obj={single} />
			{:else if single instanceof Row}
				<RowField obj={single} />
			{:else if single instanceof Corridor}
				<CorridorField obj={single} />
			{:else if single instanceof Group}
				<GroupField obj={single} />
			{/if}
		{:else}
			<div>Uzunluk {vs.length}</div>
		{/if}
	{/key}
</Tab>
