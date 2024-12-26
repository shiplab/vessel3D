// import { Scene } from "../../libs/three.js";
// import { Camera } from "../../libs/three.js";

import * as THREE from "../../libs/three.js";

import {HullStability} from "../physics/Stability.js";
import {OrbitControls} from "../../libs/OrbitControls.js";
import {DragControls} from "../../libs/DragControls.js";
import {getRandomColor} from "../math/randomFunctions.js";
import {Ocean} from "./Ocean.js";

export class Scene extends THREE.Scene {
    constructor(spec) {
        super();

        // Setting the Z-Up reference system.
        THREE.Object3D.DefaultUp.set(0, 0, 1);
        this.zUpCont = new THREE.Group();
        this.zUpCont.name = "zUpCont";
        this.zUpCont.rotation.x = -0.5 * Math.PI;
        this.add(this.zUpCont);

        this.vesselGroup = new THREE.Group();
        this.vesselGroup.name = "vesselGroup";
        this.zUpCont.add(this.vesselGroup);

        // Storing the center of gravity and angles of the ship
        this._shipCG = new THREE.Vector3();
        this._shipRotation = new THREE.Euler();

        // Elements
        this.ocean = undefined;
        this.compartment_mesh = [];

        this._init(spec);
    }

    set shipCG(value) {
        this._shipCG.setX(value.x);
        this._shipCG.setY(value.y);
        this._shipCG.setZ(value.z);
    }

    get shipCG() {
        return this._shipCG.clone();
    }

    set shipRotation(value) {
        // Try quaternion rotation in the future
        const draft_translation = this.vesselGroup.position.clone().z;
        const cg_position = this.shipCG;
        // debugger;

        const pivot = new THREE.Vector3(cg_position.x, cg_position.y, cg_position.z + draft_translation);
        // console.log(pivot);

        this.vesselGroup.position.add(pivot.clone().negate());

        // Create a quaternion for the rotation
        this._shipRotation.set(value.heel, value.trim, 0); // Yaw value is not considered

        // Applying the rotation using quaternion
        // var q = new THREE.Quaternion();
        // q.setFromEuler(this._shipRotation);
        // this.vesselGroup.applyQuaternion(q);

        // Applying the rotation using Euler
        this.vesselGroup.rotation.x = this._shipRotation.x;
        this.vesselGroup.rotation.y = this._shipRotation.y;
        this.vesselGroup.rotation.z = this._shipRotation.z;

        // Translate the vesselGroup back
        this.vesselGroup.position.add(pivot);
    }

    get shipRotation() {
        return this._shipRotation.copy();
    }

    _init(spec) {
        // Set up the camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(15, 15, 15);
        this.camera.lookAt(0, 0, 0);
        this.camera.rotation.order = "XYZ";
        this.camera.up.set(0, 1, 0);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xa9cce3, 1);

        if (!spec) {
            this.background = new THREE.Color(0xa9cce3);
        }

        // Add orbit controls to rotate the scene
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true; // Smooth orbit controls
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.screenSpacePanning = false;
        this.orbitControls.minDistance = 0.1;

        document.body.appendChild(this.renderer.domElement);

        // Add hemisphere light
        this.addToScene(new THREE.HemisphereLight(0xccccff, 0x666688, 1));
    }

    _initializeDragControls(compartment) {
        this.dragControls = new DragControls(compartment, this.camera, this.renderer.domElement);

        // Optionally, you can listen to the drag events
        this.dragControls.addEventListener("dragstart", function (event) {
            event.object.material.color.set(0xff0000); // Change color when dragging starts
        });

        this.dragControls.addEventListener("dragend", function (event) {
            const originalColor = "#" + event.object.material.originalColor;
            event.object.material.color.set(originalColor); // Revert color when dragging ends
        });

        const orbitControls = this.orbitControls;

        // Disable orbit controls when dragging
        this.dragControls.addEventListener("dragstart", function () {
            orbitControls.enabled = false;
        });

        this.dragControls.addEventListener("dragend", function () {
            orbitControls.enabled = true;
        });
    }

    initializeDragControls() {
        this._initializeDragControls(this.compartment_mesh);
    }

    addToScene(element) {
        // This add element is a workaround for covering the difference in the coordinate
        // system between the traditional coordinate of system (x, y, z) in engineering and
        // the chosen system by the Three.js developers (x, z, y)
        if (element.constructor.name == "Ship") {
            throw new Error("It seems that you are trying to add a ship object, try to use scene.addSip(ship) instead.");
        }

        this.zUpCont.add(element);
    }

    addShipElement(element) {
        if (element.constructor.name == "Ship") {
            throw new Error("It seems that you are trying to add a ship object, try to use scene.addSip(ship) instead.");
        }

        this.vesselGroup.add(element);
    }

    addShip(ship) {
        this.addShipElement(ship.hull);

        ship.compartments.forEach(compartment => {
            this.addCompartment(compartment);
        });

        // Comment: the draft is calculated independently if the design_draft
        // is provided or not. The ship is inserted on the scene
        // with the origin in the center of gravity as default.
        const stability = new HullStability(ship);

        // Inserting ship in the position equals to 0
        this.vesselGroup.position.z = -stability.calculatedDraft;

        this.shipCG = stability.weightsAndCenters.cg;
        this.shipRotation = stability.calculateStaticalStability();

        // this.vesselGroup.translate(-stability.LCG, -stability.KG, 0)
    }

    addCompartment(compartment) {
        // TODO: length is a special case for javascript,
        // maybe should be better to change to
        // something else @ferrari212.
        const length = compartment["length"];
        const width = compartment["width"];
        const height = compartment["height"];

        const x = compartment["x"];
        const y = compartment["y"];
        const z = compartment["z"];

        const geometry = new THREE.BoxGeometry(width, height, length);
        const material = new THREE.MeshBasicMaterial({color: getRandomColor()});

        // Stores the original color of the compartments
        material.originalColor = material.color.getHexString();

        const compartment_mesh = new THREE.Mesh(geometry, material);

        compartment_mesh.name = compartment.name;

        // Rotate to match ZUp reference
        compartment_mesh.rotation.set(Math.PI / 2, Math.PI / 2, 0);

        compartment_mesh.position.set(x, y, z);

        this.compartment_mesh.push(compartment_mesh);

        this.addShipElement(compartment_mesh);
    }

    addOcean(path = undefined, oceanSpec = {}) {
        this.ocean = new Ocean(path, oceanSpec);
        this.addToScene(this.ocean);

        if (!this.ocean.water.isWater) {
            let grid = new THREE.GridHelper(1000, 100);
            grid.rotation.x = 0.5 * Math.PI;
            grid.position.z = 0.01;

            this.addToScene(grid);
        }

        let sun = new THREE.DirectionalLight(0xffffff, 2);
        sun.position.set(-512, 246, 128);
        this.addToScene(sun);
    }

    addAxesHelper(size = 10) {
        const axesHelper = new THREE.AxesHelper(10);
        this.addToScene(axesHelper);
    }
}
