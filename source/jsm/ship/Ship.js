import { Scene } from "../engine/Scene.js";
import { getRandomColor } from "../math/randomFunctions.js"
import { Compartments } from "./Compartments.js";
import { Hull } from "./Hull.js"

import * as THREE from "../../libs/three.js"

export class Ship {

    constructor( specification ) {

        // Read the GLTF in case the specification is assigned
        // function read_gltf() {}

        this.scene = new Scene()

        // List of compartments
        this.compartments = []

    }

    addHull (hull, design_draft) {
        
        this.hull = new Hull(hull, design_draft)
        this.scene.addToScene(this.hull)

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