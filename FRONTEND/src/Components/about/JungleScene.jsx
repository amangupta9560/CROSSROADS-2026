import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const MODELS = {
  temple: '/assets/lost-civilization/models/ancient-temple.glb',
  pillar: '/assets/lost-civilization/models/temple-pillar.glb',
  ruin: '/assets/lost-civilization/models/jungle-ruin.glb',
  artifact: '/assets/lost-civilization/models/ancient-artifact.glb',
};

const FOG_START = new THREE.Color('#09130D');
const FOG_END = new THREE.Color('#19150C');

function PathwayWorld({ progressRef, pointerRef, reducedMotion }) {
  const templeGltf = useGLTF(MODELS.temple);
  const pillarGltf = useGLTF(MODELS.pillar);
  const ruinGltf = useGLTF(MODELS.ruin);
  const artifactGltf = useGLTF(MODELS.artifact);

  const [stoneTex, mossTex] = useTexture([
    '/assets/lost-civilization/stone-texture.webp',
    '/assets/lost-civilization/moss-stone-texture.webp',
  ]);

  const fogRef = useRef(null);
  const sanctumLightRef = useRef(null);
  const artifactGroupRef = useRef(null);

  const {
    templeScene,
    pillars,
    ruins,
    artifactScene,
    disposables,
  } = useMemo(() => {
    const clonedTextures = [];
    const clonedMaterials = [];

    const setupTex = (tex, rx, ry) => {
      const c = tex.clone();
      c.wrapS = THREE.RepeatWrapping;
      c.wrapT = THREE.RepeatWrapping;
      c.repeat.set(rx, ry);
      c.colorSpace = THREE.SRGBColorSpace;
      c.needsUpdate = true;
      clonedTextures.push(c);
      return c;
    };

    const stoneMap = setupTex(stoneTex, 2, 2);
    const mossMap = setupTex(mossTex, 2, 2);

    const decorate = (scene) => {
      const clone = scene.clone(true);
      clone.traverse((child) => {
        if (child.isMesh && child.material) {
          const mat = child.material.clone();
          if (mat.name.includes('Moss')) {
            mat.map = mossMap;
            mat.roughness = 0.94;
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
      return clone;
    };

    return {
      templeScene: decorate(templeGltf.scene),
      pillars: [
        { obj: decorate(pillarGltf.scene), pos: [-3.8, -1.0, 10.5], rotY: 0.2 },
        { obj: decorate(pillarGltf.scene), pos: [3.8, -1.0, 10.5], rotY: -0.2 },
        { obj: decorate(pillarGltf.scene), pos: [-3.9, -1.0, 4.5], rotY: 0.35 },
        { obj: decorate(pillarGltf.scene), pos: [3.9, -1.0, 4.5], rotY: -0.35 },
        { obj: decorate(pillarGltf.scene), pos: [-4.1, -1.0, -1.5], rotY: 0.15 },
        { obj: decorate(pillarGltf.scene), pos: [4.1, -1.0, -1.5], rotY: -0.15 },
      ],
      ruins: [
        { obj: decorate(ruinGltf.scene), pos: [-2.7, -1.2, 7.6], rotY: 0.5 },
        { obj: decorate(ruinGltf.scene), pos: [2.8, -1.2, 1.8], rotY: -0.6 },
        { obj: decorate(ruinGltf.scene), pos: [-2.9, -1.2, -3.5], rotY: 0.9 },
      ],
      artifactScene: artifactGltf.scene.clone(true),
      disposables: { clonedTextures, clonedMaterials },
    };
  }, [templeGltf, pillarGltf, ruinGltf, artifactGltf, stoneTex, mossTex]);

  useEffect(() => {
    return () => {
      disposables.clonedTextures.forEach((t) => t.dispose());
      disposables.clonedMaterials.forEach((m) => m.dispose());
    };
  }, [disposables]);

  useFrame((state, delta) => {
    const p = Math.min(1, Math.max(0, progressRef.current || 0));
    const t = state.clock.getElapsedTime();

    // Smooth camera advancement down the ancient stone pathway toward temple entrance
    const px = reducedMotion ? 0 : (pointerRef.current?.x || 0) * 0.48;
    const py = reducedMotion ? 0 : (pointerRef.current?.y || 0) * 0.2;

    const targetZ = 15.2 - p * 12.6;
    const targetY = 1.65 + Math.sin(p * Math.PI) * 0.45 + py;
    const targetX = px;

    const rate = 1 - Math.exp(-delta * 4.5);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, rate);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, rate);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, rate);
    state.camera.lookAt(px * 0.2, 2.0 + p * 0.35, -7.5);

    if (fogRef.current) {
      fogRef.current.color.lerpColors(FOG_START, FOG_END, p);
      fogRef.current.density = 0.068 - p * 0.022;
    }

    if (sanctumLightRef.current) {
      sanctumLightRef.current.intensity = 3.2 + p * 5.2 + (reducedMotion ? 0 : Math.sin(t * 2) * 0.45);
    }

    if (artifactGroupRef.current && !reducedMotion) {
      artifactGroupRef.current.rotation.y += delta * 0.48;
      artifactGroupRef.current.position.y = 4.65 + Math.sin(t * 1.2) * 0.14;
    }
  });

  return (
    <>
      <fogExp2 ref={fogRef} attach="fog" args={['#09130D', 0.068]} />

      <ambientLight intensity={0.42} color="#688d70" />
      <directionalLight position={[8, 12, 6]} intensity={1.85} color="#ffd894" />
      <directionalLight position={[-7, 4, 5]} intensity={0.5} color="#2d573d" />

      {/* Warm Golden Light Increasing as Camera Approaches Temple */}
      <pointLight
        ref={sanctumLightRef}
        position={[0, 2.4, -5.0]}
        intensity={4}
        distance={22}
        decay={1.5}
        color="#f2aa3d"
      />

      {/* Stone Pathway Floor Plane */}
      <mesh position={[0, -1.25, 3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 34]} />
        <meshStandardMaterial color="#111b14" roughness={0.96} metalness={0.05} />
      </mesh>

      {/* Stepped Temple Destination */}
      <primitive object={templeScene} position={[0, -1.1, -7.2]} scale={[1.18, 1.18, 1.18]} />

      {/* Colonnade of Carved Temple Pillars */}
      {pillars.map((p, i) => (
        <primitive
          key={`pillar-${i}`}
          object={p.obj}
          position={p.pos}
          rotation={[0, p.rotY, 0]}
          scale={[1.05, 1.15, 1.05]}
        />
      ))}

      {/* Scattered Ancient Stone Ruins */}
      {ruins.map((r, i) => (
        <primitive
          key={`ruin-${i}`}
          object={r.obj}
          position={r.pos}
          rotation={[0, r.rotY, 0]}
          scale={[0.85, 0.85, 0.85]}
        />
      ))}

      {/* Floating Golden Astrolabe Relic above Temple Gateway */}
      <group ref={artifactGroupRef} position={[0, 4.65, -4.4]} scale={[0.72, 0.72, 0.72]}>
        <primitive object={artifactScene} />
      </group>

      {!reducedMotion && (
        <Sparkles
          count={78}
          scale={[12, 6, 22]}
          size={2.8}
          speed={0.34}
          opacity={0.78}
          color="#f2ca6b"
        />
      )}
    </>
  );
}

useGLTF.preload(MODELS.temple);
useGLTF.preload(MODELS.pillar);
useGLTF.preload(MODELS.ruin);
useGLTF.preload(MODELS.artifact);

export default function JungleScene({ progressRef, reducedMotion, onWebGLError }) {
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
      dpr={[1, 1.75]}
      camera={{ position: [0, 1.65, 15.2], fov: 48, near: 0.1, far: 75 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.08,
      }}
      onCreated={({ gl }) => {
        if (!gl.getContext()) onWebGLError?.();
      }}
      className="w-full h-full pointer-events-none"
    >
      <Suspense fallback={null}>
        <PathwayWorld
          progressRef={progressRef}
          pointerRef={pointerRef}
          reducedMotion={reducedMotion}
        />
      </Suspense>
    </Canvas>
  );
}
