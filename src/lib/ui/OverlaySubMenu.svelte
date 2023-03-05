<script lang="ts">
	import type { TabState } from '$lib/tabs/TabBase';

	/**
	 * In which direction will this menu open itself relative to its parent?
	 */
	export let direction: 'left' | 'right' | 'top' | 'bottom';

	let state: TabState = 'closed';
	let class_descr: 'menu' | 'disabled' = 'disabled';

	$: class_descr = state === 'open' ? 'menu' : 'disabled';

	/**
	 * In order to position i
	 */
	// export let parent_height : number;
	// export let parent_width : number;

	function open_submenu() {
		state = 'open';
	}

	function close_submenu() {
		state = 'closed';
	}
</script>

<div on:mouseenter={open_submenu} on:mouseleave={close_submenu} class="submenu">
	<div class="title">
		<slot name="title" />
		<i class="fa-solid fa-caret-right" />
	</div>
	<div on:mouseenter={open_submenu} on:mouseleave={close_submenu} class="{class_descr} {direction}">
		<slot name="menu" />
	</div>
</div>

<style lang="less">
	.submenu {
		background-color: grey;
		border: 1px solid;
		position: initial;
		display: flex;

		.title:hover {
			// background-color: rgb(165, 163, 163);
			color: rgb(241, 241, 241);
		}

		.title {
			display: grid;
			grid-template-columns: 135px 10px;
			i {
				position: relative;
				top: 2px;
			}
		}
	}

	.menu {
		width: 150px;
		background-color: grey;
		position: absolute;
		display: flex;
		flex-direction: column;
		z-index: 4;
	}

	.left {
		left: 151px;
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

	.up {
		/* top : calc(--parent_height,2); */
		top: 0;
	}

	.bottom {
		/* bottom : calc(--parent_height,2); */
		bottom: 0;
	}
</style>
