import { Compartments } from "./Compartments.js";
import { Hull } from "./Hull.js"

import { HullHydrostatics } from "../physics/Hydrostatic.js"

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

    addHull (hull) {

        if (!hull.hasOwnProperty("design_draft") || typeof hull.design_draft !== "number") {
        
            throw new Error("The attribute 'design_draft' is either missing or not a numerical value.");
        
        }

        const design_draft = hull.hasOwnProperty('propertyName') ? hull.design_draft : undefined

        this.hull = new Hull(hull, design_draft)

    }

    initializeHydrostatics () {

        if ( !this.hull ) throw new Error( 'Hydrostatics only available after hull definition. Use addHull method' );

        this.HullHydrostatics = new HullHydrostatics(this.hull, this.hull.design_draft)

    }

    calculateStability () {

        

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