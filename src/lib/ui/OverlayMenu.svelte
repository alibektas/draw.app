<script lang="ts">
	import type { TabState } from '$lib/tabs/TabBase';
	import type { Writable } from 'svelte/store';
	/**
	 * In which direction will this menu open itself relative to its parent?
	 */
	export let direction: 'left' | 'right' | 'top' | 'bottom';
	export let state: Writable<TabState>;
	let class_desc: 'disabled' | 'menu-parent' = 'disabled';

	state.subscribe((value) => {
		switch (value) {
			case 'open':
				class_desc = 'menu-parent';
				break;
			case 'closed':
				class_desc = 'disabled';
				break;
			case 'inactive':
				class_desc = 'disabled';
				break;
		}
	});
</script>

<div class={class_desc}>
	<div class="menu {direction}">
		<slot name="menu" />
	</div>
</div>

<style>
	.menu-parent {
		position: absolute;
		top: 5px;
	}

	.menu {
		width: 150px;
		background-color: grey;
		position: relative;
		display: flex;
		flex-direction: column;
		z-index: 4;
	}

	.limiter {
		background-color: transparent;
		height: 1px;
	}

	.disabled {
		display: none;
	}

	.right {
		/* right : calc(--parent_width,2); */
		right: 15px;
	}

	.left {
		/* left : calc(--parent_width,2); */
		left: 50px;
		top: 0px;
	}

	.up {
		/* top : calc(--parent_height,2); */
		top: 0;
	}

	.bottom {
		/* bottom : calc(--parent_height,2); */
		bottom: 0;
	}
</style>
