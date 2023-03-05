import type { IField } from '../Field/IField';
import type { MultipleChoiceFieldError } from './MultipleChoiceFieldError';
import type { MultipleChoiceFieldWarning } from './MultipleChoiceFieldWarning';

export interface IMultipleChoiceField<FieldType>
	extends IField<'arrayed', FieldType, MultipleChoiceFieldError, MultipleChoiceFieldWarning> {
	slot_type: FieldType extends boolean ? 'checkbox' : FieldType extends number ? 'number' : 'text';
}
