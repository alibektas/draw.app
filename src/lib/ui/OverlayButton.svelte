<script lang="ts">
	/**
	 * In order to position i
	 */
	// export let parent_height : number;
	// export let parent_width : number;

	function mouse_enter() {
		console.info('Mouse enter');
	}

	function mouse_leave() {
		console.info('Mouse leave');
	}
</script>

<div on:mouseenter={mouse_enter} on:mouseleave={mouse_leave} class="title">
	<slot name="title" />
	<slot name="hotkey" />
</div>

<style lang="less">
	.title {
		background-color: grey;
		border: 1px solid;
		display: grid;
		grid-template-columns: 100px 50px;
	}

	.title:hover {
		// background-color: rgb(165, 163, 163);
		color: rgb(241, 241, 241);
	}
</style>


