import type { SupportedTypes } from "$lib/wrapper/Base";
import * as THREE from "three";
import { NonPhysical, type NonPhysicalParams } from "../NonPhysical";

export class Group extends NonPhysical {

	override get type(): SupportedTypes {
		return "group";
	}
	
	ungroup(): void {

		
		if (this._parent === null) {
			throw new Error('Group should have had a parent.');
		}
		
		
		for (const prop of this.props ) {
			prop.unselect();
			this._parent.add(prop);
		}

		this._parent.remove(this);
		window.scene.render();
	}
	
	protected override _inner: THREE.Mesh;
	
	/**
	 *
	 */
	constructor( params? : NonPhysicalParams ) {
		const inner = new THREE.Mesh(new THREE.SphereGeometry(GROUP_SPHERE_RADIUS), GROUP_MAT);
		super( inner , params );
		this._inner = inner;
		this.default_material = GROUP_MAT;
	}

}


const GROUP_MAT = new THREE.MeshBasicMaterial({ color: 0xa3d2ff, opacity: 0.5, transparent: true });
const GROUP_SPHERE_RADIUS = 3.14 / 4;