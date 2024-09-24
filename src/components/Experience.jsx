import { OrbitControls } from "@react-three/drei";
import Wings from './Wings';
import { useState, useEffect } from 'react';
import { Plane } from './AeroModel/Simulation/plane'; 

export const Experience = () => {
  const [parameters, setParameters] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Plane.loadFromFile('/data/planeData/dimond_da42_twin_star.json')
      .then((plane) => {
        setParameters(plane);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading plane data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <OrbitControls />
      <Wings 
        parameters={parameters} 
        useTexture={true}  // Set to true to use the texture
        texturePath="/public/images/image.png"  // Set path to the image texture
      />
      <axesHelper args={[5]} />
    </>
  );
};

export default Experience;
