<script lang="ts">
	import { onMount } from 'svelte';
	import { Scene } from "./wrapper/prop/scene/Scene";
	import { SelectState } from "./wrapper/prop/scene/state/SelectState";

	let w: HTMLCanvasElement;
	let width: number;
	let height: number;

	$: {
		if (window.scene !== undefined) window.scene.dim_update(width, height);
	}

	onMount(() => {
		window.scene = new Scene(width, height, w);
		window.scene.render();
		animate();
		// We start by entering the select state
		// This will allow us to select objects
		// Each state asks for the props it needs
		// this guarantees that no other state interferes with the current state.
		SelectState.instance.onEnter({ scene: window.scene });
	});

	function animate() {
		requestAnimationFrame(animate);
		window.scene.the_real_render();

	}

</script>

<div id="three-parent" bind:clientWidth={width} bind:clientHeight={height}>
	<canvas
		on:mousedown={(e) => {
			window.scene.onPointerDown(e);
		}}
		tabindex="-1"
		style="height:{height};width:{width};"
		id="three-canvas"
		class="three-container"
		bind:this={w}
	/>
</div>

<style>
	#three-parent {
		flex: 1 5 50px;
	}

	#three-canvas {
		position: absolute;
	}
</style>
