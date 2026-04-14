import { Canvas, useFrame } from "@react-three/fiber";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

const BRAIN_MAIN = "#1976D2";
const BRAIN_HIGHLIGHT = "#42A5F5";

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const createBrainPointCloud = (count: number) => {
  const mainPositions: number[] = [];
  const highlightPositions: number[] = [];
  const sparkPositions: number[] = [];

  while (mainPositions.length / 3 < count) {
    const side = Math.random() > 0.5 ? 1 : -1;
    const x = randomBetween(0, 1.48) * side;
    const y = randomBetween(-1.52, 1.52);
    const z = randomBetween(-1.18, 1.18);

    const lobe = ((x - side * 0.44) ** 2) / 1.92 + (y ** 2) / 2.12 + (z ** 2) / 1.42;
    const crown = ((x - side * 0.12) ** 2) / 1.48 + ((y - 0.72) ** 2) / 0.72 + (z ** 2) / 1.18;
    const lower = ((x - side * 0.24) ** 2) / 1.36 + ((y + 0.78) ** 2) / 0.92 + (z ** 2) / 1.08;
    const stem = (x ** 2) / 0.1 + ((y + 1.7) ** 2) / 0.34 + (z ** 2) / 0.14;
    const centralGap = (x ** 2) / 0.034 + ((y + 0.08) ** 2) / 2.42 + (z ** 2) / 0.26;

    const insideBrain = (lobe < 1 || crown < 1 || lower < 1 || stem < 1) && centralGap > 1;
    if (!insideBrain) continue;

    const jitter = 0.022;
    mainPositions.push(
      x + randomBetween(-jitter, jitter),
      y + randomBetween(-jitter, jitter),
      z + randomBetween(-jitter, jitter),
    );

    if (Math.random() > 0.76) {
      highlightPositions.push(
        x + randomBetween(-0.015, 0.015),
        y + randomBetween(-0.015, 0.015),
        z + randomBetween(-0.015, 0.015),
      );
    }

    if (Math.random() > 0.965) {
      sparkPositions.push(x, y, z);
    }
  }

  return {
    main: new Float32Array(mainPositions),
    highlight: new Float32Array(highlightPositions),
    sparks: new Float32Array(sparkPositions),
  };
};

const createBrainConnections = (source: Float32Array, sampleSize: number) => {
  const points: Array<[number, number, number]> = [];
  const total = Math.floor(source.length / 3);
  const stride = Math.max(1, Math.floor(total / sampleSize));

  for (let index = 0; index < total; index += stride) {
    points.push([
      source[index * 3],
      source[index * 3 + 1],
      source[index * 3 + 2],
    ]);
  }

  const segments: number[] = [];
  for (let i = 0; i < points.length; i += 1) {
    let nearestIndex = -1;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i][0] - points[j][0];
      const dy = points[i][1] - points[j][1];
      const dz = points[i][2] - points[j][2];
      const distance = Math.hypot(dx, dy, dz);

      if (distance < nearestDistance && distance < 0.42) {
        nearestDistance = distance;
        nearestIndex = j;
      }
    }

    if (nearestIndex >= 0) {
      segments.push(...points[i], ...points[nearestIndex]);
    }
  }

  return new Float32Array(segments);
};

