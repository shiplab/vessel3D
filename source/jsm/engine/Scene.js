// import { Scene } from "../../libs/three.js";
// import { Camera } from "../../libs/three.js";

import * as THREE from "../../libs/three.js"
import { OrbitControls } from "../../libs/OrbitControls.js";
import { DragControls } from "../../libs/DragControls.js";


export class Scene extends THREE.Scene {

    constructor(spec) {

        
        super();
        
        // Setting the Z-Up reference system.
        THREE.Object3D.DefaultUp.set(0, 0, 1);
        this.zUpCont = new THREE.Group();
        this.zUpCont.rotation.x = -0.5 * Math.PI;
        this.add(this.zUpCont)

        this._init(spec);
    
    }

    _init(spec) {
        
        // Set up the camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set( 15, 15, 15 );
        this.camera.lookAt( 0, 0, 0);
        this.camera.rotation.order = "XYZ";
        this.camera.up.set(0, 1, 0)

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0xa9cce3, 1);

        if(!spec) {

            this.background = new THREE.Color(0xa9cce3); 
        
        }

        // Add orbit controls to rotate the scene
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true; // Smooth orbit controls
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.screenSpacePanning = false;
        this.orbitControls.minDistance = 0.1;

        document.body.appendChild(this.renderer.domElement);

        
    
    }

    _initializeDragControls(compartment) {

        this.dragControls = new DragControls(compartment, this.camera, this.renderer.domElement);

        // Optionally, you can listen to the drag events
        this.dragControls.addEventListener('dragstart', function (event) {
            event.object.material.color.set(0xff0000); // Change color when dragging starts
        });

        this.dragControls.addEventListener('dragend', function (event) {
            const originalColor ="#" + event.object.material.originalColor
            event.object.material.color.set(originalColor); // Revert color when dragging ends
        });

        const orbitControls = this.orbitControls

        // Disable orbit controls when dragging
        this.dragControls.addEventListener('dragstart', function () {
            orbitControls.enabled = false;
            
        });

        this.dragControls.addEventListener('dragend', function () {
            orbitControls.enabled = true;
        });

    }

    addToScene( element ) {
        
        // This add element is a workaround for covering the difference in the coordinate
        // system between the traditional coordinate of system (x, y, z) in engineering and
        // the chosen system by the Three.js developers (x, z, y)
        this.zUpCont.add(element);
        

    }

    addAxesHelper(size = 10) {
        
        const axesHelper = new THREE.AxesHelper( 10 );
        this.addToScene( axesHelper );
    }

    
    
}