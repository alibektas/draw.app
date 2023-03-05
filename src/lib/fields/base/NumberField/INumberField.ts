import type { IField } from '../Field/IField';
import type { NumberFieldErrorType } from './NumberFieldError';
import type { NumberFieldWarningType } from './NumberFieldWarning';

export interface INumberField
	extends IField<'singular', number, NumberFieldErrorType, NumberFieldWarningType> {
	step?: number;
}
