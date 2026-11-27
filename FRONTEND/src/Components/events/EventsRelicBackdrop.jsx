import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const RELIC_PATH = '/assets/lost-civilization/models/ancient-artifact.glb';
const PILLAR_PATH = '/assets/lost-civilization/models/temple-pillar.glb';

function EventsRelicWorld({ pointerRef, reducedMotion }) {
  const relicGltf = useGLTF(RELIC_PATH);
  const pillarGltf = useGLTF(PILLAR_PATH);
  const stoneTex = useTexture('/assets/lost-civilization/stone-texture.webp');

  const leftRelicRef = useRef(null);
  const rightRelicRef = useRef(null);

  const { leftPillar, rightPillar, leftRelic, rightRelic, disposables } = useMemo(() => {
    const clonedTex = stoneTex.clone();
    clonedTex.wrapS = THREE.RepeatWrapping;
    clonedTex.wrapT = THREE.RepeatWrapping;
    clonedTex.repeat.set(2, 2);
    clonedTex.colorSpace = THREE.SRGBColorSpace;
    clonedTex.needsUpdate = true;

    const clonedMats = [];
    const applyStone = (scene) => {
      const clone = scene.clone(true);
      clone.traverse((child) => {
        if (child.isMesh && child.material) {
          const mat = child.material.clone();
          if (mat.name.includes('Stone') || mat.name.includes('Pillar')) {
            mat.map = clonedTex;
            mat.roughness = 0.9;
          }
          clonedMats.push(mat);
          child.material = mat;
        }
      });
      return clone;
    };

    return {
      leftPillar: applyStone(pillarGltf.scene),
      rightPillar: applyStone(pillarGltf.scene),
      leftRelic: relicGltf.scene.clone(true),
      rightRelic: relicGltf.scene.clone(true),
      disposables: { clonedTex, clonedMats },
    };
  }, [relicGltf, pillarGltf, stoneTex]);

  useEffect(() => {
    return () => {
      disposables.clonedTex.dispose();
      disposables.clonedMats.forEach((m) => m.dispose());
    };
  }, [disposables]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const scrollRatio = Math.min(1, window.scrollY / Math.max(window.innerHeight, 600));

    const targetX = reducedMotion ? 0 : pointerRef.current.x * 0.45;
    const targetY = reducedMotion ? 1.5 : 1.5 + pointerRef.current.y * 0.25 - scrollRatio * 0.45;
    const targetZ = 8.8 - scrollRatio * 2.4;

    const rate = 1 - Math.exp(-delta * 3.2);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, rate);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, rate);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, rate);
    state.camera.lookAt(0, 1.4, -2);

    if (!reducedMotion) {
      if (leftRelicRef.current) {
        leftRelicRef.current.rotation.y += delta * 0.35;
        leftRelicRef.current.position.y = 2.6 + Math.sin(t * 1.1) * 0.16;
      }
      if (rightRelicRef.current) {
        rightRelicRef.current.rotation.y -= delta * 0.42;
        rightRelicRef.current.position.y = 2.2 + Math.cos(t * 1.0) * 0.16;
      }
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={['#080D0B', 0.068]} />
      <ambientLight intensity={0.4} color="#6d8f75" />
      <directionalLight position={[6, 10, 5]} intensity={1.85} color="#ffd995" />
      <pointLight position={[0, 2.5, -1]} intensity={3.2} distance={14} color="#f0a83e" />

      <primitive object={leftPillar} position={[-5.4, -1.3, 0.5]} rotation={[0, 0.35, 0]} scale={[1.05, 1.15, 1.05]} />
      <primitive object={rightPillar} position={[5.4, -1.3, 0.5]} rotation={[0, -0.35, 0]} scale={[1.05, 1.15, 1.05]} />

      <group ref={leftRelicRef} position={[-4.1, 2.6, 1.1]} scale={[0.45, 0.45, 0.45]}>
        <primitive object={leftRelic} />
      </group>
      <group ref={rightRelicRef} position={[4.1, 2.2, 1.1]} scale={[0.52, 0.52, 0.52]}>
        <primitive object={rightRelic} />
      </group>

      {!reducedMotion && (
        <Sparkles count={56} scale={[13, 7, 10]} size={2.6} speed={0.3} opacity={0.72} color="#f0c766" />
      )}
    </>
  );
}

useGLTF.preload(RELIC_PATH);
useGLTF.preload(PILLAR_PATH);

export default function EventsRelicBackdrop({ reducedMotion, onWebGLError }) {
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
      camera={{ position: [0, 1.5, 8.8], fov: 46, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        if (!gl.getContext()) onWebGLError?.();
      }}
      className="w-full h-full pointer-events-none"
    >
      <Suspense fallback={null}>
        <EventsRelicWorld pointerRef={pointerRef} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
