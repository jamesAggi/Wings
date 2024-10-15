import React, { useRef, useMemo } from 'react';
import WingGeometry from './AeroModel/geometry/WingGeometry'; // Import the correct WingGeometry
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';

const Wings = ({ parameters, texturePath }) => {
  const rightMeshRef = useRef(); // Separate refs for the right and left wing meshes
  const leftMeshRef = useRef();

  // Load texture using the texture path or fallback
  const texture = useLoader(TextureLoader, texturePath || '/public/images/striped.png');

  // Configure texture wrapping and tiling (optional)
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);

  // Memoize the geometry generation based on the updated parameters
  const geometry = useMemo(() => {
    if (!parameters) {
      console.error("No parameters provided to WingGeometry");
      return null;
    }

    // Pass the updated parameters to generate the geometry
    return new WingGeometry(
      parameters.is_main,
      parameters.side,
      parameters.span,
      parameters.sweep,
      parameters.dihedral,
      parameters.mount,
      parameters.washout,
      parameters.rootChord,
      parameters.tipChord,
      parameters.root_airfoil,
      parameters.tip_airfoil,
      parameters.nSeg,
      parameters.nAFseg,
      parameters.left_start,
      parameters.right_start,
      parameters.dy,
      parameters.control,
      parameters.same_as_root
    );
  }, [parameters]);

  if (!geometry) return null;  // Return null if geometry is not generated

  return (
    <>
      {/* Group for the right wing */}
      <group rotation={[Math.PI / 2, 0, 0]}> {/* Rotate 90 degrees on the X-axis */}
        {/* Right Wing */}
        <mesh ref={rightMeshRef} geometry={geometry} position={[0, 0, 0]} frustumCulled={false}>
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={rightMeshRef} geometry={geometry} position={[0, 0, 0]} frustumCulled={false}>
          <meshBasicMaterial color="cyan" wireframe />
        </mesh>
      </group>

      {/* Group for the left wing */}
      <group rotation={[Math.PI / 2, 0, 0]}> {/* Rotate 90 degrees on the X-axis */}
        {/* Left Wing (Mirrored) */}
        <mesh ref={leftMeshRef} geometry={geometry} position={[0, 0, 0]} scale={[1, -1, 1]} frustumCulled={false}>
          <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
        </mesh>
        <mesh ref={leftMeshRef} geometry={geometry} position={[0, 0, 0]} scale={[1, -1, 1]} frustumCulled={false}>
          <meshBasicMaterial color="cyan" wireframe />
        </mesh>
      </group>
    </>
  );
};

export default Wings;

