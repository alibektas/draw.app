import type { SessionErrorType } from '$lib/common';
import {
	MAX_MODULE_COUNT_ERROR,
	MAX_POSITION_X_ERROR,
	MAX_POSITION_Y_ERROR,
	MAX_POSITION_Z_ERROR,
	MAX_ROTATION_X_ERROR,
	MAX_ROTATION_Y_ERROR,
	MAX_ROTATION_Z_ERROR,
	MAX_SHELF_DEPTH_ERROR,
	MAX_SHELF_HEIGHT_ERROR,
	MAX_SHELF_SPACING_ERROR,
	MAX_SHELF_WIDTH_ERROR,
	MIN_MODULE_COUNT_ERROR,
	MIN_ROTATION_X_ERROR,
	MIN_ROTATION_Y_ERROR,
	MIN_ROTATION_Z_ERROR,
	MIN_SHELF_DEPTH_ERROR,
	MIN_SHELF_HEIGHT_ERROR,
	MIN_SHELF_SPACING_ERROR,
	MIN_SHELF_WIDTH_ERROR
} from '$lib/constants';
import type { ErrorFormType } from '$lib/fields/base/Field/FieldError';
import type { NumberFieldErrorType } from '$lib/fields/base/NumberField/NumberFieldError';

import type { TextFieldErrorType } from '$lib/fields/base/TextField/TextFieldError';
import type { RackFieldErrorFormType } from '$lib/fields/RackField/RackFieldError';
import type { PropFieldErrorFormType } from '$lib/fields/Prop/PropError';

const num_field: ErrorFormType<NumberFieldErrorType, number> = {
	MaxValueError: {
		handler: (val) => {
			if (val === 100000) {
				return 'error';
			}
			return 'no-error';
		},
		formatter: (val) => {
			// TODO
			return `${val} cannot be greater than MAX_VALUE.`;
		}
	},
	MinValueError: {
		handler: () => {
			return 'no-error';
		},
		formatter: (val) => {
			// TODO
			return `${val} cannot be less than MIN_VALUE.`;
		}
	},
	NegativeNumberError: {
		handler: (val) => {
			if (val < 0) {
				return 'error';
			}

			return 'no-error';
		},
		formatter: (val) => {
			return `${val} cannot be negative.`;
		}
	},
	PositiveNumberError: {
		handler: (val) => {
			if (val > 0) {
				return 'error';
			}

			return 'no-error';
		},
		formatter: (val) => {
			return `${val} cannot be positive.`;
		}
	},
	ZeroNumericalValueError: {
		handler: (val) => {
			if (val === 0) {
				return 'error';
			}

			return 'no-error';
		},
		formatter: (val) => {
			return `${val} cannot be zero.`;
		}
	},
	ValueIsNaN: {
		handler: function (val): 'error' | 'no-error' {
			if (isNaN(val)) {
				return 'error';
			}

			return 'no-error';
		},
		formatter: function (): string {
			return 'Value is NaN.';
		}
	}
};

export const text_field: ErrorFormType<TextFieldErrorType, string> = {
	MaxLengthError: {
		handler: () => {
			return 'no-error';
		},
		formatter: (val) => {
			// TODO
			return `${val} cannot be longer than MAX_LENGTH.`;
		}
	},
	MinLengthError: {
		handler: () => {
			return 'no-error';
		},
		formatter: (val) => {
			// TODO
			return `${val} is too short.`;
		}
	}
};

