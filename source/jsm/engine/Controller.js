import {Raycaster, Vector2} from "../../libs/three.js";

import * as THREE from "../../libs/three.js";

import {PANEL} from "../../../utils/panel.js";

export class Controller {
    constructor(scene, ...elements) {
        if (!scene.constructor.name === "Scene") {
            throw new Error("First attribute from controller must be valid Scene class.");
        }

        this.scene = scene;

        // TODO: Generalize the control to general modifications of the elements
        if (!this.scene.dragControls) {
            throw new Error("DragControls not defined");
        }

        // This function only apply only the function that are implemented in the controller
        const _ASSIGN_FUNC = {
            Ship: this._addShip,
            HullStability: this._addStability,
        };

        elements.forEach(e => {
            try {
                // Check if e has a valid constructor and name
                if (!e || !e.constructor || !e.constructor.name) {
                    throw new Error("Element does not have a valid constructor.");
                }

                const key = e.constructor.name;

                // Check if key exists in _ASSIGN_FUNC
                if (!(key in _ASSIGN_FUNC)) {
                    throw new Error(`No implementation for ${key} method`);
                }

                // Call the function safely
                _ASSIGN_FUNC[key].call(this, e);
            } catch (error) {
                console.error(`Error processing element: ${e}`, error.message);
            }
        });
    }

    _addShip(ship) {
        this.ship = ship;

        const SHIP = this.ship;

        if (this.scene.dragControls) {
            this.scene.dragControls.addEventListener("dragstart", function (event) {
                // debugger;
                console.log(event);
                const OBJECT = event.object;
                const compartment = SHIP.getCompartmentByName(OBJECT.name);
                compartment.x = OBJECT.position.x;
                compartment.y = OBJECT.position.y;
                compartment.z = OBJECT.position.z;
            });
        }
    }

    _addStability(stability) {
        this.stability = stability;
    }

    notifyChange(newValue) {
        console.log("Attribute changed in FirstClass to:", newValue);
        // Perform some logic here
    }

    // --------- Compartment Data --------- //
    get compartmentData() {
        return this._compartmentData;
    }

    set compartmentData(newData) {
        this._compartmentData = newData;
        this.compartments.updateData(newData); // Update Compartments
        console.log("Compartment data updated:", newData);
    }
    // --------- ---------------- --------- //

    trackCenters() {
        const STABILITY = this.stability;
        const raycaster = new Raycaster();
        const camera = this.scene.camera;
        const objects = [];

        // Create an info panel
        const infoPanel = PANEL;
        document.body.appendChild(infoPanel);

        // create CG element
        const GEOMETRY = new THREE.SphereGeometry(0.5, 32, 32);

        const mesh_cg = new THREE.Mesh(GEOMETRY, new THREE.MeshBasicMaterial());
        const mesh_buoy = new THREE.Mesh(GEOMETRY, new THREE.MeshBasicMaterial());
        const mesh_bm = new THREE.Mesh(GEOMETRY, new THREE.MeshBasicMaterial());

        mesh_cg.material.color.set(0x00ff00);
        mesh_buoy.material.color.set(0xff0000);
        mesh_bm.material.color.set(0x0000ff);

        mesh_cg.position.copy(STABILITY.weightsAndCenters.cg);
        mesh_buoy.position.copy({x: STABILITY.LCB, y: STABILITY.hull.position.y, z: STABILITY.KB}); // ship is always symmetrical in this modeling
        mesh_bm.position.copy({x: STABILITY.LCB, y: STABILITY.hull.position.y, z: STABILITY.GM}); // ship is always symmetrical in this modeling

        mesh_cg.userData = {name: "CG", position: mesh_cg.position};
        mesh_buoy.userData = {name: "KB", position: mesh_buoy.position};
        mesh_bm.userData = {name: "BM", position: mesh_bm.position};

        objects.push(mesh_cg);
        objects.push(mesh_buoy);
        objects.push(mesh_bm);

        this.scene.addShipElement(mesh_cg);
        this.scene.addShipElement(mesh_buoy);
        this.scene.addShipElement(mesh_bm);

        // Helper functions to show and hide the info panel
        function showInfoPanel(intersectedObject, x, y) {
            const {name, position} = intersectedObject.userData;
            infoPanel.style.display = "block";
            infoPanel.style.left = `${x + 10}px`;
            infoPanel.style.top = `${y + 10}px`;
            infoPanel.innerHTML = `<b>${name}</b><br>Position: (x: ${position.x.toFixed(2)}, y: ${position.y.toFixed(2)}, z: ${position.z.toFixed(
                2
            )})`;
        }

        function hideInfoPanel() {
            infoPanel.style.display = "none";
        }

        // Handle mouse movement
        function onMouseMove(event) {
            const mouse = new Vector2();

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
                showInfoPanel(intersects[0].object, event.clientX, event.clientY);
            } else {
                hideInfoPanel();
            }
        }

        // Add an event listener for mouse movement
        window.addEventListener("mousemove", onMouseMove);
    }
}
