export class Compartments {

    constructor( {
        length = 10,
        width = 10,
        height = 10,
        xpos = 0,
        ypos = 0,
        zpos = 0,
        density = 1025, // Default sault water, units in kg/m**3
        type = "compartment"
    } = {} ) {

        const compartment = {
            length,
            width,
            height,
            xpos,
            ypos,
            zpos,
            density,
            type
        }

        Object.assign(this, compartment)
        this._updateWeight()

    }

    _updateWeight() {

        this.weight = this.length * this.width * this.height * this.density

    }

}
