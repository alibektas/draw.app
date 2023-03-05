<script lang="ts">
	import { DEFAULT_SHELF_SPACING } from '$lib/constants';
	import { ComponentStateType } from '$lib/fields/base/Field/FieldTypes';
	import type { IMultipleChoiceField } from '$lib/fields/base/MultipleChoiceField/IMultipleChoiceField';
	import MultipleChoiceField from '$lib/fields/base/MultipleChoiceField/MultipleChoiceField.svelte';
	import type { INumberField } from '$lib/fields/base/NumberField/INumberField';
	import NumberField from '$lib/fields/base/NumberField/NumberField.svelte';
	import PropField from '$lib/fields/Prop/PropField.svelte';
	import Expandable from '$lib/ui/Expandable.svelte';
	import type { Rack } from "$lib/wrapper/prop/physical/rack/Rack";
	import { get } from 'svelte/store';

	export let obj: Rack;

	const info = window.sessionConfig.info_texts.Module;

	const errs = window.sessionConfig.errs.RackFieldErrorType;
	const warns = window.sessionConfig.warns.RackFieldWarningType;

	const shelfWidthOptions: INumberField = {
		ui_text: info.ShelfWidth,
		state: ComponentStateType.INFO,
		uuid: obj.uuid,
		onchange: (arg) => {
			obj.shelfWidth = arg;
			window.scene.render();
		},
		user_mem: obj.input_shelfWidth,
		errors: {
			MaxValueError: errs.ShelfWidthError.MaxValueError,
			MinValueError: errs.ShelfWidthError.MinValueError,
			NegativeNumberError: errs.ShelfWidthError.NegativeNumberError
		},
		warnings: {}
	};

	const numberOfShelvesOption: INumberField = {
		ui_text: info.NumberShelves,
		uuid: obj.uuid,
		state: ComponentStateType.INFO,
		onchange: (arg) => {
			obj.shelfCount = arg;
			const l1 = get(obj.input_shelfActive).length;
			const l2 = get(obj.input_shelvesSpacing).length;

			if (l1 < arg) {
				obj.input_shelfActive.update((arr) => {
					for (let i = l1; i < arg; i++) {
						arr.push(false);
					}
					return arr;
				});
			} else if (l1 > arg) {
				obj.input_shelfActive.update((arr) => {
					for (let i = l1; i > arg; i--) {
						arr.pop();
					}
					return arr;
				});
			}

			if (l2 < arg) {
				for (let i = l2; i < arg; i++) {
					obj.input_shelvesSpacing.update((arr) => {
						arr.push(String(DEFAULT_SHELF_SPACING));
						return arr;
					});
				}
			} else if (l2 > arg) {
				for (let i = l2; i > arg; i--) {
					obj.input_shelvesSpacing.update((arr) => {
						arr.pop();
						return arr;
					});
				}
			}

			window.scene.render();
		},
		user_mem: obj.input_shelfCount,
		errors: {
			NegativeNumberError: errs.NumberShelvesError.NegativeNumberError,
			MaxValueError: errs.NumberShelvesError.MaxValueError,
			MinValueError: errs.NumberShelvesError.MinValueError
		},
		warnings: {
			ZeroNumericalValueWarning: warns.NumberShelvesWarning.ZeroNumericalValueWarning
		}
	};

	const shelfDepthOptions: INumberField = {
		ui_text: info.ShelfDepth,
		state: ComponentStateType.INFO,
		uuid: obj.uuid,
		onchange: (arg) => {
			obj.shelfDepth = arg;
			window.scene.render();
		},
		user_mem: obj.input_shelfDepth,
		errors: {
			MaxValueError: errs.ShelfDepthError.MaxValueError,
			NegativeNumberError: errs.ShelfDepthError.NegativeNumberError
		},
		warnings: {}
	};

	const inactiveShelvesOptions: IMultipleChoiceField<boolean> = {
		user_mem: obj.input_shelfActive,
		onchange: (v, index) => {
			obj.set_shelf_activity(index, !v)
			window.scene.render();
		},
		slot_type: 'checkbox',
		ui_text: info.InactiveShelves,
		uuid: obj.uuid,
		state: ComponentStateType.INFO,
		errors: {},
		warnings: {}
	};

	const shelfSpacingOptions: IMultipleChoiceField<number> = {
		slot_type: 'number',
		ui_text: info.ShelfSpacing,
		state: ComponentStateType.INFO,
		onchange: (v, index) => {
			obj.set_single_shelf_spacing(index, v);
			window.scene.render();
		},
		user_mem: obj.input_shelvesSpacing,
		uuid: obj.uuid,
		errors: {},
		warnings: {}
	};

	// const axataAddress : IVector3Field<ITextField> = {
	// 	"x" : {
			
	// 	}
	// }
</script>

<PropField {obj} />
<Expandable isExpanded={true} ui_text={info.Expandable}>
	<!-- NumberShelves -->
	<NumberField opt={numberOfShelvesOption} />

	<!-- InactiveShelves -->
	<div class="button-grid">
		<div class="button">
			<MultipleChoiceField opt={inactiveShelvesOptions} />
		</div>
	</div>

	<!-- ShelfWidth -->
	<NumberField opt={shelfWidthOptions} />

	<!-- ShelfDepth -->
	<NumberField opt={shelfDepthOptions} />

	<div class="inactive-shelves-grid">
		<div class="inactive-shelf-entry">
			<MultipleChoiceField opt={shelfSpacingOptions} />
		</div>
	</div>
</Expandable>

<style lang="less">
	.button {
		display: grid;
		grid-template-columns: 20px 20px;
	}

	.button-grid {
		display: grid;
		grid-template-columns: 40px 40px 40px;
		column-gap: 15px;
	}

	.inactive-shelves-grid {
		display: grid;
		grid-template-columns: 80px 80px;
		column-gap: 20px;
	}

	.inactive-shelf-entry {
		display: grid;
		grid-template-columns: 20px 60px;
	}
</style>