const module_field: RackFieldErrorFormType = {
	NumberShelvesError: {
		ZeroNumericalValueError: {
			handler: (val) => {
				if (val === 0) {
					return 'error';
				}

				return 'no-error';
			},
			formatter: (val) => {
				return `Number of shelves cannot be zero. Value : ${val}.`;
			}
		},
		MaxValueError: {
			formatter: (val) => {
				return `Number of shelves cannot be greater than ${MAX_MODULE_COUNT_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val > MAX_MODULE_COUNT_ERROR) {
					return 'error';
				}
				return 'no-error';
			}
		},
		MinValueError: {
			formatter: (val) => {
				return `Number of shelves cannot be less than ${MIN_MODULE_COUNT_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val < MIN_MODULE_COUNT_ERROR) {
					return 'error';
				}
				return 'no-error';
			}
		},
		NegativeNumberError: {
			formatter: (val) => {
				return `Number of shelves cannot be negative. Value : ${val}.`;
			},
			handler: num_field.NegativeNumberError.handler
		},
		PositiveNumberError: {
			formatter: (val) => {
				return `Number of shelves cannot be positive. Value : ${val}.`;
			},
			handler: num_field.PositiveNumberError.handler
		},
		ValueIsNaN: {
			handler: num_field.ValueIsNaN.handler,
			formatter: () => 'Number of shelves is not a number.'
		}
	},
	InactiveShelvesError: {
		AllShelvesInactive: {
			formatter: () => {
				return `Not all shelves can be inactive.`;
			},
			handler: (val) => {
				for (let i = 0; i < val.length; i++) {
					if (val[i] === true) {
						return 'no-error';
					}
				}

				return 'error';
			}
		}
	},
	ShelfHeightError: {
		MaxValueError: {
			formatter: (val) => {
				return `Shelf height cannot be greater than ${MAX_SHELF_HEIGHT_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val > MAX_SHELF_HEIGHT_ERROR) {
					return 'error';
				}
				return 'no-error';
			}
		},
		MinValueError: {
			formatter: (val) => {
				return `Shelf height cannot be less than ${MIN_SHELF_HEIGHT_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val < MIN_SHELF_HEIGHT_ERROR) {
					return 'error';
				}
				return 'no-error';
			}
		},
		NegativeNumberError: {
			formatter: (val) => {
				return `Shelf height cannot be negative. Value : ${val}.`;
			},
			handler: num_field.NegativeNumberError.handler
		},
		PositiveNumberError: {
			formatter: (val) => {
				return `Shelf height cannot be positive. Value : ${val}.`;
			},
			handler: num_field.PositiveNumberError.handler
		},
		ZeroNumericalValueError: {
			formatter: (val) => {
				return `Shelf height cannot be zero. Value : ${val}.`;
			},
			handler: num_field.ZeroNumericalValueError.handler
		},
		ValueIsNaN: {
			handler: num_field.ValueIsNaN.handler,
			formatter: () => {
				return 'Shelf height value is not a number.';
			}
		}
	},
	ShelfDepthError: {
		MaxValueError: {
			formatter: (val) => {
				return `Shelf depth cannot be greater than ${MAX_SHELF_DEPTH_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val > MAX_SHELF_DEPTH_ERROR) {
					return 'error';
				}
				return 'no-error';
			}
		},
		NegativeNumberError: {
			formatter: (val) => {
				return `Shelf depth cannot be negative. Value : ${val}.`;
			},
			handler: num_field.NegativeNumberError.handler
		},
		MinValueError: {
			formatter: (val) => {
				return `Shelf depth cannot be less than ${MIN_SHELF_DEPTH_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val < MIN_SHELF_DEPTH_ERROR) {
					return 'error';
				}
				return 'no-error';
			}
		},
		PositiveNumberError: {
			formatter: (val) => {
				return `Shelf depth cannot be positive. Value : ${val}.`;
			},
			handler: num_field.PositiveNumberError.handler
		},
		ZeroNumericalValueError: {
			formatter: (val) => {
				return `Shelf depth cannot be zero. Value : ${val}.`;
			},
			handler: num_field.ZeroNumericalValueError.handler
		},
		ValueIsNaN: {
			handler: num_field.ValueIsNaN.handler,
			formatter: () => {
				return 'Shelf depth value is not a number.';
			}
		}
	},
	ShelfWidthError: {
		ValueIsNaN: {
			formatter: () => {
				return 'Shelf width value is not a number.';
			},
			handler: num_field.ValueIsNaN.handler
		},
		MaxValueError: {
			formatter: (val) => {
				return `Shelf width cannot be greater than ${MAX_SHELF_WIDTH_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val > MAX_SHELF_WIDTH_ERROR) {
					return 'error';
				}
				return 'no-error';
			}
		},
		NegativeNumberError: {
			formatter: (val) => {
				return `Shelf width cannot be negative. Value : ${val}.`;
			},
			handler: num_field.NegativeNumberError.handler
		},
		MinValueError: {
			formatter: (val) => {
				return `Shelf width cannot be less than ${MIN_SHELF_WIDTH_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val < MIN_SHELF_WIDTH_ERROR) {
					return 'error';
				}
				return 'no-error';
			}
		},
		PositiveNumberError: {
			formatter: (val) => {
				return `Shelf width cannot be positive. Value : ${val}.`;
			},
			handler: num_field.PositiveNumberError.handler
		},
		ZeroNumericalValueError: {
			formatter: (val) => {
				return `Shelf width cannot be zero. Value : ${val}.`;
			},
			handler: num_field.ZeroNumericalValueError.handler
		}
	},
	ShelfSpacingError: {
		ValueIsNaN: {
			formatter: () => {
				return 'Shelf spacing value is not a number.';
			},
			handler: (array, index) => {
				if (index !== undefined) {
					return num_field.ValueIsNaN.handler(array[index]);
				} else {
					for (let i = 0; i < array.length; i++) {
						if (num_field.ValueIsNaN.handler(array[i]) === 'error') {
							return 'error';
						}
					}
				}
				return 'no-error';
			}
		},
		MaxValueError: {
			formatter: (val) => {
				return `Shelf depth cannot be greater than ${MAX_SHELF_SPACING_ERROR}. Value : ${val}.`;
			},
			handler: (val, index) => {
				if (index !== undefined) {
					if (val[index] > MAX_SHELF_SPACING_ERROR) {
						return 'error';
					}
				} else {
					for (let i = 0; i < val.length; i++) {
						if (val[i] > MAX_SHELF_SPACING_ERROR) {
							return 'error';
						}
					}
				}

				return 'no-error';
			}
		},
		NegativeNumberError: {
			formatter: (val) => {
				return `Shelf depth cannot be negative. Value : ${val}.`;
			},
			handler: (array, index) => {
				if (index !== undefined) {
					return num_field.NegativeNumberError.handler(array[index]);
				} else {
					for (let i = 0; i < array.length; i++) {
						if (num_field.NegativeNumberError.handler(array[i]) === 'error') {
							return 'error';
						}
					}
				}
				return 'no-error';
			}
		},
		MinValueError: {
			formatter: (val) => {
				return `Shelf depth cannot be less than ${MIN_SHELF_SPACING_ERROR}. Value : ${val}.`;
			},
			handler: (array, index) => {
				if (index !== undefined) {
					if (array[index] < MIN_SHELF_SPACING_ERROR) {
						return 'error';
					}
				} else {
					for (let i = 0; i < array.length; i++) {
						if (array[i] < MIN_SHELF_SPACING_ERROR) {
							return 'error';
						}
					}
				}
				return 'no-error';
			}
		},
		PositiveNumberError: {
			formatter: (val) => {
				return `Shelf depth cannot be positive. Value : ${val}.`;
			},
			handler: (array, index) => {
				if (index !== undefined) {
					return num_field.PositiveNumberError.handler(array[index]);
				} else {
					for (let i = 0; i < array.length; i++) {
						if (num_field.PositiveNumberError.handler(array[i]) === 'error') {
							return 'error';
						}
					}
				}
				return 'no-error';
			}
		},
		ZeroNumericalValueError: {
			formatter: (val) => {
				return `Shelf depth cannot be zero. Value : ${val}.`;
			},
			handler: (array, index) => {
				if (index !== undefined) {
					return num_field.ZeroNumericalValueError.handler(array[index]);
				} else {
					for (let i = 0; i < array.length; i++) {
						if (num_field.ZeroNumericalValueError.handler(array[i]) === 'error') {
							return 'error';
						}
					}
				}
				return 'no-error';
			}
		}
	}
};

