import * as Vessel3D from "../source/vessel3D.js";

import {HullHydrostatics as Hydrostatic} from "../source/jsm/physics/Hydrostatic.js";
import {HullStability} from "../source/jsm/physics/Stability.js";
import {Controller} from "../source/jsm/engine/Controller.js";

const ship = new Vessel3D.Ship();

// Commands to create compartments
// ship.addCompartments()

// 1- Define the hull and add it under ship
const hull = {};
// hull.halfBreadths = {
//     "waterlines": [0, 0, 0.5, 1],
//     "stations":[0, 1],
//     "table": [[0 , 0],[1 , 1], [1 , 1],[1 , 1]],
// }
hull.halfBreadths = {
    waterlines: [0, 0, 1],
    stations: [0, 1],
    table: [
        [0, 0],
        [1, 1],
        [1, 1],
    ],
};

hull.attributes = {
    LOA: 20,
    BOA: 10,
    Depth: 5,
    APP: 0,
    structureWeight: 200000, //kg
};
hull.style = {
    opacity: 0.5,
};
hull.design_draft = 3;

// ship.addHull(hull);

// 1.2 - There is the possibility to create a default hull as well by using:
ship.addHull();
// ship.addHull(undefined, {predefinedHullName: "barge"});

// 1.1 - Add compartments if you want, here are some examples:
// ship.addCompartments({height: 20, x:0})
ship.addCompartments({name: "test", length: 2, width: 2, height: 2, x: 10, y: 5, z: 5, density: 1000});
// ship.addCompartments({width: 20, x:10})

// 2 - Create a scene with ocean
const scene = new Vessel3D.Scene();
scene.addShip(ship);
scene.addOcean();
scene.addAxesHelper();

// 3 - Initialize hydrostatic
// The hydrostatic can be created using the initialize hydrostatic command or can
// be created independently
// ship.initializeHydrostatics()
const hydrostatics = new Hydrostatic(hull, 3, false);
const hydrostaticTable = hydrostatics.retrieveHydrostaticCurves();

// 4 - Initialize stability
const stability = new HullStability(ship);
const {phi, theta} = stability.calculateStaticalStability();

console.log(stability);
console.log("LCG: ", stability.LCG);
console.log("KG: ", stability.KG);
console.log("GM: ", stability.GM);
console.log("Heel angle: ", phi);
console.log("Trim angle: ", theta);

scene.initializeDragControls();

const controller = new Controller(scene, ship, stability);
// Initialize dragControls

console.log(ship);
console.log(hydrostaticTable);
controller.trackCenters();

// Render loop
function animate() {
    requestAnimationFrame(animate);
    scene.renderer.render(scene, scene.camera);
}
animate();
