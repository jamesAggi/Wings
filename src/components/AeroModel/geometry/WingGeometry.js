import * as THREE from 'three';
import { applyPlanarUVs } from "./UVMapping";
import { runFlightSimulation } from '../Simulation/runFlightSimulation';
import SimModel from '../Simulation/SimModel';
import { check_airfoil, read_airfoil, calculateAirfoilZ, naca_geometry } from '../utils/AirfoilHelpers';
import { deleteDuplicateComponents, deleteComponent } from '../utils/ComponentHelpers';
import { calculateMeanChord, calculateArea, calculateAspectRatio, calculateSkinWeight, calculateFuelVolume, calculateFuelWeight, calculateTotalWeight, calculateBestVelocity, calculateRequiredCL, calculateControlSurfaceIndices, generateIndicesForFaces } from '../utils/GeometyCalculation';
import { calculateCm1, calculateCm2, calculateScalingFactor, adjustVelocityForMachEffects } from '../utils/MachCalculations';
import { math_compute_normal, math_rot_x, math_rot_y, math_rot_z, applyTwistAndDihedral } from '../utils/MathHelpers';
import { unlockAccount } from '../utils/unlockAccount';

export class WingGeometry extends THREE.BufferGeometry {
  constructor(is_main, side, span, sweep, dihedral, mount, washout, root_chord, tip_chord, root_airfoil, tip_airfoil, nSeg, nAFseg, left_start, right_start, dy, control, same_as_root) {
    super();
    this.type = 'WingGeometry';

    this.parameters = {
      is_main: is_main || true,
      side: side || 'both',
      span: span || 4.0,
      sweep: sweep || 0.0,
      dihedral: dihedral || 0.0,
      mount: mount || 0.0,
      washout: washout || 0.0,
      root_chord: root_chord || 1.0,
      tip_chord: tip_chord || 1.0,
      root_airfoil: root_airfoil || "NACA 2412",
      tip_airfoil: tip_airfoil || "NACA 2412",
      nSeg: nSeg || 40,
      nAFseg: nAFseg || 50,
      left_start: left_start || new THREE.Vector3(0.0, 0.0, 0.0),
      right_start: right_start || new THREE.Vector3(0.0, 0.0, 0.0),
      dy: dy || 0.0,
      control: control || {
        has_control_surface: false,
        span_root: 0.2,
        span_tip: 0.8,
        chord_root: 0.2,
        chord_tip: 0.2,
        mix: {
          elevator: 1.0,
          rudder: 0.0,
          aileron: 0.0,
          flap: 0.0
        }
      },
      same_as_root: same_as_root || true
    };

    const my_root_airfoil = read_airfoil(this.parameters.root_airfoil, this.parameters.nAFseg);
    const my_tip_airfoil = read_airfoil(this.parameters.tip_airfoil, this.parameters.nAFseg);
    const nairfoilpts = my_root_airfoil[0];

    const vertices = [];
    const indices = [];

    generateWingGeometry(vertices, indices, {
      side: this.parameters.side,
      nSeg: this.parameters.nSeg,
      nairfoilpts,
      my_root_airfoil,
      my_tip_airfoil,
      span: this.parameters.span,
      sweep: this.parameters.sweep,
      dihedral: this.parameters.dihedral,
      mount: this.parameters.mount,
      washout: this.parameters.washout,
      root_chord: this.parameters.root_chord,
      tip_chord: this.parameters.tip_chord,
      left_start: this.parameters.left_start,
      right_start: this.parameters.right_start,
      dy: this.parameters.dy,
      control: this.parameters.control
    });

    const verticesArray = new Float32Array(vertices);
    this.setAttribute('position', new THREE.Float32BufferAttribute(verticesArray, 3));
    this.setIndex(indices);

    applyPlanarUVs(this);

    this.computeVertexNormals();
    this.computeBoundingSphere();
  }
}

// Main function: Generate the wing geometry
function generateWingGeometry(vertices, indices, config) {
  const {
    side,
    nSeg,
    nairfoilpts,
    my_root_airfoil,
    my_tip_airfoil,
    span,
    sweep,
    dihedral,
    mount,
    washout,
    root_chord,
    tip_chord,
    left_start,
    right_start,
    dy,
    control
  } = config;

  let startwing, stopwing;
  if (side === 'both') {
    startwing = 1;
    stopwing = 2;
  } else if (side === 'right') {
    startwing = 1;
    stopwing = 1;
  } else {
    startwing = 2;
    stopwing = 2;
  }

  // Loop through each wing (left and/or right)
  for (let iwing = startwing; iwing <= stopwing; iwing++) {
    const my_side = iwing === 2 ? 'left' : 'right';
    const start_point = my_side === 'left' ? left_start.clone() : right_start.clone();
    generateSingleWing(vertices, indices, {
      my_side,
      start_point,
      nSeg,
      nairfoilpts,
      my_root_airfoil,
      my_tip_airfoil,
      span,
      sweep,
      dihedral,
      mount,
      washout,
      root_chord,
      tip_chord,
      dy,
      control
    });
  }
}

