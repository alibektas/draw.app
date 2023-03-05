import type { ErrorFormType } from '../Field/FieldError';

export type TextFieldErrorType = 'MaxLengthError' | 'MinLengthError';

export type TextFieldErrorFormType = ErrorFormType<TextFieldErrorType, string>;
