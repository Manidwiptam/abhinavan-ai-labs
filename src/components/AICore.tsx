import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import { Group, Mesh } from "three";

const CoreScene = ({ pointer }: { pointer: { x: number; y: number } }) => {
  const groupRef = useRef<Group>(null);
  const shellRef = useRef<Mesh>(null);
  const nucleusRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (!groupRef.current || !shellRef.current || !nucleusRef.current) return;

    groupRef.current.rotation.y += delta * 0.18;
    groupRef.current.rotation.x += delta * 0.08;
    groupRef.current.position.x += ((pointer.x * 0.35) - groupRef.current.position.x) * 0.04;
    groupRef.current.position.y += ((pointer.y * 0.2) - groupRef.current.position.y) * 0.04;

    shellRef.current.rotation.z += delta * 0.12;
    nucleusRef.current.rotation.y -= delta * 0.4;
    nucleusRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.03);
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 4, 6]} intensity={18} color="#38bdf8" />
      <pointLight position={[-4, -3, 5]} intensity={10} color="#8b5cf6" />
      <Float speed={1.4} rotationIntensity={0.45} floatIntensity={0.85}>
        <group ref={groupRef}>
          <mesh ref={shellRef}>
            <icosahedronGeometry args={[1.5, 1]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#3b82f6"
              emissiveIntensity={1.4}
              wireframe
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh ref={nucleusRef}>
            <sphereGeometry args={[0.82, 64, 64]} />
            <MeshDistortMaterial
              color="#7dd3fc"
              emissive="#8b5cf6"
              emissiveIntensity={1.8}
              distort={0.28}
              speed={2}
              roughness={0.1}
            />
          </mesh>
          <Sparkles
            count={45}
            scale={[4.6, 4.6, 4.6]}
            size={3}
            speed={0.45}
            color="#60a5fa"
          />
        </group>
      </Float>
    </>
  );
};

const AICore = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const dpr = useMemo(() => [1, 1.5] as [number, number], []);

  return (
    <div className="relative h-[360px] w-[360px] lg:h-[460px] lg:w-[460px]">
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />
      <Canvas
        dpr={dpr}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5], fov: 42 }}
        onPointerMove={(event) =>
          setPointer({
            x: event.pointer.x,
            y: event.pointer.y,
          })
        }
      >
        <CoreScene pointer={pointer} />
      </Canvas>
    </div>
  );
};

export default AICore;
