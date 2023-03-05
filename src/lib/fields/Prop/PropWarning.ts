import type { WarningFormType } from '../base/Field/FieldWarning';
import type { NumberFieldWarningType } from '../base/NumberField/NumberFieldWarning';
import type { TextFieldWarningType } from '../base/TextField/TextFieldWarning';
import type { IVector3Field } from '../base/Vector3Field/IVector3Field';

type NameFieldWarningType = TextFieldWarningType;
type IsHiddenFieldWarningType = string;
type PositionFieldWarningType = NumberFieldWarningType;
type RotationFieldWarningType = NumberFieldWarningType;

export type PropFieldWarningFormType = {
	NameFieldWarning: WarningFormType<NameFieldWarningType, string>;
	IsHiddenFieldWarning: WarningFormType<IsHiddenFieldWarningType, boolean>;
	PositionFieldWarning: IVector3Field<WarningFormType<PositionFieldWarningType, number>>;
	RotationFieldWarning: IVector3Field<WarningFormType<RotationFieldWarningType, number>>;
};
