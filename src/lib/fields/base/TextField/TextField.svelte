<script lang="ts">
	import { errorCount, problems, warningCount } from '$lib/stores/stores';
	import Field from '../Field/Field.svelte';
	import { get } from 'svelte/store';
	import type { ITextField } from './ITextField';
	import type { ProblemsObject } from '$lib/common';
	import type { TextFieldErrorType } from './TextFieldError';
	import type { TextFieldWarningType } from './TextFieldWarning';

	export let opt: ITextField;

	/**
	 * @summary This function checks whether the given value (as given on change) is admissible for this field.
	 * @param e Input event for the change in value.
	 * @returns boolean This value is true if the given value passes all admissibility checks. Otherwise it is false.
	 */
	function ontextfieldchange(e: Event) {
		const problemsObject: ProblemsObject<TextFieldErrorType, TextFieldWarningType> = {
			errors: [],
			warnings: []
		};

		let value = (e.target as HTMLInputElement).value;

		// Save the value, so the parent can see the value's changed.
		opt.user_mem.set(value);

		let no_problems_found = true;

		for (const [error_name, guard] of Object.entries(opt.errors)) {
			const key = error_name as TextFieldErrorType;
			if (guard.handler(value) === 'error') {
				problemsObject['errors'].push([key, guard.formatter(value)]);
				errorCount.update((a) => a + 1);
				no_problems_found = false;
			}
		}

		for (const [warning_name, guard] of Object.entries(opt.warnings)) {
			const key = warning_name as TextFieldWarningType;
			if (guard.handler(value) === 'warning') {
				problemsObject['warnings'].push([key, guard.formatter(value)]);
				no_problems_found = false;
			}
		}

		// Update problems store.
		problems.update((ps) => {
			const old_err_count = ps[opt.uuid] !== undefined ? ps[opt.uuid].errors.length : 0;
			const old_warn_count = ps[opt.uuid] !== undefined ? ps[opt.uuid].warnings.length : 0;

			errorCount.update((a) => a + problemsObject.errors.length - old_err_count);
			warningCount.update((a) => a + problemsObject.warnings.length - old_warn_count);

			ps[opt.uuid] = problemsObject;
			return ps;
		});

		if (no_problems_found) {
			opt.onchange(value);
		}
	}
</script>

<Field {opt}>
	<input type="text" on:input={ontextfieldchange} value={get(opt.user_mem)} />
</Field>
