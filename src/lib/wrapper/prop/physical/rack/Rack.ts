import { MAX_SHELF_COUNT_WARNING, DEFAULT_SHELF_SPACING } from "$lib/constants";
import { SELECTED_OBJECT_MAT, type SupportedTypes } from "$lib/wrapper/Base";
import { type Writable, writable } from "svelte/store";
import * as THREE from "three";
import { type PhysicalParams, Physical } from "../Physical";

export interface RackParams extends PhysicalParams {
	shelf_active: Array<boolean>,
	shelf_depth: number,
	shelf_spacing: Array<number>,
	shelf_count: number,
	shelf_width: number,
	shelf_thickness?: number,
	address : string | null
}

export class Rack extends Physical {

	address : string | null = null;
	shelves: Array<Shelf> = [];
	input_shelfCount: Writable<string>;
	input_shelfWidth: Writable<string>;
	input_shelvesSpacing: Writable<Array<string>>;
	input_shelfActive: Writable<Array<boolean>>;
	input_shelfDepth: Writable<string>;

	private anchors: Array<Anchor> = [];
	private shelf_geometry: THREE.BoxGeometry | null = null;

    override get type() : SupportedTypes { return "rack"; }

	
	set shelfDepth(depth: number) {
		this.shelf_depth = depth;
		this.shelf_geometry = new THREE.BoxGeometry(this.shelf_width, this.shelf_thickness, this.shelf_depth);
		this.shelves.forEach((shelf) => {
			const old_geo = shelf.geometry;
			old_geo.dispose();
			shelf.geometry = this.shelf_geometry as THREE.BoxGeometry;
		});

		this.update();
	}

	get shelfDepth() {
		return this.shelf_depth;
	}

	set_single_shelf_spacing(index: number, value: number) {
		this.shelf_spacing[index] = value;
		this.update();
	}

	set_shelf_activity(index: number, value: boolean) {
		this.shelf_active[index] = !value;
		this.shelves[index].visible = !value;
	}

	get shelvesSpacing() {
		return this.shelf_spacing;
	}

	set shelvesSpacing(spacings: number[]) {
		this.shelf_spacing = spacings;
		this.update();
	}

	set shelfCount(count: number) {
		if (this.shelf_count > count) {
			for (let t = 0; t < this.shelf_count - count; t++) {
				const o = this.shelves.pop();
				if (o === undefined) {
					throw new Error('Undefined Behavior');
				} else {
					this.shelf_active.pop();
					this.input_shelfActive.update(
						( v ) => {
							v.pop();
							return v;
						}
					)
					this._inner.remove(o);
				}
			}
		} else {
			for (let t = 0; t < count - this.shelf_count; t++) {
				const shelf = new Shelf(
					new THREE.Vector3(this.shelf_width, this.shelf_thickness, this.shelf_depth)
				);

				if (this.is_selected) {
					shelf.color();
				}

				this.shelves.push(shelf);
				this.shelf_active.push(true);
				this.input_shelfActive.update(
					( v ) => {
						v.push(true);
						return v;
					}
				)
				this._inner.add(shelf);

			}
		}

		this.shelf_count = count;
		this.update();
	}

	get shelfCount() {
		return this.shelf_count;
	}

	set shelfWidth(width: number) {
		this.shelf_geometry?.dispose();
		this.shelf_width = width;
		this.shelf_geometry = new THREE.BoxGeometry(
			this.shelf_width,
			this.shelf_thickness,
			this.shelf_depth
		);

		this.shelves.forEach((shelf) => {
			shelf.geometry = this.shelf_geometry as THREE.BoxGeometry;
		});

		this.update();
	}

	get shelfWidth() {
		return this.shelf_width;
	}

	override onSelect() {
		for (const o of this.shelves.concat(this.anchors)) {
			o.color();
		}
	}


	override onUnselect(): void {
		for (const o of this.shelves.concat(this.anchors)) {
			o.uncolor();
		}
	}

	update() {
		const rotation_old = this.rotation.clone();
		this.rotation.set(0, 0, 0);

		let spacing = 0;
		for (let i = 0; i < this.shelf_count; i++) {
			const shelf = this.shelves[i];
			shelf.position.set(0, 0, 0);
			shelf.position.setY(spacing);
			spacing = spacing + this.shelf_spacing[i] + this.shelf_thickness;
			if (this.is_selected) {
				shelf.color();
			}
		}

		this.anchors[0].position.set(this.shelf_width / 2, spacing / 2, this.shelf_depth / 2);
		this.anchors[1].position.set(-this.shelf_width / 2, spacing / 2, -this.shelf_depth / 2);
		this.anchors[2].position.set(this.shelf_width / 2, spacing / 2, -this.shelf_depth / 2);
		this.anchors[3].position.set(-this.shelf_width / 2, spacing / 2, this.shelf_depth / 2);

		this.anchors.forEach((anchor, index) => {
			const old_geo = anchor.geometry;
			this.anchors[index].geometry = new THREE.BoxGeometry(0.1, spacing, 0.1);
			old_geo.dispose();
		});

		if (this.is_selected) {
			for (const anchor of this.anchors) {
				anchor.color();
			}
		}

		this.rotation.set(rotation_old.x, rotation_old.y, rotation_old.z);
	}