const object3d_field: PropFieldErrorFormType = {
	IsHiddenFieldError: {},
	NameFieldError: {
		MaxLengthError: text_field.MaxLengthError,
		MinLengthError: text_field.MinLengthError
	},
	PositionFieldError: {
		x: {
			ValueIsNaN: {
				formatter: () => {
					return "Position's x component is not a number.";
				},
				handler: num_field.ValueIsNaN.handler
			},
			BeyondAllowedPerimeterError: {
				formatter: (val) => {
					return `Position x cannot be greater than ${MAX_POSITION_X_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val > MAX_POSITION_X_ERROR) {
						return 'error';
					}
					return 'no-error';
				}
			},
			MaxValueError: num_field.MaxValueError,
			MinValueError: num_field.MinValueError,
			NegativeNumberError: num_field.NegativeNumberError,
			PositiveNumberError: num_field.PositiveNumberError,
			ZeroNumericalValueError: num_field.ZeroNumericalValueError
		},
		y: {
			ValueIsNaN: {
				formatter: () => {
					return "Position's y component is not a number.";
				},
				handler: num_field.ValueIsNaN.handler
			},
			BeyondAllowedPerimeterError: {
				formatter: (val) => {
					return `Position y cannot be greater than ${MAX_POSITION_Y_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val > MAX_POSITION_Y_ERROR) {
						return 'error';
					}
					return 'no-error';
				}
			},
			MaxValueError: num_field.MaxValueError,
			MinValueError: num_field.MinValueError,
			NegativeNumberError: num_field.NegativeNumberError,
			PositiveNumberError: num_field.PositiveNumberError,
			ZeroNumericalValueError: num_field.ZeroNumericalValueError
		},
		z: {
			ValueIsNaN: {
				formatter: () => {
					return "Position's z component is not a number.";
				},
				handler: num_field.ValueIsNaN.handler
			},
			BeyondAllowedPerimeterError: {
				formatter: (val) => {
					return `Position z cannot be greater than ${MAX_POSITION_Z_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val > MAX_POSITION_Z_ERROR) {
						return 'error';
					}
					return 'no-error';
				}
			},
			MaxValueError: num_field.MaxValueError,
			MinValueError: num_field.MinValueError,
			NegativeNumberError: num_field.NegativeNumberError,
			PositiveNumberError: num_field.PositiveNumberError,
			ZeroNumericalValueError: num_field.ZeroNumericalValueError
		}
	},
	RotationFieldError: {
		x: {
			ValueIsNaN: {
				formatter: () => {
					return "Rotation's x component is not a number.";
				},
				handler: num_field.ValueIsNaN.handler
			},
			MaxValueError: {
				formatter: (val) => {
					return `Rotation x cannot be greater than ${MAX_ROTATION_X_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val > MAX_ROTATION_X_ERROR) {
						return 'error';
					}
					return 'no-error';
				}
			},
			MinValueError: {
				formatter: (val) => {
					return `Rotation x cannot be less than ${MIN_ROTATION_X_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val < MIN_ROTATION_X_ERROR) {
						return 'error';
					}
					return 'no-error';
				}
			},
			NegativeNumberError: {
				formatter: (val) => {
					return `Rotation x cannot be negative. Value : ${val}.`;
				},
				handler: num_field.NegativeNumberError.handler
			},
			PositiveNumberError: {
				formatter: (val) => {
					return `Rotation x cannot be positive. Value : ${val}.`;
				},
				handler: num_field.PositiveNumberError.handler
			},
			ZeroNumericalValueError: {
				formatter: (val) => {
					return `Rotation x cannot be zero. Value : ${val}.`;
				},
				handler: num_field.ZeroNumericalValueError.handler
			},
			RotationForbiddenOnAxisError: {
				handler: (val) => {
					if (val !== 0) {
						return 'error';
					}
					return 'no-error';
				},
				formatter: (val) => {
					return `Rotation on x-axis is forbidden. Value : ${val}.`;
				}
			}
		},
		y: {
			ValueIsNaN: {
				formatter: () => {
					return "Rotation's y component is not a number.";
				},
				handler: num_field.ValueIsNaN.handler
			},
			MaxValueError: {
				formatter: (val) => {
					return `Rotation y cannot be greater than ${MAX_ROTATION_Y_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val > MAX_ROTATION_Y_ERROR) {
						return 'error';
					}
					return 'no-error';
				}
			},
			MinValueError: {
				formatter: (val) => {
					return `Rotation x cannot be less than ${MIN_ROTATION_Y_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val < MIN_ROTATION_Y_ERROR) {
						return 'error';
					}
					return 'no-error';
				}
			},
			NegativeNumberError: {
				formatter: (val) => {
					return `Rotation y cannot be negative. Value : ${val}.`;
				},
				handler: num_field.NegativeNumberError.handler
			},
			PositiveNumberError: {
				formatter: (val) => {
					return `Rotation y cannot be positive. Value : ${val}.`;
				},
				handler: num_field.PositiveNumberError.handler
			},
			ZeroNumericalValueError: {
				formatter: (val) => {
					return `Rotation y cannot be zero. Value : ${val}.`;
				},
				handler: num_field.ZeroNumericalValueError.handler
			},
			RotationForbiddenOnAxisError: {
				handler: (val) => {
					if (val !== 0) {
						return 'error';
					}
					return 'no-error';
				},
				formatter: (val) => {
					return `Rotation on y-axis is forbidden. Value : ${val}.`;
				}
			}
		},
		z: {
			ValueIsNaN: {
				formatter: () => {
					return "Rotation's z component is not a number.";
				},
				handler: num_field.ValueIsNaN.handler
			},
			MaxValueError: {
				formatter: (val) => {
					return `Rotation z cannot be greater than ${MAX_ROTATION_Z_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val > MAX_ROTATION_Y_ERROR) {
						return 'error';
					}
					return 'no-error';
				}
			},
			MinValueError: {
				formatter: (val) => {
					return `Rotation z cannot be less than ${MIN_ROTATION_Z_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val < MIN_ROTATION_Z_ERROR) {
						return 'error';
					}
					return 'no-error';
				}
			},
			NegativeNumberError: {
				formatter: (val) => {
					return `Rotation z cannot be negative. Value : ${val}.`;
				},
				handler: num_field.NegativeNumberError.handler
			},
			PositiveNumberError: {
				formatter: (val) => {
					return `Rotation z cannot be positive. Value : ${val}.`;
				},
				handler: num_field.PositiveNumberError.handler
			},
			ZeroNumericalValueError: {
				formatter: (val) => {
					return `Rotation z cannot be zero. Value : ${val}.`;
				},
				handler: num_field.ZeroNumericalValueError.handler
			},
			RotationForbiddenOnAxisError: {
				handler: (val) => {
					if (val !== 0) {
						return 'error';
					}
					return 'no-error';
				},
				formatter: (val) => {
					return `Rotation on z-axis is forbidden. Value : ${val}.`;
				}
			}
		}
	}
};

export const english_errs: SessionErrorType = {
	Core: {
		BoolField: {},
		NumField: num_field,
		TextField: text_field
	},
	RackFieldErrorType: module_field,
	PropFieldErrorType: object3d_field
};
