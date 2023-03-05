import type { Locked, Prop, SupportedTypes, Visual , Temporary } from "$lib/wrapper/Base";
import { Box3Helper, Edge } from "$lib/wrapper/visual/Visual";
import { type Writable, writable } from "svelte/store";
import * as  THREE from "three";
import { type NonPhysicalParams, NonPhysical } from "../NonPhysical";

const ROUTER_SPHERE_RADIUS = 3.14 / 4;

export type LinkType = 
	/** A ( `this` ) is parent of B */
	"parent"|
	/** A ( `this` ) is child of B */
	"child"|
	/** A ( `this` ) is custom link to B */
	"custom"

export class  NextHop {
	constructor( 
		public edge : Edge,
		public object : Address,
		public link_type : LinkType
	) {}
}

export interface AddressParams extends NonPhysicalParams {
	address_type: AddressType;
	links : Array<{
		connect_to : string,
		link_type : LinkType
	}>;
	restrictions : {
		max_height : number | null ,
		max_width : number | null
	}
}


export type AddressType = 'endpoint' | 'router' | 'inbound' | 'outbound';

export class Address extends NonPhysical {
	
	protected override _inner: THREE.Mesh;
	protected _links :  Array<NextHop> = []; 

	get links() : Array<NextHop> {
		return this._links;
	}


	address_type: AddressType = "endpoint";
	input_max_height_restriction: Writable<string> = writable('');
	input_max_width_restriction: Writable<string> = writable('');

	override get type(): SupportedTypes {
		return 'address';
	}

	private _box_helper: Box3Helper | null = null;
	private _restrictions: {
		max_height: null | number;
		max_width: null | number;
	};

	override onAddToParent(): void {
		console.log(`[${this.type}][name:${this.name}] New parent for address`);
		if (this.try_web()) {
			window.scene.render();
		}
	}

	/**
	 * Once a new address object is introduced,
	 * it tries to set up some links by following a pattern
	 * according to which the parent ( if there is one ) and its
	 * siblings are traversed and any address among them will be linked to.
	 */
	try_web(): boolean {
		function try_web_predecessor(alpha: Address, beta: Prop | Visual | null): boolean {
			if (beta === null) return false;

			if (beta instanceof Address) {

				alpha.try_link( beta , "child" );
				beta.try_link( alpha , "parent" );
				return true;
			}

			return try_web_predecessor(alpha, beta.parent);
		}

		return try_web_predecessor(this, this.parent);
	}



	constructor( params? : AddressParams ) {
		const mesh = new THREE.Mesh(new THREE.SphereGeometry(ROUTER_SPHERE_RADIUS), ADDRESS_MAT);
		super(mesh , params);

		

		this._inner = mesh;
		this.default_material =  ADDRESS_MAT ;

		if ( params !== undefined)  {
			if ( params.address_type !== undefined ) {
				this.address_type = params.address_type;
			}
		}

		this._restrictions = {
			max_height: params?.restrictions?.max_height ?? null,
			max_width: params?.restrictions?.max_width ?? null 
		};

		if ( this._restrictions.max_height !== null ) {
			this.input_max_height_restriction.set(this._restrictions.max_height.toString());
		}
		
		if ( this._restrictions.max_width !== null ) {
			this.input_max_width_restriction.set(this._restrictions.max_width.toString());
		}

		if ( this._restrictions.max_height && this._restrictions.max_width ) {
			this.try_build_box_helper();
		}
	}

	set maxWidthRestriction(n: number) {
		this._restrictions.max_width = n;
		this.input_max_width_restriction.set(n.toString());
		this.try_build_box_helper();
	}

	set maxHeightRestriction(n: number) {
		this._restrictions.max_height = n;
		this.input_max_height_restriction.set(n.toString());
		this.try_build_box_helper();
	}

