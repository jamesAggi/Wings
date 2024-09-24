import React, { useMemo } from 'react';
import { WingGeometry } from './AeroModel/geometry/WingGeometry'; // Correct path
import { useTexture } from '@react-three/drei'; // Import useTexture for loading textures
import { WingMaterials } from './AeroModel/materials/wingMaterial'; // Import the materials

const Wings = ({ parameters, texturePath }) => {
  const geometry = useMemo(() => {
    if (!parameters) return null;

    return new WingGeometry(
      parameters.isMainWing,
      parameters.sideType,
      parameters.span,
      parameters.sweep,
      parameters.dihedral,
      parameters.mount,
      parameters.washout,
      parameters.rootChord,
      parameters.tipChord,
      parameters.rootAirfoil,
      parameters.tipAirfoil,
      parameters.segments,
      parameters.chordwiseSegments,
      parameters.leftStart,
      parameters.rightStart,
      parameters.yOffset,
      parameters.control,
      parameters.sameAsRoot
    );
  }, [parameters]);

  if (!geometry) return null;

  // Call useTexture with a fallback even when there's no texturePath to maintain consistent hook usage
  const texture = useTexture(texturePath ? texturePath : '');

  // Memoize the material selection based on the presence of texture
  const material = useMemo(() => {
    if (texture) {
      return new THREE.MeshStandardMaterial({ map: texture });
    } else {
      return WingMaterials(); // Fallback material
    }
  }, [texture]);

  return (
    <>
      <mesh geometry={geometry} material={material} />
      
      {/* Wireframe Overlay */}
      <mesh geometry={geometry}>
        <meshBasicMaterial color="black" wireframe />
      </mesh>
    </>
  );
};

export default Wings;