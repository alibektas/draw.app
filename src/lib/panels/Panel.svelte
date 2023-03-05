<script lang="ts">
	import type { TabState } from '$lib/tabs/TabBase';
	import { loadPrefabs, loadScene } from "$lib/wrapper/utils";
	import { get } from 'svelte/store';
	export let position: 'left' | 'right' | 'bottom';

	// let subscribers : Array<Unsubscriber> = [];
	let state: TabState = 'inactive';

	let panel_tabs = window.tabs[position];

	if (panel_tabs['problems'] !== undefined) {
		window.addEventListener('toggle-problems', () => {
			open_tab('problems');
		});
	}

	if (panel_tabs['inspect'] !== undefined) {
		window.addEventListener('toggle-inspect', () => {
			console.info('toggle-inspect');
			open_tab('inspect');
		});
	}

	if (panel_tabs['hierarchy'] !== undefined) {
		window.addEventListener('toggle-hierarchy', () => {
			console.info('toggle-hierarchy');
			open_tab('hierarchy');
		});
	}

	if ( panel_tabs [ "prefab_explorer" ] !== undefined ) {
		window.addEventListener( 'toggle-prefab' , ( ) => {
			console.info( 'toggle-prefab' ) ;
			open_tab( 'prefab_explorer' ) ;
		} ) ;
	}

	if (panel_tabs['route'] !== undefined) {
		window.addEventListener('toggle-route', () => {
			console.info('toggle-route');
			open_tab('route');
		});
	}

	if (panel_tabs['controls'] !== undefined) {
		window.addEventListener('toggle-controls', () => {
			console.info('toggle-controls');
			open_tab('controls');
		});
	}

	// onDestroy(
	// 	() => {
	// 		subscribers.forEach(
	// 			(s) => {
	//		TODO unsubscribe
	// 			}
	// 		)
	// 	}
	// )

	function open_tab(name: string) {
		Object.entries(panel_tabs).forEach(([key, value]) => {
			if (key === name) {
				if (get(value.state) === 'open') {
					value.state.set('closed');
					state = 'closed';
				} else if (get(value.state) === 'closed') {
					value.state.set('open');
					state = 'open';
				} else {
					throw new Error('Unhandled case for tab state.');
				}
			} else {
				if (get(value.state) === 'open') value.state.set('closed');
			}
		});
	}


	function onOpenFile( e : Event & { currentTarget: EventTarget & HTMLInputElement; } ) {
		if ( e.target === null ) return;
		const input_target = e.target as HTMLInputElement;
		if ( input_target.files !== null  ) {
			const file = input_target.files[0];
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = JSON.parse(e.target?.result as string);
				loadScene(data['scene']);
				loadPrefabs(data['prefabs'])
			};
			reader.readAsText(file);
		}
	}
</script>

<div class=" outerframe {position} {state}">
	<!-- BUTTON BAR-->
	<div class="button-bar">
		{#if position === 'left'}
			<!-- Create a file input that opens the file dialog when clicked. -->
			<!-- Use fa-solid fa-folder-open fontawesome icon for the button-->
			<button>
				<label for="file-input">
					<i class="fas fa-2x fa-folder-open">
						<input 
							type="file" 
							id="file-input" 
							accept=".json" 
							style="display: none;" 
							on:change={onOpenFile}
						/>
					</i>
				</label>
			</button>
		{/if}
		{#each Object.entries(panel_tabs) as [key, value]}
			<button on:click={() => open_tab(key)}>
				{#if value.type === 'panel_view'}
					{#if position === 'bottom'}
						<div>{value['button_text']}</div>
					{:else}
						<i class="{value['button_icon']} {get(value.state)}" />
					{/if}
				{:else}
					<i class="{value['button_icon']} {get(value.state)}" />
					<svelte:component this={value['component']} state={value.state} direction={position} />
				{/if}
			</button>
		{/each}
	</div>

	<!-- PANEL  -->
	<div class="panel {state}">
		{#each Object.values(panel_tabs) as value}
			{#if value.type === 'panel_view'}
				<svelte:component this={value['component']} state={value.state} />
			{/if}
		{/each}
	</div>
</div>

<style lang="less">
	.left {
		display: grid;

		&.inactive,
		&.closed {
			grid-template-columns: 50px 0px;
		}

		&.open {
			grid-template-columns: 50px 400px;
		}

		.button-bar {
			button,
			label {
				flex: 0 0 80px;
				width: 40px;
			}

			display: flex;
			flex-direction: column;
			flex: 0 0 content;
		}

		.panel {
			background-color: gray;

			&.inactive,
			&.closed {
				display: none;
			}
			&.open {
				display: block;
			}
		}
	}

	.right {
		flex-direction: column;

		.button-bar {
			button {
				flex: 0 0 100px;
			}

			display: none;
			flex-direction: column;
			flex: 0 0 content;
		}

		.right :nth-child(1) {
			order: 3;
		}

		.right :nth-child(3) {
			order: 1;
		}

		.panel.active-open {
			flex: 0 1 max(content, 350px);
			background-color: gray;
		}
	}

	.bottom {
		flex-direction: column-reverse;

		.button {
			flex: 0 0 80px;
		}

		.panel {
			flex: 0 5 content;
		}

		.button-bar {
			display: flex;
			flex: 0 0 20px;
			flex-direction: row-reverse;
		}
	}

	.indicator-bar {
		display: flex;
		flex: 0 0 auto;
		flex-direction: column;
	}

	.button-bar {
		i:hover {
			color: rgb(241, 241, 241);
		}

		i.active {
			color: rgb(241, 241, 241);
		}

		background-color: rgb(128, 128, 128);
	}

	button {
		background-color: rgb(140, 140, 140);
		border: 1px solid;
	}
</style>

