<script lang="ts">
	import Panel from './panels/Panel.svelte';
	import ThreeView from './ThreeView.svelte';

	// TODO : Hierarchyelementlerden bi suru yapinca sayfa boyuna uzayip gidiyor. 3/9/22 tarihinde cozemedin bir daha dene.
</script>

<div class="main-view">
	<Panel position="left" />
	<div class="drag-n-extend" />
	<div class="central-view">
		<ThreeView />
		<div class="drag-n-extend" />
		<Panel position="bottom" />
	</div>
	<Panel position="right" />
</div>

<style lang="less">
	.main-view {
		/* align-items: stretch; */
		display: flex;
	}

	.central-view {
		display: flex;
		flex-direction: column;
		flex: 3 1 auto;
	}

	.drag-n-extend {
		flex: 0 0 5px;
		background-color: red;
	}

	:global(.clickable) {
		&:hover {
			cursor: pointer;
		}
	}
</style>
