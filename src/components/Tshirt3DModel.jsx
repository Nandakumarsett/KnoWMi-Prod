import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Proper T-shirt silhouette with wide sleeves, using ExtrudeGeometry
// ─────────────────────────────────────────────────────────────────────────────
function createTshirtShape() {
  const shape = new THREE.Shape();

  // Start at bottom-left, draw counter-clockwise
  // Body is 2.4 wide, 2.8 tall. Sleeves extend to ±3.4

  // Bottom left
  shape.moveTo(-1.2, -2.2);
  // Bottom right
  shape.lineTo(1.2, -2.2);
  // Up right body side
  shape.lineTo(1.2, 0.0);

  // ---- Right sleeve ----
  // Armpit curve outward
  shape.bezierCurveTo(1.2, 0.3, 1.6, 0.6, 2.0, 0.8);
  // Sleeve outer top-right corner
  shape.bezierCurveTo(2.5, 0.9, 3.2, 0.85, 3.4, 0.6);
  // Sleeve tip
  shape.bezierCurveTo(3.55, 0.45, 3.5, 0.1, 3.3, -0.05);
  // Sleeve bottom curve back in
  shape.bezierCurveTo(3.0, -0.25, 2.3, -0.2, 1.9, 0.0);
  // Back to body armpit
  shape.bezierCurveTo(1.55, 0.2, 1.2, 0.15, 1.2, 0.0);

  // Up to right shoulder
  shape.lineTo(1.2, 0.0);
  shape.bezierCurveTo(1.15, 0.55, 0.9, 1.05, 0.75, 1.2);

  // ---- Neck (crew neck) ----
  shape.bezierCurveTo(0.55, 1.35, 0.3, 1.45, 0.0, 1.45);
  shape.bezierCurveTo(-0.3, 1.45, -0.55, 1.35, -0.75, 1.2);

  // Left shoulder
  shape.bezierCurveTo(-0.9, 1.05, -1.15, 0.55, -1.2, 0.0);

  // ---- Left sleeve (mirror of right) ----
  shape.bezierCurveTo(-1.2, 0.15, -1.55, 0.2, -1.9, 0.0);
  shape.bezierCurveTo(-2.3, -0.2, -3.0, -0.25, -3.3, -0.05);
  shape.bezierCurveTo(-3.5, 0.1, -3.55, 0.45, -3.4, 0.6);
  shape.bezierCurveTo(-3.2, 0.85, -2.5, 0.9, -2.0, 0.8);
  shape.bezierCurveTo(-1.6, 0.6, -1.2, 0.3, -1.2, 0.0);

  // Back down to start
  shape.lineTo(-1.2, -2.2);

  return shape;
}

// Crew-neck hole cutout
function createCollarHole() {
  const hole = new THREE.Path();
  hole.absellipse(0, 1.2, 0.55, 0.28, 0, Math.PI * 2, false);
  return hole;
}

// ─────────────────────────────────────────────────────────────────────────────
// The T-shirt mesh
// ─────────────────────────────────────────────────────────────────────────────
function TshirtMesh() {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y += 0.004;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.06;
  });

  const shirtGeometry = useMemo(() => {
    const shape = createTshirtShape();
    shape.holes.push(createCollarHole());
    return new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 8,
    });
  }, []);

  // Visible charcoal — clearly different from the black bg
  const shirtMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#3a3a3a',
    roughness: 0.9,
    metalness: 0.0,
  }), []);

  const orangeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff5500',
    roughness: 0.5,
    emissive: '#ff5500',
    emissiveIntensity: 0.5,
  }), []);

  const collarMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#4a4a4a',
    roughness: 0.95,
  }), []);

  return (
    <group ref={group} position={[0, -0.3, 0]}>
      {/* Main shirt body */}
      <mesh geometry={shirtGeometry} material={shirtMat} castShadow receiveShadow />

      {/* Chest orange accent stripe */}
      <mesh position={[0, -0.4, 0.36]} castShadow>
        <planeGeometry args={[1.0, 0.07]} />
        <primitive object={orangeMat} />
      </mesh>
      <mesh position={[0, -0.54, 0.36]} castShadow>
        <planeGeometry args={[0.55, 0.05]} />
        <primitive object={orangeMat} />
      </mesh>

      {/* Collar rim */}
      <mesh position={[0, 1.22, 0.15]}>
        <torusGeometry args={[0.48, 0.03, 8, 48, Math.PI]} />
        <primitive object={collarMat} />
      </mesh>

      {/* Left sleeve cuff band */}
      <mesh position={[-3.3, 0.25, 0.15]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.15, 0.5, 0.02]} />
        <primitive object={collarMat} />
      </mesh>

      {/* Right sleeve cuff band */}
      <mesh position={[3.3, 0.25, 0.15]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.15, 0.5, 0.02]} />
        <primitive object={collarMat} />
      </mesh>

      {/* Bottom hem strip */}
      <mesh position={[0, -2.22, 0.15]}>
        <boxGeometry args={[2.4, 0.03, 0.03]} />
        <primitive object={collarMat} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Tshirt3DModel() {
  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.5, 8.5], fov: 38 }}
      >
        {/* Strong ambient so dark shirt is clearly visible */}
        <ambientLight intensity={1.2} />

        {/* Bright front key light */}
        <directionalLight position={[2, 4, 6]} intensity={3} color="#ffffff" castShadow />
        {/* Left rim */}
        <directionalLight position={[-5, 2, 2]} intensity={1.0} color="#ddeeff" />
        {/* Orange backlight glow — brand signature */}
        <pointLight position={[0, 0, -4]} intensity={2.0} color="#ff5500" />
        {/* Top fill */}
        <pointLight position={[0, 6, 3]} intensity={0.8} color="#fffbe8" />

        <TshirtMesh />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>
    </div>
  );
}
