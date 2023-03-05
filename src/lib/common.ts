import type { BooleanFieldErrorFormType } from './fields/base/BoolField/BooleanFieldError';
import type { BooleanFieldWarningType } from './fields/base/BoolField/BooleanFieldWarning';
import type { TextFieldWarningType } from './fields/base/TextField/TextFieldWarning';
import type { NumberFieldErrorFormType } from './fields/base/NumberField/NumberFieldError';
import type { TextFieldErrorFormType } from './fields/base/TextField/TextFieldError';
import type { NumberFieldWarningType } from './fields/base/NumberField/NumberFieldWarning';
import type { WarningFormType } from './fields/base/Field/FieldWarning';
import type { RackFieldWarningFormType } from './fields/RackField/RackFieldWarning';
import type { PropFieldWarningFormType } from './fields/Prop/PropWarning';
import type { PropFieldErrorFormType } from './fields/Prop/PropError';
import type { RackFieldErrorFormType } from './fields/RackField/RackFieldError';
import type { SceneStateName } from "./wrapper/prop/scene/state/ABCSceneState";

export type Position = 'left' | 'right' | 'bottom';
export type TabPositioning = Position | 'inactive';

export type PanelLayout<T> = {
	[pos in Position]: T;
};

export type PanelTabType =
	| 'prefab_explorer'
	| 'inspect'
	| 'route'
	| 'hierarchy'
	| 'problems'
	| 'controls';

export type TabType = PanelTabType;

export type TabHash<T> = {
	[tab in TabType]: T;
};

export type TabLayout = {
	[tab in TabType]: Position;
};

export type PrimitiveFieldText = {
	header: string;
	placeholder?: string;
	about: string;
};

/** When multiple fields are grouped together we call this a FieldGrouping.
 * This type contains the necessary properties like the header for this grouping and other properties.
 */
export type FieldGrouping = {
	header: string;
	about: string;
};

export type SessionWarningType = {
	Core: {
		NumField: WarningFormType<NumberFieldWarningType, number>;
		TextField: WarningFormType<TextFieldWarningType, string>;
		BoolField: WarningFormType<BooleanFieldWarningType, boolean>;
	};
	PropFieldWarningType: PropFieldWarningFormType;
	RackFieldWarningType: RackFieldWarningFormType;
};

export type SessionErrorType = {
	Core: {
		NumField: NumberFieldErrorFormType;
		TextField: TextFieldErrorFormType;
		BoolField: BooleanFieldErrorFormType;
	};
	PropFieldErrorType: PropFieldErrorFormType;
	RackFieldErrorType: RackFieldErrorFormType;
};

export type InfoTexts = {
	Node: {
		Expandable: FieldGrouping;
		NodeProperties: FieldGrouping;
		NextHopsList: FieldGrouping;
		Restrictions: {
			Expandable: FieldGrouping;
			MaxWidth: PrimitiveFieldText;
			MaxHeight: PrimitiveFieldText;
		};
	};
	Object3D: {
		Expandable: FieldGrouping;
		NameField: PrimitiveFieldText;
		IsHiddenField: PrimitiveFieldText;
		PositionField: PrimitiveFieldText;
		RotationField: PrimitiveFieldText;
	};
	Module: {
		Expandable: FieldGrouping;
		NumberShelves: PrimitiveFieldText;
		InactiveShelves: PrimitiveFieldText;
		ShelfSpacing: PrimitiveFieldText;
		ShelfHeight: PrimitiveFieldText;
		ShelfDepth: PrimitiveFieldText;
		ShelfWidth: PrimitiveFieldText;
	};
	Group: {
		Expandable: FieldGrouping;
		HelperVisible: PrimitiveFieldText;
	};
};

export type UITexts = {
	Tab: {
		Inspect: {
			NoObjectSelected: string;
		};
		Routes: {
			NoObjectSelected: string;
		};
	};
	Mode: {
		[mode in SceneStateName]: string;
	};
	ProblemsBar: {
		ErrorTitle: string;
		WarningTitle: string;
	};
};

export type Configuration = {
	lang: 'EN' | 'DE' | 'TR';
	tabs: TabLayout;
	errs: SessionErrorType;
	warns: SessionWarningType;
	ui_texts: UITexts;
	info_texts: InfoTexts;
};

export type ProblemState = 'active_on' | 'active_off' | 'inactive';

/** In order to maintain reactivity we create objects in which we store
 * warning and errors that need to be solved for particular objects.
 * By clicking these errors/warnings in ProblemsTab the user will be directed to
 * the object from which the problem originates.
 *
 * What each property means,
 * @param state : Whether it should be checked for an error/warning.
 * @param msg : Error message to be shown.
 */
export type ProblemsObject<Err extends string, Warn extends string> = {
	errors: [Err, string][];
	warnings: [Warn, string][];
};
