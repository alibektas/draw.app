import type { InfoTexts } from '$lib/common';

export const english_info_texts: InfoTexts = {
	Node: {
		Expandable: {
			header: 'Node',
			about: 'Here you can edit the properties of the address node.'
		},
		NodeProperties: {
			header: 'Node Properties',
			about: ''
		},
		NextHopsList: {
			header: 'Next Hops',
			about: ''
		},
		Restrictions: {
			Expandable: {
				about: 'Here you can deny access to a certain group of operators for this area.',
				header: 'Restrictions'
			},
			MaxHeight: {
				about: 'What should be the maximum height of an operator?',
				header: 'Max Height'
			},
			MaxWidth: {
				about: 'What should be the maximum width of an operator?',
				header: 'Max Width'
			}
		}
	},
	Object3D: {
		Expandable: {
			header: 'Base Properties',
			about: 'Here you can edit the base properties of the object.'
		},
		NameField: {
			header: 'Name Field',
			placeholder: 'Enter a name',
			about: 'The name of the object.'
		},
		IsHiddenField: {
			header: 'Hide Field',
			about: 'If this is checked, the object will not be visible in the scene.'
		},
		PositionField: {
			header: 'Position Field',
			about: 'The position  of the object relative to parent in the scene.'
		},
		RotationField: {
			header: 'Rotation Field',
			about: 'The rotation of the object relative to parent in the scene.'
		}
	},
	Module: {
		Expandable: {
			header: 'Module Field',
			about: 'Here you can edit the properties of the module.'
		},
		NumberShelves: {
			header: 'Number of Shelves',
			about: 'The number of shelves in the module.'
		},
		InactiveShelves: {
			header: 'Inactive Shelves',
			about: 'The shelves that are not active.'
		},
		ShelfSpacing: {
			header: 'Shelf Spacing',
			about: 'Spacing between each shelf.'
		},
		ShelfHeight: {
			header: 'Shelf Height',
			about: 'The height of each shelf.'
		},
		ShelfDepth: {
			header: 'Shelf Depth',
			about: 'The depth of each shelf.'
		},
		ShelfWidth: {
			header: 'Shelf Width',
			about: 'The width of each shelf.'
		}
	},
	Group: {
		Expandable: {
			header: 'Group Field',
			about: 'Here you can edit the properties of a group.'
		},
		HelperVisible: {
			header: 'Show Helper',
			about: 'Enable a helper object that makes moving and selecting object easier.'
		}
	}
};