// Function to generate a single wing (either left or right)
function generateSingleWing(vertices, indices, config) {
  const { my_side, start_point, nSeg, nairfoilpts, my_root_airfoil, my_tip_airfoil, span, sweep, dihedral, mount, washout, root_chord, tip_chord, dy, control } = config;

  // Control surface indices
  const dtheta = Math.PI / nSeg;
  let csrooti = 0,
    cstipi = nSeg;
  if (control.has_control_surface) {
    ({ csrooti, cstipi } = calculateControlSurfaceIndices(control, nSeg, dtheta));
  }

  // Generate the vertices for the wing
  generateWingVerticesAndControlSurfaces(vertices, {
    nSeg,
    nairfoilpts,
    my_root_airfoil,
    my_tip_airfoil,
    span,
    sweep,
    dihedral,
    mount,
    washout,
    root_chord,
    tip_chord,
    csrooti,
    cstipi,
    control,
    my_side,
    start_point,
    dy
  });

  // Generate faces and indices for the wing
  generateIndicesForFaces(indices, vertices.length / 3, nairfoilpts, nSeg);
}

// Function to generate the vertices for the wing, including control surface deflection
function generateWingVerticesAndControlSurfaces(vertices, config) {
  const {
    nSeg,
    nairfoilpts,
    my_root_airfoil,
    my_tip_airfoil,
    span,
    sweep,
    dihedral,
    mount,
    washout,
    root_chord,
    tip_chord,
    csrooti,
    cstipi,
    control,
    my_side,
    start_point,
    dy
  } = config;

  const dtheta = Math.PI / nSeg;
  const aerocenter = new THREE.Vector3(0, 0, 0);

  // Iterate over each wing section
  for (let y = 0; y <= nSeg; y++) {
    let percent = 0.5 * (1.0 - Math.cos(dtheta * y)); // Spanwise distribution
    let my_chord = root_chord + percent * (tip_chord - root_chord);
    const my_twist = mount - percent * washout;

    // Control surface handling
    if (control.has_control_surface) {
      if (y === csrooti) percent = control.span_root;
      if (y === csrooti + 1) percent = control.span_root;
      if (y === cstipi) percent = control.span_tip;
      if (y === cstipi + 1) percent = control.span_tip;
    }

    // Calculate control surface chord ratio
    let cf_c = 0;
    if (control.has_control_surface) {
      cf_c =
        control.chord_root +
        (percent - control.span_root) / (control.span_tip - control.span_root) * (control.chord_tip - control.chord_root);
    }

    // Calculate aerocenter vector for current spanwise position
    const qvec = new THREE.Vector3(0, span / Math.cos((sweep * Math.PI) / 180.0), 0);
    math_rot_z(qvec, (sweep * Math.PI) / 180.0);
    math_rot_x(qvec, (-dihedral * Math.PI) / 180.0);

    aerocenter.x = percent * qvec.x;
    aerocenter.y = percent * qvec.y;
    aerocenter.z = percent * qvec.z;

    // Invert direction if on left side
    if (my_side === 'left') {
      qvec.y = -qvec.y;
    }

    // Generate vertices for each airfoil section
    for (let x = 0; x < nairfoilpts; x++) {
      // Interpolate between root and tip airfoils
      const airfoil_x = my_root_airfoil[1][x] + percent * (my_tip_airfoil[1][x] - my_root_airfoil[1][x]);
      const airfoil_y = my_root_airfoil[2][x] + percent * (my_tip_airfoil[2][x] - my_root_airfoil[2][x]);

      // Calculate the vertex
      const vertex = new THREE.Vector3(my_chord * (-airfoil_x + 0.25), 0.0, my_chord * (-airfoil_y));

      // Handle control surface deflection
      if (control.has_control_surface && y > csrooti && y <= cstipi && vertex.x < my_chord * (-1.0 + cf_c + 0.25)) {
        vertex.x -= my_chord * (-1.0 + cf_c + 0.25);
        math_rot_y(vertex, control.mix.elevator * Math.PI / 180.0); // Apply elevator deflection
        vertex.x += my_chord * (-1.0 + cf_c + 0.25);
      }

      // Apply twist and dihedral to vertex
      applyTwistAndDihedral(vertex, my_twist, dihedral, my_side);

      // Adjust position using the aerocenter and start point
      vertex.x += aerocenter.x + start_point.x;
      vertex.y += aerocenter.y + start_point.y + dy;
      vertex.z += aerocenter.z + start_point.z;

      // Add the vertex to the vertices array
      vertices.push(vertex.x, vertex.y, vertex.z);
    }
  }
}