import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const CHEST_PATH = '/assets/lost-civilization/models/treasure-chest.glb';
const RELIC_PATH = '/assets/lost-civilization/models/ancient-artifact.glb';

function VaultGuardianWorld({ pointerRef, reducedMotion }) {
  const chestGltf = useGLTF(CHEST_PATH);
  const relicGltf = useGLTF(RELIC_PATH);

  const chestGroupRef = useRef(null);
  const leftRelicRef = useRef(null);
  const rightRelicRef = useRef(null);

  const { chestScene, relicLeft, relicRight } = useMemo(
    () => ({
      chestScene: chestGltf.scene.clone(true),
      relicLeft: relicGltf.scene.clone(true),
      relicRight: relicGltf.scene.clone(true),
    }),
    [chestGltf, relicGltf]
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();
    const scrollRatio = Math.min(1, window.scrollY / Math.max(window.innerHeight, 600));

    const rate = 1 - Math.exp(-dt * 3.5);
    const tx = reducedMotion ? 0 : pointerRef.current.x * 0.45;
    const ty = reducedMotion ? 1.2 : 1.2 + pointerRef.current.y * 0.25 - scrollRatio * 0.35;
    const tz = 8.4 - scrollRatio * 2.0;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, tx, rate);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, ty, rate);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, tz, rate);
    state.camera.lookAt(0, 0.6, 0);

    if (!reducedMotion) {
      if (chestGroupRef.current) {
        chestGroupRef.current.rotation.y += dt * 0.22;
        chestGroupRef.current.position.y = -1.25 + Math.sin(t * 0.9) * 0.06;
      }
      if (leftRelicRef.current) {
        leftRelicRef.current.rotation.y -= dt * 0.45;
        leftRelicRef.current.position.y = 1.65 + Math.sin(t * 1.15) * 0.14;
      }
      if (rightRelicRef.current) {
        rightRelicRef.current.rotation.y += dt * 0.42;
        rightRelicRef.current.position.y = 1.35 + Math.cos(t * 1.1) * 0.14;
      }
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={['#080D0B', 0.075]} />
      <ambientLight intensity={0.42} color="#7c967e" />
      <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffdf9e" />
      <pointLight position={[0, 1.4, 1.2]} intensity={3.4} distance={14} color="#f5a638" />

      <group ref={chestGroupRef} position={[3.6, -1.25, -0.8]} rotation={[0.1, -0.55, 0]} scale={[1.05, 1.05, 1.05]}>
        <primitive object={chestScene} />
      </group>

      <group ref={leftRelicRef} position={[-4.2, 1.65, 0.4]} scale={[0.42, 0.42, 0.42]}>
        <primitive object={relicLeft} />
      </group>

      <group ref={rightRelicRef} position={[4.1, 1.35, 0.5]} scale={[0.38, 0.38, 0.38]}>
        <primitive object={relicRight} />
      </group>

      {!reducedMotion && (
        <Sparkles count={48} scale={[12, 6, 9]} size={2.4} speed={0.32} opacity={0.68} color="#f0c766" />
      )}
    </>
  );
}

useGLTF.preload(CHEST_PATH);
useGLTF.preload(RELIC_PATH);

export default function RegistrationVaultBackdrop({ reducedMotion, onWebGLError }) {
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return undefined;
    const onMove = (e) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reducedMotion]);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.2, 8.4], fov: 44, near: 0.1, far: 45 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        if (!gl.getContext()) onWebGLError?.();
      }}
      className="w-full h-full pointer-events-none"
    >
      <Suspense fallback={null}>
        <VaultGuardianWorld pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
