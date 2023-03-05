export {};

// import { AddressTestWrapper } from '$lib/wrapper/simple/prop/nonphysical/address/AddressTestWrapper';
// import { GroupTestWrapper } from '$lib/wrapper/simple/prop/nonphysical/group/GroupTestWrapper';
// import { RackTestWrapper } from '$lib/wrapper/simple/prop/physical/rack/RackTestWrapper';
// import type { PropType, Prop } from "$lib/wrapper/simple/prop/Prop";
// import { Vector3 } from 'three';
// import { test, suite } from 'vitest';

// export type TestActions =
// 	| 'parent'
// 	| 'child'
// 	| 'remove'
// 	| 'move'
// 	| 'rotate'
// 	| 'go_up_tree'
// 	| 'go_down_tree';

// /**
//  * Create random shapes including Native objects.
//  * Apply random actions to the shapes like parent, child, remove, move, rotate.
//  * Clone the root object and compare the cloned object with the original.
//  */
// suite('Module Test Shapes', () => {
// 	test('Create random hierarchy and clone', () => {
// 		const retry_count = 100;
// 		const object_types: Array<PropType> = ['address', 'group', 'module', 'native', 'piece'];
// 		const action_types: Array<TestActions> = [
// 			'parent',
// 			'child',
// 			'remove',
// 			'move',
// 			'rotate',
// 			'go_down_tree',
// 			'go_up_tree'
// 		];

// 		let random_number;
// 		let random_type: PropType;
// 		let random_action: TestActions;
// 		const root: Prop = new GroupTestWrapper();
// 		let current: Base = root;
// 		let obj: Prop;

// 		for (let i = 0; i < retry_count; i++) {
// 			// Get a random number between 0 and 4
// 			random_number = Math.floor(Math.random() * object_types.length);
// 			random_type = object_types[random_number];
// 			random_action = action_types[Math.floor(Math.random() * action_types.length)];


// 			switch (random_action) {
// 				case 'parent':
// 					switch (random_type) {
// 						case 'address':
// 							obj = new AddressTestWrapper();
// 							break;
// 						case 'group':
// 							obj = new GroupTestWrapper();
// 							break;
// 						case 'module':
// 							obj = new RackTestWrapper();
// 							break;
// 						default:
// 							continue;
// 					}

// 					current.add(obj);
// 					break;
// 				case 'child':
// 					// Make current child of the newly created object
// 					switch (random_type) {
// 						case 'address':
// 							obj = new AddressTestWrapper();
// 							break;
// 						case 'group':
// 							obj = new GroupTestWrapper();
// 							break;
// 						case 'module':
// 							obj = new RackTestWrapper();
// 							break;
// 						default:
// 							continue;
// 					}

// 					if (current.parent !== null) {
// 						current.parent.add(obj);
// 						current.parent.remove(current);
// 						obj.add(current);
// 						current = obj;
// 					}

// 					break;
// 				case 'remove':
// 					current.remove();
// 					break;
// 				case 'move':
// 					current.position.setX(Math.random() * 100);
// 					current.position.setY(Math.random() * 100);
// 					current.position.setZ(Math.random() * 100);
// 					break;
// 				case 'rotate':
// 					current.rotation.setFromVector3(
// 						new Vector3(Math.random() * 100, Math.random() * 100, Math.random() * 100)
// 					);
// 					break;
// 				case 'go_down_tree':
// 					if (current.props.length > 0) {
// 						const rand_idx = Math.floor(Math.random() * current.props.length);
// 						current = current.props[rand_idx];
// 					}
// 					break;
// 				case 'go_up_tree':
// 					if (current.parent) {
// 						current = current.parent;
// 					}
// 					break;
// 				default:
// 					throw new Error('Unknown action ' + random_action);
// 			}

// 			const root_clone = root.clone(true);
// 			root.eq(root_clone);
// 		}
// 	});
// });
