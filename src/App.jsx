import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Wing Geometry Visualizer</h1>
      {/*<ControlPanel parameters={parameters} onChange={setParameters} />*/}
      <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    </>
  );
}

export default App;
