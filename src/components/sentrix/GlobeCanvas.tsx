import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { Earth } from './Earth';
import { AttackArcs } from './AttackArcs';
import { CyberAttack } from '@/data/attackData';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface GlobeCanvasProps {
  attacks: CyberAttack[];
  onAttackClick: (attack: CyberAttack) => void;
  selectedAttackId: string | null;
  visible: boolean;
}

function SceneContent({
  attacks,
  onAttackClick,
  selectedAttackId,
}: Omit<GlobeCanvasProps, 'visible'>) {
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    if (controlsRef.current) {
      const targetSpeed = selectedAttackId ? 0.05 : 0.3;
      controlsRef.current.autoRotateSpeed = THREE.MathUtils.lerp(
        controlsRef.current.autoRotateSpeed,
        targetSpeed,
        0.05
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight position={[5, 3, 5]} intensity={0.15} color="#4488ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.05} color="#ff2244" />

      <Stars radius={100} depth={60} count={4000} factor={4} saturation={0} fade speed={0.5} />

      <Suspense fallback={null}>
        <Earth />
        <AttackArcs
          attacks={attacks}
          onAttackClick={onAttackClick}
          selectedId={selectedAttackId}
        />
      </Suspense>

      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
      />
    </>
  );
}

export function GlobeCanvas({ attacks, onAttackClick, selectedAttackId, visible }: GlobeCanvasProps) {
  return (
    <div
      className="absolute inset-0"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 1.5s ease-out' }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#080c18']} />
        <SceneContent
          attacks={attacks}
          onAttackClick={onAttackClick}
          selectedAttackId={selectedAttackId}
        />
      </Canvas>
    </div>
  );
}