	try_build_box_helper() {
		if (this._box_helper === null) {
			if (this._restrictions.max_height !== null && this._restrictions.max_width !== null) {
				this._box_helper = new Box3Helper(
					new THREE.Box3().setFromCenterAndSize(
						new THREE.Vector3(0, this._restrictions.max_height / 2, 0),
						new THREE.Vector3(this._restrictions.max_width, this._restrictions.max_height, 0.2)
					)
				);

				this.add(this._box_helper);
			}
		} else {
			if (this._restrictions.max_height !== null && this._restrictions.max_width !== null) {
				this._box_helper.setFromCenterAndSize(
					new THREE.Vector3(0, 0 + this._restrictions.max_height / 2, 0),
					new THREE.Vector3(this._restrictions.max_width, this._restrictions.max_height, 0.2)
				);
			} else {
				this.remove(this._box_helper);
			}
		}
	}

	override toJSON() : AddressParams {
		return {
			...super.toJSON(),
			address_type: this.address_type,
			links : this._links.map(
				( l ) => {
					return {
						"connect_to": l.object.uuid,
						"link_type": l.link_type
					};
				}
			),
			restrictions : {
				max_height: this._restrictions.max_height,
				max_width: this._restrictions.max_width
			}
		};
	}

	override onBeforeRemoveFromParent(): void {
		for ( const l of this._links ) {
			if ( l.link_type === "parent" ) {
				console.log(`[${this.type}][name:${this.name}] Unlinking from parent link`);
				this._links = this._links.filter( ( e ) => e.object.uuid !== l.object.uuid ) ;	
			}
		}
	}

	override add(...objects: ( NextHop | Prop | Visual | Locked | Temporary)[]): this {
		
		for ( const obj of objects ) {
			if ( obj instanceof NextHop ) {
				console.log(`[${this.type}][name:${this.name}] links to ${obj.edge.name}`);
				this._links.push( obj );
				
				if ( this._inHierarchy )  {
					this.dispatchEvent({ type : 'onmount' });
				}
			}
			else {
				super.add(obj);
			}
		}

		return this;
	}

	override remove( ...objects: ( NextHop | Prop | Visual | Locked | Temporary)[] ): this {
		for ( const obj of objects ) {
			if ( obj instanceof NextHop ) {
				this._links = this._links.filter( ( e ) => e.object.uuid !== obj.object.uuid );
			}
			else {
				super.remove(obj);
			}
		}
		
		return this;
	}

	override onMountHierarchy() {
		super.onMountHierarchy();
		
		for ( const link of this._links ) {
			console.log(`[${this.type}][${this.name}] Adding link ${link.edge.name}`);
			if ( link.object.inHierarchy ) {
				window.scene.add( link.edge ) ;
			}	
		}
	}


	/**
	 * Try to create a new link between `this` and `beta`. This operation fails if there is already a link from (`this`,`beta`)
	 * @param beta the other end of the link
	 * @returns true , if the link was created
	 * @returns false , otherwise
	 */
	try_link ( beta : Address , link_type : LinkType ) : boolean {
		
		if ( this.has_link(beta) ) return false;

		const edge = new Edge( this , beta );
		const hop = new NextHop(
			edge,
			beta,
			link_type
		);

		this.add(hop);
		hop.edge.try_mount();
		return true;
	}

	/**
	 * Try to remove a link between `this` and `beta`. This operation fails if there is not a link from (`this`,`beta`)
	 * @param beta the other end of the link
	 * @returns true , if the link was created
	 * @returns false , otherwise
	 */
	try_unlink ( beta : Address ) : boolean {

		for ( const link of this._links ) {
			if ( link.object.uuid === beta.uuid ) {
				this.remove(link);
				return true;
			}

		}
		
		return false;
	}

	/**
	 * Check if the address has a direct link to the address `beta`
	 * @param beta the other end of the link
	 * @returns true , if the address has a direct link to `beta`
	 * @returns false , otherwise
	 */
	private has_link ( beta : Address ) : boolean {

		for ( const link of this._links ) {
			if ( link.object.uuid === beta.uuid ) {
				return true;
			}
		}

		return false;
	}
}

const ADDRESS_MAT = new THREE.MeshBasicMaterial({
	color: 0x51cfff,
	opacity: 0.5,
	transparent: true
});
