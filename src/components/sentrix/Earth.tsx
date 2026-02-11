import { useRef, useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { GLOBE_RADIUS } from '@/data/attackData';

const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float intensity = pow(0.62 - dot(vNormal, viewDir), 3.0);
    vec3 cyan = vec3(0.0, 0.55, 1.0);
    vec3 red = vec3(0.8, 0.1, 0.2);
    vec3 color = mix(cyan, red, 0.15);
    gl_FragColor = vec4(color, intensity * 1.4);
  }
`;

export function Earth() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightsTexture = useTexture('/textures/earth-lights.png');

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, []);

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#060d1f"
          emissiveMap={lightsTexture}
          emissive="#ffffff"
          emissiveIntensity={3}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Inner atmosphere glow */}
      <mesh scale={[1.015, 1.015, 1.015]}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#003366"
          transparent
          opacity={0.08}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Outer atmosphere */}
      <mesh scale={[1.12, 1.12, 1.12]}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <primitive object={atmosphereMaterial} attach="material" />
      </mesh>
    </group>
  );
}
