'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Planet from './Planet';
import ChatInterface from './ChatInterface';
import { Html } from '@react-three/drei';

interface CelestialEntity {
  id: string;
  name: string;
  type: string;
  color: string;
  position: [number, number, number];
  size: number;
  entityType: 'planet';
}

// Responsive planet positioning based on screen size
const getResponsivePlanetPositions = (screenSize: 'mobile' | 'tablet' | 'desktop') => {
  const baseDistance = screenSize === 'mobile' ? 4 : screenSize === 'tablet' ? 5 : 6;
  const heightOffset = screenSize === 'mobile' ? 0.5 : 0;
  
  return [
    // Terra Nova - at 0° (top) - Blue terrestrial world
    { id: 'terra-nova', position: [0, heightOffset, -baseDistance] as [number, number, number], size: screenSize === 'mobile' ? 0.6 : screenSize === 'tablet' ? 0.7 : 0.8, color: '#4A90E2', type: 'terrestrial', name: 'Terra Nova', entityType: 'planet' as const },
    
    // Crystal Peak - at 72° (top-right) - Pink crystalline world
    { id: 'crystal-peak', position: [baseDistance * 0.95, heightOffset, -baseDistance * 0.31] as [number, number, number], size: screenSize === 'mobile' ? 0.8 : screenSize === 'tablet' ? 0.9 : 1.0, color: '#FF69B4', type: 'crystalline', name: 'Crystal Peak', entityType: 'planet' as const },
    
    // Cryo Sphere - at 144° (bottom-right) - Ice world
    { id: 'cryo-sphere', position: [baseDistance * 0.59, heightOffset, baseDistance * 0.81] as [number, number, number], size: screenSize === 'mobile' ? 0.4 : screenSize === 'tablet' ? 0.5 : 0.6, color: '#87CEEB', type: 'ice', name: 'Cryo Sphere', entityType: 'planet' as const },
    
    // Marina Deep - at 216° (bottom-left) - Ocean world
    { id: 'marina-deep', position: [-baseDistance * 0.59, heightOffset, baseDistance * 0.81] as [number, number, number], size: screenSize === 'mobile' ? 0.7 : screenSize === 'tablet' ? 0.8 : 0.9, color: '#20B2AA', type: 'ocean', name: 'Marina Deep', entityType: 'planet' as const },
    
    // Sahara Sands - at 288° (top-left) - Desert world
    { id: 'sahara-sands', position: [-baseDistance * 0.95, heightOffset, -baseDistance * 0.31] as [number, number, number], size: screenSize === 'mobile' ? 0.5 : screenSize === 'tablet' ? 0.6 : 0.7, color: '#DAA520', type: 'desert', name: 'Sahara Sands', entityType: 'planet' as const },
  ];
};

