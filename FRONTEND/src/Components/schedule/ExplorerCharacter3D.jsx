import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Articulated 3D Temple Explorer Character that traverses from card pedestal to card pedestal
 * in response to both scroll position and pointer/cursor targeting.
 */
function ExplorerAvatarMesh({
  timelineBoundsRef,
  anchorRefs,
  targetIndexRef,
  cursorRef,
  reducedMotion,
}) {
  const { size, camera } = useThree();
  const rootRef = useRef(null);
  const bodyRef = useRef(null);
  const headRef = useRef(null);
  const leftArmRef = useRef(null);
  const rightArmRef = useRef(null);
  const leftLegRef = useRef(null);
  const rightLegRef = useRef(null);
  const capeRef = useRef(null);
  const discRef = useRef(null);
  const pulseRingRef = useRef(null);
  const flameRef = useRef(null);

  const posRef = useRef({ x: 0, y: 0, initialized: false });
  const prevIdxRef = useRef(-1);
  const hopProgressRef = useRef(1);
  const pulseRef = useRef(0);
  const stridePhaseRef = useRef(0);
  const visScaleRef = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.getElapsedTime();
    const root = rootRef.current;
    if (!root) return;

    const boundsEl = timelineBoundsRef.current;
    const targetIdx = targetIndexRef.current;
    const anchorEl = anchorRefs.current?.[targetIdx];

    if (!boundsEl || !anchorEl || size.width < 1 || size.height < 1) {
      root.visible = false;
      return;
    }

    const boundsRect = boundsEl.getBoundingClientRect();
    const inViewport =
      boundsRect.bottom > 110 && boundsRect.top < size.height - 90;

    const targetVis = inViewport ? 1 : 0;
    visScaleRef.current = THREE.MathUtils.lerp(
      visScaleRef.current,
      targetVis,
      1 - Math.exp(-dt * 8)
    );

    if (visScaleRef.current < 0.03) {
      root.visible = false;
      return;
    }
    root.visible = true;

    const rect = anchorEl.getBoundingClientRect();
    const px = rect.left + rect.width * 0.5;
    const py = rect.top + rect.height * 0.5;

    const vFov = (camera.fov * Math.PI) / 180;
    const worldH = 2 * Math.tan(vFov / 2) * camera.position.z;
    const worldW = worldH * (size.width / size.height);

    const destX = (px / size.width - 0.5) * worldW;
    const destY = (0.5 - py / size.height) * worldH;

    if (!posRef.current.initialized) {
      posRef.current.x = destX;
      posRef.current.y = destY;
      posRef.current.initialized = true;
      prevIdxRef.current = targetIdx;
    }

    // Trigger hop arc & landing pulse whenever active card changes
    if (prevIdxRef.current !== targetIdx) {
      prevIdxRef.current = targetIdx;
      hopProgressRef.current = 0;
      pulseRef.current = 1;
    }

    if (hopProgressRef.current < 1) {
      hopProgressRef.current = Math.min(1, hopProgressRef.current + dt * 2.2);
    }
    if (pulseRef.current > 0) {
      pulseRef.current = Math.max(0, pulseRef.current - dt * 2.1);
    }

    const prevX = posRef.current.x;
    const prevY = posRef.current.y;
    const followRate = reducedMotion ? 1 : 1 - Math.exp(-dt * 9.5);
    posRef.current.x = THREE.MathUtils.lerp(posRef.current.x, destX, followRate);
    posRef.current.y = THREE.MathUtils.lerp(posRef.current.y, destY, followRate);

    const vx = (posRef.current.x - prevX) / Math.max(dt, 0.001);
    const vy = (posRef.current.y - prevY) / Math.max(dt, 0.001);
    const speed = Math.min(12, Math.hypot(vx, vy));

    const hopArc =
      !reducedMotion && hopProgressRef.current < 1
        ? Math.sin(hopProgressRef.current * Math.PI)
        : 0;

    const mobileScale = size.width < 640 ? 0.3 : size.width < 1024 ? 0.36 : 0.42;
    const finalScale = mobileScale * visScaleRef.current;

    root.position.set(
      posRef.current.x,
      posRef.current.y + hopArc * 0.42 + (reducedMotion ? 0 : Math.sin(t * 2.4) * 0.045),
      hopArc * 1.15
    );
    root.scale.setScalar(finalScale);

    // Orient explorer subtly toward motion direction + live cursor position
    const targetYaw =
      THREE.MathUtils.clamp(vx * 0.08, -0.55, 0.55) +
      cursorRef.current.nx * 0.42;
    const targetRoll = THREE.MathUtils.clamp(-vx * 0.035, -0.25, 0.25);

    root.rotation.y = THREE.MathUtils.lerp(
      root.rotation.y,
      targetYaw,
      1 - Math.exp(-dt * 8)
    );
    root.rotation.z = THREE.MathUtils.lerp(
      root.rotation.z,
      targetRoll,
      1 - Math.exp(-dt * 8)
    );

    if (!reducedMotion) {
      // Stride & arm articulation driven by real card-to-card speed + subtle idle sway
      stridePhaseRef.current += dt * (2.2 + speed * 2.1);
      const strideAmp = Math.min(0.62, 0.08 + speed * 0.14);
      const swing = Math.sin(stridePhaseRef.current) * strideAmp;

      if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -swing * 0.85;
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -0.55 + swing * 0.55 - hopArc * 0.35;
      }

      if (bodyRef.current) {
        bodyRef.current.position.y = Math.abs(Math.sin(stridePhaseRef.current)) * (speed * 0.012);
      }

      if (headRef.current) {
        headRef.current.rotation.y = THREE.MathUtils.lerp(
          headRef.current.rotation.y,
          cursorRef.current.nx * 0.5,
          1 - Math.exp(-dt * 10)
        );
        headRef.current.rotation.x = THREE.MathUtils.lerp(
          headRef.current.rotation.x,
          -cursorRef.current.ny * 0.28 + Math.sin(t * 2) * 0.04,
          1 - Math.exp(-dt * 10)
        );
      }

      if (capeRef.current) {
        capeRef.current.rotation.x =
          0.22 + Math.min(0.55, speed * 0.08) + Math.sin(t * 4.5) * 0.08;
      }

      if (discRef.current) {
        discRef.current.rotation.z += dt * (0.9 + speed * 0.35);
      }

      if (pulseRingRef.current) {
        const ringScale = 1 + (1 - pulseRef.current) * 0.85;
        pulseRingRef.current.scale.set(ringScale, ringScale, 1);
        pulseRingRef.current.material.opacity = pulseRef.current * 0.75;
      }

      if (flameRef.current) {
        const flicker = 0.92 + Math.sin(t * 14) * 0.12;
        flameRef.current.scale.setScalar(flicker);
      }
    }
  });

  return (
    <group ref={rootRef} visible={false}>
      {/* Floating Carved Gold Astrolabe Pedestal Ring */}
      <group position={[0, -0.95, 0]}>
        <mesh ref={discRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.72, 0.075, 12, 32]} />
          <meshStandardMaterial
            color="#E8C574"
            metalness={0.85}
            roughness={0.22}
            emissive="#8F631F"
            emissiveIntensity={0.45}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.58, 0.64, 0.08, 24]} />
          <meshStandardMaterial
            color="#182B20"
            metalness={0.35}
            roughness={0.75}
            emissive="#123020"
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Expanding landing ring wave */}
        <mesh ref={pulseRingRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
          <ringGeometry args={[0.76, 0.92, 32]} />
          <meshBasicMaterial color="#F3DDA0" transparent opacity={0} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Articulated Explorer Character Body */}
      <group ref={bodyRef} position={[0, -0.1, 0]}>
        {/* Left & Right Legs */}
        <group ref={leftLegRef} position={[-0.2, -0.28, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.1, 0.09, 0.42, 12]} />
            <meshStandardMaterial color="#243D2C" roughness={0.82} />
          </mesh>
          <mesh position={[0, -0.46, 0.05]}>
            <boxGeometry args={[0.19, 0.14, 0.28]} />
            <meshStandardMaterial color="#3A2212" roughness={0.65} />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[0.2, -0.28, 0]}>
          <mesh position={[0, -0.22, 0]}>
            <cylinderGeometry args={[0.1, 0.09, 0.42, 12]} />
            <meshStandardMaterial color="#243D2C" roughness={0.82} />
          </mesh>
          <mesh position={[0, -0.46, 0.05]}>
            <boxGeometry args={[0.19, 0.14, 0.28]} />
            <meshStandardMaterial color="#3A2212" roughness={0.65} />
          </mesh>
        </group>

        {/* Torso Tunic + Golden Belt & Chest Emblem */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.3, 0.25, 0.62, 16]} />
          <meshStandardMaterial color="#6D4B2B" roughness={0.78} metalness={0.12} />
        </mesh>
        {/* Belt Buckle */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.265, 0.265, 0.09, 16]} />
          <meshStandardMaterial color="#C69B43" metalness={0.82} roughness={0.28} />
        </mesh>
        {/* Glowing Relic Core on Chest */}
        <mesh position={[0, 0.08, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.05, 6]} />
          <meshStandardMaterial
            color="#FFE08C"
            emissive="#F0B13E"
            emissiveIntensity={1.6}
            metalness={0.5}
            roughness={0.2}
          />
        </mesh>

        {/* Expedition Satchel Scarf / Cape */}
        <group ref={capeRef} position={[0, 0.28, -0.24]}>
          <mesh position={[0, -0.32, -0.05]}>
            <boxGeometry args={[0.48, 0.68, 0.06]} />
            <meshStandardMaterial color="#B86B35" roughness={0.88} side={THREE.DoubleSide} />
          </mesh>
        </group>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.38, 0.25, 0]}>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.085, 0.075, 0.44, 12]} />
            <meshStandardMaterial color="#7C5633" roughness={0.78} />
          </mesh>
          <mesh position={[0, -0.44, 0]}>
            <sphereGeometry args={[0.085, 12, 12]} />
            <meshStandardMaterial color="#E0B68A" roughness={0.65} />
          </mesh>
        </group>

        {/* Right Arm + Golden Expedition Torch */}
        <group ref={rightArmRef} position={[0.38, 0.25, 0]} rotation={[-0.55, 0, 0]}>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.085, 0.075, 0.42, 12]} />
            <meshStandardMaterial color="#7C5633" roughness={0.78} />
          </mesh>
          {/* Torch Handle */}
          <group position={[0, -0.4, 0.14]} rotation={[Math.PI / 2.2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.03, 0.5, 10]} />
              <meshStandardMaterial color="#4A2C17" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <cylinderGeometry args={[0.08, 0.05, 0.1, 10]} />
              <meshStandardMaterial color="#C69B43" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Glowing Torch Crystal Flame */}
            <mesh ref={flameRef} position={[0, 0.4, 0]}>
              <octahedronGeometry args={[0.11, 0]} />
              <meshStandardMaterial
                color="#FFF2B2"
                emissive="#FFAD33"
                emissiveIntensity={2.4}
                roughness={0.15}
              />
            </mesh>
            <pointLight position={[0, 0.45, 0.1]} color="#ffb94d" intensity={2.4} distance={4.5} />
          </group>
        </group>

        {/* Head + Explorer Hat + Luminous Visor */}
        <group ref={headRef} position={[0, 0.56, 0]}>
          {/* Head sphere */}
          <mesh>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial color="#18261E" roughness={0.45} metalness={0.35} />
          </mesh>
          {/* Golden Relic Visor */}
          <mesh position={[0, 0.02, 0.19]}>
            <boxGeometry args={[0.3, 0.09, 0.12]} />
            <meshStandardMaterial
              color="#FFE7A1"
              emissive="#E8B84B"
              emissiveIntensity={1.5}
              metalness={0.4}
              roughness={0.2}
            />
          </mesh>
          {/* Adventurer Hat Brim */}
          <mesh position={[0, 0.17, 0]} rotation={[0.06, 0, 0]}>
            <cylinderGeometry args={[0.42, 0.44, 0.035, 24]} />
            <meshStandardMaterial color="#4A321F" roughness={0.85} />
          </mesh>
          {/* Hat Crown */}
          <mesh position={[0, 0.29, 0]} rotation={[0.06, 0, 0]}>
            <cylinderGeometry args={[0.19, 0.24, 0.22, 20]} />
            <meshStandardMaterial color="#593C25" roughness={0.82} />
          </mesh>
          {/* Gold Hat Band */}
          <mesh position={[0, 0.2, 0]} rotation={[0.06, 0, 0]}>
            <cylinderGeometry args={[0.246, 0.246, 0.05, 20]} />
            <meshStandardMaterial color="#E8C574" metalness={0.88} roughness={0.2} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

