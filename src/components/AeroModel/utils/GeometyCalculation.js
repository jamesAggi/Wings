import * as THREE from 'three';

// Calculate mean chord of the wing
export const calculateMeanChord = (rootChord, tipChord) => {
    return (rootChord + tipChord) / 2;
};

// Calculate wing area
export const calculateArea = (span, meanChord) => {
    return span * meanChord;
};

// Calculate aspect ratio
export const calculateAspectRatio = (span, area) => {
    return span ** 2 / area;
};

// Calculate skin weight
export const calculateSkinWeight = (skinWeightFactor, area) => {
    return skinWeightFactor * area;
};

// Calculate structural weight
export const calculateStructuralWeight = (structuralWeightFactor, wingWeightRoot, span, meanChord) => {
    return structuralWeightFactor * wingWeightRoot * (span ** 2) / meanChord;
};

// Calculate fuel volume
export const calculateFuelVolume = (maxFuelVolume, fuelVolumeRatio, span, meanChord) => {
    return Math.min(maxFuelVolume, 7.5 * fuelVolumeRatio * span * (meanChord ** 2));
};

// Calculate fuel weight
export const calculateFuelWeight = (fuelVolume) => {
    return 6.7 * fuelVolume;
};

// Calculate total weight
export const calculateTotalWeight = (skinWeight, structuralWeight, fuelWeight, wingWeightRoot) => {
    return skinWeight + structuralWeight + fuelWeight + wingWeightRoot;
};

// Calculate best velocity (minimum drag velocity)
export const calculateBestVelocity = (totalWeight, area, aspectRatio, oswaldEfficiency, zeroLiftCd, airDensity) => {
    return Math.sqrt(2) / Math.sqrt(Math.PI * oswaldEfficiency * aspectRatio * zeroLiftCd) * 
           Math.sqrt(totalWeight / (area * airDensity));
};

// Calculate required lift coefficient
export const calculateRequiredCL = (totalWeight, area, airDensity, velocity) => {
    return totalWeight / (0.5 * airDensity * area * Math.pow(velocity, 2));
};

// Function to calculate control surface indices
export const calculateControlSurfaceIndices = (control, nSeg, dtheta) => {
    let csrooti = 0;
    let cstipi = nSeg;
    let mindistroot = 1.0;
    let mindisttip = 1.0;

    if (control?.has_control_surface) {
        for (let y = 0; y <= nSeg; y++) {
            const percent = 0.5 * (1.0 - Math.cos(dtheta * y));
            if (Math.abs(percent - control.span_root) < Math.abs(mindistroot)) {
                mindistroot = percent - control.span_root;
                csrooti = y;
            }
            if (Math.abs(percent - control.span_tip) < Math.abs(mindisttip)) {
                mindisttip = percent - control.span_tip;
                cstipi = y;
            }
        }
    }

    return { csrooti, cstipi };
};

// Function to generate indices for faces
export const generateIndicesForFaces = (indices, indexOffset, nairfoilpts, nSeg) => {
  for (let y = 0; y < nSeg; y++) {
    for (let x = 0; x < nairfoilpts - 1; x++) {
      const a = indexOffset + y * nairfoilpts + x;
      const b = indexOffset + (y + 1) * nairfoilpts + x;
      const c = indexOffset + (y + 1) * nairfoilpts + (x + 1);
      const d = indexOffset + y * nairfoilpts + (x + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }
};

function calculateVertexWithControl(my_chord, airfoil_x, airfoil_y, percent, my_twist, dihedral, my_side, control, csrooti, cstipi, y, start_point) {
  const vertex = new THREE.Vector3(
    my_chord * (-airfoil_x + 0.25),
    0.0,
    my_chord * (-airfoil_y)
  );

  // Apply twist and dihedral transformations
  applyTwistAndDihedral(vertex, my_twist, dihedral, my_side);

  // Control Surface Handling
  if (control?.has_control_surface && y >= csrooti && y <= cstipi) {
    const cf_c = control.chord_root + (percent - control.span_root) / (control.span_tip - control.span_root) * (control.chord_tip - control.chord_root);
    if (vertex.x < my_chord * (-1.0 + cf_c + 0.25)) {
      vertex.x -= my_chord * (-1.0 + cf_c + 0.25);
      math_rot_y(vertex, control.mix.elevator * Math.PI / 180.0); // Apply elevator deflection
      vertex.x += my_chord * (-1.0 + cf_c + 0.25);
    }
  }

  // Apply positional offset
  vertex.add(start_point);

  return vertex;
}