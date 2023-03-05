import type { Configuration, Position, TabLayout, TabType } from '$lib/common';
import { JobStack } from "./jobs/JobStack";
import { english_errs } from './locale/en/error_formatter';
import { english_info_texts } from './locale/en/info_text';
import { english_ui_texts } from './locale/en/ui_text';
import { english_warns } from './locale/en/warning_formatter';
import { tablist, type TabProperties } from './tabs/TabBase';
import type { Temporary } from "./wrapper/Base";
import { Group } from "./wrapper/prop/nonphysical/group/Group";
import type { Scene } from "./wrapper/prop/scene/Scene";
import { ExplodeState } from "./wrapper/prop/scene/state/ExplodeState";
import { LinkState } from "./wrapper/prop/scene/state/LinkState";
import { NodesState } from "./wrapper/prop/scene/state/NodesState";
import { ParentState } from "./wrapper/prop/scene/state/ParentState";
import { RotateState } from "./wrapper/prop/scene/state/RotateState";
import { SelectState } from "./wrapper/prop/scene/state/SelectState";
import { TranslateState } from "./wrapper/prop/scene/state/TranslateState";
import { UnlinkState } from "./wrapper/prop/scene/state/UnlinkState";





declare global {

			
	interface Window {
		sessionConfig: Configuration;
		tabs: {
			[p in Position]: { [tab_type in TabType]?: TabProperties };
		};
		temp_objs: Array< Temporary >;
		graveyard: Group;
		scene: Scene;
		sceneStates: {
			Select: SelectState;
			Explode: ExplodeState;
			Link: LinkState;
			Nodes: NodesState;
			Parent: ParentState;
			Rotate: RotateState;
			Translate: TranslateState;
			Unlink: UnlinkState;
		}
	}
}

export async function getConfiguration(): Promise<Configuration> {
	const defaultSettings: Configuration = {
		lang: 'EN',
		tabs: {
			prefab_explorer : 'left',
			hierarchy: 'left',
			inspect: 'left',
			route: 'left',
			problems: 'bottom',
			controls: 'right'
		},
		errs: english_errs,
		warns: english_warns,
		ui_texts: english_ui_texts,
		info_texts: english_info_texts ,
	};

	window.sessionConfig = defaultSettings;
	window.tabs = { left: {}, right: {}, bottom: {} };
	window.temp_objs = [];
	window.graveyard = new Group();

	window.sceneStates = {
		Select: SelectState.instance,
		Explode: ExplodeState.instance,
		Link: LinkState.instance,
		Nodes: NodesState.instance,
		Parent: ParentState.instance,
		Rotate: RotateState.instance,
		Translate: TranslateState.instance,
		Unlink: UnlinkState.instance
	};

	for (const [key, value] of Object.entries(window.sessionConfig.tabs)) {
		const k = key as unknown as keyof TabLayout;

		if (window.tabs[value][k] === undefined) {
			window.tabs[value][k] = tablist[k];
			(window.tabs[value][k] as unknown as TabProperties).state.set('closed');
		}
	}

	return defaultSettings;
}



export const jobStack = new JobStack();
