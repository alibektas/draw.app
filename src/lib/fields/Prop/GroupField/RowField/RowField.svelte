<script lang="ts">
	import PropField from '$lib/fields/Prop/PropField.svelte';
	import Expandable from '$lib/ui/Expandable.svelte';
	import type { Row } from "$lib/wrapper/prop/nonphysical/group/row/Row";


	export let obj: Row ;
	let isExpanded = true;

	const infos = window.sessionConfig.info_texts.Group;

</script>

<!-- A field where addresses are shown.-->
<!-- The address is shown as a string, but the user can click on it to select the object. -->
<Expandable ui_text={infos.Expandable} {isExpanded}>
	<PropField {obj} />
</Expandable>
