import { REVISION } from "./constants.js";

// export const f = {
// 	linearFromArrays,
// 	bilinear,
// 	bisectionSearch
// };

export { Scene } from "./jsm/engine/Scene.js";
export { Ship } from "./jsm/ship/Ship.js"

if ( typeof window !== "undefined" ) {

	if ( window.__VESSEL__ ) {

		console.warn( "WARNING: Multiple instances of Vessel.js being imported." );

	} else {

		window.__VESSEL__ = REVISION;

	}

}