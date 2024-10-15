import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { Experience } from "./components/Experience";
import ControlPanel from "./components/ControlPanel";

function App() {
  const [parameters, setParameters] = useState(null); // State to store wing parameters
  const [loading, setLoading] = useState(true);       // State for loading status

  // Fetch parameters.json once when the component mounts
  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await fetch("/data/planeData/parameters.json");
        const data = await response.json();
        setParameters(data);  // Set the parameters after fetching
        setLoading(false);    // Stop the loading state
      } catch (error) {
        console.error("Error loading parameters:", error);
        setLoading(false);    // Handle errors by stopping the loading state
      }
    };

    fetchParameters();
  }, []);

  // Update parameters when sliders change
  const handleParameterChange = (newParameters) => {
    setParameters(newParameters);
  };

  // Display loading screen if data is still being fetched
  if (loading || !parameters) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  }

  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Wing Geometry Visualizer</h1>

      {/* Control panel to modify parameters */}
      <ControlPanel parameters={parameters} onChange={handleParameterChange} />

      {/* 3D Canvas for rendering the scene */}
      <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience parameters={parameters} />
      </Canvas>
    </>
  );
}

export default App;
