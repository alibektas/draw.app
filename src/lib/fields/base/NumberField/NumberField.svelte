<script lang="ts" context="module">
</script>

<script lang="ts">
	import { errorCount, problems, warningCount } from '$lib/stores/stores';
	import Field from '../Field/Field.svelte';
	import { get } from 'svelte/store';
	import type { INumberField } from './INumberField';
	import type { NumberFieldWarningType } from './NumberFieldWarning';
	import type { NumberFieldErrorType } from './NumberFieldError';
	import type { ProblemsObject } from '$lib/common';

	export let opt: INumberField;

	/**
	 * @summary This function checks whether the given value (as given on change) is admissible for this field.
	 * @param e Input event for the change in value.
	 * @returns boolean This value is true if the given value passes all admissibility checks. Otherwise it is false.
	 */
	function onnumberfieldchange(e: Event) {
		let value = (e.target as HTMLInputElement).value;

		// Save the value, so the parent can see the value's changed.
		opt.user_mem.set(value);

		const nval = Number(value);

		/** Whether we can call sub*/
		let no_problems_found = true;

		const problemsObject: ProblemsObject<NumberFieldErrorType, NumberFieldWarningType> = {
			errors: [],
			warnings: []
		};

		for (const [name, guard] of Object.entries(opt.errors)) {
			const key = name as NumberFieldErrorType;
			if (guard.handler(nval) === 'error') {
				problemsObject['errors'].push([key, guard.formatter(nval)]);
				no_problems_found = false;
			}
		}

		for (const [name, guard] of Object.entries(opt.warnings)) {
			const key = name as NumberFieldWarningType;
			if (guard.handler(nval) === 'warning') {
				problemsObject['warnings'].push([key, guard.formatter(nval)]);
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
			opt.onchange(nval);
		}
	}
</script>

<Field {opt}>
	<input type="number" min="0" on:input={onnumberfieldchange} value={get(opt.user_mem)} />
</Field>
