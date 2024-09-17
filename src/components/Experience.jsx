import { OrbitControls } from "@react-three/drei";
import Wings from './Wings';
import { useState } from 'react';
import * as THREE from 'three';

export const Experience = () => {
  const [parameters, setParameters] = useState({
    isMainWing: true,
    sideType: 'both',
    span: 24.0000, // Correct span for Diamond DA42
    sweep: 0.0000, // No sweep for this wing
    dihedral: 0.0000, // No dihedral
    mount: 0, // Neutral mounting angle
    washout: 0.0000, // No washout
    rootChord: 3.5000, // Root chord length
    tipChord: 1.7500, // Tip chord length; taper ratio = 0.5
    rootAirfoil: {
      "NACA 2412": {
        properties: {
          type: "linear",
          alpha_L0: -0.036899751,
          CL_alpha: 6.283185307,
          Cm_L0: -0.0527,
          Cm_alpha: -0.08,
          CD0: 0.0055,
          CD0_L: -0.0045,
          CD0_L2: 0.01,
          CL_max: 1.4
        }
      }
    },
    tipAirfoil: {
      "NACA 2412": {
        properties: {
          type: "linear",
          alpha_L0: -0.036899751,
          CL_alpha: 6.283185307,
          Cm_L0: -0.0527,
          Cm_alpha: -0.08,
          CD0: 0.0055,
          CD0_L: -0.0045,
          CD0_L2: 0.01,
          CL_max: 1.4
        }
      }
    },
    segments: 10, // Number of segments along the span
    chordwiseSegments: 20, // Number of segments along the chord
    leftStart: new THREE.Vector3(0, 0, 0),
    rightStart: new THREE.Vector3(0, 0, 0),
    yOffset: 0, // No y-offset
    control: {
      has_control_surface: false,
      span_root: 0.2,
      span_tip: 0.8,
      chord_root: 0.2,
      chord_tip: 0.2,
      is_sealed: 1,
      mix: {
        elevator: 1.0,
        rudder: 0.0,
        aileron: 0.0,
        flap: 0.0
      }
    },
    sameAsRoot: true, // Same airfoil for root and tip
  });

  return (
    <>
      <OrbitControls />
      <Wings parameters={parameters} />
      <axesHelper args={[5]} />
      {/* Uncomment to add a box geometry for reference */}
      {/*<mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>*/}
    </>
  );
};
