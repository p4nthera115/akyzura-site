import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"

function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 1000 }}
      className="border min-h-dvh w-dvw absolute h-dvh"
    >
      <Experience />
    </Canvas>
  )
}

export default App
