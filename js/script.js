import * as Vessel3D from "../source/vessel3D.js";

const ship = new Vessel3D.Ship()

// ship.addCompartments()
// ship.addCompartments({height: 20, xpos:0})
// ship.addCompartments({length: 20, xpos:10})
ship.addCompartments({width: 20, xpos:10})

ship.addHull()

console.log(ship);

ship.scene.addAxesHelper()


// Initialize dragControls
ship.initializeDragControls()
ship.initializeDragControls()


// Render loop
function animate() {
    requestAnimationFrame(animate);

    const scene = ship.scene

    scene.renderer.render(scene, scene.camera);
}
animate();