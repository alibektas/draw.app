import type { IField } from '../Field/IField';
import type { BooleanFieldErrorType } from './BooleanFieldError';
import type { BooleanFieldWarningType } from './BooleanFieldWarning';

export interface IBooleanField
	extends IField<'singular', boolean, BooleanFieldErrorType, BooleanFieldWarningType> {
	onchange: (m: boolean) => void;
}
