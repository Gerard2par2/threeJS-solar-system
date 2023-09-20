import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PlanetDataType, PlanetObjectType } from './types/types';

// ----- Variables -----
let paused = false;

// Planet currently followed by the camera
let followedPlanet: Three.Object3D<Three.Object3DEventMap> | null = null;

// Map to find the name of the planets with the 3D Objects
const planetDataMap = new Map<Three.Object3D<Three.Object3DEventMap>, PlanetDataType>();

const pauseIndicator = document.getElementById('pauseIndicator');
const followedObjectIndicator = document.getElementById('followedObjectIndicator');

// ----- Scene, Renderer & Camera-----

let scene = new Three.Scene();

let camera = new Three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 20;

let renderer = new Three.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = Three.PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );

// ----- Solar System & Ball -----

let solarSystem = new Three.Object3D();
let ball = new Three.SphereGeometry(1, 32, 32);

// ----- Materials -----

const loader = new Three.TextureLoader();

const sunTextureMaterial = new Three.MeshBasicMaterial({map: loader.load('/assets/sun.jpg'),});

const sunEmissiveMaterial = new Three.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 1,
});

const mercuryMaterial = new Three.MeshStandardMaterial({map: loader.load('/assets/mercury.jpg')});

const venusMaterial = new Three.MeshStandardMaterial({map: loader.load('/assets/venus.jpg'),});

const earthMaterial = new Three.MeshStandardMaterial({map: loader.load('/assets/earth.jpg')});

const moonMaterial = new Three.MeshStandardMaterial({map: loader.load('/assets/moon.jpg')});

const marsMaterial = new Three.MeshStandardMaterial({map: loader.load('/assets/mars.jpg')});

const jupiterMaterial = new Three.MeshStandardMaterial({map: loader.load('/assets/jupiter.jpg')});

const saturnMaterial = new Three.MeshStandardMaterial({map: loader.load('/assets/saturn.jpg')});

const uranusMaterial = new Three.MeshStandardMaterial({map: loader.load('/assets/uranus.jpg')});

const neptuneMaterial = new Three.MeshStandardMaterial({map: loader.load('/assets/neptune.jpg')});

// ----- Lights -----

const sunLight = new Three.PointLight(0xffffff, 20);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
solarSystem.add(sunLight);

const ambiantLight = new Three.AmbientLight(0xffffff, 0.01);
scene.add(ambiantLight);

// ----- Celestial bodies -----
const planets: PlanetObjectType[] = [];

// SUN
const sunGroup = new Three.Group();
const sun = new Three.Mesh(ball, sunTextureMaterial);
const sunEmissive = new Three.Mesh(ball, sunEmissiveMaterial);
sunGroup.add(sun, sunEmissive);
sun.scale.set(0.6, 0.6, 0.6);

planetDataMap.set(sun, {
    name: 'Sun',
    distanceToSun: 0,
    diameter: 1392684,
    weight: "1,989 x 10^27 tons",
    rotationPeriod: 0,
    atmospherePressure: 0,
});

// MERCURY
const mercury = createPlanet(mercuryMaterial, 0.2, sun.scale.x * 4, {
    name: 'Mercury',
    distanceToSun: 0.4,
    diameter: 4878,
    weight: "3,285 x 10^20 tons",
    rotationPeriod: 59,
    atmospherePressure: 0,
});

planets.push({planet: mercury, moons: [], distance: mercury.position.x, step: 0.005, rotationStep: 0.01, o: 45})

// VENUS
const venus = createPlanet(venusMaterial, 0.3, sun.scale.x * 10, {
    name: 'Venus',
    distanceToSun: 0.7,
    diameter: 12104,
    weight: "4,867 x 10^21 tons",
    rotationPeriod: 225,
    atmospherePressure: 92,
});

planets.push({planet: venus, moons: [], distance: venus.position.x, step: 0.0025, rotationStep: 0.01, o: 78})

// EARTH
const earth = createPlanet(earthMaterial, 0.3, sun.scale.x * 16, {
    name: 'Earth',
    distanceToSun: 1,
    diameter: 12756,
    weight: "5,972 x 10^21 tons",
    rotationPeriod: 365,
    atmospherePressure: 1,
});

const moon = createPlanet(moonMaterial, 0.1, earth.position.x / 2, {
    name: 'Moon',
    distanceToSun: 1,
    diameter: 3475,
    weight: "8.1 x 10^19 tons",
    rotationPeriod: 1,
    atmospherePressure: 0,
});

planets.push({planet: earth, moons: [
    {planet: moon, distance: moon.position.x, step: 0.001, rotationStep: 0.01, o:0}
], distance: earth.position.x, step: 0.001, rotationStep: 0.01, o: 0})

// MARS
const mars = createPlanet(marsMaterial, 0.2, sun.scale.x * 22, {
    name: 'Mars',
    distanceToSun: 1.5,
    diameter: 6792,
    weight: "6,39 x 10^20 tons",
    rotationPeriod: 354,
    atmospherePressure: 0.006,
});

planets.push({planet: mars, moons: [], distance: mars.position.x, step: 0.005, rotationStep: 0.01, o: 12});

// JUPITER
const jupiter = createPlanet(jupiterMaterial, 0.5, sun.scale.x * 28, {
    name: 'Jupiter',
    distanceToSun: 5.2,
    diameter: 142984,
    weight: "1,898 x 10^24 tons",
    rotationPeriod: 4333,
    atmospherePressure: 0,
});

planets.push({planet: jupiter, moons: [], distance: jupiter.position.x, step: 0.004, rotationStep: 0.01, o: 150});

