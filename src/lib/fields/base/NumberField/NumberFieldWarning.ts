import type { WarningFormType } from '../Field/FieldWarning';

export type NumberFieldWarningType =
	| 'NegativeNumberWarning'
	| 'ZeroNumericalValueWarning'
	| 'PositiveNumberWarning'
	| 'MaxValueWarning'
	| 'MinValueWarning';

export type NumberFieldWarningForm = WarningFormType<NumberFieldWarningType, number>;