/**
 * Full-viewport fixed WebGL stage at z-[25] that hovers the 3D Explorer directly over
 * timeline card pedestals while staying beneath overlapping higher-z chapters & Navbar.
 */
export default function ExplorerCharacter3D({
  timelineBoundsRef,
  anchorRefs,
  targetIndexRef,
  cursorRef,
  reducedMotion,
  onWebGLError,
}) {
  const localCanvasRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (!cursorRef.current) return;
      cursorRef.current.nx = (e.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      cursorRef.current.ny = -((e.clientY / Math.max(window.innerHeight, 1)) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [cursorRef]);

  return (
    <div
      ref={localCanvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-[25] pointer-events-none"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 40, near: 0.1, far: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          if (!gl.getContext()) onWebGLError?.();
        }}
        className="w-full h-full pointer-events-none"
      >
        <ambientLight intensity={0.65} color="#8fb599" />
        <directionalLight position={[5, 8, 8]} intensity={1.85} color="#ffe3a8" />
        <directionalLight position={[-6, -3, 4]} intensity={0.85} color="#B86B35" />
        <Suspense fallback={null}>
          <ExplorerAvatarMesh
            timelineBoundsRef={timelineBoundsRef}
            anchorRefs={anchorRefs}
            targetIndexRef={targetIndexRef}
            cursorRef={cursorRef}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
