<script lang="ts">
	import Field from '../Field/Field.svelte';
	import type { IBooleanField } from './IBooleanField';
	import { get } from 'svelte/store';

	export let opt: IBooleanField;

	/**
	 * @summary This function checks whether the given value (as given on change) is admissible for this field.
	 * @param e Input event for the change in value.
	 * @returns boolean This value is true if the given value passes all admissibility checks. Otherwise it is false.
	 */
	function onboolfieldchange(e: Event) {
		let value = (e.target as HTMLInputElement).checked;

		// Save the value, so the parent can see the value's changed.
		opt.user_mem.set(value);

		/** Whether we should update var of type svelte.store problem*/
		// let update = false;

		// const problemsObject : ProblemsObject<TextFieldErrorType , TextFieldWarningType> = {
		// 	'errors' : {},
		// 	'warnings' : {},
		// }

		// Propentries( opt.errors ).forEach(
		// 	( [ error_name , guard ] ) => {
		// 		const key = error_name as BooleanFieldErrorType;
		// 		if ( guard.handler( value ) === "error" )  {
		// 			problemsObject['errors'][key] = guard.formatter(value);
		// 			update = true;
		// 		}
		// 	}
		// )

		// Propentries( opt.warnings ).forEach(
		// 	( [ warning_name , guard ] ) => {
		// 		const key = warning_name as BooleanFieldWarningType;
		// 		if ( guard.handler( value ) === "warning" )  {
		// 			problemsObject['warnings'][key] = guard.formatter(value);
		// 			update = true;
		// 		}
		// 	}
		// )

		// if (update) {
		// 	// Update problems store.
		// 	problems.update((ps) => {
		// 		ps[opt.uuid] = problemsObject;
		// 		return ps;
		// 	});

		// 	return;
		// }

		opt.onchange(value);
	}
</script>

<Field {opt}>
	<input type="checkbox" on:input={onboolfieldchange} value={get(opt.user_mem)} />
</Field>
