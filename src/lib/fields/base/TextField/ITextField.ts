import type { IField } from '../Field/IField';
import type { TextFieldErrorType } from './TextFieldError';
import type { TextFieldWarningType } from './TextFieldWarning';

export interface ITextField
	extends IField<'singular', string, TextFieldErrorType, TextFieldWarningType> {
	onchange: (m: string) => void;
}
