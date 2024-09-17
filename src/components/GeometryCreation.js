import * as THREE from 'three';
import { calculateAirfoilZ } from './CalculationUtils'; // Import the utility function

export const createWingGeometry = ({
  isMainWing,
  sideType,
  span,
  sweep,
  dihedral,
  mount,
  washout,
  rootChord,
  tipChord,
  rootAirfoil,
  tipAirfoil,
  segments,
  chordwiseSegments,
  leftStart,
  rightStart,
  yOffset,
  control,
  sameAsRoot
}) => {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const indices = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const currentChord = rootChord * (1 - t) + tipChord * t;

    const x = t * span;
    const zRoot = calculateAirfoilZ(x / rootChord, rootChord); // Call to the utility function
    const zTip = calculateAirfoilZ(x / tipChord, tipChord); // Call to the utility function

    vertices.push(
      leftStart.x + x,
      leftStart.y,
      leftStart.z + zRoot,
      rightStart.x + x,
      rightStart.y,
      rightStart.z + zTip
    );
  }

  // Create faces (triangles) using the vertices
  for (let i = 0; i < segments; i++) {
    const a = i * 2;
    const b = i * 2 + 1;
    const c = (i + 1) * 2;
    const d = (i + 1) * 2 + 1;

    indices.push(a, c, b);
    indices.push(b, c, d);
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  applySweep(geometry, sweep);
  applyDihedral(geometry, dihedral);
  applyWashout(geometry, washout);

  return geometry;
};

// These functions are specific to geometry creation and stay in this file
const applySweep = (geometry, sweep) => {
  const position = geometry.attributes.position.array;
  for (let i = 0; i < position.length; i += 3) {
    position[i] += sweep * (i / 3);
  }
  geometry.attributes.position.needsUpdate = true;
};

const applyDihedral = (geometry, dihedral) => {
  const position = geometry.attributes.position.array;
  for (let i = 1; i < position.length; i += 3) {
    position[i] += dihedral * Math.abs(position[i - 1]);
  }
  geometry.attributes.position.needsUpdate = true;
};

const applyWashout = (geometry, washout) => {
  const position = geometry.attributes.position.array;
  for (let i = 2; i < position.length; i += 3) {
    position[i] += washout * (i / 3);
  }
  geometry.attributes.position.needsUpdate = true;
};
