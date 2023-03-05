<script lang="ts">
	import { get } from 'svelte/store';
	import InfoBox from '../InfoBox/InfoBox.svelte';
	import type { IMultipleChoiceField } from './IMultipleChoiceField';
	export let opt: IMultipleChoiceField<any>;

	let len = 0;
	opt.user_mem.subscribe((val) => {
		len = val.length;
	});

	function onmultiplechoicechange(e: Event, index: number) {
		if (opt.slot_type === 'checkbox') {
			const target = e.target as HTMLInputElement;
			opt.user_mem.update((arr) => {
				arr[index] = target.checked;
				return arr;
			});
			opt.onchange(target.checked, index);
			return;
		} else {
			const target = e.target as HTMLInputElement;
			opt.user_mem.update((arr) => {
				arr[index] = target.checked;
				return arr;
			});
			opt.onchange(target.valueAsNumber, index);
			return;
		}
	}
</script>

<div class="container">
	<div class="field_title">
		{opt.ui_text.header}
	</div>
	<div class="choices">
		{#if opt.slot_type === 'number'}
			{#key len}
				{#each get(opt.user_mem) as slot, index (index)}
					<div class="text-field">
						<div>{index + 1}</div>
						<input
							name="field"
							type="number"
							value={Number(slot)}
							on:input={(e) => {
								onmultiplechoicechange(e, index);
							}}
						/>
					</div>
				{/each}
			{/key}
		{:else if opt.slot_type === 'checkbox'}
			{#key len}
				{#each get(opt.user_mem) as slot, index (index)}
					<div class="button">
						<div>{index + 1}</div>
						<input
							name="field"
							type="checkbox"
							checked={slot === true}
							on:input={(e) => {
								onmultiplechoicechange(e, index);
							}}
						/>
					</div>
				{/each}
			{/key}
		{/if}
	</div>
	<InfoBox info={opt.ui_text.about} state={opt.state} />
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 100px 1fr 30px;
	}

	.field_title {
		text-align: center;
	}

	.choices {
		display: grid;
		grid-template-columns: repeat(2, 80px);
	}

	.text-field {
		display: grid;
		grid-template-columns: 30px 50px;
	}

	.button {
		display: grid;
		grid-template-columns: 50px 20px;
	}
</style>