// Custom camera controller component with enhanced zoom and orbit functionality
function CameraController({ 
  targetPosition, 
  isZooming, 
  isChatOpen,
  screenSize
}: { 
  targetPosition: [number, number, number] | null, 
  isZooming: boolean,
  isChatOpen: boolean,
  screenSize: 'mobile' | 'tablet' | 'desktop'
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const orbitAngleRef = useRef(0);
  const zoomProgressRef = useRef(0);
  const initialCameraPositionRef = useRef<THREE.Vector3 | null>(null);
  const initialTargetRef = useRef<THREE.Vector3 | null>(null);
  const baseOrbitPositionRef = useRef<THREE.Vector3 | null>(null);
  
  // Responsive camera settings
  const getResponsiveCameraSettings = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          maxDistance: isChatOpen ? 4 : 30,
          minDistance: isChatOpen ? 1.2 : 2,
          zoomDistance: 1.8,
          orbitHeight: 1.0
        };
      case 'tablet':
        return {
          maxDistance: isChatOpen ? 5 : 40,
          minDistance: isChatOpen ? 1.5 : 2.5,
          zoomDistance: 2.2,
          orbitHeight: 1.1
        };
      default: // desktop
        return {
          maxDistance: isChatOpen ? 6 : 50,
          minDistance: isChatOpen ? 1.8 : 3,
          zoomDistance: 2.5,
          orbitHeight: 1.2
        };
    }
  };
  
  const cameraSettings = getResponsiveCameraSettings();
  
  useFrame((state) => {
    if (isZooming && targetPosition && controlsRef.current) {
      const target = new THREE.Vector3(...targetPosition);
      
      // Store initial positions on first zoom
      if (initialCameraPositionRef.current === null) {
        initialCameraPositionRef.current = camera.position.clone();
        initialTargetRef.current = controlsRef.current.target.clone();
        zoomProgressRef.current = 0;
        orbitAngleRef.current = 0;
      }
      
      // Much more gradual zoom progress - slowed down significantly
      zoomProgressRef.current = Math.min(zoomProgressRef.current + 0.003, 1); // Reduced from 0.008 to 0.003 for much smoother zoom
      
      // Calculate zoom distance based on planet size and screen size
      const planetSize = getResponsivePlanetPositions(screenSize).find(e => 
        e.position[0] === targetPosition[0] && 
        e.position[1] === targetPosition[1] && 
        e.position[2] === targetPosition[2]
      )?.size || 0.8;
      const zoomDistance = cameraSettings.zoomDistance + (planetSize * 0.8); // Reduced multiplier from 1.5 to 0.8 for closer zoom
      
      // Calculate camera position for zoom - much closer to planet
      const zoomCameraPosition = target.clone().add(new THREE.Vector3(0, cameraSettings.orbitHeight * 0.7, zoomDistance * 0.6)); // Closer and lower
      
      // Smooth camera movement to zoom position with easing
      if (initialCameraPositionRef.current) {
        // Use easing function for smoother transition
        const easedProgress = 1 - Math.pow(1 - zoomProgressRef.current, 4); // Changed from cubic to quartic for even smoother easing
        camera.position.lerpVectors(initialCameraPositionRef.current, zoomCameraPosition, easedProgress);
        controlsRef.current.target.lerpVectors(initialTargetRef.current!, target, easedProgress);
      }
      
      // Once zoomed in and chat is open, maintain close position with some movement
      if (zoomProgressRef.current >= 1 && isChatOpen) {
        // Store base orbit position if not set
        if (baseOrbitPositionRef.current === null) {
          baseOrbitPositionRef.current = camera.position.clone();
        }
        
        // Allow very slow automatic orbiting
        orbitAngleRef.current += 0.003; // Even slower rotation
        
        const orbitRadius = zoomDistance;
        const orbitHeight = cameraSettings.orbitHeight;
        
        // Calculate base orbit position
        const orbitX = target.x + Math.cos(orbitAngleRef.current) * orbitRadius;
        const orbitZ = target.z + Math.sin(orbitAngleRef.current) * orbitRadius;
        const orbitY = target.y + orbitHeight;
        
        const baseOrbitPosition = new THREE.Vector3(orbitX, orbitY, orbitZ);
        baseOrbitPositionRef.current = baseOrbitPosition;
        
        // Keep camera close to base orbit position but allow some drift
        camera.position.lerp(baseOrbitPosition, 0.01); // Very gentle pull back to base position
        controlsRef.current.target.lerp(target, 0.02);
        
        // Enable limited controls but with constraints
        controlsRef.current.enablePan = true;
        controlsRef.current.enableZoom = true;
        controlsRef.current.enableRotate = true;
        
        // Constrain movement to stay close to planet
        const distanceFromTarget = camera.position.distanceTo(target);
        const maxDistance = zoomDistance * 1.5; // Allow some movement but not too far
        
        if (distanceFromTarget > maxDistance) {
          // Pull camera back towards planet if it gets too far
          const direction = camera.position.clone().sub(target).normalize();
          const constrainedPosition = target.clone().add(direction.multiplyScalar(maxDistance));
          camera.position.lerp(constrainedPosition, 0.1);
        }
        
        // Keep minimum distance
        const minDistance = zoomDistance * 0.8;
        if (distanceFromTarget < minDistance) {
          const direction = camera.position.clone().sub(target).normalize();
          const constrainedPosition = target.clone().add(direction.multiplyScalar(minDistance));
          camera.position.lerp(constrainedPosition, 0.1);
        }
      }
    } else {
      // Reset when not zooming
      if (initialCameraPositionRef.current !== null) {
        initialCameraPositionRef.current = null;
        initialTargetRef.current = null;
        baseOrbitPositionRef.current = null;
        zoomProgressRef.current = 0;
        orbitAngleRef.current = 0;
        
        // Re-enable full controls
        if (controlsRef.current) {
          controlsRef.current.enablePan = true;
          controlsRef.current.enableZoom = true;
          controlsRef.current.enableRotate = true;
        }
      }
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      maxDistance={cameraSettings.maxDistance}
      minDistance={cameraSettings.minDistance}
      dampingFactor={0.05}
      enableDamping={true}
    />
  );
}

function SpaceEnvironment({ 
  onEntityClick, 
  screenSize 
}: { 
  onEntityClick: (entity: CelestialEntity) => void;
  screenSize: 'mobile' | 'tablet' | 'desktop';
}) {
  const groupRef = useRef<THREE.Group>(null);
  const celestialEntities = getResponsivePlanetPositions(screenSize);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Get planet positions for laser battle
  const planetPositions = celestialEntities.reduce((acc, p) => {
    acc[p.name] = p.position;
    return acc;
  }, {} as { [key: string]: [number, number, number] });

  return (
    <group ref={groupRef}>
      {celestialEntities.map((entity) => (
        <Planet
          key={entity.id}
          position={entity.position}
          size={entity.size}
          color={entity.color}
          type={entity.type}
          name={entity.name}
          entityType={entity.entityType}
          onPlanetClick={() => onEntityClick(entity)}
        />
      ))}
      
      {/* Planet Name Labels */}
      {celestialEntities.map((entity) => (
        <PlanetNameLabel
          key={`label-${entity.id}`}
          position={entity.position}
          name={entity.name}
          color={entity.color}
          size={entity.size}
        />
      ))}
      
      {/* Laser battle between Crystal Peak and Sahara Sands - now inside the rotating group */}
      <PlanetLaserBattle planetPositions={planetPositions} />
    </group>
  );
}

// Cool planet name label component
function PlanetNameLabel({ position, name, color, size }: { 
  position: [number, number, number]; 
  name: string; 
  color: string; 
  size: number;
}) {
  const [hovered, setHovered] = useState(false);
  const labelRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (labelRef.current) {
      // More responsive positioning - directly follow the planet
      const targetY = position[1] + size + 0.5;
      const currentY = labelRef.current.position.y;
      
      // Smooth but responsive follow with higher lerp factor
      labelRef.current.position.y = THREE.MathUtils.lerp(currentY, targetY, 0.15); // Increased from 0.1 to 0.15
      
      // Keep X and Z positions tightly coupled to planet
      labelRef.current.position.x = position[0];
      labelRef.current.position.z = position[2];
      
      // Gentle rotation that follows planet movement
      labelRef.current.rotation.y = state.clock.elapsedTime * 0.05; // Reduced rotation speed
    }
  });

  return (
    <group 
      ref={labelRef}
      position={[position[0], position[1] + size + 0.5, position[2]]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Text label */}
      <Html
        center
        position={[0, 0, 0.1]}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <div
          className={`transition-all duration-200 ${
            hovered ? 'scale-110 opacity-100' : 'scale-100 opacity-60'
          }`}
          style={{
            color: color,
            textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            fontFamily: 'monospace',
            fontSize: '12px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: `linear-gradient(45deg, ${color}20, transparent)`,
            padding: '4px 8px',
            borderRadius: '4px',
            border: `1px solid ${color}40`,
            backdropFilter: 'blur(4px)'
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

function PlanetLaserBattle({ planetPositions }: { planetPositions: { [key: string]: [number, number, number] } }) {
  const groupRef = useRef<THREE.Group>(null);
  const [laserPhase, setLaserPhase] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // Debug: log planet positions
  console.log('PlanetLaserBattle - Planet positions:', planetPositions);

  // Animation: continuous periodic laser firing
  useFrame((state) => {
    if (startTimeRef.current === null) startTimeRef.current = state.clock.getElapsedTime();
    const elapsed = (state.clock.getElapsedTime() - startTimeRef.current) * 1000;
    
    // Laser firing phases - every 800ms, continuous
    const laserTime = elapsed % 800;
    setLaserPhase(laserTime / 800);
  });

  // Get planet positions - now static since we rotate with the group
  const crystal = planetPositions['Crystal Peak'];
  const sahara = planetPositions['Sahara Sands'];
  
  console.log('Crystal Peak position:', crystal, 'Sahara Sands position:', sahara);
  
  if (!crystal || !sahara) {
    console.log('Missing planet positions, not rendering lasers');
    return null;
  }

  // Flicker effect for continuous animation
  const flicker = Math.sin(laserPhase * Math.PI * 20) * 0.3 + 0.7;
  
  // Offensive vs Defensive dynamics
  // Crystal Peak (OFFENSIVE/WINNING) - fires first, longer bursts, more aggressive
  const offensivePhase = laserPhase < 0.35; // 35% of cycle for offensive (reduced from 40%)
  const offensiveIntensity = offensivePhase ? Math.sin(laserPhase * Math.PI * 8) * 0.6 + 0.4 : 0;
  
  // Sahara Sands (DEFENSIVE/LOSING) - fires second, but with more frequent and longer counter-attacks
  const defensivePhase = laserPhase > 0.4 && laserPhase < 0.8; // 40% of cycle for defensive (increased from 20%)
  const defensiveIntensity = defensivePhase ? Math.sin((laserPhase - 0.4) * Math.PI * 6) * 0.5 + 0.5 : 0;

  // Calculate laser path points between planet cores
  const createLaserPath = (from: [number, number, number], to: [number, number, number]) => {
    // Connect directly from core to core - no offsets
    const start = [from[0], from[1], from[2]];
    const end = [to[0], to[1], to[2]];
    
    // Create curved path with multiple points
    const points = [];
    const segments = 15; // Increased segments for smoother curves
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = start[0] + (end[0] - start[0]) * t;
      const y = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.5; // Increased curve
      const z = start[2] + (end[2] - start[2]) * t;
      points.push(x, y, z);
    }
    
    return points;
  };

  // Calculate offset laser path for parallel beams
  const createOffsetLaserPath = (from: [number, number, number], to: [number, number, number], offset: [number, number, number] = [0.2, 0.1, 0.2]) => {
    const start = [from[0] + offset[0], from[1] + offset[1], from[2] + offset[2]];
    const end = [to[0] + offset[0], to[1] + offset[1], to[2] + offset[2]];
    
    // Create curved path with multiple points
    const points = [];
    const segments = 15;
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = start[0] + (end[0] - start[0]) * t;
      const y = start[1] + (end[1] - start[1]) * t + Math.sin(t * Math.PI) * 0.5;
      const z = start[2] + (end[2] - start[2]) * t;
      points.push(x, y, z);
    }
    
    return points;
  };

  return (
    <group ref={groupRef}>
      {/* Crystal Peak fires multiple pink lasers at Sahara Sands */}
      {offensivePhase && (
        <>
          {/* Core beam - massive and bright */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createLaserPath(crystal, sahara))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff69b4" 
              transparent 
              opacity={flicker * offensiveIntensity}
              linewidth={20}
            />
          </line>
          
          {/* Outer glow layer 1 */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createLaserPath(crystal, sahara))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff1493" 
              transparent 
              opacity={flicker * offensiveIntensity * 0.7}
              linewidth={25}
            />
          </line>
          
          {/* Outer glow layer 2 */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createLaserPath(crystal, sahara))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff007f" 
              transparent 
              opacity={flicker * offensiveIntensity * 0.5}
              linewidth={30}
            />
          </line>
          
          {/* Energy particles along the beam */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh 
              key={i}
              position={[
                crystal[0] + (sahara[0] - crystal[0]) * (i / 8),
                crystal[1] + (sahara[1] - crystal[1]) * (i / 8) + Math.sin((i / 8) * Math.PI) * 0.5,
                crystal[2] + (sahara[2] - crystal[2]) * (i / 8)
              ]}
            >
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial 
                color="#ff69b4" 
                transparent 
                opacity={offensiveIntensity * 0.8}
              />
            </mesh>
          ))}
          
          {/* Offset parallel laser beam for Crystal Peak */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createOffsetLaserPath(crystal, sahara, [-0.25, -0.1, -0.25]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff1493" 
              transparent 
              opacity={flicker * offensiveIntensity * 0.9}
              linewidth={18}
            />
          </line>
          
          {/* Energy particles along the offset beam */}
          {Array.from({ length: 7 }, (_, i) => (
            <mesh 
              key={`crystal-offset-${i}`}
              position={[
                crystal[0] - 0.25 + (sahara[0] - 0.25 - (crystal[0] - 0.25)) * (i / 7),
                crystal[1] - 0.1 + (sahara[1] - 0.1 - (crystal[1] - 0.1)) * (i / 7) + Math.sin((i / 7) * Math.PI) * 0.5,
                crystal[2] - 0.25 + (sahara[2] - 0.25 - (crystal[2] - 0.25)) * (i / 7)
              ]}
            >
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshBasicMaterial 
                color="#ff1493" 
                transparent 
                opacity={offensiveIntensity * 0.75}
              />
            </mesh>
          ))}
          
          {/* Impact effect at Sahara Sands core - much bigger */}
          <mesh position={[sahara[0], sahara[1], sahara[2]]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial 
              color="#ff69b4" 
              transparent 
              opacity={offensiveIntensity * 0.7}
            />
          </mesh>
          
          {/* Impact glow */}
          <mesh position={[sahara[0], sahara[1], sahara[2]]}>
            <sphereGeometry args={[1.2, 16, 16]} />
            <meshBasicMaterial 
              color="#ff1493" 
              transparent 
              opacity={offensiveIntensity * 0.4}
            />
          </mesh>
        </>
      )}
      
      {/* Sahara Sands fires multiple orange lasers at Crystal Peak */}
      {defensivePhase && (
        <>
          {/* Core beam - massive and bright */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createLaserPath(sahara, crystal))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff6b35" 
              transparent 
              opacity={flicker * defensiveIntensity}
              linewidth={18}
            />
          </line>
          
          {/* Outer glow layer 1 */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createLaserPath(sahara, crystal))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff8c42" 
              transparent 
              opacity={flicker * defensiveIntensity * 0.7}
              linewidth={23}
            />
          </line>
          
          {/* Outer glow layer 2 */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createLaserPath(sahara, crystal))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff4500" 
              transparent 
              opacity={flicker * defensiveIntensity * 0.5}
              linewidth={28}
            />
          </line>
          
          {/* Energy particles along the beam */}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh 
              key={i}
              position={[
                sahara[0] + (crystal[0] - sahara[0]) * (i / 8),
                sahara[1] + (crystal[1] - sahara[1]) * (i / 8) + Math.sin((i / 8) * Math.PI) * 0.5,
                sahara[2] + (crystal[2] - sahara[2]) * (i / 8)
              ]}
            >
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial 
                color="#ff6b35" 
                transparent 
                opacity={defensiveIntensity * 0.8}
              />
            </mesh>
          ))}
          
          {/* Additional counter-attack beams for more firepower */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createLaserPath(sahara, crystal))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff6347" 
              transparent 
              opacity={flicker * defensiveIntensity * 0.6}
              linewidth={15}
            />
          </line>
          
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createLaserPath(sahara, crystal))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff4500" 
              transparent 
              opacity={flicker * defensiveIntensity * 0.4}
              linewidth={12}
            />
          </line>
          
          {/* Offset parallel laser beam */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={16}
                array={new Float32Array(createOffsetLaserPath(sahara, crystal, [0.3, 0.15, 0.3]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial 
              color="#ff6b35" 
              transparent 
              opacity={flicker * defensiveIntensity * 0.8}
              linewidth={16}
            />
          </line>
          
          {/* Energy particles along the offset beam */}
          {Array.from({ length: 6 }, (_, i) => (
            <mesh 
              key={`offset-${i}`}
              position={[
                sahara[0] + 0.3 + (crystal[0] + 0.3 - (sahara[0] + 0.3)) * (i / 6),
                sahara[1] + 0.15 + (crystal[1] + 0.15 - (sahara[1] + 0.15)) * (i / 6) + Math.sin((i / 6) * Math.PI) * 0.5,
                sahara[2] + 0.3 + (crystal[2] + 0.3 - (sahara[2] + 0.3)) * (i / 6)
              ]}
            >
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshBasicMaterial 
                color="#ff6b35" 
                transparent 
                opacity={defensiveIntensity * 0.7}
              />
            </mesh>
          ))}
          
          {/* Impact effect at Crystal Peak core - much bigger */}
          <mesh position={[crystal[0], crystal[1], crystal[2]]}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshBasicMaterial 
              color="#ff6b35" 
              transparent 
              opacity={defensiveIntensity * 0.7}
            />
          </mesh>
          
          {/* Impact glow */}
          <mesh position={[crystal[0], crystal[1], crystal[2]]}>
            <sphereGeometry args={[1.0, 16, 16]} />
            <meshBasicMaterial 
              color="#ff8c42" 
              transparent 
              opacity={defensiveIntensity * 0.4}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export default function SpaceScene() {
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedEntity, setSelectedEntity] = useState<CelestialEntity | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null);
  const [isZooming, setIsZooming] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Responsive screen size detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive camera settings
  const getResponsiveCameraConfig = () => {
    switch (screenSize) {
      case 'mobile':
        return { position: [0, 2, 12] as [number, number, number], fov: 70 };
      case 'tablet':
        return { position: [0, 2.5, 15] as [number, number, number], fov: 72 };
      default: // desktop
        return { position: [0, 3, 17] as [number, number, number], fov: 75 };
    }
  };

  const handleEntityClick = (entityData: CelestialEntity) => {
    setSelectedEntity(entityData);
    setIsChatOpen(true);
    
    // Set target position for camera zoom
    setTargetPosition(entityData.position);
    setIsZooming(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setSelectedEntity(null);
    
    // Reset camera zoom
    setIsZooming(false);
    setTargetPosition(null);
  };

  const cameraConfig = getResponsiveCameraConfig();

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={cameraConfig}
        style={{ background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e, #16213e)' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[30, 20, 20]} intensity={0.8} />
        <pointLight position={[-30, -20, -20]} intensity={0.6} />
        
        <Stars 
          radius={screenSize === 'mobile' ? 100 : screenSize === 'tablet' ? 120 : 150} 
          depth={screenSize === 'mobile' ? 30 : screenSize === 'tablet' ? 40 : 50} 
          count={screenSize === 'mobile' ? 3000 : screenSize === 'tablet' ? 4000 : 5000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={1}
        />
        
        <SpaceEnvironment onEntityClick={handleEntityClick} screenSize={screenSize} />
        
        <CameraController 
          targetPosition={targetPosition} 
          isZooming={isZooming} 
          isChatOpen={isChatOpen}
          screenSize={screenSize}
        />
      </Canvas>

      {/* Chat Interface - Now outside Canvas context */}
      {selectedEntity && (
        <ChatInterface
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          planetName={selectedEntity.name}
          planetType={selectedEntity.type}
          planetColor={selectedEntity.color}
          entityType={selectedEntity.entityType}
          screenSize={screenSize}
        />
      )}

      {/* Responsive Instructions Overlay */}
      {showInstructions && (
        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm border border-purple-500/30 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-purple-300 text-xs sm:text-sm">
              <span className="text-purple-400 font-semibold">✨ Interactive Space Experience:</span> 
              <span className="hidden sm:inline"> Click on any planet to chat with its consciousness</span>
              <span className="sm:hidden"> Tap any planet to chat</span>
            </p>
            <p className="text-purple-200 text-xs mt-1 hidden sm:block">
              Explore the 5 unique planets: Terra Nova (Blue), Crystal Peak (Pink), Cryo Sphere (Ice), Marina Deep (Ocean), Sahara Sands (Desert)
            </p>
            <p className="text-purple-200 text-xs mt-1 sm:hidden">
              Explore 5 unique planets with distinct personalities
            </p>
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 