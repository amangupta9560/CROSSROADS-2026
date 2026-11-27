import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles, useGLTF } from '@react-three/drei';

function VaultDiorama() {
  const chestGltf = useGLTF('/assets/lost-civilization/models/treasure-chest.glb');
  const artifactGltf = useGLTF('/assets/lost-civilization/models/ancient-artifact.glb');
  const groupRef = useRef(null);
  const artifactRef = useRef(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25;
    }
    if (artifactRef.current) {
      artifactRef.current.rotation.y -= delta * 0.65;
      artifactRef.current.position.y = 1.68 + Math.sin(t * 1.4) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.45} color="#7c967e" />
      <directionalLight position={[4, 6, 4]} intensity={2.2} color="#ffe09e" />
      <pointLight position={[0, 1.4, 0.4]} intensity={3.5} distance={7} color="#f5a638" />

      <group ref={groupRef} position={[0, -0.55, 0]}>
        <primitive object={chestGltf.scene.clone(true)} scale={[1.15, 1.15, 1.15]} />
        <group ref={artifactRef} position={[0, 1.68, 0]} scale={[0.36, 0.36, 0.36]}>
          <primitive object={artifactGltf.scene.clone(true)} />
        </group>
      </group>

      <Sparkles count={32} scale={[4, 3, 4]} size={2.2} speed={0.4} color="#f0c766" />
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={0.9} maxPolarAngle={1.65} />
    </>
  );
}

useGLTF.preload('/assets/lost-civilization/models/treasure-chest.glb');

export default function TreasureRelicCanvas() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.1, 3.8], fov: 42 }}
      gl={{ alpha: true, antialias: true }}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    >
      <Suspense fallback={null}>
        <VaultDiorama />
      </Suspense>
    </Canvas>
  );
}
