<script lang="ts">
	import PropField from '$lib/fields/Prop/PropField.svelte';

	import { scene_state } from '$lib/stores/stores';
	import Expandable from '$lib/ui/Expandable.svelte';
	import type { Address, AddressType } from "$lib/wrapper/prop/nonphysical/address/Address";
	import { SelectState } from "$lib/wrapper/prop/scene/state/SelectState";
	import { get } from 'svelte/store';
	import { ComponentStateType } from '../../base/Field/FieldTypes';
	import type { INumberField } from '../../base/NumberField/INumberField';
	import NumberField from '../../base/NumberField/NumberField.svelte';

	export let obj: Address;
	let isExpanded = true;
	let address_properties_expanded = true;

	const infos = window.sessionConfig.info_texts.Node;
	let restrictionsIsExpanded = true;

	let restriction_max_height: INumberField = {
		ui_text: infos.Restrictions.MaxHeight,
		uuid: '',
		user_mem: obj.input_max_height_restriction,
		state: ComponentStateType.INFO,
		onchange: function (m: number): void {
			obj.maxHeightRestriction = m;
			window.scene.render();
		},
		errors: {},
		warnings: {}
	};

	let restriction_max_width: INumberField = {
		ui_text: infos.Restrictions.MaxWidth,
		uuid: '',
		user_mem: obj.input_max_width_restriction,
		state: ComponentStateType.INFO,
		onchange: function (m: number): void {
			obj.maxWidthRestriction = m;
			window.scene.render();
		},
		errors: {},
		warnings: {}
	};

	function select_next_hop(hop: Address) {
		if (get(scene_state) === 'Select') {
			const h = hop;
			SelectState.instance.select_object(h);
		}
	}

	function address_type_change(
		_event: Event & { currentTarget: EventTarget & HTMLSelectElement }
	): any {
		// Read the value of the select element
		const value = _event.currentTarget.value;
		obj.address_type = value as AddressType;
		console.log(`[AddressField][${obj.name}] new address type: ${value}`);
	}
</script>

<!-- A field where addresses are shown.-->
<!-- The address is shown as a string, but the user can click on it to select the object. -->
<Expandable ui_text={infos.Expandable} {isExpanded}>
	<PropField {obj} />
	<Expandable ui_text={infos.NodeProperties} isExpanded={address_properties_expanded}>
		<label for="address-type">Address Type </label>
		<select
			on:change={address_type_change}
			name="address-type"
			id="address-type"
			value={obj.address_type}
		>
			<option value="router">Router</option>
			<option value="outbound">Outbound</option>
			<option value="inbound">Inbound</option>
			<option value="endpoint">Endpoint</option>
		</select>

		{#each obj.links as link}
			{#if link !== null}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="clickable"
					on:click={() => {
						select_next_hop(link.object);
					}}
				>
					{link.edge.name}
				</div>
			{/if}
		{/each}
	</Expandable>

	<Expandable
		ui_text={infos.Restrictions.Expandable}
		isExpanded={restrictionsIsExpanded}
		on:click={() => {
			restrictionsIsExpanded = !restrictionsIsExpanded;
		}}
	>
		<NumberField opt={restriction_max_height} />
		<NumberField opt={restriction_max_width} />
	</Expandable>
</Expandable>
