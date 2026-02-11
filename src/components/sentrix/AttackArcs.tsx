import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CyberAttack, getThreatColorHex, latLonToVector3, GLOBE_RADIUS } from '@/data/attackData';

interface AttackArcsProps {
  attacks: CyberAttack[];
  onAttackClick: (attack: CyberAttack) => void;
  selectedId: string | null;
}

interface ArcProps {
  attack: CyberAttack;
  onClick: (attack: CyberAttack) => void;
  dimmed: boolean;
  onComplete: (id: string) => void;
}

function SingleArc({ attack, onClick, dimmed, onComplete }: ArcProps) {
  const progressRef = useRef(0);
  const fadeRef = useRef(1);
  const completedRef = useRef(false);
  const packetRef = useRef<THREE.Mesh>(null);
  const arcMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const packetMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const originRef = useRef<THREE.Mesh>(null);
  const targetMarkerRef = useRef<THREE.Mesh>(null);

  const { curve, color, points } = useMemo(() => {
    const s = latLonToVector3(attack.sourceCoords.lat, attack.sourceCoords.lon, GLOBE_RADIUS);
    const e = latLonToVector3(attack.targetCoords.lat, attack.targetCoords.lon, GLOBE_RADIUS);
    const startV = new THREE.Vector3(s.x, s.y, s.z);
    const endV = new THREE.Vector3(e.x, e.y, e.z);

    const mid = new THREE.Vector3().addVectors(startV, endV).multiplyScalar(0.5);
    const dist = startV.distanceTo(endV);
    const altitude = GLOBE_RADIUS + 0.15 + dist * 0.2;
    mid.normalize().multiplyScalar(altitude);

    const c = new THREE.QuadraticBezierCurve3(startV, mid, endV);
    const col = getThreatColorHex(attack.threatLevel);
    const pts = c.getPoints(50);
    return { curve: c, color: col, points: pts };
  }, [attack]);

  const speed = useMemo(() => 0.15 + Math.random() * 0.15, []);

  useFrame((_, delta) => {
    if (!completedRef.current) {
      progressRef.current += delta * speed;
      if (progressRef.current >= 1) {
        completedRef.current = true;
      }
    } else {
      fadeRef.current -= delta * 0.4;
      if (fadeRef.current <= 0) {
        onComplete(attack.id);
        return;
      }
    }

    const opacity = fadeRef.current * (dimmed ? 0.1 : 0.55);

    if (arcMaterialRef.current) {
      arcMaterialRef.current.opacity = opacity;
    }

    if (packetRef.current && !completedRef.current) {
      const pos = curve.getPoint(progressRef.current);
      packetRef.current.position.copy(pos);
      if (packetMaterialRef.current) {
        packetMaterialRef.current.opacity = dimmed ? 0.2 : 1;
      }
    } else if (packetRef.current && completedRef.current) {
      if (packetMaterialRef.current) {
        packetMaterialRef.current.opacity = fadeRef.current * (dimmed ? 0.1 : 0.6);
      }
    }

    // Pulse origin marker
    if (originRef.current) {
      const scale = 1 + Math.sin(Date.now() * 0.005) * 0.3;
      originRef.current.scale.setScalar(scale);
    }
  });

  const startPos = points[0];
  const endPos = points[points.length - 1];

  return (
    <group>
      {/* Arc tube */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(attack);
        }}
      >
        <tubeGeometry args={[curve, 50, 0.006, 6, false]} />
        <meshBasicMaterial
          ref={arcMaterialRef}
          color={color}
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Wider invisible hit area */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick(attack);
        }}
      >
        <tubeGeometry args={[curve, 20, 0.04, 4, false]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Moving packet */}
      <mesh ref={packetRef} position={[startPos.x, startPos.y, startPos.z]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial
          ref={packetMaterialRef}
          color={0xffffff}
          transparent
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Origin marker */}
      <mesh ref={originRef} position={[startPos.x, startPos.y, startPos.z]}>
        <sphereGeometry args={[0.015, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Target marker */}
      <mesh ref={targetMarkerRef} position={[endPos.x, endPos.y, endPos.z]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export function AttackArcs({ attacks, onAttackClick, selectedId }: AttackArcsProps) {
  return (
    <group>
      {attacks.map((attack) => (
        <SingleArc
          key={attack.id}
          attack={attack}
          onClick={onAttackClick}
          dimmed={selectedId !== null && selectedId !== attack.id}
          onComplete={() => {}} // Parent handles lifecycle
        />
      ))}
    </group>
  );
}
