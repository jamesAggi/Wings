import * as THREE from 'three';

export class Plane {
  constructor(data) {
    this.isMainWing = data.isMainWing || true;
    this.sideType = data.sideType || 'both';
    this.span = data.span || 24.0;
    this.sweep = data.sweep || 0.0;
    this.dihedral = data.dihedral || 0.0;
    this.mount = data.mount || 0;
    this.washout = data.washout || 0.0;
    this.rootChord = data.rootChord || 3.5;
    this.tipChord = data.tipChord || 1.75;
    this.rootAirfoil = data.rootAirfoil || {};
    this.tipAirfoil = data.tipAirfoil || {};
    this.segments = data.segments || 10;
    this.chordwiseSegments = data.chordwiseSegments || 20;
    this.leftStart = data.leftStart ? new THREE.Vector3(...data.leftStart) : new THREE.Vector3(0, 0, 0);
    this.rightStart = data.rightStart ? new THREE.Vector3(...data.rightStart) : new THREE.Vector3(0, 0, 0);
    this.yOffset = data.yOffset || 0;
    this.control = data.control || {};
    this.sameAsRoot = data.sameAsRoot || true;
  }

  // Static method to load from a JSON file and return a new instance of Plane
  static async loadFromFile(filePath) {
    try {
      const response = await fetch(filePath);  // Fetch the JSON data
      const data = await response.json();      // Parse the data into JSON format
      return new Plane(data);                  // Create and return a new Plane instance
    } catch (error) {
      console.error("Error loading plane data:", error);
      throw error; // Rethrow the error to handle it where the method is called
    }
  }
}

export default Plane;
