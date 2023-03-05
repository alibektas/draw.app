<!-- 
This component is responsible for creating a button near a field that explains what the given field is for when the mouse is over it.
In case of a syntactical or semantical error infobox turns into a error box. 
This will be different in style to emphasize the existence of an error.
-->
<script lang="ts">
	import { ComponentStateType } from '../Field/FieldTypes';
	export let state: ComponentStateType = ComponentStateType.INFO;
	export let info: string;
	let infobox_active = false;
	/**
	 * The message will be read from this.
	 */
	let msg: string = info;
	let icon = 'fa-circle-info';

	$: {
		if (state === ComponentStateType.ERR) {
			icon = 'fa-circle-exclamation';
		} else if (state === ComponentStateType.WARN) {
			icon = 'fa-circle-exclamation';
		} else {
			icon = 'fa-circle-info';
		}
	}

	let light = false;
	const show_infobox = () => {
		light = infobox_active = true;
	};
	const hide_infobox = () => {
		light = infobox_active = false;
	};
</script>

<i
	on:mouseenter={show_infobox}
	on:mouseleave={hide_infobox}
	class="info-icon fa-solid {state} {icon} "
	class:light
	style="justify-content:center;"
>
	{#if infobox_active}
		{#if msg !== ''}
			<div class="message_frame">
				{#if state == ComponentStateType.INFO}
					<p>{msg}</p>
				{:else if state === ComponentStateType.WARN}
					<p>{msg}</p>
				{:else if state === ComponentStateType.ERR}
					<p>{msg}</p>
				{:else}
					Undefined behavior.
				{/if}
			</div>
		{/if}
	{/if}
</i>

<style lang="less">
	// A floating message that appears when the mouse is over the info icon.
	.message_frame {
		position: absolute;
		background-color: rgba(187, 187, 187, 0.455);
		border-radius: 5px;
		padding: 5px;
		z-index: 100;
		display: flex;
		justify-content: center;
		align-items: center;

		p {
			font-family: 'Courier New', Courier, monospace;
			font-size: small;
			color: white;
		}
	}

	.warning {
		color: rgb(240, 240, 88);
	}

	.error {
		color: rgb(217, 80, 80);
	}
</style>
