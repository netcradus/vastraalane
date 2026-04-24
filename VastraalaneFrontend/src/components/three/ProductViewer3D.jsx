import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { Spinner } from "../ui/Spinner";

function FallbackMesh({ color = "#d4a373" }) {
  return (
    <mesh rotation={[0.4, 0.7, 0]}>
      <boxGeometry args={[1.4, 1.8, 1]} />
      <meshStandardMaterial color={color} metalness={0.35} roughness={0.3} />
    </mesh>
  );
}

export function ProductViewer3D({ color }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top,#fff7ec,transparent_45%),linear-gradient(180deg,#efe6d6_0%,#e6dccf_100%)]">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }} shadows gl={{ antialias: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 3, 2]} intensity={1.2} castShadow />
        <Suspense fallback={null}>
          <FallbackMesh color={color} />
          <Environment preset="studio" />
          <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={6} blur={2.4} />
          <OrbitControls enableDamping />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4 text-xs uppercase tracking-[0.2em] text-ink/50">
        Rotate to inspect
      </div>
      <div className="absolute left-4 top-4">
        <Spinner />
      </div>
    </div>
  );
}
