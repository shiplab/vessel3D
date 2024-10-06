import { Scene } from "../engine/Scene.js";
import { getRandomColor } from "../math/randomFunctions.js"
import { Compartments } from "./Compartments.js";
import { Hull } from "./Hull.js"

import { HullHydrostatics } from "../physics/Hydrostatic.js"

import * as THREE from "../../libs/three.js"

export class Ship {

    constructor( specification ) {

        // TODO: Read the GLTF in case the specification is assigned
        // function read_gltf() {}

        // List of compartments
        this.compartments = []

    }

    addHull (hull, design_draft) {
        
        this.hull = new Hull(hull, design_draft)

    }

    initializeHydrostatics () {

        if ( !this.hull ) throw new Error( 'Hydrostatics only available after the hul definition. Use addHull method' );

        this.HullHydrostatics = new HullHydrostatics(this.hull)

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

    addCompartments({
        length = 10,
        width = 10,
        height = 10,
        xpos = 0,
        ypos = 0,
        zpos = 0,
        type = "compartment"
    } = {}) {
    
        console.log(width, height, length);
        
        const geometry = new THREE.BoxGeometry(width, height, length);
        const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });
        const compartment = new Compartments(geometry, material);
        
        compartment.position.set(
            xpos,
            ypos,
            zpos,
        )

        this.scene.addToScene(compartment);
        this.compartments.push(compartment)

        // Update the controls to accommodate the change in the scene
        this.scene.orbitControls.update()

    }

    initializeDragControls() {
        
        this.scene._initializeDragControls(this.compartments)

    }

}