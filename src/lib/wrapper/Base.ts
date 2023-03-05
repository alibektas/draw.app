import { writable, type Writable } from "svelte/store";
import *  as THREE from "three";


export interface BaseParams extends Partial<{
	'position' : THREE.Vector3Tuple,
	'rotation' : [ number , number , number , ( THREE.EulerOrder | undefined ) ],
	"name" : string;
	"uuid" : string;
	"type" : SupportedTypes;
	"temporaries" : Array< TemporaryParams >;
	"locks" : Array< LockedParams >;
	"props" : Array< PropParams >;
	"visuals" : Array< VisualParams >;
	"positionWorld" : THREE.Vector3;
	"rotationWorld" : [ number , number , number , ( THREE.EulerOrder | undefined ) ];
}> {};


export type SupportedTypes = 
	"rack" |
	"module" |
	"group" |
	"address" |
	"visual" |
	"temporary" |
	"locked" |
	"edge" |
	"corridor" |
	"row" |
	"scene";

export abstract class Base  {
	
	protected _parent: Base | null = null;
	protected _is_selected = false;
	protected _is_root = true;
	protected _inHierarchy = false;

	get inHierarchy() : boolean {
		return this._inHierarchy;
	}


	constructor(inner: THREE.Object3D , params? : BaseParams ) {
		this._inner = inner;
		this._inner.name = this.type + '_' + this.uuid.slice(0, 5);
		this._inner.userData.wrapper = this;

		
	}

	get inner() : THREE.Object3D {
		return this._inner;
	}

	get name(): string {
		return this._inner.name;
	}
 
	set name(name: string) {
		this._inner.name = name;
	}

	
	get type() : SupportedTypes {
		throw new Error("Not Implemented.");
	}

	
	removeFromParent() : void {
		this._parent?.remove(this);
	}

	clone( ): Prop {
		const c = new (this.constructor as any)(this.toJSON()) as Prop;
		return c;
	}
	
	protected _inner : THREE.Object3D;
	_props : Array< Prop > = [];
	_visuals : Array< Visual > = [];
	_locks : Array < Locked > = [];
	_temporaries : Array < Temporary > = [];


	get props(): Array< Base > {
		return this._props;
	}

	get visuals(): Array< Base > {
		return this._visuals;
	}


	get position(): THREE.Vector3 {
		return this._inner.position;
	}

	set position(pos: THREE.Vector3) {
		this._inner.position.copy(pos);
	}


	get rotation(): THREE.Euler {
		return this._inner.rotation;
	}

	set rotation(rot: THREE.Euler) {
		this._inner.rotation.copy(rot);
	}

	get uuid(): string {
		return this._inner.uuid;
	}


	select() {
		if ( this._is_selected ) return;

		this._inner.dispatchEvent({ type: 'select' });
		this._is_selected = true;

		for (const prop of this._props ) {
			prop.select();
		}

		this.onSelect();
	}

	unselect() {
		if ( !this._is_selected ) return;

		this._inner.dispatchEvent({ type: 'unselect' });
		this._is_selected = false;

		for (const prop of this._props ) {
			prop.unselect();
		}
		
		this.onUnselect();
	}
	

	getWorldPosition(v: THREE.Vector3): void {
		this._inner.getWorldPosition(v);
	}

	getWorldQuaternion(q: THREE.Quaternion): void {
		this._inner.getWorldQuaternion(q);
	}

	getWorldDirection(v: THREE.Vector3): void {
		this._inner.getWorldDirection(v);
	}

	addEventListener(type: string, listener: (event: THREE.Event) => void) {
		this._inner.addEventListener(type, listener);
	}

	removeEventListener(type: string, listener: (event: THREE.Event) => void) {
		this._inner.removeEventListener(type, listener);
	}

	dispatchEvent(event: THREE.Event) {
		this._inner.dispatchEvent(event);
	}

	set visible(v: boolean) {
		this._inner.visible = v;
		
		if  ( !v ) {
			console.log(`[${this.type}][name:${this.name}] Hiding`)
			this.onHide();
		}
		else {
			console.log(`[${this.type}][name:${this.name}] Unhiding`);
			this.onUnhide();
		}
		
	}