// SATURN
const saturn = createPlanet(saturnMaterial, 0.4, sun.scale.x * 34, {
    name: 'Saturn',
    distanceToSun: 9.5,
    diameter: 120536,
    weight: "5,683 x 10^23 tons",
    rotationPeriod: 10756,
    atmospherePressure: 0,
});

planets.push({planet: saturn, moons: [], distance: saturn.position.x, step: 0.003, rotationStep: 0.01, o: 118});

// URANUS
const uranus = createPlanet(uranusMaterial, 0.4, sun.scale.x * 40, {
    name: 'Uranus',
    distanceToSun: 19.2,
    diameter: 51118,
    weight: "8.681x1025 tons",
    rotationPeriod: 30687,
    atmospherePressure: 0,
});

planets.push({planet: uranus, moons: [], distance: uranus.position.x, step: 0.002, rotationStep: 0.01, o: 54});

// NEPTUNE
const neptune = createPlanet(neptuneMaterial, 0.4, sun.scale.x * 46, {
    name: 'Neptune',
    distanceToSun: 30.1,
    diameter: 49528,
    weight: "8,681 x 10^22 tons",
    rotationPeriod: 60190,
    atmospherePressure: 0,
});

planets.push({planet: neptune, moons: [], distance: uranus.position.x, step: 0.001, rotationStep: 0.01, o: 305});

// ----- Add to scene -----
scene.add(solarSystem);
solarSystem.add(sun);

for(let planetObject of planets) {
    solarSystem.add(planetObject.planet);
    if(!planetObject.moons) continue;
    for(let moon of planetObject.moons) {
        planetObject.planet.add(moon.planet);
        moon.planet.position.y = 0;
    }
}

// ----- Controls -----

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.8;

// ----- Events Listeners -----

window.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        paused = !paused;
        pauseIndicator?.classList.toggle('hidden');
    }
});

renderer.domElement.addEventListener('click', onObjectClick, false);

// ----- Functions -----

function createPlanet(material: Three.Material, scale: number, distance: number, data: PlanetDataType): Three.Mesh {
    const planet = new Three.Mesh(ball, material);

    planet.scale.set(scale, scale, scale);
    planet.position.x -= distance;
    planet.castShadow = true;
    planet.receiveShadow = true;

    planetDataMap.set(planet, data);

    return planet;
}

function followObject(object: Three.Object3D<Three.Object3DEventMap>) {
    camera.position.x = object.position.x;
    camera.position.y = object.position.y;
    camera.position.z = object.position.z + 2;
    camera.lookAt(object.position);
}

function resetCameraPosition() {
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 20;    
    camera.lookAt(solarSystem.position);
} 

function updateFollowedObjectIndicator(data: PlanetDataType | undefined) {
    let innerHtml: string;
    if(!data){
        innerHtml = '';
    } else {
        innerHtml = `
        <h1>${data.name}</h1>
        ${data.distanceToSun > 0 ? `<p>Distance to the sun: ${data.distanceToSun} AU</p>` : ''}
        <p>Diameter: ${data.diameter} km</p>
        <p>Weight: ${data.weight}</p>
        ${data.rotationPeriod > 0 ? `<p>Rotation period: ${data.rotationPeriod <= 365 ? data.rotationPeriod + ' days': Math.round(data.rotationPeriod / 365 * 1000) / 1000 + ' years'}</p>` : ''}
        ${data.atmospherePressure > 0 ? `<p>Atmosphere pressure: ${data.atmospherePressure} bar</p>` : ''} `;
    }
    followedObjectIndicator!.innerHTML = innerHtml;
}


function onObjectClick(event: MouseEvent) {
    // Put the mouse position in a verctor 2
    const mouse = new Three.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // Create a raycaster from camera's direction and the mouse's position
    const raycaster = new Three.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Get the objects that intersect with the raycaster
    const intersects = raycaster.intersectObjects(solarSystem.children);

    if (intersects.length > 0) {
        // Get the first intersected object
        const clickedObject = intersects[0].object;

        if(followedPlanet !== clickedObject) {
            // Set followed planter to the clicked object
            followedPlanet = clickedObject;
            if(followedObjectIndicator) {
                // Show the followed object indicator and update the text
                followedObjectIndicator.classList.remove('hidden');
                updateFollowedObjectIndicator(planetDataMap.get(followedPlanet));
            }
            // Follow the object
            followObject(followedPlanet);
            return;
        }
    } 

    if(followedPlanet) {
        resetCameraPosition();
    }

    // If no object was clicked or the clicked object was already followed, reset the followed object
    followedPlanet = null;

    if(followedObjectIndicator) {
        // Hide the followed object indicator and reset the text
        followedObjectIndicator.classList.add('hidden');
        updateFollowedObjectIndicator(undefined);
    }
    // Reset the camera position
}

function rotatePlanet(object: PlanetObjectType) {
    // Rotate the object using polar coordinates
    object.planet.position.x = object.distance * Math.cos(object.o);
    object.planet.position.z = object.distance * Math.sin(object.o);
    // Rotate the planet around itself
    object.planet.rotation.y += object.rotationStep;
    // Increment the angle
    object.o = object.o < 360 ? object.o += object.step : 0;
}

function render() {
    requestAnimationFrame( render );

    controls.update();

    if(followedPlanet) {
        followObject(followedPlanet);
    }

    if (!paused) {

        sun.rotation.y += 0.001;

        for(let planetObject of planets) {
            rotatePlanet(planetObject);
            if(!planetObject.moons) {
                continue;
            } for(let moon of planetObject.moons) {
                rotatePlanet(moon);
            }
        }
    }


    renderer.render( scene, camera );
}

render();