import React, { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { createWingGeometry } from './GeometryCreation';

const Wings = ({ parameters }) => {
  // Memoize the geometry creation to avoid recalculating it on every render
  const geometry = useMemo(() => {
    return createWingGeometry(parameters);
  }, [parameters]);

  console.log("Generated Geometry:", geometry);
  console.log("Vertices:", geometry.attributes.position.array);
  console.log("Indices:", geometry.index.array);

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color="#596d95" />
    </mesh>
  );
};

export default Wings;
