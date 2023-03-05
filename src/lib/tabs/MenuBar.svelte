<script lang="ts">
	import OverlayButton from '$lib/ui/OverlayButton.svelte';
	import OverlayMenu from '$lib/ui/OverlayMenu.svelte';
	import OverlaySubMenu from '$lib/ui/OverlaySubMenu.svelte';
	import type { Writable } from 'svelte/store';
	import type { TabState } from './TabBase';

	export let direction: 'left' | 'right' | 'bottom';

	export let state: Writable<TabState>;
</script>

<OverlayMenu {state} {direction}>
	<div slot="menu">
		<OverlaySubMenu {direction}>
			<div slot="title">File</div>
			<div slot="menu">
				<OverlayButton>
					<div
						on:click={() => {
							alert('NotImplemented');
						}}
						slot="title"
						on:keydown={() => {
							console.info('Keydown Overlay Button');
						}}
					>
						New
					</div>
				</OverlayButton>
			</div>
		</OverlaySubMenu>
		<OverlaySubMenu {direction}>
			<div slot="title">Edit</div>
			<div slot="menu">
				<OverlaySubMenu {direction}>
					<div slot="title">ZUBAla</div>
					<div slot="menu" />
				</OverlaySubMenu>
			</div>
		</OverlaySubMenu>
		<OverlaySubMenu {direction}>
			<div slot="title">Create</div>
			<div slot="menu">
				<OverlaySubMenu {direction}>
					<div slot="title">Basic</div>
					<div slot="menu">
						<OverlayButton>
							<div
								on:click={() => {
									window.dispatchEvent(new Event('create/module'));
								}}
								on:keydown={() => {
									console.info('Keydown Overlay Button');
								}}
								slot="title"
							>
								Module
							</div>
							<div slot="hotkey">&#x21E7+M</div>
						</OverlayButton>
					</div>
				</OverlaySubMenu>
				<OverlaySubMenu {direction}>
					<div slot="title">Compound</div>
					<div slot="menu">
						<OverlayButton>
							<div
								on:click={() => {
									window.dispatchEvent(new Event('create/row'));
								}}
								on:keydown={() => {
									console.info('Keydown Overlay Button');
								}}
								slot="title"
							>
								Row
							</div>
							<div slot="hotkey">&#x21E7+R</div>
						</OverlayButton>
						<OverlayButton>
							<div
								on:click={() => {
									window.dispatchEvent(new Event('create/corridor'));
								}}
								on:keydown={() => {
									console.info('Keydown Overlay Button');
								}}
								slot="title"
							>
								Corridor
							</div>
							<div slot="hotkey">&#x21E7+K</div>
						</OverlayButton>
					</div>
				</OverlaySubMenu>
			</div>
		</OverlaySubMenu>
		<OverlaySubMenu {direction}>
			<div slot="title">Route</div>
			<div slot="menu" />
		</OverlaySubMenu>
	</div>
</OverlayMenu>

