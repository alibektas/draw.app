import type { Base, SupportedTypes } from "$lib/wrapper/Base";
import { type Writable, writable } from "svelte/store";
import type { NonPhysicalParams } from "../../NonPhysical";
import { Group } from "../Group";
import { Row } from "../row/Row";


export abstract class Corridor extends Group {


    protected row1 : Row | null  = null;
    protected row2 : Row | null  = null;
    private _corridor_code : string | null  = null;
    private _first_row_naming : string | null  = null;
    private _second_row_naming : string | null  = null;
    
    public input_corridor_code : Writable<string> =  writable();
    public input_first_row_naming : Writable<string> =  writable();
    public input_second_row_naming : Writable<string> =  writable();

    set first_row_naming ( name : string ) {
        this._first_row_naming = name;
        this.input_first_row_naming.set( name );
    }

    get first_row_naming () : string {
        return this._first_row_naming ?? "";
    }

    get second_row_naming () : string {
        return this._second_row_naming ?? "";
    }

    set second_row_naming ( name : string ) {
        this._second_row_naming = name;
        this.input_second_row_naming.set( name );
    }

    set corridor_code( code : string ) {
        this._corridor_code = code;
        this.input_corridor_code.set( code );
    }

    get corridor_code () : string {
        return this._corridor_code ?? "";
    }


    override get type(): SupportedTypes {
        return "corridor";
    }


    constructor(params? : NonPhysicalParams ) {
        super(params);
    }

    override add( ...objects : Array < Base > ) {
        for ( const obj of objects ) {
            if ( obj instanceof Row ) {
                if ( this.row1 === null ) {
                    this.row1 = obj;
                }
                else if ( this.row2 === null ) {
                    this.row2 = obj;
                }
                else {
                    console.warn(`[${this.type}][${this.name}] already has two rows. Cannot add more.`);
                }
                super.add(obj);
            }
        }

        return this;
    }


    override remove( ...objects : Array < Base > ) {
        for ( const obj of objects ) {
            if ( obj instanceof  Row ) {
                if ( this.row1 !== null && this.row1.uuid === obj.uuid ) {
                    this.row1 = null;
                }
                else if ( this.row2 !== null && this.row2.uuid === obj.uuid ) {
                    this.row2 = null;
                }
                else {
                    console.warn(`[${this.type}][${this.name}] does not have row ${obj.name}. Cannot remove.`);
                }  
            }
            super.remove(...objects);
        }
        
        return this;
    }


    abstract address() : void;
}

export class AxataCorridor extends Corridor {
    
    constructor( params? : NonPhysicalParams & { corridor_code : string, first_row_naming : string, second_row_naming : string } ) {
        super(params);
        if ( params?.corridor_code !== undefined ) {
            this.corridor_code = params.corridor_code;
        }
        if ( params?.first_row_naming !== undefined ) {
            this.first_row_naming = params.first_row_naming;
        }
        if ( params?.second_row_naming !== undefined ) {
            this.second_row_naming = params.second_row_naming;
        } 
    }

    address() : void {
        console.log(`[${this.type}][${this.name}] generate`);
        
        if ( this.row1 !== null )  {
            this.row1.address(this.corridor_code + this.first_row_naming);
        }
        
        if ( this.row2 !== null )  {
            this.row2.address(this.corridor_code + this.second_row_naming);
        }
    }

    override toJSON() {


        return {
            ...super.toJSON(),
            corridor_code : this.corridor_code,
            first_row_naming : this.first_row_naming,
            second_row_naming : this.second_row_naming,
        }
    }
}