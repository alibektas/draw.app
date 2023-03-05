import type { ErrorFormType } from '$lib/fields/base/Field/FieldError';
import type { IVector3Field } from '$lib/fields/base/Vector3Field/IVector3Field';
import type { NumberFieldErrorType } from '../base/NumberField/NumberFieldError';
import type { TextFieldErrorFormType } from '../base/TextField/TextFieldError';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
type IsHiddenFieldErrorType = string;
type PositionFieldErrorType = NumberFieldErrorType | 'BeyondAllowedPerimeterError';
type RotationFieldErrorType = NumberFieldErrorType | 'RotationForbiddenOnAxisError';

export interface PropFieldErrorFormType {
	NameFieldError: TextFieldErrorFormType;
	IsHiddenFieldError: ErrorFormType<IsHiddenFieldErrorType, boolean>;
	PositionFieldError: IVector3Field<ErrorFormType<PositionFieldErrorType, number>>;
	RotationFieldError: IVector3Field<ErrorFormType<RotationFieldErrorType, number>>;
}
