import type { Base } from "$lib/wrapper/Base";
import { clone  } from "$lib/wrapper/utils";
import { writable, type Writable } from "svelte/store";

export interface PrefabParams  {
	object : Base ;
}

// TODO
// export class Prefab extends PrimitivePrefab {
// 	private _base: Prop ;
// 	private _count: number;
// 	private _instances: { [uuid: string]: Prop };

// 	get name(): string {
// 		return this._base.name;
// 	}

// 	/**
// 	 *
// 	 */
// 	constructor(base: Prop ) {
// 		this._base = base;
// 		this._instances = {};
// 		this._count = 0;
// 	}

// 	deinstantiate(inst: Prop ) {
// 		if (this._instances[inst.uuid] === undefined) {
// 			throw new Error('Trying to remove an instance of a prefab that does not exist.');
// 		}

// 		delete this._instances[inst.uuid];
// 		this._count -= 1;
// 	}

// 	instantiate(): Prop {
// 		const clone = this._base.clone();
// 		// TODO add lock to prefab.
// 		// clone.add(new Locked(this._base.uuid));
// 		this._count += 1;
// 		this._instances[clone.uuid] = clone;
// 		return clone;
// 	}


// 	/**
// 	 * Get number of instances of this prefab.
// 	 */
// 	public get count(): number {
// 		return this._count;
// 	}
// }


/**
 * 
 * @alibektas
 * A prefab class that almost has no functionality.
 * Our primary intention was to create a class that has links to the ones 
 * that derived from it. Yet this is at this point ( as of 02/02/2023 ) too much work
 * to do. The reason behind using this class with such method names even though their 
 * functionalities is as good as none is to have the skeleton upon which foreign 
 * submodules can build as well. So the next gen prefabs must definitely be derived
 * from this class.
 */
export class PrimitivePrefab {

	public input_name : Writable < string > ;

	get uuid () : string {
		return this.object.uuid;
	}
	

	constructor( private object : Base , name? : string ) {
		if ( name ) {
			object.name = name;
		}
		this.input_name = writable ( this.object.name ) ;
		this.input_name.subscribe(( nm ) => this.object.name = nm);
	}

	toJSON() : PrefabParams {
		return {
			"object" : this.object
		}
	}

	/** 
	 * Create an instance of the prefab. 
	 * TODO : Prefabs must remember which objects they have instantiated.
	*/
	instantiate() : any {
		return clone(this.object);
	}
}