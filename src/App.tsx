import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"

function App() {
  return (
    <Canvas className="border min-h-dvh w-dvw absolute">
      <Experience />
    </Canvas>
  )
}

export default App
