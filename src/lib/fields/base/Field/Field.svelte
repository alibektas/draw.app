<script lang="ts">
	import InfoBox from '../InfoBox/InfoBox.svelte';
	import type { IField } from './IField';
	export let opt: IField<'singular', any, any, any>;
</script>

<div
	style="
        display: grid;
        grid-template-columns: 100px 1fr 30px;
    "
>
	<div class="field_title">
		{opt.ui_text.header}
	</div>
	<div>
		<slot />
	</div>
	<InfoBox info={opt.ui_text.about} state={opt.state} />
</div>

<style>
	.field_title {
		text-align: center;
	}
</style>