const BrainPoints = ({ simplified = false }: { simplified?: boolean }) => {
  const reduceMotion = useReducedMotion();
  const groupRef = useRef<THREE.Group>(null);
  const dragState = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    velocityX: 0,
    velocityY: 0,
    rotationX: 0.22,
    rotationY: -0.18,
    targetX: 0.22,
    targetY: -0.18,
    pointerX: 0,
    pointerY: 0,
  });

  const [dragging, setDragging] = useState(false);

  const pointCloud = useMemo(
    () => createBrainPointCloud(simplified ? 1600 : 3200),
    [simplified],
  );
  const connectionGeometry = useMemo(
    () => createBrainConnections(pointCloud.highlight.length ? pointCloud.highlight : pointCloud.main, simplified ? 70 : 110),
    [pointCloud, simplified],
  );

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const brainState = dragState.current;
    const drift = state.clock.getElapsedTime();
    const idleY = reduceMotion ? 0 : Math.sin(drift * 0.22) * 0.12;
    const pulse = reduceMotion ? 1 : 1 + Math.sin(drift * 1.6) * 0.035;
    const spring = 1 - Math.pow(0.02, delta);

    if (!brainState.active) {
      brainState.targetY += delta * (simplified ? 0.12 : 0.16);
      brainState.targetX += (brainState.pointerY * 0.12 - brainState.targetX) * 0.012;
    }

    brainState.velocityX *= 0.94;
    brainState.velocityY *= 0.94;
    brainState.targetY += brainState.velocityX;
    brainState.targetX += brainState.velocityY;

    brainState.rotationX += (brainState.targetX - brainState.rotationX) * spring;
    brainState.rotationY += (brainState.targetY - brainState.rotationY) * spring;

    group.rotation.x = brainState.rotationX;
    group.rotation.y = brainState.rotationY;
    group.position.y = idleY;
    group.scale.setScalar(pulse);
  });

  const updatePointerParallax = (clientX: number, clientY: number, currentTarget: Element) => {
    const rect = currentTarget.getBoundingClientRect();
    const normalizedX = (clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (clientY - rect.top) / rect.height - 0.5;
    dragState.current.pointerX = normalizedX;
    dragState.current.pointerY = normalizedY;

    if (!dragState.current.active) {
      dragState.current.targetX = 0.22 - normalizedY * 0.28;
      dragState.current.targetY += normalizedX * 0.003;
    }
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={(event) => {
        event.stopPropagation();
        dragState.current.active = true;
        dragState.current.lastX = event.clientX;
        dragState.current.lastY = event.clientY;
        dragState.current.velocityX = 0;
        dragState.current.velocityY = 0;
        setDragging(true);
      }}
      onPointerMove={(event) => {
        updatePointerParallax(event.clientX, event.clientY, event.currentTarget);

        if (!dragState.current.active || simplified) return;

        const deltaX = event.clientX - dragState.current.lastX;
        const deltaY = event.clientY - dragState.current.lastY;
        dragState.current.lastX = event.clientX;
        dragState.current.lastY = event.clientY;

        dragState.current.targetY += deltaX * 0.0062;
        dragState.current.targetX += deltaY * 0.0048;
        dragState.current.velocityX = deltaX * 0.00065;
        dragState.current.velocityY = deltaY * 0.00048;
      }}
      onPointerUp={() => {
        dragState.current.active = false;
        setDragging(false);
      }}
      onPointerOut={() => {
        dragState.current.active = false;
        setDragging(false);
      }}
    >
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointCloud.main.length / 3}
            array={pointCloud.main}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={BRAIN_MAIN}
          size={simplified ? 0.03 : 0.028}
          sizeAttenuation
          transparent
          opacity={dragging ? 0.9 : 0.72}
          depthWrite={false}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointCloud.highlight.length / 3}
            array={pointCloud.highlight}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={BRAIN_HIGHLIGHT}
          size={simplified ? 0.044 : 0.04}
          sizeAttenuation
          transparent
          opacity={0.95}
          depthWrite={false}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={pointCloud.sparks.length / 3}
            array={pointCloud.sparks}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#9ED1FF"
          size={simplified ? 0.055 : 0.05}
          sizeAttenuation
          transparent
          opacity={0.78}
          depthWrite={false}
        />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={connectionGeometry.length / 3}
            array={connectionGeometry}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={BRAIN_HIGHLIGHT} transparent opacity={simplified ? 0.08 : 0.12} />
      </lineSegments>
    </group>
  );
};

const NeuralBrain = () => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto flex w-full max-w-[620px] items-center justify-center">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[12%] inset-y-[18%] rounded-full bg-[radial-gradient(circle,rgba(25,118,210,0.2),rgba(25,118,210,0.08)_34%,transparent_72%)] blur-3xl"
        animate={reduceMotion ? undefined : { scale: [0.96, 1.05, 0.96], opacity: [0.54, 0.88, 0.54] }}
        transition={reduceMotion ? undefined : { duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[9%] rounded-[40%] border border-[#42A5F5]/15"
        animate={reduceMotion ? undefined : { rotate: [0, 6, 0, -6, 0] }}
        transition={reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="hidden aspect-square w-full max-w-[560px] lg:block">
        <Canvas
          dpr={[1, 1.8]}
          camera={{ position: [0, 0, 5.8], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.35} color="#5DAFFF" />
          <pointLight position={[2, 3, 4]} intensity={10} color="#42A5F5" distance={12} />
          <pointLight position={[-3, -2, 3]} intensity={4.6} color="#1976D2" distance={10} />
          <BrainPoints />
        </Canvas>
      </div>

      <motion.div
        className="relative aspect-square w-full max-w-[320px] lg:hidden"
        animate={reduceMotion ? undefined : { y: [0, -8, 0], scale: [0.98, 1.01, 0.98] }}
        transition={reduceMotion ? undefined : { duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgba(25,118,210,0.22),rgba(66,165,245,0.1)_34%,transparent_72%)] blur-2xl" />
        <div className="absolute inset-0 rounded-[42%] border border-[#42A5F5]/12" />
        <Canvas
          dpr={[1, 1.4]}
          camera={{ position: [0, 0, 6.2], fov: 42 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} color="#5DAFFF" />
          <pointLight position={[2, 2, 4]} intensity={7} color="#42A5F5" distance={10} />
          <BrainPoints simplified />
        </Canvas>
      </motion.div>
    </div>
  );
};

export default NeuralBrain;
