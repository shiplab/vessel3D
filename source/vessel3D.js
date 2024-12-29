import {REVISION} from "./constants.js";

import {bisectionSearch} from "./jsm/math/interpolation.js";

export const math = {
    bisectionSearch,
};

export {Scene} from "./jsm/engine/Scene.js";
export {Ship} from "./jsm/ship/Ship.js";
export {HullHydrostatics} from "./jsm/physics/Hydrostatic.js";
export {Controller} from "./jsm/engine/Controller.js";

if (typeof window !== "undefined") {
    if (window.__VESSEL__) {
        console.warn("WARNING: Multiple instances of Vessel.js being imported.");
    } else {
        window.__VESSEL__ = REVISION;
    }
}