	constructor(params : RackParams ) {
		super(new THREE.Group() , params );
		this.shelves = [];
		this.shelf_count = params.shelf_count;
		this.shelf_active = params.shelf_active;
		this.shelf_depth = params.shelf_depth;
		this._is_root = true;
		this.address = params.address;

		// Initialize shelf spacing array to the same length as the maximum number of shelves as stated by the MAX_SHELF_COUNT_WARNING const.
		this.shelf_spacing = [...new Array(MAX_SHELF_COUNT_WARNING).fill(DEFAULT_SHELF_SPACING)];
		params.shelf_spacing.map((value, index) => {
			this.shelf_spacing[index] = value;
		});

		this.shelf_width = params.shelf_width;
		if ( params.shelf_thickness === undefined) {
			this.shelf_thickness = 0.15;
		}
		else {
			this.shelf_thickness = params.shelf_thickness;
		}

		this.shelves = [...new Array(this.shelf_count)].map(( _ , index ) => {
			const shelf = new Shelf(
				new THREE.Vector3(this.shelf_width, this.shelf_thickness, this.shelf_depth)
			);
			shelf.visible = params.shelf_active[index]
			this._inner.add(shelf);
			return shelf;
		});

		this.shelf_active = params.shelf_active;

		this.anchors = [...new Array(4)].map(() => {
			const anchor = new Anchor(new THREE.Vector3(0.1, 1, 0.1));
			this._inner.add(anchor);
			return anchor;
		});

		// Init user input buffers
		{
			this.input_shelfActive = writable([]);
			this.input_shelvesSpacing = writable([]);
			this.input_shelfActive.update((arr) => {
				for (let i = 0; i < this.shelf_count; i++) {
					arr[i] = this.shelf_active[i];
				}

				return arr;
			});

			this.input_shelvesSpacing.update((arr) => {
				for (let i = 0; i < this.shelf_count; i++) {
					arr[i] = String(this.shelf_spacing[i]);
				}

				return arr;
			});

			this.input_ishidden = writable(this.visible);
			this.input_shelfWidth = writable(String(this.shelf_width));
			this.input_shelfDepth = writable(String(this.shelf_depth));
			this.input_shelfCount = writable(String(this.shelfCount));
		}

		this.update();
	}

	private shelf_active: Array<boolean>;
	private shelf_depth: number;
	private shelf_spacing: Array<number>;
	private shelf_count: number;
	private shelf_width: number;
	private shelf_thickness: number;

	static get default(): Rack {
		return new Rack({
			shelf_active : [true , true , true , true , true ],
			shelf_depth : 1.05 ,
			shelf_spacing : [1.7, 1.7, 1.7, 1.7, 1.7],
			shelf_count : 5,
			shelf_width : 2.7,
			address : null
		});
	}

	override toJSON() {



		return {
			shelf_count: this.shelf_count,
			shelf_active: this.shelf_active,
			shelf_depth: this.shelf_depth,
			shelf_spacing: this.shelf_spacing,
			shelf_width: this.shelf_width,
			shelf_thickness: this.shelf_thickness,
			address : this.address,
			...super.toJSON()
		};
	}

	override clone(): Rack {
		const m =new Rack({
			shelf_active : this.shelf_active,
			shelf_depth : this.shelf_depth,
			shelf_spacing : this.shelf_spacing,
			shelf_count : this.shelf_count,
			shelf_width : this.shelf_width,
			shelf_thickness : this.shelf_thickness,
			address : null
		});

		m.copy(this);
		return m;
	} 
}

class Shelf extends THREE.Mesh {
	/**
	 *
	 */
	constructor(dim: THREE.Vector3) {
		super(new THREE.BoxGeometry(dim.x, dim.y, dim.z), SHELF_MATERIAL);
	}

	color() {
		this.material = SELECTED_OBJECT_MAT;
	}

	uncolor() {
		this.material = SHELF_MATERIAL;
	}
}

class Anchor extends THREE.Mesh {
	/**
	 *
	 */
	constructor(dim: THREE.Vector3) {
		super(new THREE.BoxGeometry(dim.x, dim.y, dim.z), ANCHOR_MATERIAL);
	}

	color() {
		this.material = SELECTED_OBJECT_MAT;
	}

	uncolor() {
		this.material = ANCHOR_MATERIAL;
	}
}

const ANCHOR_MATERIAL = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffff00) });
const SHELF_MATERIAL = new THREE.MeshBasicMaterial({ color: 0x0000ff });
