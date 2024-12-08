// // Importing the Three.js
import * as THREE from "../Vessel3D/libs/three.js";
// import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.146.0/build/three.module.js';

import {DragControls} from "../Vessel3D/libs/DragControls.js";

// Importing the OrbitControls.js library
import {OrbitControls} from "../Vessel3D/libs/OrbitControls.js";

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xa9cce3, 1);
document.body.appendChild(renderer.domElement);

// Create a few cubes and add them to the scene
const cubes = [];

for (let i = 0; i < 3; i++) {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = i * 2 - 2; // Spread cubes out on the X-axis
    scene.add(cube);
    cubes.push(cube);
}

// Add orbit controls to rotate the scene
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true; // Smooth orbit controls
orbitControls.dampingFactor = 0.05;
orbitControls.screenSpacePanning = false;
orbitControls.minDistance = 2;
orbitControls.maxDistance = 10;

// Set the camera position
camera.position.z = 5;

// Initialize DragControls with the cubes and camera/renderer
const dragControls = new DragControls(cubes, camera, renderer.domElement);

// Optionally, you can listen to the drag events
dragControls.addEventListener("dragstart", function (event) {
    event.object.material.color.set(0xff0000); // Change color when dragging starts
});

dragControls.addEventListener("dragend", function (event) {
    event.object.material.color.set(0x00ff00); // Revert color when dragging ends
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    orbitControls.update();
    renderer.render(scene, camera);
}

// Disable orbit controls when dragging
dragControls.addEventListener("dragstart", function () {
    orbitControls.enabled = false;
});

dragControls.addEventListener("dragend", function () {
    orbitControls.enabled = true;
});

animate();
