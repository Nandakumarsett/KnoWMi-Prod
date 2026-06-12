import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function BlockyShirt() {
  const group = useRef();
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={group}>
      {/* Torso */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 3, 0.8]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
        
        {/* Safe text placeholder box */}
        <mesh position={[0, 0.5, 0.41]}>
          <planeGeometry args={[1.5, 0.2]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Back QR placeholder box */}
        <mesh position={[0, 0, -0.41]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial color="#ff5500" />
        </mesh>
      </mesh>

      {/* Left Sleeve */}
      <mesh position={[-1.4, 0.5, 0]} rotation={[0, 0, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1, 0.8]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>

      {/* Right Sleeve */}
      <mesh position={[1.4, 0.5, 0]} rotation={[0, 0, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1, 0.8]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
    </group>
  );
}

export default function Tshirt3DModel() {
  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={2} />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* We removed Suspense and async hooks so this renders immediately */}
        <BlockyShirt />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
        />
      </Canvas>
    </div>
  );
}
