import *  as THREE from "three";
import { TransformControls as THREETransformControls } from 'three/examples/jsm/controls/TransformControls';
import { Visual, type Prop, type SupportedTypes } from "../Base";
import type { Address } from "../prop/nonphysical/address/Address";


export class Box3Helper extends Visual {


	protected override  _inner : THREE.Box3Helper;

	constructor(box: THREE.Box3, color?: THREE.Color | undefined) {
		const g = new THREE.Box3Helper(box, color);
		super(g);
		this._inner = g ;
	}

	setFromCenterAndSize(center: THREE.Vector3, size: THREE.Vector3) {
		this._inner.box.setFromCenterAndSize(center, size);
	}
}

export class TransformControls extends Visual {


	protected override _inner : THREETransformControls;

	constructor(object: THREE.Camera, domElement?: HTMLElement | undefined) {
		const g = new THREETransformControls(object, domElement);
		super(g);
		this._inner = g ; 
	}

	set enabled(enabled: boolean) {
		this._inner .enabled = enabled;
	}

	attach(object: Prop): this {
		
		this._inner.attach(object.inner);

		return this;
	}

	setMode(mode: 'translate' | 'rotate' | 'scale') {
		this._inner .setMode(mode);
	}

	detach(): this {
		this._inner .detach();
		return this;
	}

	get showZ() {
		return this._inner .showZ;
	}

	set showZ(showZ: boolean) {
		this._inner .showZ = showZ;
	}

	get dragging() {
		return this._inner .dragging;
	}
}

export class GridHelper extends Visual {


	protected override  _inner : THREE.GridHelper;

	constructor(
		size?: number,
		divisions?: number,
		color1?: THREE.ColorRepresentation,
		color2?: THREE.ColorRepresentation
	) {
		const g = new THREE.GridHelper(size, divisions, color1, color2);
		super(g);
		this._inner = g ;
	}
}

export class AmbientLight extends Visual {


	protected override  _inner : THREE.AmbientLight;

	constructor(color?: THREE.ColorRepresentation | undefined, intensity?: number | undefined) {
		const g = new THREE.AmbientLight(color, intensity);
		super(g);
		this._inner = g ;
	}
}

export class Line extends Visual {


	protected override _inner : THREE.Line;

	constructor(geometry?: THREE.BufferGeometry, material?: THREE.Material | THREE.Material[]) {
		const g = new THREE.Line(geometry, material)
		super(g);
		this._inner = g ; 
	}
}

export class Edge extends Line {

	/**
	 * When a link is created it is not obvious if its two ends are already in the scene.
	 * Only then the link can be made visible in the scene. This function makes the necessary 
	 * checks and mounts the link to the scene if it succeeds.
	 */
	try_mount() : boolean {
		if ( this.alpha.inHierarchy && this.beta.inHierarchy ) {
			this._inHierarchy = true;
			this.update( this.alpha , this.beta );
			window.scene.add(this);
			window.scene.render();
			return true;
		}

		return false;
	}

	/**
	 * If at least one of the ends of the link is not in the scene, the link should be removed.
	 * This function makes the necessary checks and unmounts the link from the scene if it succeeds.
	 */
	try_unmount()  : boolean {
		if ( !this.alpha.inHierarchy || !this.beta.inHierarchy ) {

			if ( this.alpha.inHierarchy ) { 
				this.alpha.try_unlink( this.beta ) ;
			}

			if ( this.beta.inHierarchy ) { 
				this.beta.try_unlink( this.beta ) ;
			}

			window.scene.remove(this);
			window.scene.render();
			return true;
		}

		return false;
	}

	
		
	override get type(): SupportedTypes {
		return 'edge';
	}

	constructor( 
		private alpha : Address  , 
		private beta : Address 
	) {
		super(
			new THREE.BufferGeometry(), 
			LINE_HELPER_MAT
		)

		alpha.addEventListener("onmove", (  ) =>{
			this.update( alpha , beta );
		})

		beta.addEventListener("onmove", (  ) =>{
			this.update( alpha , beta );
		})

		alpha.addEventListener("onhide", (  ) =>{
			this.visible = false ;
		})

		beta.addEventListener("onhide", (  ) =>{
			this.visible = false;
		})


		alpha.addEventListener("onmount" , () => {
			this.try_mount();
		});

		beta.addEventListener("onmount" , () => {
			this.try_mount();
		});

		alpha.addEventListener("onunmount" , () => {
			this.try_unmount();
		});

		beta.addEventListener( "onunmount", () => {
			this.try_unmount();
		});

		this.update( alpha , beta ) ;
	}

	update( a : Prop | Visual , b : Prop | Visual) {

		if ( !this.inHierarchy ) return ;
			
		const v_alpha = new THREE.Vector3();
		a.getWorldPosition(v_alpha)

		const v_beta = new THREE.Vector3();
		b.getWorldPosition(v_beta)

		
		this._inner.geometry.setFromPoints([ v_alpha , v_beta ]) ;
	}
}

export const LINE_HELPER_MAT = new THREE.LineBasicMaterial({
	colorWrite: true,
	color: 0xff0000,
	linewidth: 5
});