	get visible() {
		return this._inner.visible;
	}


	eq(other: Base ): boolean {
		if (this.position != other.position) {
			return false;
		}
		if (this.rotation != other.rotation ) {
			return false;
		}

		return true;
	}

	explode(): void {
		let visited = false;

		for (const child of this.props ) {
			child._is_root = true;
			visited = true;
		}

		if (visited) {
			this._is_root = false; // This way it will only then be set to true if a child is a meaningful object on its o wn.
		}
	}


	copy( other : Base ) : void {
		
		for ( const p of other.props ) {
			this.add(p.clone());
		}

		for ( const v of other.visuals ) {
			this.add(v.clone());
		}
		
		this.position.copy(other.position);
		this.rotation.copy(other.rotation);
	}


	/** This method is executed every time `this` has a new a parent. */
	onAddToParent(): void {
		console.log(`[${this.type}][name:${this.name}] onAddToParent new parent : ${this.parent?.name} `);
	}
	/** This is called whenever `this` is removed from its parent. */
	onBeforeRemoveFromParent(): void {
		console.log(`[${this.type}][name:${this.name}] onBeforeRemoveFromParent  old parent : ${this.parent?.name}`);
	}

	/** This is called whenever `this` is added for the first time to the hierarchy. */
	onMountHierarchy(): void {
		this._inHierarchy = true;
		console.log(`[${this.type}][name:${this.name}] onMountHierarchy `);

		for (  const prop of this._props ) {
			prop.onMountHierarchy();
		}

		for ( const visual of this._visuals ) {
			visual.onMountHierarchy();
		}

		for ( const lock of this._locks ) {
			lock.onMountHierarchy();
		}

		for ( const temp of this._temporaries ) {
			temp.onMountHierarchy();
		}

		this.dispatchEvent({type : "onmount"});
	}


	/** Called when the object is moved. */
	onMove(): void {
		console.log(`[${this.type}][name:${this.name}] onMove }`);
	}
	/** Called when the object is completely removed from the scene and practically becomes ready to be send over to the Garbage Collector.*/
	onUnmountHierarchy(): void {
		this._inHierarchy = false;
		this.dispatchEvent({type : "onunmount"});
		console.log(`[${this.type}][name:${this.name}] onUnmountHierarchy`);
	}

	/** Called when the object becomes hidden. */
	onHide(): void {
		this.dispatchEvent({type : "onhide"});
		console.log(`[${this.type}][name:${this.name}] onHide`);
	}

	/** Called when the object becomes unhidden. */
	onUnhide(): void {
		this.dispatchEvent({type : "onunhide"});
		console.log(`[${this.type}][name:${this.name}] onUnhide`);
	}

	/**Called when the object is selected */
	onSelect() : void {
		console.log(`[${this.type}][name:${this.name}] onSelect`);
	}

	onUnselect() : void {
		console.log(`[${this.type}][name:${this.name}] onUnselect`);
	}

	/** Here you can install a guard to decide which props are eligible for adding to `this` */
	protected can_add(_obj: Base | Locked | Temporary  ): boolean {
		return true;
	}
	/** Here you can install a guard to decide which props are eligible for deleting from `this` */
	protected can_remove(_obj: Base | Locked | Temporary ) : boolean {
		return true;
	}

	

	toJSON(): BaseParams {


		if ( this.type === null ) {
			throw new Error(`[${this.type}][name:${this.name}] toJSON() : type is null`);
		}

		const pw = new THREE.Vector3();
		this.getWorldPosition(pw);

		return {
			name : this.name,
			uuid : this.uuid,
			type : this.type,
			position : this.position.toArray(),
			rotation : this.rotation.toArray() as [number, number, number, (THREE.EulerOrder | undefined)],
			temporaries : this._temporaries.map( v => v.toJSON()),
			locks : this._locks.map( v => v.toJSON()),
			props : this._props.map( v => v.toJSON()),
			visuals : this._visuals.filter( v => v.type != "edge" ).map( v => v.toJSON()),
			positionWorld : pw,

		}
	}
	
	

		
	get is_root() {
		return this._is_root;
	}

