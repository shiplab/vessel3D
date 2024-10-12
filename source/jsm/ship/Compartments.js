import * as THREE from "../../libs/three.js"

export class Compartments extends THREE.Mesh {

    constructor( {
        length = 10,
        width = 10,
        height = 10,
        xpos = 0,
        ypos = 0,
        zpos = 0,
        type = "compartment"
    } = {} ) {
        
        const compartment = {
            length,
            width,
            height,
            xpos,
            ypos,
            zpos,
            type
        } 

        return compartment

    }

}
