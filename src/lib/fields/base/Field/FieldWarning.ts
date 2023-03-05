export type FieldWarningHandlerType<T> = T extends Array<unknown>
	? (val: T, index: number) => 'warning' | 'no-warning'
	: (val: T) => 'warning' | 'no-warning';

export type FieldWarningFormatterType<T> = T extends Array<unknown>
	? (val: T, index: number) => string
	: (val: T) => string;

export type SingleWarningFormType<T> = {
	handler: FieldWarningHandlerType<T>;
	formatter: FieldWarningFormatterType<T>;
};

export type WarningFormType<T extends string, FieldType> = {
	[key in T]: SingleWarningFormType<FieldType>;
};
