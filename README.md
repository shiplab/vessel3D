# Vessel3D

Vessel3D is a library for conceptual ship visualization, built on top of the Three.js library for 3D rendering in the browser.

In addition to visualization, the library includes tools for calculating key naval architecture properties. The current version supports basic
stability calculations, with more features planned for future releases.

# Installation

You can install vessel3D by cloning the repository or using a package manager.

#### Option 1: Clone the repository

Use the library on your own machine by cloning the repository.

```
git clone https://github.com/yourusername/vessel3D.git
cd vessel3D
```

#### Option 2: Install via npm

Install the Vessel 3D into your application using npm.

```
npm i @shiplab/vessel3d
```

# Basic Usage

Here’s a basic example of how to import and use vessel3D in your project divided in three steps:

```javascript
import * as Vessel3D from "vessel3D.js";

// Instantiate ship object
const ship = new Vessel3D.Ship();

// 1 - Add hull:
ship.addHull(); // this would create an default hull with a Wigley shape

// Alternatively takes the data from a list of predefined ships
// ship.addHull({predefinedHullName: "barge"})

// 2 - Create a Three.js scene scene with ocean:
const scene = new Vessel3D.Scene();
scene.addShip(ship);
scene.addOcean();

// 3 - Create a Three.js scene scene with ocean:
function animate() {
    requestAnimationFrame(animate);
    scene.renderer.render(scene, scene.camera);
}
animate();
```

# Database

The library accepts the hull in the Vessels.js format ([Link](https://github.com/shiplab/vesseljs/wiki/API-Reference#hull)):

```javascript
import * as Vessel3D from "vessel3D.js";

const ship = new Vessel3D.Ship();

// < ---- Add your own defined hull ---- >

const hull = {};
hull.halfBreadths = {
    waterlines: [0, 0, 1],
    stations: [0, 1],
    table: [
        [0, 0],
        [0.5, 0.5],
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

ship.addHull(hull);

// < ---- End of the block ---- >

const scene = new Vessel3D.Scene();
scene.addShip(ship);
scene.addOcean();

// 3 - Create a Three.js scene scene with ocean:
function animate() {
    requestAnimationFrame(animate);
    scene.renderer.render(scene, scene.camera);
}
animate();
```

# Authors / Acknowledgements

**Author**: Felipe Ferrari

This project was developed with the valuable academic and technical support of **NTNU** (Norwegian University of Science and Technology) and the
**ShipLab** research group. Special recognition goes to the ShipLab team for their prior development of supporting tools, such as the _Vessels.js_
library, which provided essential groundwork for the creation of the **vessel3D** library.

## License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this software with proper attribution. For full details, see the
[LICENSE](https://github.com/shiplab/vessel3D?tab=MIT-1-ov-file#readme) file included in the repository.
