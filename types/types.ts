export type PlanetObjectType = {
    planet: THREE.Mesh;
    moons?: PlanetObjectType[];
    distance: number;
    step: number;
    rotationStep: number;
    o: number;
}

export type PlanetDataType = {
    name: String;
    distanceToSun: number;
    diameter: number;
    weight: string;
    rotationPeriod: number;
    atmospherePressure: number;
}