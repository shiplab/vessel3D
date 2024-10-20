import * as Vessel3D from "../source/vessel3D.js";

import { HullHydrostatics as Hydrostatic } from "../source/jsm/physics/Hydrostatic.js";

const ship = new Vessel3D.Ship()

// Commands to create compartments
// ship.addCompartments()



// 1- Define the hull and add it under ship
const hull = {}
// hull.halfBreadths = {        
//     "waterlines": [0, 0, 0.5, 1],
//     "stations":[0, 1],
//     "table": [[0 , 0],[1 , 1], [1 , 1],[1 , 1]],
// }
hull.halfBreadths = {        
    "waterlines": [0, 0, 1],
    "stations":[0, 1],
    "table": [[0 , 0],[1 , 1],[1 , 1]],
}

hull.attributes = {
    "LOA": 22.5,
    "BOA": 10,
    "Depth": 5,
    "APP": 0,
    "hullStructureWeight": 800
}
hull.style = {
    "upperColor": "yellow",
    "lowerColor": "green",
    "opacity": 0.5
}
hull.structureWeight = 800 //kg
hull.design_draft = 3

ship.addHull(hull)
// ship.addCompartments({height: 20, xpos:0})
ship.addCompartments({length: 20, xpos:10})
// ship.addCompartments({width: 20, xpos:10})

// 2 - Create a scene
const scene = new Vessel3D.Scene()
scene.addShip( ship )
scene.addAxesHelper()

// 3 - Initialize hydrostatic
// The hydrostatic can be created using the initialize hydrostatic command or can
// be created independently
ship.initializeHydrostatics()
const hydrostatics = new Hydrostatic(hull, 3)

// Initialize dragControls
scene.initializeDragControls()

console.log(ship);
console.log(hydrostatics);


// Render loop
function animate() {

    requestAnimationFrame(animate);
    scene.renderer.render(scene, scene.camera);

}
animate();