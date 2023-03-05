import type { WarningFormType } from '$lib/fields/base/Field/FieldWarning';
import type { NumberFieldWarningType } from '$lib/fields/base/NumberField/NumberFieldWarning';

export type NumberShelvesWarningType = NumberFieldWarningType;

export type InactiveShelvesWarningType =
	/** All shelves are inactive which*/
	'AllShelvesInactive';

export type ShelfHeightWarningType = NumberFieldWarningType;
export type ShelfDepthWarningType = NumberFieldWarningType;
export type ShelfWidthWarningType = NumberFieldWarningType;
export type ShelfSpacingWarningType = NumberFieldWarningType;

export type RackFieldWarningFormType = {
	NumberShelvesWarning: WarningFormType<NumberShelvesWarningType, number>;
	InactiveShelvesWarning: WarningFormType<InactiveShelvesWarningType, Array<boolean>>;
	ShelfHeightWarning: WarningFormType<ShelfHeightWarningType, number>;
	ShelfDepthWarning: WarningFormType<ShelfDepthWarningType, number>;
	ShelfWidthWarning: WarningFormType<ShelfWidthWarningType, number>;
	ShelfSpacingWarning: WarningFormType<ShelfSpacingWarningType, Array<number>>;
};