	set is_root(v: boolean) {
		this._is_root = v;
	}

    
	get is_selected(): boolean {
		return this._is_selected;
	}

	get root(): Prop | Visual {
		if (this._is_root) {
			return this;
		} else {
			if (this._parent === null) {


				throw new Error('"Prop" called for its root but it is undefined.');
			} else {
				return this._parent.root;


			}
		}
	}


	set parent(p: Prop | Visual | null) {
		if (this._parent !== p) {


			this._parent = p;


			// this._inner.parent = p;
		}
	}

	get parent(): Prop | Visual | null {
		return this._parent;


	}
    
	
	/** Add a prop to this object.
	 * If the prop will appear in the scene for the first time then we call prop.OnCreate
	 * if not then we do not. In either case we call prop.OnAddToParent
	 * */
	add(...objects: Array <Base > ): this {
		if (objects === undefined) return this;
		let visited = false;
		for (const o of objects) {

			if ( o instanceof Locked ) {
				this._locks.push(o);
				continue;
			}
			else if ( o instanceof Temporary ) {
				this._temporaries.push(o);
				continue;
			}
			
			if (this.can_add(o)) {
				const hadParent = o.parent !== null;
				const oldParent = o.parent;
				
				if ( o instanceof Prop ) {
					this._props.push(o);
				}
				else {
					this._visuals.push(o);
				}
				
				
				this._inner.attach(o.inner);
				o.parent = this;
				o.onAddToParent();
				
				if (!hadParent) {
					o.onMountHierarchy();
				}
				else {
					// If the object is somehow added to the same parent twice,
					// next line would make the object disappear from the hierarchy.
					// In order to prevent that we first check if the new parent 
					// and the old parent are different.
					if ( oldParent !== null && oldParent.uuid !== this.uuid ) {
						oldParent.remove( o );
					}
				}
				
				
				visited = true;
				
			} else {
				console.log(`[${this.type}][name:${this.name}] Cannot add prop ${o.name}`);
			}
		}

		if (visited) {
			// Let UI know children count changed.
			this._inner.dispatchEvent({ type: 'update-children' });
		}

		return this;
	}

	remove(...objects: Array< Base | Temporary | Locked >): this {
		if (objects === undefined) return this;

		let visited = false;

		for (const o of objects) {

			if ( o instanceof Locked ) {
				this._locks = this._locks.filter( (p) => p.uuid !== o.uuid);
				continue;
			}
			else if ( o instanceof Temporary ) {
				this._temporaries = this._temporaries.filter( (p) => p.uuid !== o.uuid);
				continue;
			}
			else {
				if (this.can_remove(o)) {
					if ( o instanceof Prop  ) {
						this._props  = this._props.filter((p) => p.uuid !== o.uuid );
					}
					else {
						this._visuals = this._visuals.filter((v) => v.uuid !== o.uuid);
					}
					
					o.onBeforeRemoveFromParent();
					this._inner.remove(o._inner);
					visited = true;
				} else {
					console.warn(`[${this.type}][${this.name}] Cannot remove child ${o.name}`);
				}
			}

		}

		if (visited) {
			// Let UI know children count changed.
			this._inner.dispatchEvent({ type: 'update-children' });
		}

		return this;
	}

}




export interface PropParams extends BaseParams {}

export const DEFAULT_OBJECT_MAT = new THREE.MeshBasicMaterial({ color: 0x0000ff });
export const SELECTED_OBJECT_MAT = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
export type PropType = 'address' | 'group' | 'module' | 'native' | 'piece';


export abstract class Prop extends Base {
	

	protected default_material: THREE.Material = DEFAULT_OBJECT_MAT;
	protected selected_material: THREE.Material = SELECTED_OBJECT_MAT;

	constructor(
		three : THREE.Object3D , 
		params? : PropParams
	) {
		super(three , params);
		this._inner = three;
        this.input_name = writable(this._inner.name);
		this.input_ishidden = writable(this._inner.visible);
		this.input_position = {
			x: writable(String(this._inner.position.x)),
			y: writable(String(this._inner.position.y)),
			z: writable(String(this._inner.position.z))
		};


		this.input_rotation = {
			x: writable(String(this._inner.rotation.x)),
			y: writable(String(this._inner.rotation.y)),
			z: writable(String(this._inner.rotation.z))
		};

		this._inner.userData.wrapper = this;

	}

	

