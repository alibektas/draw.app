import type { Writable } from 'svelte/store';
import type { ErrorFormType } from './FieldError';
import type { ComponentStateType } from './FieldTypes';
import type { WarningFormType } from './FieldWarning';

export interface IField<
	T extends 'arrayed' | 'singular',
	FieldType,
	ErrorTypes extends string,
	WarningTypes extends string
> {
	/** UI texts that make fields meaningful. These can be headers, info messages or a placeholder.*/
	ui_text: {
		header: string;
		about: string;
		placeholder?: string;
	};

	/**
	 * In case of an error or warning, user should be allowed to access the object that causes them by
	 * clicking in problems tab on the error message. To be able to redirect the user, we keep a record of
	 * the source object assigned to a property. The actual message is stored separately in the ProblemsObject
	 */
	uuid: string;

	/**
	 * As we cannot use an object's properties to store erroneous values, we keep a separate writable store.
	 */
	user_mem: T extends 'arrayed' ? Writable<Array<boolean | string>> : Writable<string | boolean>;

	/**
	 * State of this field.
	 */
	state: ComponentStateType;

	/**
	 * A function that is only then called
	 * if super validates **without** any problems
	 */
	onchange: T extends 'singular' ? (m: FieldType) => void : (m: FieldType, index: number) => void;

	errors: Partial<ErrorFormType<ErrorTypes, FieldType>>;
	warnings: Partial<WarningFormType<WarningTypes, FieldType>>;
}
