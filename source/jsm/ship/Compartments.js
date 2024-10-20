export class Compartments {

    constructor( {
        length = 10,
        width = 10,
        height = 10,
        xpos = 0,
        ypos = 0,
        zpos = 0,
        density = 1025, // Default soult water
        type = "compartment"
    } = {} ) {

        const weight = length * width * height * density
        
        const compartment = {
            length,
            width,
            height,
            xpos,
            ypos,
            zpos,
            density,
            weight,
            type
        }

        Object.assign(this, compartment)

    }

}
