import type { ErrorFormType } from '../Field/FieldError';

export type NumberFieldErrorType =
	| 'NegativeNumberError'
	| 'ZeroNumericalValueError'
	| 'PositiveNumberError'
	| 'MaxValueError'
	| 'MinValueError'
	| 'ValueIsNaN';

export type NumberFieldErrorFormType = ErrorFormType<NumberFieldErrorType, number>;
