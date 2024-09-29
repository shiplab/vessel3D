import { HullHydrostatics } from "../source/jsm/physics/Hydrostatic.js";
import * as Vessel3D from "../source/vessel3D.js";

const ship = new Vessel3D.Ship()

// ship.addCompartments()
// ship.addCompartments({height: 20, xpos:0})
// ship.addCompartments({length: 20, xpos:10})
// ship.addCompartments({width: 20, xpos:10})



ship.addHull()

// const hull = {}

// hull.halfBreadths = {        
//     "waterlines": [0, 0, 1],
//     "stations":[0, 1],
//     "table": [[0 , 0],[1 , 1],[1 , 1]],
// }

// hull.attributes = {
//     "LOA": 22.5,
//     "BOA": 10,
//     "Depth": 2.5,
//     "APP": 0
// }
// hull.style = {
//     "upperColor": "yellow",
//     "lowerColor": "green",
//     "opacity": 0.5
// }
// ship.addHull(hull, 5)

console.log(ship);

ship.scene.addAxesHelper()

ship.initializeHydrostatics()

// Initialize dragControls
// ship.initializeDragControls()

const scene = ship.scene

// Render loop
function animate() {
    requestAnimationFrame(animate);


    scene.renderer.render(scene, scene.camera);
}
animate();