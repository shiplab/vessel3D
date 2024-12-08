import { Compartments } from "./Compartments.js";
import { Hull } from "./Hull.js"

import { HullHydrostatics } from "../physics/Hydrostatic.js"

import { PREDEFINED_HULLS } from "../database/predefinedHull.js"

export class Ship {

    constructor( specification ) {

        // TODO: Read the GLTF in case the specification is assigned
        // function read_gltf() {}

        // List of compartments
        this.compartments = []
        this.cargoCompartments = []
        this.ballastCompartments = []
        this.fuelCompartments = []
        this.freshWater = []
        
        // List of equipments
        this.engine = []
        this.equipments = []

    }

    addHull (hull = undefined, design_draft = undefined) {

        if(hull === undefined) {
            // Undefined hull will be assigned automatically to Wigley Hull

            const HULL = PREDEFINED_HULLS["wigleyHull"]
            this.hull = new Hull(HULL)

            return this.hull
            
        }
        
        if(hull.hasOwnProperty('design_draft') && typeof hull.design_draft !== "number") {
            
            // Assign the design draft written in the hull object 
            design_draft = hull.design_draft
        
        } 

        this.hull = new Hull(hull, design_draft)

        return this.hull

    }

    initializeHydrostatics () {

        if ( !this.hull ) throw new Error( 'Hydrostatics only available after hull definition. Use addHull method' );

        this.HullHydrostatics = new HullHydrostatics(this.hull, this.hull.design_draft)

    }

    initializeStability () {
        
        if ( this.HullHydrostatics ) throw new Error( "Hydrostatics is a subclass of Stability. Therefore, no need for initializing hydrostatics 'shi.initializeHydrostatics()'." );

        this.HullStability = new HullStability(this.ship)

    }

    addBulkhead (xpos_aft, thickness, density) {

        try {
            
            if (this.hull === undefined) {
                
                // Throw an error if "hull" is not defined
                throw new Error("The key 'hull' is not defined in the object. Use the addHull function to insert a hull first");

            }

        } catch (error) {

            // Throw an error if "hull" is not defined
            throw new Error("The key 'hull' is not defined in the object.");
            
        }

        this.hull.addBulkheads(this.hull.attributes, xpos_aft, thickness, density)
        
    }

    addCompartments(compartmentObject) {
    
        const compartment = new Compartments(compartmentObject)

        this.compartments.push(compartment)
        
    }

    initializeDragControls() {
        
        this.scene._initializeDragControls(this.compartments)

    }

}