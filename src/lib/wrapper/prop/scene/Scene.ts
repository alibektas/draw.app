import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { scene_state } from '$lib/stores/stores';
import { WebGLRenderer, type Camera } from 'three';
import type { SceneStateName } from './state/ABCSceneState';
import { get } from 'svelte/store';
import { Prop, Visual, type SupportedTypes } from "../../Base";
import { GridHelper, Line , TransformControls } from "$lib/wrapper/visual/Visual";

export class Scene extends Prop {
	protected override _inner: THREE.Scene;

	override get root(): Scene {
		if (this._is_root) {
			return this;
		} else {
			throw new Error('Scene must have been a root on its own.');
		}
	}

	protected override can_remove(obj: Prop | Visual): boolean {
		if (obj instanceof GridHelper) {
			// Better not
			return false;
		} 
		else if ( obj instanceof TransformControls ) {
			// Better not
			return false;
		}

		return super.can_remove(obj);
	}

	public orbitControls: OrbitControls;
	public transformControls: TransformControls;

	private _renderer: THREE.WebGLRenderer;
	private _camera: THREE.PerspectiveCamera;
	private _raycaster: THREE.Raycaster;
	private _pointer: THREE.Vector2;
	private _domElement: HTMLCanvasElement;
	private needs_render = false;

	override get type(): SupportedTypes {
		return 'scene';
	}

	constructor(width: number, height: number, canvas: HTMLCanvasElement, scene = new THREE.Scene()) {
		super(scene);
		this._inner = scene;
		this._raycaster = new THREE.Raycaster();
		this._pointer = new THREE.Vector2();

		// Gray background
		this._inner.background = new THREE.Color('rgb(100,100,100)');

		// ----------------------------------------------------------------
		// ----------------------------------------------------------------
		// ADD GRID
		// ----------------------------------------------------------------
		// ----------------------------------------------------------------
		this.add(new GridHelper(10000, 1000));

		//create a blue LineBasicMaterial
		const material2 = new THREE.LineBasicMaterial({ color: 0x0000ff });
		const points = [];
		points.push(new THREE.Vector3(300, 0, 0));
		points.push(new THREE.Vector3(-300, 0, 0));
		const geometry2 = new THREE.BufferGeometry().setFromPoints(points);
		const line = new Line(geometry2, material2);
		this.add(line);

		const material4 = new THREE.LineBasicMaterial({ color: 0xff0000 });
		const points3 = [];
		points3.push(new THREE.Vector3(0, 0, 300));
		points3.push(new THREE.Vector3(0, 0, -300));
		const geometry4 = new THREE.BufferGeometry().setFromPoints(points3);
		const line3 = new Line(geometry4, material4);
		this.add(line3);
		// ----------------------------------------------------------------
		// ----------------------------------------------------------------
		// ----------------------------------------------------------------

		this._renderer = new WebGLRenderer({ canvas: canvas });
		this._camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
		this._domElement = this._renderer.domElement;
		this.orbitControls = new OrbitControls(this._camera as Camera, this._renderer.domElement);

		this.transformControls = new TransformControls(
			this._camera,
			this._domElement
		);
		// It was earlier a bug to delete an object if this object was the object to be transformed in any of the edit modes.
		// To prevent this from happening by setting every time we use this._transformControls  its 'enabled' property to true.
		// And after we are done using it we set it back to 'false'.
		this.transformControls.enabled = false;
		this.add(this.transformControls);

		this._camera.position.z = 30;
		this._camera.position.y = 10;

		this.orbitControls.addEventListener('change', () => {
			this.render();
		});

		this.transformControls.addEventListener('change', () => {
			this.render();
		});

		this.render();
	}

	dim_update(width: number, height: number) {
		if (this._renderer === undefined) return;
		this._renderer.setSize(width, height);
		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();
		this._renderer.setPixelRatio(window.devicePixelRatio);
		this.render();
	}

	the_real_render(){
		if ( this.needs_render ) {
			for (const tmp of window.temp_objs) {
				tmp.update()
			}
	
			this._renderer.render(this._inner, this._camera);
		}

		this.needs_render = false;
	}

	render() {
		this.needs_render = true;
	}

	onPointerDown(event: MouseEvent) {
		const rect = (this._domElement as HTMLCanvasElement).getBoundingClientRect();
		this._pointer.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1;
		this._pointer.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1;

		this._raycaster.setFromCamera(this._pointer, this._camera);
		const base = [];

		for ( const prop of this._props ) {
			base.push(prop.inner);
		}

		const intersects = this._raycaster.intersectObjects(
			base,
			true
		) as THREE.Intersection<THREE.Object3D>[];


		const state: SceneStateName = get(scene_state);
		window.sceneStates[state].__on_intersects(intersects);
	}
}
