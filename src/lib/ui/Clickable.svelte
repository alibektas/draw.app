<script lang="ts">
	export let clicked = false;
	let light = false;

	const onClick = () => {
		clicked = !clicked;
	};
	const mouseEnter = () => {
		light = true;
	};
	const mouseLeave = () => {
		light = false;
	};
</script>

<div
	class="clickable"
	on:mouseenter={mouseEnter}
	on:mouseleave={mouseLeave}
	on:click={onClick}
	on:keydown={() => {
		/*FUT001*/
	}}
>
	<slot style="color:{light ? 'white' : 'black'};" />
</div>
