import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Decal, useTexture, Environment } from '@react-three/drei';
import * as THREE from 'three';

// A procedural "Blocky" T-shirt model since we don't have a .glb yet.
// Once you get a custom .glb, you can use the useGLTF hook from '@react-three/drei' to load it here!
function BlockyShirt() {
  const group = useRef();
  
  // Slowly rotate the shirt automatically
  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.2;
  });

  // Load the QR code texture for the back
  const qrTexture = useTexture('/assets/scrolly/qr_code_glow.png');

  return (
    <group ref={group}>
      {/* Torso */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 3, 0.8]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
        
        {/* Front Motivational Text */}
        <Text 
          position={[0, 0.5, 0.41]} 
          fontSize={0.25} 
          color="#ffffff" 
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2"
          anchorX="center" 
          anchorY="middle"
          maxWidth={1.8}
          textAlign="center"
        >
          WORK HARD. STAY HUMBLE.
        </Text>

        {/* Back QR Code & Logo (Decal) */}
        <Decal 
          position={[0, 0, -0.41]} 
          rotation={[0, Math.PI, 0]} 
          scale={[1.5, 1.5, 1.5]}
        >
          <meshStandardMaterial 
            map={qrTexture} 
            transparent 
            polygonOffset 
            polygonOffsetFactor={-1} 
          />
        </Decal>
      </mesh>

      {/* Left Sleeve */}
      <mesh position={[-1.4, 0.5, 0]} rotation={[0, 0, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1, 0.8]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      {/* Right Sleeve */}
      <mesh position={[1.4, 0.5, 0]} rotation={[0, 0, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 1, 0.8]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>
    </group>
  );
}

export default function Tshirt3DModel() {
  return (
    <div className="w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
        
        <BlockyShirt />
        
        <Environment preset="city" />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
