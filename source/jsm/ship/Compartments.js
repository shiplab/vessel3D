import {generateUUID} from "../../../utils/uuid.js";

export class Compartments {
    constructor({
        length = 10,
        width = 10,
        height = 10,
        xpos = 0,
        ypos = 0,
        zpos = 0,
        cg = {x: undefined, y: undefined, z: undefined},
        density = 1025, // Default sault water, units in kg/m**3
        name = undefined,
        type = "compartment",
    } = {}) {
        const compartment = {
            length,
            width,
            height,
            xpos,
            ypos,
            zpos,
            cg,
            density,
            name,
            type,
        };

        // Set the uuid as name in case it is not defined
        Object.assign(this, compartment);

        this.name = name || generateUUID();

        this._updateWeight();
        this._updateCG();
    }

    _updateWeight() {
        this.weight = this.length * this.width * this.height * this.density;
    }

    _updateCG() {
        // If any of the values are undefined use the geometric center of
        // the compartment.
        if (Object.values(this.cg).some(c => c === undefined)) {
            this.cg = {
                x: this.length / 2,
                y: this.width / 2,
                z: this.height / 2,
            };
        }
    }
}
