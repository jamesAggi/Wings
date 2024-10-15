import { OrbitControls } from "@react-three/drei";
import Wings from './Wings';

export const Experience = ({ parameters }) => {
  return (
    <group>
      <OrbitControls />
      {/* Pass updated parameters to the Wings component */}
      {parameters && (
        <Wings 
          parameters={parameters} 
          useTexture={true}
          texturePath="/public/images/striped.png"
        />
      )}
      <axesHelper args={[5]} />
    </group>
  );
};

export default Experience;
