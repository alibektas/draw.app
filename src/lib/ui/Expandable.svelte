<script lang="ts">
	import { ComponentStateType } from '$lib/fields/base/Field/FieldTypes';
	import InfoBox from '$lib/fields/base/InfoBox/InfoBox.svelte';
	import Clickable from './Clickable.svelte';

	/** Whether the expandable is currently expanded.*/
	export let isExpanded: boolean;

	export let state: ComponentStateType = ComponentStateType.INFO;

	export let ui_text: {
		header: string;
		about: string;
	};
</script>

<div class="block expandable-frame">
	<div
		style="
        display:grid;
        grid-template-columns: 1fr 30px 30px;
        "
	>
		<div>
			{ui_text.header}
		</div>
		<InfoBox info={ui_text.about} {state} />

		<Clickable let:style bind:clicked={isExpanded}>
			<i
				name="clickable"
				{style}
				class={isExpanded ? 'fa-solid fa-caret-down' : 'fa-solid fa-caret-right'}
			/>
		</Clickable>
	</div>
	<div style="display:{isExpanded ? 'block' : 'none'};">
		<slot />
	</div>
</div>

<style lang="less">
	.expandable-frame {
		display: grid;
		grid-template-rows: 30px 1fr;
		background-color: grey;
		padding-top: 5px;
		padding-bottom: 5px;
		padding-left: 10px;
	}

	.block {
		margin-top: 5px;
		margin-bottom: 5px;
		padding-top: 10px;
		background-color: rgb(105, 102, 102);
	}
</style>
