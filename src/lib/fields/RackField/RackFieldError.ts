import type { ErrorFormType } from '$lib/fields/base/Field/FieldError';
import type { NumberFieldErrorType } from '$lib/fields/base/NumberField/NumberFieldError';

export type NumberShelvesErrorType = NumberFieldErrorType;
export type ShelfHeightErrorType = NumberFieldErrorType;
export type ShelfDepthErrorType = NumberFieldErrorType;
export type ShelfWidthErrorType = NumberFieldErrorType;
export type ShelfSpacingErrorType = NumberFieldErrorType;

export type InactiveShelvesErrorType =
	/** All shelves are inactive*/
	'AllShelvesInactive';

export type RackFieldErrorFormType = {
	NumberShelvesError: ErrorFormType<NumberShelvesErrorType, number>;
	InactiveShelvesError: ErrorFormType<InactiveShelvesErrorType, Array<boolean>>;
	ShelfHeightError: ErrorFormType<ShelfHeightErrorType, number>;
	ShelfDepthError: ErrorFormType<ShelfDepthErrorType, number>;
	ShelfWidthError: ErrorFormType<ShelfWidthErrorType, number>;
	ShelfSpacingError: ErrorFormType<ShelfSpacingErrorType, Array<number>>;
};
