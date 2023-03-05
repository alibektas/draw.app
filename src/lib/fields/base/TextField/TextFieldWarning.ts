import type { WarningFormType } from '../Field/FieldWarning';

export type TextFieldWarningType = 'MaxLengthWarning' | 'MinLengthWarning';

export type TextFieldWarningForm = WarningFormType<TextFieldWarningType, string>;
