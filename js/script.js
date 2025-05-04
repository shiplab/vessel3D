const editor = document.getElementById("editor");
const viewer = document.getElementById("viewer");

import * as Vessel3D from "../build/vessel3D.js";

const trackPosition = {x: 15, y: 15, z: 15};

const defaultCode = `

// Imported Vessel3D library automatically
// import * as Vessel3D from "../build/vessel3D.js";

const ship = new Vessel3D.Ship();
const scene = new Vessel3D.Scene();

ship.addHull();
ship.addCompartments({ 
    name: "test",
    length: 2,
    width: 2,
    height: 2,
    x: 10,
    y: 0,
    z: 5,
    density: 1000 
});


scene.addShip(ship);
scene.addOcean();
scene.addAxesHelper();

const hydrostatics = new Vessel3D.HullHydrostatics(ship.hull, 3, false);
const stability = new Vessel3D.HullStability(ship);

// Verify stability calculations
// const {heel, trim} = stability.calculateStaticalStability();
// console.log("LCG: ", stability.LCG);
// console.log("KG: ", stability.KG);
// console.log("GM: ", stability.GM);
// console.log("Heel angle: ", heel);
// console.log("Trim angle: ", trim);

// const controller = new Vessel3D.Controller(scene, ship, stability);
// controller.trackCenters();

//---- Function to track position (Not necessary for ordinary use) ---- //
scene.camera.position.set(trackPosition.x, trackPosition.y, trackPosition.z);
scene.camera.lookAt(0, 0, 0);
//---- End of function ---->

function animate() {
    requestAnimationFrame(animate);
    scene.renderer.render(scene, scene.camera);

    //---- Update camera position (Not necessary for ordinary use) ----//
    trackPosition.x = scene.camera.position.x;
    trackPosition.y = scene.camera.position.y;
    trackPosition.z = scene.camera.position.z;
    //---- End of function ----//
}

animate();

viewer.appendChild(scene.renderer.domElement);
scene.renderer.setSize(viewer.clientWidth, viewer.clientHeight)
`;

const codeMirror = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "javascript",
    lineNumbers: true,
    theme: "default",
    viewportMargin: 50,
});

codeMirror.setValue(defaultCode);

let currentScene = null;
let timeoutId;

function runUserCode() {
    if (currentScene && currentScene.renderer) {
        currentScene.renderer.dispose();
        viewer.innerHTML = "";
    }

    try {
        const userCode = `(async function(viewer) { ${codeMirror.getValue()} })`;
        const runFunc = eval(userCode);
        runFunc(viewer);
    } catch (err) {
        console.error("Error executing user code:", err);
    }
}

codeMirror.on("change", () => {
    clearTimeout(timeoutId);
    viewer.firstChild?.remove(); // Remove the previous scene if it exists
    timeoutId = setTimeout(runUserCode, 250);
});

// editor.addEventListener("input", () => {
//     clearTimeout(timeoutId);
//     viewer.firstChild?.remove(); // Remove the previous scene if it exists
//     timeoutId = setTimeout(runUserCode, 250); // debounce for smoother updates
// });

viewer.addEventListener("mouseover", () => {
    viewer.style.cursor = "default";
});

runUserCode();
