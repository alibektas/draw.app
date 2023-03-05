<script lang="ts">
	import type { ProblemsObject } from '$lib/common';
	import { errorCount, problems, warningCount } from '$lib/stores/stores';
	import Field from '../Field/Field.svelte';
	import type { INumberField } from '../NumberField/INumberField';
	import type { IVector3Field } from './IVector3Field';
	import type { Vector3FieldError } from './Vector3FieldError';
	import type { Vector3FieldWarning } from './Vector3FieldWarning';
	export let opt: IVector3Field<INumberField>;

	function oninput(e: Event, comp: 'x' | 'y' | 'z') {
		let value = (e.target as HTMLInputElement).value;

		// Set the value, so the parent can see the value's changed.
		opt[comp].user_mem.set(value);

		const nval = Number(value);

		/** Whether we should update var of type svelte.store problem*/
		let no_problems_found = true;

		const problemsObject: ProblemsObject<Vector3FieldError, Vector3FieldWarning> = {
			errors: [],
			warnings: []
		};

		Object.entries(opt[comp].errors).forEach(([error_name, guard]) => {
			const key = error_name as Vector3FieldError;
			if (guard.handler(nval) === 'error') {
				problemsObject['errors'].push([key, guard.formatter(nval)]);
				no_problems_found = false;
			}
		});

		Object.entries(opt[comp].warnings).forEach(([warning_name, guard]) => {
			const key = warning_name as Vector3FieldWarning;
			if (guard.handler(nval) === 'warning') {
				problemsObject['warnings'].push([key, guard.formatter(nval)]);
				no_problems_found = false;
			}
		});

		// Update problems store.
		problems.update((ps) => {
			const old_err_count = ps[opt.x.uuid] !== undefined ? ps[opt.x.uuid].errors.length : 0;
			const old_warn_count = ps[opt.x.uuid] !== undefined ? ps[opt.x.uuid].warnings.length : 0;

			errorCount.update((a) => a + problemsObject.errors.length - old_err_count);
			warningCount.update((a) => a + problemsObject.warnings.length - old_warn_count);

			ps[opt.x.uuid] = problemsObject;
			return ps;
		});

		if (no_problems_found) opt[comp].onchange(nval);
	}

	let x = opt.x.user_mem;
	let y = opt.y.user_mem;
	let z = opt.z.user_mem;
</script>

<Field opt={opt.x}>
	<div style="display:grid;grid-template-columns:50px 50px 50px;grid-gap:5px;">
		<!-- <div id="field" contenteditable='true' on:change={onChange}>{value} </div>
        <div id="fieldY" contenteditable='true' on:change={onChange}>{valueY} </div>
        <div id="fieldZ" contenteditable='true' on:change={onChange}>{valueZ} </div> -->

		<input
			name="field"
			type="number"
			value={$x}
			on:input={(e) => {
				oninput(e, 'x');
			}}
		/>
		<input
			name="fieldY"
			type="number"
			value={$y}
			on:input={(e) => {
				oninput(e, 'y');
			}}
		/>
		<input
			name="fieldZ"
			type="number"
			value={$z}
			on:input={(e) => {
				oninput(e, 'z');
			}}
		/>
	</div>
</Field>
