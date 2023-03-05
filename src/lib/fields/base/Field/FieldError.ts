export type FieldErrorHandlerType<T> = T extends Array<unknown>
	? (val: T, index?: number) => 'error' | 'no-error'
	: (val: T) => 'error' | 'no-error';

export type FieldErrorFormatterType<T> = T extends Array<unknown>
	? (val: T, index?: number) => string
	: (val: T) => string;

export type SingleErrorFormType<T> = {
	handler: FieldErrorHandlerType<T>;
	formatter: FieldErrorFormatterType<T>;
};

export type ErrorFormType<T extends string, FieldType> = {
	[key in T]: SingleErrorFormType<FieldType>;
};
