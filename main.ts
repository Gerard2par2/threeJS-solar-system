import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PlanetObjectType } from './types/types';

let paused = false;
let followedPlanet: THREE.Object3D<THREE.Object3DEventMap> | null = null;
let planetNameMap = new Map<THREE.Object3D<THREE.Object3DEventMap>, string>();

const pauseIndicator = document.getElementById('pauseIndicator');
const followedObjectIndicator = document.getElementById('followedObjectIndicator');

// Initialisation of the scene / camera / renderer
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );


camera.position.z = 20;

let solarSystem = new THREE.Object3D();
scene.add(solarSystem);
let ball = new THREE.SphereGeometry(1, 32, 32);

// ----- Materials -----

const loader = new THREE.TextureLoader();

const sunTextureMaterial = new THREE.MeshBasicMaterial({map: loader.load('/assets/sun.jpg'),});

const sunEmissiveMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 1,
});

const mercuryMaterial = new THREE.MeshStandardMaterial({map: loader.load('/assets/mercury.jpg')});

const venusMaterial = new THREE.MeshStandardMaterial({
    map: loader.load('/assets/venus.jpg'),});

const earthMaterial = new THREE.MeshStandardMaterial({map: loader.load('/assets/earth.jpg')});

const moonMaterial = new THREE.MeshStandardMaterial({map: loader.load('/assets/moon.jpg')});

const marsMaterial = new THREE.MeshStandardMaterial({map: loader.load('/assets/mars.jpg')});

const jupiterMaterial = new THREE.MeshStandardMaterial({map: loader.load('/assets/jupiter.jpg')});

const saturnMaterial = new THREE.MeshStandardMaterial({map: loader.load('/assets/saturn.jpg')});

const uranusMaterial = new THREE.MeshStandardMaterial({map: loader.load('/assets/uranus.jpg')});

const neptuneMaterial = new THREE.MeshStandardMaterial({map: loader.load('/assets/neptune.jpg')});

// ----- Lights -----

const sunLight = new THREE.PointLight(0xffffff, 20);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 500;
solarSystem.add(sunLight);

const ambiantLight = new THREE.AmbientLight(0xffffff, 0.01);
scene.add(ambiantLight);

// ----- Celestial bodies -----
const planets: PlanetObjectType[] = [];

// SUN
const sunGroup = new THREE.Group();
const sun = new THREE.Mesh(ball, sunTextureMaterial);
const sunEmissive = new THREE.Mesh(ball, sunEmissiveMaterial);
sunGroup.add(sun, sunEmissive);
sun.scale.set(0.6, 0.6, 0.6);

planetNameMap.set(sun, 'Sun');

// MERCURY
const mercury = new THREE.Mesh(ball, mercuryMaterial);
mercury.scale.set(0.2,0.2,0.2);
mercury.position.x -= sun.scale.x * 4;
mercury.castShadow = true;
mercury.receiveShadow = true;

planetNameMap.set(mercury, 'Mercury');

planets.push({planet: mercury, moons: [], distance: mercury.position.x, step: 0.005, rotationStep: 0.01, o: 45})

// VENUS
const venus = new THREE.Mesh(ball, venusMaterial);
venus.scale.set(0.3,0.3,0.3);
venus.position.x -= sun.scale.x * 10;
venus.castShadow = true;
venus.receiveShadow = true;

planetNameMap.set(venus, 'Venus');

planets.push({planet: venus, moons: [], distance: venus.position.x, step: 0.0025, rotationStep: 0.01, o: 78})

// EARTH
const earth = new THREE.Mesh(ball, earthMaterial);
earth.scale.set(0.3,0.3,0.3);
earth.position.x -= sun.scale.x * 16;
earth.castShadow = true;
earth.receiveShadow = true;

planetNameMap.set(earth, 'Earth');

const moon = new THREE.Mesh(ball, moonMaterial);
moon.scale.set(0.3,0.3,0.3);
moon.position.x -= earth.position.x - earth.scale.x * 2
moon.castShadow = true;
moon.receiveShadow = true;

planetNameMap.set(moon, 'Moon');

planets.push({planet: earth, moons: [{planet: moon, distance: moon.position.x, step: 0.001, rotationStep: 0.01, o:0}
], distance: earth.position.x, step: 0.001, rotationStep: 0.01, o: 0})

// MARS
const mars = new THREE.Mesh(ball, marsMaterial);
mars.scale.set(0.2,0.2,0.2);
mars.position.x -= sun.scale.x * 22;
mars.castShadow = true;
mars.receiveShadow = true;

planetNameMap.set(mars, 'Mars');

planets.push({planet: mars, moons: [], distance: mars.position.x, step: 0.005, rotationStep: 0.01, o: 12});

// JUPITER
const jupiter = new THREE.Mesh(ball, jupiterMaterial);
jupiter.scale.set(0.6,0.6,0.6);
jupiter.position.x -= sun.scale.x * 28;
jupiter.castShadow = true;
jupiter.receiveShadow = true;

planetNameMap.set(jupiter, 'Jupiter');

planets.push({planet: jupiter, moons: [], distance: jupiter.position.x, step: 0.004, rotationStep: 0.01, o: 150});

// SATURN
const saturn = new THREE.Mesh(ball, saturnMaterial);
saturn.scale.set(0.45,0.45,0.45);
saturn.position.x -= sun.scale.x * 34;
saturn.castShadow = true;
saturn.receiveShadow = true;

planetNameMap.set(saturn, 'Saturn');

planets.push({planet: saturn, moons: [], distance: saturn.position.x, step: 0.003, rotationStep: 0.01, o: 118});

// URANUS
const uranus = new THREE.Mesh(ball, uranusMaterial);
uranus.scale.set(0.4,0.4,0.4);
uranus.position.x -= sun.scale.x * 40;
uranus.castShadow = true;
uranus.receiveShadow = true;

planetNameMap.set(uranus, 'Uranus');

planets.push({planet: uranus, moons: [], distance: uranus.position.x, step: 0.002, rotationStep: 0.01, o: 54});

// NEPTUNE
const neptune = new THREE.Mesh(ball, neptuneMaterial);
neptune.scale.set(0.35,0.35,0.35);
neptune.position.x -= sun.scale.x * 46;
neptune.castShadow = true;
neptune.receiveShadow = true;

planetNameMap.set(neptune, 'Neptune');

planets.push({planet: neptune, moons: [], distance: uranus.position.x, step: 0.001, rotationStep: 0.01, o: 305});

// ----- Add to scene -----

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

function followObject(object: THREE.Object3D<THREE.Object3DEventMap>) {
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


function onObjectClick(event) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(solarSystem.children);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Objet cliqué :', clickedObject);

        if(followedPlanet !== clickedObject) {
            console.log("1")
            followedPlanet = clickedObject;
            if(followedObjectIndicator) {
                followedObjectIndicator.classList.remove('hidden');
                followedObjectIndicator.innerText = `${planetNameMap.get(followedPlanet)}`
            }
            followObject(followedPlanet);
        } else {
            followedPlanet = null;
            if(followedObjectIndicator) {
                followedObjectIndicator.classList.add('hidden');
                followedObjectIndicator.innerText = '';
            }
            resetCameraPosition();
        }
    }
}

function rotatePlanet(object: PlanetObjectType) {
    object.planet.position.x = object.distance * Math.cos(object.o);
    object.planet.position.z = object.distance * Math.sin(object.o);
    object.planet.rotation.y += object.rotationStep;
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