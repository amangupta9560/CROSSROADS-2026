import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const MODEL_PATHS = {
  temple: '/assets/lost-civilization/models/ancient-temple.glb',
  pillar: '/assets/lost-civilization/models/temple-pillar.glb',
  artifact: '/assets/lost-civilization/models/ancient-artifact.glb',
  ruin: '/assets/lost-civilization/models/jungle-ruin.glb',
};

function TempleWorld({ pointerRef, reducedMotion, isMobile }) {
  const templeGltf = useGLTF(MODEL_PATHS.temple);
  const pillarGltf = useGLTF(MODEL_PATHS.pillar);
  const artifactGltf = useGLTF(MODEL_PATHS.artifact);
  const ruinGltf = useGLTF(MODEL_PATHS.ruin);

  const [stoneTex, mossTex] = useTexture([
    '/assets/lost-civilization/stone-texture.webp',
    '/assets/lost-civilization/moss-stone-texture.webp',
  ]);

  const artifactRef = useRef(null);
  const gatewayGlowRef = useRef(null);
  const sunShaftsRef = useRef(null);

  const {
    distantTemple,
    leftPillar,
    rightPillar,
    leftRuin,
    rightRuin,
    artifactScene,
    disposables,
  } = useMemo(() => {
    const clonedTextures = [];
    const clonedMaterials = [];

    const configureTex = (tex, repeatX, repeatY) => {
      const cloned = tex.clone();
      cloned.wrapS = THREE.RepeatWrapping;
      cloned.wrapT = THREE.RepeatWrapping;
      cloned.repeat.set(repeatX, repeatY);
      cloned.colorSpace = THREE.SRGBColorSpace;
      cloned.needsUpdate = true;
      clonedTextures.push(cloned);
      return cloned;
    };

    const stoneMap = configureTex(stoneTex, 2, 2);
    const mossMap = configureTex(mossTex, 2, 2);

    const applyPbrTextures = (scene) => {
      const cloned = scene.clone(true);
      cloned.traverse((child) => {
        if (child.isMesh && child.material) {
          const mat = child.material.clone();
          if (mat.name.includes('Moss')) {
            mat.map = mossMap;
            mat.roughness = 0.92;
          } else if (
            mat.name.includes('Stone') ||
            mat.name.includes('Pillar') ||
            mat.name.includes('Ruin')
          ) {
            mat.map = stoneMap;
            mat.roughness = 0.88;
          }
          clonedMaterials.push(mat);
          child.material = mat;
        }
      });
      return cloned;
    };

    return {
      distantTemple: applyPbrTextures(templeGltf.scene),
      leftPillar: applyPbrTextures(pillarGltf.scene),
      rightPillar: applyPbrTextures(pillarGltf.scene),
      leftRuin: applyPbrTextures(ruinGltf.scene),
      rightRuin: applyPbrTextures(ruinGltf.scene),
      artifactScene: artifactGltf.scene.clone(true),
      disposables: { clonedTextures, clonedMaterials },
    };
  }, [templeGltf, pillarGltf, artifactGltf, ruinGltf, stoneTex, mossTex]);

  useEffect(() => {
    return () => {
      disposables.clonedTextures.forEach((t) => t.dispose());
      disposables.clonedMaterials.forEach((m) => m.dispose());
    };
  }, [disposables]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const scrollProgress = Math.min(
      1,
      Math.max(0, window.scrollY / Math.max(window.innerHeight, 600))
    );

    // Smooth mouse parallax + subtle scroll-driven forward trek toward the temple entrance
    const targetX = reducedMotion || isMobile ? 0 : pointerRef.current.x * 0.55;
    const targetY =
      reducedMotion || isMobile
        ? 2.15
        : 2.18 + pointerRef.current.y * 0.24 - scrollProgress * 0.35;
    const driftZ = reducedMotion ? 0 : Math.sin(t * 0.22) * 0.26;
    const targetZ = 9.8 - scrollProgress * 3.2 + driftZ;

    const lerpRate = 1 - Math.exp(-delta * 2.8);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, lerpRate);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, lerpRate);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, lerpRate);
    state.camera.lookAt(targetX * 0.22, 2.2 - scrollProgress * 0.25, -4.5);

    if (artifactRef.current && !reducedMotion) {
      artifactRef.current.rotation.y += delta * 0.42;
      artifactRef.current.rotation.x = Math.sin(t * 0.6) * 0.14;
      artifactRef.current.position.y = 3.6 + Math.sin(t * 1.15) * 0.14;
    }

    if (gatewayGlowRef.current && !reducedMotion) {
      gatewayGlowRef.current.intensity = 3.8 + Math.sin(t * 1.8) * 0.6;
    }

    if (sunShaftsRef.current && !reducedMotion) {
      sunShaftsRef.current.rotation.z = -0.28 + Math.sin(t * 0.28) * 0.025;
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={['#09110D', 0.062]} />

      <ambientLight intensity={0.44} color="#6f9177" />
      <directionalLight position={[7, 11, 5]} intensity={1.9} color="#ffd995" />
      <directionalLight position={[-8, 5, 3]} intensity={0.55} color="#3a6b4d" />

      {/* Warm golden sanctum glow radiating from temple doorway axis */}
      <pointLight
        ref={gatewayGlowRef}
        position={[0, 2.5, -2.8]}
        intensity={3.8}
        distance={14}
        decay={1.7}
        color="#f0a83e"
      />

      {/* Volumetric sunbeam shaft */}
      <group ref={sunShaftsRef} position={[3.2, 6.4, -3.5]} rotation={[0, 0, -0.28]}>
        <mesh>
          <coneGeometry args={[3.2, 13, 18, 1, true]} />
          <meshBasicMaterial
            color="#e6b75e"
            transparent
            opacity={0.055}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Side Sanctuary Ruin Silhouette (keeps central doorway image unobstructed) */}
      <primitive
        object={distantTemple}
        position={[-7.2, -1.35, -7.8]}
        rotation={[0, 0.55, 0]}
        scale={[0.58, 0.58, 0.58]}
      />

      {/* Flanking Mossy Temple Pillars framing the viewport */}
      <primitive
        object={leftPillar}
        position={[-5.45, -0.95, 1.4]}
        rotation={[0, 0.38, 0]}
        scale={[1.02, 1.15, 1.02]}
      />
      <primitive
        object={rightPillar}
        position={[5.45, -0.95, 1.2]}
        rotation={[0, -0.42, 0]}
        scale={[1.02, 1.15, 1.02]}
      />

      {/* Lower Foreground Broken Stone Ruins */}
      <primitive
        object={leftRuin}
        position={[-4.1, -1.45, 3.6]}
        rotation={[0, 0.6, 0]}
        scale={[0.85, 0.85, 0.85]}
      />
      <primitive
        object={rightRuin}
        position={[4.2, -1.45, 3.2]}
        rotation={[0, -0.8, 0]}
        scale={[0.88, 0.88, 0.88]}
      />

      {/* Floating Ancient Golden Astrolabe Artifact on upper-right flank */}
      <group ref={artifactRef} position={[4.2, 3.6, 0.6]} scale={[0.56, 0.56, 0.56]}>
        <primitive object={artifactScene} />
      </group>

      {/* Atmospheric Fireflies & Dust Motes */}
      {!reducedMotion && (
        <>
          <Sparkles
            count={isMobile ? 28 : 72}
            scale={[14, 7, 12]}
            size={isMobile ? 2.2 : 2.8}
            speed={0.34}
            opacity={0.75}
            color="#f0c766"
          />
          <Sparkles
            count={isMobile ? 14 : 34}
            scale={[10, 5, 9]}
            size={3.4}
            speed={0.22}
            opacity={0.45}
            color="#d97d3a"
          />
        </>
      )}
    </>
  );
}

useGLTF.preload(MODEL_PATHS.temple);
useGLTF.preload(MODEL_PATHS.pillar);
useGLTF.preload(MODEL_PATHS.artifact);
useGLTF.preload(MODEL_PATHS.ruin);

export default function TempleScene({ reducedMotion, isMobile, onWebGLError }) {
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion || isMobile) return undefined;
    const handlePointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [reducedMotion, isMobile]);

  return (
    <Canvas
      dpr={isMobile ? 1 : [1, 1.75]}
      camera={{ position: [0, 2.18, 9.8], fov: 46, near: 0.1, far: 60 }}
      gl={{
        alpha: true,
        antialias: !isMobile,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
      }}
      onCreated={({ gl }) => {
        if (!gl.getContext()) {
          onWebGLError?.();
        }
      }}
      className="w-full h-full pointer-events-none"
    >
      <Suspense fallback={null}>
        <TempleWorld
          pointerRef={pointerRef}
          reducedMotion={reducedMotion}
          isMobile={isMobile}
        />
      </Suspense>
    </Canvas>
  );
}
