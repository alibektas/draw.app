import type { Base, SupportedTypes } from "$lib/wrapper/Base";
import { Rack } from "$lib/wrapper/prop/physical/rack/Rack";
import { Group } from "../Group";



export class Row extends Group {

    racks : Array < Rack > = [];


    override get type() : SupportedTypes {
        return "row";
    }

    /**
     * 
     * @param address_prefix How belonging to this row will affect it's children addresses?
     */
    constructor() {
        super();
    }

    override add(...objects: Array <Base > ): this {
        for (const object of objects) {
            if (object instanceof Rack) {
                object.address = null;
                this.racks.push(object);
            }
            else {
                console.warn("You can only add/remove racks to a row.");
            }
            super.add( object );
        }

        return this;
    }

    override remove(...objects : Array < Base > ) : this  {
        for ( const object of objects ) {
            if ( object instanceof Rack ) {
                object.address = null;
                this.racks = this.racks.filter( ( r) => r.uuid !== object.uuid);
            }
            else {
                console.warn("You can only add/remove racks to a row.");
            }
            super.remove( object );
        }

        return this;
    }

    address ( prefix : string ) : void {


        let addressRangeStart = 1;
        let addressRangeEnd = 1;

        for ( const [ index , rack ]  of this.racks.entries() ) {
            addressRangeStart = addressRangeEnd;
            addressRangeEnd = Math.floor( rack.shelfWidth / 0.8 ) + addressRangeStart;
            this.racks[index].name = prefix + addressRangeStart + "-" + prefix + addressRangeEnd ;
        }

    }
}