export type PlanetObjectType = {
    planet: THREE.Mesh;
    moons?: PlanetObjectType[];
    distance: number;
    step: number;
    rotationStep: number;
    o: number;
}