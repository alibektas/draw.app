import type { SessionWarningType } from '$lib/common';
import {
	MAX_MODULE_COUNT_ERROR,
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
import type { NumberFieldWarningForm } from '$lib/fields/base/NumberField/NumberFieldWarning';
import type { PropFieldWarningFormType } from '$lib/fields/Prop/PropWarning';
import type { TextFieldWarningForm } from '$lib/fields/base/TextField/TextFieldWarning';
import type { RackFieldWarningFormType } from '$lib/fields/RackField/RackFieldWarning';

const num_field: NumberFieldWarningForm = {
	MaxValueWarning: {
		handler: (val) => {
			if (val === 100000) {
				return 'warning';
			}
			return 'no-warning';
		},
		formatter: (val) => {
			// TODO
			return `${val} cannot be greater than MAX_VALUE.`;
		}
	},
	MinValueWarning: {
		handler: () => {
			return 'no-warning';
		},
		formatter: (val) => {
			// TODO
			return `${val} cannot be less than MIN_VALUE.`;
		}
	},
	NegativeNumberWarning: {
		handler: (val) => {
			if (val < 0) {
				return 'warning';
			}

			return 'no-warning';
		},
		formatter: (val) => {
			return `${val} cannot be negative.`;
		}
	},
	PositiveNumberWarning: {
		handler: (val) => {
			if (val > 0) {
				return 'warning';
			}

			return 'no-warning';
		},
		formatter: (val) => {
			return `${val} cannot be positive.`;
		}
	},
	ZeroNumericalValueWarning: {
		handler: (val) => {
			if (val === 0) {
				return 'warning';
			}

			return 'no-warning';
		},
		formatter: (val) => {
			return `${val} cannot be zero.`;
		}
	}
};

export const text_field: TextFieldWarningForm = {
	MaxLengthWarning: {
		handler: () => {
			return 'no-warning';
		},
		formatter: (val) => {
			// TODO
			return `${val} cannot be longer than MAX_LENGTH.`;
		}
	},
	MinLengthWarning: {
		handler: () => {
			return 'no-warning';
		},
		formatter: (val) => {
			// TODO
			return `${val} is too short.`;
		}
	}
};

const module_field: RackFieldWarningFormType = {
	NumberShelvesWarning: {
		ZeroNumericalValueWarning: {
			handler: num_field.ZeroNumericalValueWarning.handler,
			formatter: (val) => {
				return `Number of shelves cannot be zero. Value : ${val}.`;
			}
		},
		MaxValueWarning: {
			formatter: (val) => {
				return `Number of shelves cannot be greater than ${MAX_MODULE_COUNT_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val > MAX_MODULE_COUNT_ERROR) {
					return 'warning';
				}
				return 'no-warning';
			}
		},
		MinValueWarning: {
			formatter: (val) => {
				return `Number of shelves cannot be less than ${MIN_MODULE_COUNT_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val < MIN_MODULE_COUNT_ERROR) {
					return 'warning';
				}
				return 'no-warning';
			}
		},
		NegativeNumberWarning: {
			formatter: (val) => {
				return `Number of shelves cannot be negative. Value : ${val}.`;
			},
			handler: num_field.NegativeNumberWarning.handler
		},
		PositiveNumberWarning: {
			formatter: (val) => {
				return `Number of shelves cannot be positive. Value : ${val}.`;
			},
			handler: num_field.PositiveNumberWarning.handler
		}
	},
	InactiveShelvesWarning: {
		AllShelvesInactive: {
			formatter: () => {
				return `All shelves cannot be inactive.`;
			},
			handler: (val) => {
				for (let i = 0; i < val.length; i++) {
					if (val[i] === true) {
						return 'no-warning';
					}
				}

				return 'warning';
			}
		}
	},
	ShelfHeightWarning: {
		MaxValueWarning: {
			formatter: (val) => {
				return `Shelf height cannot be greater than ${MAX_SHELF_HEIGHT_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val > MAX_SHELF_HEIGHT_ERROR) {
					return 'warning';
				}
				return 'no-warning';
			}
		},
		MinValueWarning: {
			formatter: (val) => {
				return `Shelf height cannot be less than ${MIN_SHELF_HEIGHT_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val < MIN_SHELF_HEIGHT_ERROR) {
					return 'warning';
				}
				return 'no-warning';
			}
		},
		NegativeNumberWarning: {
			formatter: (val) => {
				return `Shelf height cannot be negative. Value : ${val}.`;
			},
			handler: num_field.NegativeNumberWarning.handler
		},
		PositiveNumberWarning: {
			formatter: (val) => {
				return `Shelf height cannot be positive. Value : ${val}.`;
			},
			handler: num_field.PositiveNumberWarning.handler
		},
		ZeroNumericalValueWarning: {
			formatter: (val) => {
				return `Shelf height cannot be zero. Value : ${val}.`;
			},
			handler: num_field.ZeroNumericalValueWarning.handler
		}
	},
	ShelfDepthWarning: {
		MaxValueWarning: {
			formatter: (val) => {
				return `Shelf depth cannot be greater than ${MAX_SHELF_DEPTH_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val > MAX_SHELF_DEPTH_ERROR) {
					return 'warning';
				}
				return 'no-warning';
			}
		},
		NegativeNumberWarning: {
			formatter: (val) => {
				return `Shelf depth cannot be negative. Value : ${val}.`;
			},
			handler: num_field.NegativeNumberWarning.handler
		},
		MinValueWarning: {
			formatter: (val) => {
				return `Shelf depth cannot be less than ${MIN_SHELF_DEPTH_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val < MIN_SHELF_DEPTH_ERROR) {
					return 'warning';
				}
				return 'no-warning';
			}
		},
		PositiveNumberWarning: {
			formatter: (val) => {
				return `Shelf depth cannot be positive. Value : ${val}.`;
			},
			handler: num_field.PositiveNumberWarning.handler
		},
		ZeroNumericalValueWarning: {
			formatter: (val) => {
				return `Shelf depth cannot be zero. Value : ${val}.`;
			},
			handler: num_field.ZeroNumericalValueWarning.handler
		}
	},
	ShelfWidthWarning: {
		MaxValueWarning: {
			formatter: (val) => {
				return `Shelf width cannot be greater than ${MAX_SHELF_WIDTH_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val > MAX_SHELF_WIDTH_ERROR) {
					return 'warning';
				}
				return 'no-warning';
			}
		},
		NegativeNumberWarning: {
			formatter: (val) => {
				return `Shelf width cannot be negative. Value : ${val}.`;
			},
			handler: num_field.NegativeNumberWarning.handler
		},
		MinValueWarning: {
			formatter: (val) => {
				return `Shelf width cannot be less than ${MIN_SHELF_WIDTH_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				if (val < MIN_SHELF_WIDTH_ERROR) {
					return 'warning';
				}
				return 'no-warning';
			}
		},
		PositiveNumberWarning: {
			formatter: (val) => {
				return `Shelf width cannot be positive. Value : ${val}.`;
			},
			handler: num_field.PositiveNumberWarning.handler
		},
		ZeroNumericalValueWarning: {
			formatter: (val) => {
				return `Shelf width cannot be zero. Value : ${val}.`;
			},
			handler: num_field.ZeroNumericalValueWarning.handler
		}
	},
	ShelfSpacingWarning: {
		MaxValueWarning: {
			formatter: (val) => {
				return `Shelf spacing cannot be greater than ${MAX_SHELF_SPACING_ERROR}. Value : ${val}.`;
			},
			handler: (val) => {
				for (let i = 0; i < val.length; i++) {
					if (val[i] > MAX_SHELF_SPACING_ERROR) {
						return 'warning';
					}
				}

				return 'no-warning';
			}
		},
		NegativeNumberWarning: {
			formatter: (val) => {
				return `Shelf spacing cannot be negative. Value : ${val}.`;
			},
			handler: (array, index) => {
				if (index !== undefined) {
					return num_field.NegativeNumberWarning.handler(array[index]);
				} else {
					for (let i = 0; i < array.length; i++) {
						if (array[i] < 0) {
							return 'warning';
						}
					}
				}

				return 'no-warning';
			}
		},
		MinValueWarning: {
			formatter: (val) => {
				return `Shelf depth cannot be less than ${MIN_SHELF_SPACING_ERROR}. Value : ${val}.`;
			},
			handler: (array, index) => {
				if (index !== undefined) {
					return array[index] < MIN_SHELF_SPACING_ERROR ? 'warning' : 'no-warning';
				} else {
					for (let i = 0; i < array.length; i++) {
						if (array[i] < MIN_SHELF_SPACING_ERROR) {
							return 'warning';
						}
					}
				}

				return 'no-warning';
			}
		},
		PositiveNumberWarning: {
			formatter: (val) => {
				return `Shelf spacing cannot be positive. Value : ${val}.`;
			},
			handler: (array, index) => {
				if (index !== undefined) {
					return array[index] > 0 ? 'warning' : 'no-warning';
				} else {
					for (let i = 0; i < array.length; i++) {
						if (array[i] > 0) {
							return 'warning';
						}
					}
				}

				return 'no-warning';
			}
		},
		ZeroNumericalValueWarning: {
			formatter: (val) => {
				return `Shelf spacing  cannot be zero. Value : ${val}.`;
			},
			handler: (array, index) => {
				if (index !== undefined) {
					return array[index] === 0 ? 'warning' : 'no-warning';
				} else {
					for (let i = 0; i < array.length; i++) {
						if (array[i] === 0) {
							return 'warning';
						}
					}
				}

				return 'no-warning';
			}
		}
	}
};

const object3d_field: PropFieldWarningFormType = {
	IsHiddenFieldWarning: {},
	NameFieldWarning: {
		MaxLengthWarning: text_field.MaxLengthWarning,
		MinLengthWarning: text_field.MinLengthWarning
	},
	PositionFieldWarning: {
		x: {
			MaxValueWarning: num_field.MaxValueWarning,
			MinValueWarning: num_field.MinValueWarning,
			NegativeNumberWarning: num_field.NegativeNumberWarning,
			PositiveNumberWarning: num_field.PositiveNumberWarning,
			ZeroNumericalValueWarning: num_field.ZeroNumericalValueWarning
		},
		y: {
			MaxValueWarning: num_field.MaxValueWarning,
			MinValueWarning: num_field.MinValueWarning,
			NegativeNumberWarning: num_field.NegativeNumberWarning,
			PositiveNumberWarning: num_field.PositiveNumberWarning,
			ZeroNumericalValueWarning: num_field.ZeroNumericalValueWarning
		},
		z: {
			MaxValueWarning: num_field.MaxValueWarning,
			MinValueWarning: num_field.MinValueWarning,
			NegativeNumberWarning: num_field.NegativeNumberWarning,
			PositiveNumberWarning: num_field.PositiveNumberWarning,
			ZeroNumericalValueWarning: num_field.ZeroNumericalValueWarning
		}
	},
	RotationFieldWarning: {
		x: {
			MaxValueWarning: {
				formatter: (val) => {
					return `Rotation x cannot be greater than ${MAX_ROTATION_X_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val > MAX_ROTATION_X_ERROR) {
						return 'warning';
					}
					return 'no-warning';
				}
			},
			MinValueWarning: {
				formatter: (val) => {
					return `Rotation x cannot be less than ${MIN_ROTATION_X_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val < MIN_ROTATION_X_ERROR) {
						return 'warning';
					}
					return 'no-warning';
				}
			},
			NegativeNumberWarning: {
				formatter: (val) => {
					return `Rotation x cannot be negative. Value : ${val}.`;
				},
				handler: num_field.NegativeNumberWarning.handler
			},
			PositiveNumberWarning: {
				formatter: (val) => {
					return `Rotation x cannot be positive. Value : ${val}.`;
				},
				handler: num_field.PositiveNumberWarning.handler
			},
			ZeroNumericalValueWarning: {
				formatter: (val) => {
					return `Rotation x cannot be zero. Value : ${val}.`;
				},
				handler: num_field.ZeroNumericalValueWarning.handler
			}
		},
		y: {
			MaxValueWarning: {
				formatter: (val) => {
					return `Rotation y cannot be greater than ${MAX_ROTATION_Y_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val > MAX_ROTATION_Y_ERROR) {
						return 'warning';
					}
					return 'no-warning';
				}
			},
			MinValueWarning: {
				formatter: (val) => {
					return `Rotation x cannot be less than ${MIN_ROTATION_Y_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val < MIN_ROTATION_Y_ERROR) {
						return 'warning';
					}
					return 'no-warning';
				}
			},
			NegativeNumberWarning: {
				formatter: (val) => {
					return `Rotation y cannot be negative. Value : ${val}.`;
				},
				handler: num_field.NegativeNumberWarning.handler
			},
			PositiveNumberWarning: {
				formatter: (val) => {
					return `Rotation y cannot be positive. Value : ${val}.`;
				},
				handler: num_field.PositiveNumberWarning.handler
			},
			ZeroNumericalValueWarning: {
				formatter: (val) => {
					return `Rotation y cannot be zero. Value : ${val}.`;
				},
				handler: num_field.ZeroNumericalValueWarning.handler
			}
		},
		z: {
			MaxValueWarning: {
				formatter: (val) => {
					return `Rotation z cannot be greater than ${MAX_ROTATION_Z_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val > MAX_ROTATION_Y_ERROR) {
						return 'warning';
					}
					return 'no-warning';
				}
			},
			MinValueWarning: {
				formatter: (val) => {
					return `Rotation z cannot be less than ${MIN_ROTATION_Z_ERROR}. Value : ${val}.`;
				},
				handler: (val) => {
					if (val < MIN_ROTATION_Z_ERROR) {
						return 'warning';
					}
					return 'no-warning';
				}
			},
			NegativeNumberWarning: {
				formatter: (val) => {
					return `Rotation z cannot be negative. Value : ${val}.`;
				},
				handler: num_field.NegativeNumberWarning.handler
			},
			PositiveNumberWarning: {
				formatter: (val) => {
					return `Rotation z cannot be positive. Value : ${val}.`;
				},
				handler: num_field.PositiveNumberWarning.handler
			},
			ZeroNumericalValueWarning: {
				formatter: (val) => {
					return `Rotation z cannot be zero. Value : ${val}.`;
				},
				handler: num_field.ZeroNumericalValueWarning.handler
			}
		}
	}
};

export const english_warns: SessionWarningType = {
	Core: {
		BoolField: {},
		NumField: num_field,
		TextField: text_field
	},
	RackFieldWarningType: module_field,
	PropFieldWarningType: object3d_field
};
