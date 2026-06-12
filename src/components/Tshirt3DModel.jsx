import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Builds a smooth, realistic T-shirt shape using Three.js ExtrudeGeometry
// ─────────────────────────────────────────────────────────────────────────────
function createTshirtShape() {
  const shape = new THREE.Shape();

  // The shape is centered around (0,0), top of the shirt near y=2
  // We'll draw it going clockwise starting from left shoulder

  //  LEFT side of body bottom
  shape.moveTo(-1.1, -2.0);

  // Right side of body bottom
  shape.lineTo(1.1, -2.0);

  // Right body up to armpit
  shape.lineTo(1.1, 0.2);

  // Right sleeve horizontal out
  shape.bezierCurveTo(1.1, 0.4, 2.2, 0.6, 2.4, 0.6);

  // Right sleeve tip (top right)
  shape.bezierCurveTo(2.6, 0.6, 2.7, 0.3, 2.6, 0.1);

  // Right sleeve bottom back toward shoulder
  shape.bezierCurveTo(2.4, -0.1, 1.8, -0.1, 1.5, 0.2);

  // Right shoulder slope up
  shape.bezierCurveTo(1.3, 0.4, 1.05, 0.9, 0.95, 1.0);

  // Right neck curve (concave)
  shape.bezierCurveTo(0.85, 1.1, 0.45, 1.3, 0.0, 1.3);

  // Left neck curve (concave) - mirror
  shape.bezierCurveTo(-0.45, 1.3, -0.85, 1.1, -0.95, 1.0);

  // Left shoulder slope up
  shape.bezierCurveTo(-1.05, 0.9, -1.3, 0.4, -1.5, 0.2);

  // Left sleeve bottom
  shape.bezierCurveTo(-1.8, -0.1, -2.4, -0.1, -2.6, 0.1);

  // Left sleeve tip (top left)
  shape.bezierCurveTo(-2.7, 0.3, -2.6, 0.6, -2.4, 0.6);

  // Left sleeve horizontal back in
  shape.bezierCurveTo(-2.2, 0.6, -1.1, 0.4, -1.1, 0.2);

  // Left body down
  shape.lineTo(-1.1, -2.0);

  return shape;
}

// ─────────────────────────────────────────────────────────────────────────────
// Collar hole cutout
// ─────────────────────────────────────────────────────────────────────────────
function createCollarHole() {
  const hole = new THREE.Path();
  hole.absellipse(0, 1.0, 0.38, 0.22, 0, Math.PI * 2, false);
  return hole;
}

// ─────────────────────────────────────────────────────────────────────────────
// The actual 3D Tshirt mesh
// ─────────────────────────────────────────────────────────────────────────────
function TshirtMesh() {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    // Gentle auto-rotation
    group.current.rotation.y += 0.005;
    // Subtle floating bob
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
  });

  const extrudeSettings = useMemo(() => ({
    steps: 1,
    depth: 0.22,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 6,
  }), []);

  const shirtGeometry = useMemo(() => {
    const shape = createTshirtShape();
    shape.holes.push(createCollarHole());
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [extrudeSettings]);

  // KnoWMi brand color: dark near-black with a subtle warm undertone
  const shirtMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.85,
    metalness: 0.05,
  }), []);

  // Subtle fabric grain on the surface using a normal map trick
  const seamMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff5500',
    roughness: 0.6,
    metalness: 0.1,
    emissive: '#ff5500',
    emissiveIntensity: 0.15,
  }), []);

  return (
    <group ref={group} rotation={[0.05, 0, 0]}>
      {/* Main T-shirt body */}
      <mesh geometry={shirtGeometry} material={shirtMaterial} castShadow receiveShadow />

      {/* KnoWMi logo – orange chest print (simple bar as brand mark) */}
      <mesh position={[0, -0.3, 0.27]} castShadow>
        <planeGeometry args={[0.9, 0.08]} />
        <meshStandardMaterial color="#ff5500" roughness={0.4} emissive="#ff5500" emissiveIntensity={0.4} />
      </mesh>
      {/* Second line of logo */}
      <mesh position={[0, -0.44, 0.27]} castShadow>
        <planeGeometry args={[0.5, 0.06]} />
        <meshStandardMaterial color="#ff5500" roughness={0.4} emissive="#ff5500" emissiveIntensity={0.3} />
      </mesh>

      {/* Collar ring */}
      <mesh position={[0, 1.0, 0.12]}>
        <torusGeometry args={[0.32, 0.025, 8, 40, Math.PI]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>

      {/* Bottom hem line */}
      <mesh position={[0, -2.0, 0.12]}>
        <boxGeometry args={[2.2, 0.025, 0.025]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Canvas wrapper
// ─────────────────────────────────────────────────────────────────────────────
export default function Tshirt3DModel() {
  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 6], fov: 42 }}
      >
        {/* Rich multi-point lighting for a premium look */}
        <ambientLight intensity={0.4} />

        {/* Key light - warm front */}
        <directionalLight
          position={[3, 5, 5]}
          intensity={2.5}
          color="#fff8f0"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Fill light - cool left */}
        <directionalLight position={[-4, 2, 2]} intensity={0.6} color="#c0d0ff" />
        {/* Rim light - orange glow from behind */}
        <directionalLight position={[0, -2, -5]} intensity={1.2} color="#ff6600" />
        {/* Top bounce */}
        <pointLight position={[0, 8, 0]} intensity={0.5} color="#ffffff" />

        <TshirtMesh />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
}
