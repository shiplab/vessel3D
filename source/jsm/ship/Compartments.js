import {generateUUID} from "../../../utils/uuid.js";

export class Compartments {
    constructor({
        length = 10,
        width = 10,
        height = 10,
        x = 0,
        y = 0,
        z = 0,
        cg = {x: undefined, y: undefined, z: undefined},
        density = 1025, // Default sault water, units in kg/m**3
        name = undefined,
        type = "compartment",
    } = {}) {
        const compartment = {
            length,
            width,
            height,
            cg,
            density,
            name,
            type,
        };

        // Set the uuid as name in case it is not defined
        Object.assign(this, compartment);

        this.x = x;
        this.y = y;
        this.z = z;

        this.name = name || generateUUID();

        this._updateWeight();
        this._updateCG();
    }

    set x(value) {
        this._xpos = value;
    }
    get x() {
        return this._xpos;
    }

    set y(value) {
        this._ypos = value;
    }

    get y() {
        return this._ypos;
    }

    set z(value) {
        this._zpos = value;
    }

    get z() {
        return this._zpos;
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
