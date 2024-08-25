import * as THREE from "../../libs/three.js"

export class Compartments extends THREE.Mesh {

    constructor( geometry, material ) {
        
        super(geometry, material)

        // Stores the original size of the compartments
        this.material.originalColor = material.color.getHexString()

        
        this.rotation.set(Math.PI / 2, Math.PI / 2, 0); 

    }

}