	override onMove(): void {
		this.dispatchEvent({ type: 'onmove' });
		
		const p = this._inner.position; // Get the local position vector.
		this.input_position.x.set(String(p.x));
		this.input_position.y.set(String(p.y));
		this.input_position.z.set(String(p.z));
		const r = this._inner.rotation; // Get the local rotation vector.
		this.input_rotation.x.set(String(THREE.MathUtils.radToDeg(r.x)));
		this.input_rotation.y.set(String(THREE.MathUtils.radToDeg(r.y)));
		this.input_rotation.z.set(String(THREE.MathUtils.radToDeg(r.z)));

		for (const child of this.props) {
			child.onMove();
		}
	}


	override onSelect(): void {
		if (this._inner instanceof THREE.Mesh) {
			this._inner.material = this.selected_material;
		} 
	}


	override onUnselect(): void {
		if (this._inner instanceof THREE.Mesh) {
			this._inner.material = this.default_material;
		}
	}


	override set name(name: string) {
		this.input_name.set(name);
		super.name = name;
	}

	override get name() {
		return this._inner.name;
	}



    public input_name: Writable<string>;
	public input_ishidden: Writable<boolean>;
	public input_position: { x: Writable<string>; y: Writable<string>; z: Writable<string> };
	public input_rotation: { x: Writable<string>; y: Writable<string>; z: Writable<string> };
	
	

	center() : void {

		let count = 0 ;
		const center = new THREE.Vector3(0,0,0);
		const v = new THREE.Vector3();
		
		const p = this._props;
		for ( const prop of p ) {
			prop.getWorldPosition(v);
			center.add(v);
			count += 1;
			prop._inner.removeFromParent();
		}

		
		const parent = this._inner.parent
		this._inner.removeFromParent();
		window.scene.inner.add(this._inner);
		center.divide(new THREE.Vector3(count,count,count));
		this._inner.position.set( center.x , center.y , center.z );
		this._inner.removeFromParent();
		parent?.attach(this._inner);
		for ( const prop of p ) {
			this._inner.attach(prop._inner);
		}
	}
}



export interface VisualParams extends BaseParams {}
export abstract class Visual extends Base {
	override get type(): SupportedTypes {
		return 'visual';
	}
}


/**
 * TemporaryProp objects are objects which are dependent on time.
 * They will signal that they are ready to change state by going from
 * `IDLE` to `READY`.
 * */
export enum TemporaryState {
	/** Object is not ready to change state. */
	IDLE,
	/** Object is ready to change state. */
	READY
}


export interface TemporaryParams {}

export class Temporary extends Base {

	override get type(): SupportedTypes {
		return 'temporary';
	}

	update() {
		if ( this.guard(this.object) ) {
			console.log(`[${this.type}] ${this.object.name} is ready.`)
			this.on_ready(this.object);
			window.temp_objs = window.temp_objs.filter( p => p !== this )
		}
		else {
			console.log(`[${this.type}] ${this.object.name} is not ready.`)
		}
	}

	
	/**
	 * Create a temporary object that will do what needs to be done when the guard return `true`.
	 * @param inner The prop to wrap
	 * @param guard The function which will be called every frame to check if the prop is ready to change state.
	 * @param on_ready The function which will be called when the guard returns `true`.
	 */
	constructor(
		protected object : Prop | Visual ,
		protected  guard : (obj : Prop | Visual  ) => boolean,
		protected  on_ready : (obj : Prop | Visual  ) => void,
	) {
		super(new THREE.Object3D());
		window.temp_objs.push(this);
	}

	override toJSON(): TemporaryParams {
		return {
			guard: this.guard.toString(),
			on_ready: this.on_ready.toString(),
		};
	}	
}




export interface LockedParams extends BaseParams {
}


export abstract class Locked extends Base {
	override get type(): SupportedTypes {
		return 'locked';
	}
}


