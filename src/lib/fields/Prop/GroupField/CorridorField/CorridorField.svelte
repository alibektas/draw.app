<script lang="ts">
	import { ComponentStateType } from "$lib/fields/base/Field/FieldTypes";
	import type { ITextField } from "$lib/fields/base/TextField/ITextField";
	import TextField from "$lib/fields/base/TextField/TextField.svelte";
	import PropField from '$lib/fields/Prop/PropField.svelte';
	import Expandable from '$lib/ui/Expandable.svelte';
	import type { Corridor } from "$lib/wrapper/prop/nonphysical/group/corridor/Corridor";
	
	export let obj: Corridor;
	let isExpanded = true;
	const infos = window.sessionConfig.info_texts.Group;

	const corridorCode : ITextField =  {
		"state" : ComponentStateType.INFO,
		'uuid' : obj.uuid,
		"onchange" : (value : string) => {
			obj.corridor_code = value;
		},
		"ui_text" : {
			"header" : "Corridor Code",
			"placeholder" : "Corridor Code",
			"about" : "Corridor Code",
		},
		'user_mem' : obj.input_corridor_code,
		"errors" : {},
		"warnings" : {}
	};

	const firstRowNaming : ITextField =  {
		"state" : ComponentStateType.INFO,
		'uuid' : obj.uuid,
		"onchange" : (value : string) => {
			obj.first_row_naming = value;
		},
		"ui_text" : {
			"header" : "First Row Naming",
			"placeholder" : "First Row Naming",
			"about" : "First Row Naming",
		},
		'user_mem' : obj.input_first_row_naming,
		"errors" : {},
		"warnings" : {}
	};

	const secondRowNaming : ITextField =  {
		"state" : ComponentStateType.INFO,
		'uuid' : obj.uuid,
		"onchange" : (value : string) => {
			obj.second_row_naming = value;
		},
		"ui_text" : {
			"header" : "Second Row Naming",
			"placeholder" : "Second Row Naming",
			"about" : "Second Row Naming",
		},
		'user_mem' : obj.input_second_row_naming,
		"errors" : {},
		"warnings" : {}
	};
</script>

<!-- A field where addresses are shown.-->
<!-- The address is shown as a string, but the user can click on it to select the object. -->
<Expandable ui_text={infos.Expandable} {isExpanded}>
	<PropField {obj} />
	<TextField opt={corridorCode} />
	<TextField opt={firstRowNaming} />
	<TextField opt={secondRowNaming} />
	<button on:click={() => obj.address()}>
		"Generate"
	</button>
</Expandable>
