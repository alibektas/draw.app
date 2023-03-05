import { prefabs } from "$lib/stores/stores";
import * as THREE from "three";
import type { Base, BaseParams, SupportedTypes } from "./Base";
import { PrimitivePrefab, type PrefabParams } from "./locked/prefab/Prefab";
import { Address } from "./prop/nonphysical/address/Address";
import { AxataCorridor, Corridor } from "./prop/nonphysical/group/corridor/Corridor";
import { Group } from "./prop/nonphysical/group/Group";
import { Row } from "./prop/nonphysical/group/row/Row";
import { Rack, type RackParams } from "./prop/physical/rack/Rack";
import { Scene } from "./prop/scene/Scene";

export function getConstructorFor( type : SupportedTypes ) : any {
    if ( type === "group") {
        return Group;
    }
    else if ( type === "corridor") {
        return AxataCorridor;
    }
    else if ( type === "row") {
        return Row;
    }
    else if ( type === "rack") {
        return Rack;
    }
    else if ( type === "address") {
        return Address;
    }
    else if ( type === "scene" ) {
        return Scene;
    }
    else {
        throw new Error(`Unknown type ${type}`);
    }
}


export function fromJSON( json : any ) : any {
    const constructor = getConstructorFor( json.type );
    const obj = new constructor( json );

    if ( json.props !== undefined ) {
        for ( const prop of json.props ) {
            obj.add( fromJSON( prop ) );
        }
    }

    if ( json.type === "corridor") {
        (obj as Corridor).address();
    }


    obj._inner.position.copy(new THREE.Vector3().fromArray(json.position as Array<number> ));
    obj._inner.rotation.copy(new THREE.Euler().fromArray(json.rotation as any));
		
    
    return obj;
}


export function clone( o : Base ) : Base { 

    const obj = o.clone();
    
    for( const child of o.props ) {
        obj.add( clone( child ) );
    }


    obj.inner.position.copy( o.inner.position );
    obj.inner.rotation.copy( o.inner.rotation );


    return obj;

}


function loadSceneInner( json : BaseParams ) : any {
    if ( json.type === undefined ) {
        throw new Error("Error reading .json file. Object has no type.");
    }

    const constructor = getConstructorFor( json.type );
    const obj = new constructor( json );

    if ( json.props !== undefined ) {
        for ( const prop of json.props ) {
            obj.add( loadSceneInner( prop ) );
        }
    }

    if ( json.type === "rack" ) {
        (obj as Rack).address = (json as RackParams).address;
    }

    obj._inner.position.copy(new THREE.Vector3().fromArray(json.position as Array<number> ));
    obj._inner.rotation.copy(new THREE.Euler().fromArray(json.rotation as any));
    obj._inner.uuid = json.uuid;
    obj._inner.name = json.name;

        
    return obj;
}

export function loadScene( json : BaseParams ) : any {
    if ( json.type === undefined ) {
        throw new Error("Error reading .json file. Object has no type.");
    }

    // const constructor = getConstructorFor( json.type );
    // const obj = new constructor( json );

    const scene = window.scene ;

    for ( const prop of scene.props) {
        scene.remove( prop );
    }

    for ( const visual of scene.visuals ) {
        scene.remove( visual );
    }

    for ( const temp of scene._temporaries) {
        scene.remove( temp );
    }


    if ( json.props !== undefined ) {
        for ( const prop of json.props ) {
            scene.add( loadSceneInner( prop ) );
        }
    }

    scene.inner.position.copy(new THREE.Vector3().fromArray(json.position as Array<number> ));
    scene.inner.rotation.copy(new THREE.Euler().fromArray(json.rotation as any));
    
    if ( json.uuid === undefined )  {
        throw new Error("For the sake of hard cloning, scene had to have a uuid.");
    }
    scene.inner.uuid = json.uuid;
    
    if ( json.name === undefined ) {
        throw new Error("For the sake of hard cloning, scene had to have a name.");
    }
    scene.inner.name = json.name;
    window.scene.render();
}


/**
 * Reads the list of prefabs from a .json file and mounts them to the current session.
 */
export function loadPrefabs( pfb : { [uuid : string ] : PrefabParams } ) : boolean {

    prefabs.update( 
        ( dct ) => {
            for ( const p of Object.values( pfb ) ) {
                const obj =  fromJSON(p['object']);
                dct[obj.uuid] = new PrimitivePrefab(obj , p['object'].name);
            }

            return dct;
        }
    )
        
    return true;
}