'use client';

import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlanetProps {
  position: [number, number, number];
  size: number;
  color: string;
  type?: string;
  name: string;
  entityType?: 'planet' | 'star' | 'nebula' | 'asteroid' | 'blackhole' | 'comet';
  onPlanetClick?: () => void;
}

// Utility to generate a canvas-based texture for different entity types
function useEntityTexture(entityType: string, type: string, color: string, size: number) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    if (entityType === 'star') {
      // Star texture - bright center with rays
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.1, color);
      grad.addColorStop(0.3, color);
      grad.addColorStop(0.7, color + '80');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add star rays
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x1 = 256 + Math.cos(angle) * 50;
        const y1 = 256 + Math.sin(angle) * 50;
        const x2 = 256 + Math.cos(angle) * 200;
        const y2 = 256 + Math.sin(angle) * 200;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    } else if (entityType === 'nebula') {
      // Nebula texture - swirling clouds
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, color + 'FF');
      grad.addColorStop(0.3, color + 'CC');
      grad.addColorStop(0.6, color + '88');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add swirling patterns
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 100 + 20;
        const alpha = Math.random() * 0.5 + 0.1;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (entityType === 'blackhole') {
      // Black hole texture - dark center with accretion disk
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, '#000000');
      grad.addColorStop(0.1, '#1a1a1a');
      grad.addColorStop(0.3, '#333333');
      grad.addColorStop(0.7, '#666666');
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add accretion disk
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const radius = 100 + i * 30;
        ctx.beginPath();
        ctx.arc(256, 256, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (entityType === 'comet') {
      // Comet texture - icy core with tail
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 100);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.3, color);
      grad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add comet tail
      const tailGrad = ctx.createLinearGradient(256, 256, 0, 256);
      tailGrad.addColorStop(0, color + 'FF');
      tailGrad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = tailGrad;
      ctx.fillRect(0, 200, 256, 112);
    } else if (entityType === 'asteroid') {
      // Asteroid texture - rocky surface
      const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      grad.addColorStop(0, color);
      grad.addColorStop(0.7, color);
      grad.addColorStop(1, '#333333');
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add craters and surface details
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 30 + 5;
        const alpha = Math.random() * 0.5 + 0.1;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#222222';
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Planet texture (default) - using planet's actual color
      const grad = ctx.createRadialGradient(256, 256, 80, 256, 256, 256);
      
      // Use the planet's actual color instead of hardcoded type-based colors
      const baseColor = new THREE.Color(color);
      const lighterColor = baseColor.clone().multiplyScalar(1.3);
      const darkerColor = baseColor.clone().multiplyScalar(0.7);
      const veryLightColor = baseColor.clone().multiplyScalar(1.6);
      
      const colors = [
        baseColor.getHexString(),
        lighterColor.getHexString(),
        darkerColor.getHexString(),
        veryLightColor.getHexString()
      ];
      
      grad.addColorStop(0, '#' + colors[0]);
      grad.addColorStop(0.3, '#' + colors[1]);
      grad.addColorStop(0.7, '#' + colors[2]);
      grad.addColorStop(1, '#' + colors[3]);
      
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);
      
      // Add some texture variation using the planet's color
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 20 + 5;
        const alpha = Math.random() * 0.3 + 0.1;
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#' + colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    return texture;
  }, [entityType, type, color, size]);
}

// Enhanced animated colors function
const getAnimatedColors = (entityType: string, type: string, time: number, planetColor: string) => {
  if (entityType === 'star') {
    const starColors = {
      'yellow-dwarf': ['#FFD700', '#FFA500', '#FF8C00', '#FFD700'],
      'pulsar': ['#FF69B4', '#FF1493', '#FF007F', '#FF69B4'],
      'red-giant': ['#FF4500', '#FF6347', '#FF4500', '#FF6347'],
      'blue-supergiant': ['#00BFFF', '#1E90FF', '#4169E1', '#00BFFF']
    };
    const colors = starColors[type as keyof typeof starColors] || starColors['yellow-dwarf'];
    const phase = (time * 0.2) % colors.length;
    const index1 = Math.floor(phase);
    const index2 = (index1 + 1) % colors.length;
    const t = phase - index1;
    
    return colors.map((_, i) => {
      const color1 = new THREE.Color(colors[(index1 + i) % colors.length]);
      const color2 = new THREE.Color(colors[(index2 + i) % colors.length]);
      return color1.clone().lerp(color2, t);
    });
  } else if (entityType === 'nebula') {
    const nebulaColors = {
      'emission': ['#9370DB', '#8A2BE2', '#9400D3', '#9370DB'],
      'star-forming': ['#FF1493', '#FF69B4', '#FFB6C1', '#FF1493'],
      'planetary': ['#00CED1', '#40E0D0', '#48D1CC', '#00CED1']
    };
    const colors = nebulaColors[type as keyof typeof nebulaColors] || nebulaColors['emission'];
    const phase = (time * 0.1) % colors.length;
    const index1 = Math.floor(phase);
    const index2 = (index1 + 1) % colors.length;
    const t = phase - index1;
    
    return colors.map((_, i) => {
      const color1 = new THREE.Color(colors[(index1 + i) % colors.length]);
      const color2 = new THREE.Color(colors[(index2 + i) % colors.length]);
      return color1.clone().lerp(color2, t);
    });
  } else if (entityType === 'blackhole') {
    return [
      new THREE.Color('#000000'),
      new THREE.Color('#1a1a1a'),
      new THREE.Color('#333333'),
      new THREE.Color('#FFD700'),
      new THREE.Color('#FFA500')
    ];
  } else if (entityType === 'comet') {
    return [
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#F0E68C'),
      new THREE.Color('#E6E6FA'),
      new THREE.Color('#FFFFFF'),
      new THREE.Color('#F0E68C')
    ];
  } else if (entityType === 'asteroid') {
    return [
      new THREE.Color('#8B4513'),
      new THREE.Color('#A0522D'),
      new THREE.Color('#CD853F'),
      new THREE.Color('#8B4513'),
      new THREE.Color('#A0522D')
    ];
  } else {
    // Planet colors using the planet's actual color
    const baseColor = new THREE.Color(planetColor);
    const lighterColor = baseColor.clone().multiplyScalar(1.3);
    const darkerColor = baseColor.clone().multiplyScalar(0.7);
    const veryLightColor = baseColor.clone().multiplyScalar(1.6);
    const veryDarkColor = baseColor.clone().multiplyScalar(0.4);
    
    const colors = [baseColor, lighterColor, darkerColor, veryLightColor, veryDarkColor];
    const phase = (time * 0.1) % colors.length;
    const index1 = Math.floor(phase);
    const index2 = (index1 + 1) % colors.length;
    const t = phase - index1;
    
    return colors.map((_, i) => {
      const color1 = colors[(index1 + i) % colors.length];
      const color2 = colors[(index2 + i) % colors.length];
      return color1.clone().lerp(color2, t);
    });
  }
};

export default function Planet({ position, size, color, type = 'terrestrial', name, entityType = 'planet', onPlanetClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Simplified particle animation refs - reduced complexity to prevent leaks
  const particleRefs = useRef<THREE.Mesh[]>([]);
  const sparkleRefs = useRef<THREE.Mesh[]>([]);

  const texture = useEntityTexture(entityType, type, color, size);
  
  // Initialize animated colors with current time
  const [animatedColors, setAnimatedColors] = useState(() => getAnimatedColors(entityType, type, 0, color));

  // Short-circuit effect for Sahara Sands (desert planet)
  const isShortCircuiting = name === 'Sahara Sands';
  const [shortCircuitIntensity, setShortCircuitIntensity] = useState(0);
  const [flickerState, setFlickerState] = useState(false);

  const getRingConfig = (entityType: string, planetType: string) => {
    if (entityType === 'star') {
      return {
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF4500'],
        opacity: 0.9,
        particleCount: 12, // Drastically reduced from 60
        sparkleCount: 6    // Drastically reduced from 30
      };
    } else if (entityType === 'nebula') {
      return {
        colors: [color, color + '80', color + '40', color + '20'],
        opacity: 0.7,
        particleCount: 8,  // Drastically reduced from 40
        sparkleCount: 4    // Drastically reduced from 20
      };
    } else if (entityType === 'blackhole') {
      return {
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF4500'],
        opacity: 0.8,
        particleCount: 10, // Drastically reduced from 50
        sparkleCount: 5    // Drastically reduced from 25
      };
    } else if (entityType === 'comet') {
      return {
        colors: ['#FFFFFF', '#F0E68C', '#E6E6FA', '#FFFFFF'],
        opacity: 0.6,
        particleCount: 6,  // Drastically reduced from 30
        sparkleCount: 3    // Drastically reduced from 15
      };
    } else if (entityType === 'asteroid') {
      return {
        colors: ['#8B4513', '#A0522D', '#CD853F', '#8B4513'],
        opacity: 0.4,
        particleCount: 4,  // Drastically reduced from 20
        sparkleCount: 2    // Drastically reduced from 10
      };
    } else {
      // Enhanced Planet rings with beautiful color variations using planet's actual color
      const baseColor = new THREE.Color(color);
      
      // Create beautiful complementary color variations
      const lighterColor = baseColor.clone().multiplyScalar(1.4).getHexString();
      const darkerColor = baseColor.clone().multiplyScalar(0.6).getHexString();
      const complementaryColor = baseColor.clone().offsetHSL(180, 0, 0).getHexString();
      const warmAccent = baseColor.clone().offsetHSL(30, 0.2, 0.1).getHexString();
      const coolAccent = baseColor.clone().offsetHSL(-30, 0.2, 0.1).getHexString();
      
      // Special wounded ring configuration for Sahara Sands
      if (name === 'Sahara Sands') {
        return {
          rings: [
            { innerRadius: 1.2, outerRadius: 1.4, opacity: 0.6, color: '#' + baseColor.getHexString(), tilt: 0.3, rotation: 0.2 },
            { innerRadius: 1.5, outerRadius: 1.7, opacity: 0.85, color: '#' + warmAccent, tilt: 0.4, rotation: 0.1 },
            { innerRadius: 1.8, outerRadius: 2.0, opacity: 0.4, color: '#' + darkerColor, tilt: 0.25, rotation: 0.3 },
            { innerRadius: 2.1, outerRadius: 2.3, opacity: 0.3, color: '#' + complementaryColor, tilt: 0.35, rotation: 0.15 }
          ],
          colors: ['#' + baseColor.getHexString(), '#' + warmAccent, '#' + darkerColor, '#' + complementaryColor],
          opacity: 0.5,
          particleCount: 8,
          sparkleCount: 4,
          isWounded: true
        };
      }
      
      const configs = {
        gas: {
          // Saturn-like rings with multiple bands using planet color
          rings: [
            { innerRadius: 1.3, outerRadius: 1.5, opacity: 0.9, color: '#' + baseColor.getHexString() },
            { innerRadius: 1.6, outerRadius: 1.8, opacity: 0.95, color: '#' + lighterColor },
            { innerRadius: 1.9, outerRadius: 2.1, opacity: 0.7, color: '#' + complementaryColor },
            { innerRadius: 2.2, outerRadius: 2.4, opacity: 0.6, color: '#' + warmAccent },
            { innerRadius: 2.5, outerRadius: 2.7, opacity: 0.5, color: '#' + baseColor.getHexString() }
          ],
          colors: ['#' + baseColor.getHexString(), '#' + lighterColor, '#' + complementaryColor, '#' + warmAccent, '#' + baseColor.getHexString()],
          opacity: 0.8,
          particleCount: 15,
          sparkleCount: 8
        },
        ice: {
          // Uranus-like rings with icy particles using planet color
          rings: [
            { innerRadius: 1.4, outerRadius: 1.6, opacity: 0.7, color: '#' + baseColor.getHexString() },
            { innerRadius: 1.7, outerRadius: 1.9, opacity: 0.9, color: '#' + lighterColor },
            { innerRadius: 2.0, outerRadius: 2.2, opacity: 0.5, color: '#' + coolAccent },
            { innerRadius: 2.3, outerRadius: 2.5, opacity: 0.4, color: '#' + complementaryColor }
          ],
          colors: ['#' + baseColor.getHexString(), '#' + lighterColor, '#' + coolAccent, '#' + complementaryColor],
          opacity: 0.6,
          particleCount: 10,
          sparkleCount: 5
        },
        ocean: {
          // Neptune-like rings with water ice using planet color
          rings: [
            { innerRadius: 1.5, outerRadius: 1.7, opacity: 0.8, color: '#' + baseColor.getHexString() },
            { innerRadius: 1.8, outerRadius: 2.0, opacity: 0.95, color: '#' + lighterColor },
            { innerRadius: 2.1, outerRadius: 2.3, opacity: 0.6, color: '#' + coolAccent },
            { innerRadius: 2.4, outerRadius: 2.6, opacity: 0.5, color: '#' + complementaryColor }
          ],
          colors: ['#' + baseColor.getHexString(), '#' + lighterColor, '#' + coolAccent, '#' + complementaryColor],
          opacity: 0.7,
          particleCount: 12,
          sparkleCount: 6
        },
        desert: {
          // Mars-like rings with dust and sand using planet color
          rings: [
            { innerRadius: 1.2, outerRadius: 1.4, opacity: 0.6, color: '#' + baseColor.getHexString() },
            { innerRadius: 1.5, outerRadius: 1.7, opacity: 0.85, color: '#' + warmAccent },
            { innerRadius: 1.8, outerRadius: 2.0, opacity: 0.4, color: '#' + darkerColor },
            { innerRadius: 2.1, outerRadius: 2.3, opacity: 0.3, color: '#' + complementaryColor }
          ],
          colors: ['#' + baseColor.getHexString(), '#' + warmAccent, '#' + darkerColor, '#' + complementaryColor],
          opacity: 0.5,
          particleCount: 8,
          sparkleCount: 4
        },
        terrestrial: {
          // Earth-like rings using planet's actual color with beautiful variations
          rings: [
            { innerRadius: 1.3, outerRadius: 1.5, opacity: 0.5, color: '#' + baseColor.getHexString() },
            { innerRadius: 1.6, outerRadius: 1.8, opacity: 0.9, color: '#' + lighterColor },
            { innerRadius: 1.9, outerRadius: 2.1, opacity: 0.3, color: '#' + complementaryColor }
          ],
          colors: ['#' + baseColor.getHexString(), '#' + lighterColor, '#' + complementaryColor],
          opacity: 0.4,
          particleCount: 6,
          sparkleCount: 3
        }
      };
      
      return configs[planetType as keyof typeof configs] || configs.terrestrial;
    }
  };

  const ringConfig = getRingConfig(entityType, type);

  const hasRings = (config: any): config is { rings: any[] } => {
    return config && Array.isArray(config.rings);
  };

  const handleClick = (event: any) => {
    event.stopPropagation();
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    if (onPlanetClick) {
      onPlanetClick();
    }
  };

  const handlePointerOver = (event: any) => {
    event.stopPropagation();
    setHovered(true);
  };

  const handlePointerOut = (event: any) => {
    event.stopPropagation();
    setHovered(false);
  };

  // Drastically slowed down particle animations for better performance
  const ultraSlowSpeed = 0.001;  // 100x slower than before
  const verySlowSpeed = 0.002;   // 50x slower than before

  // Simplified animation with better error handling
  useFrame((state) => {
    try {
      const time = state?.clock?.elapsedTime || 0;
      const newColors = getAnimatedColors(entityType, type, time, color);
      
      // Update animated colors state
      setAnimatedColors(newColors);
      
      // Short-circuit effect animation
      if (isShortCircuiting) {
        // Random flickering pattern
        const flickerChance = Math.random();
        if (flickerChance > 0.95) { // 5% chance per frame
          setFlickerState(!flickerState);
        }
        
        // Intense short-circuit moments
        const shortCircuitChance = Math.random();
        if (shortCircuitChance > 0.98) { // 2% chance per frame
          setShortCircuitIntensity(1);
          setTimeout(() => setShortCircuitIntensity(0), 200);
        } else {
          setShortCircuitIntensity(Math.max(0, shortCircuitIntensity - 0.02));
        }
      }
      
      if (meshRef.current) {
        const material = meshRef.current.material as THREE.MeshPhysicalMaterial;
        if (material?.emissive) {
          // Apply short-circuit effect to emissive
          if (isShortCircuiting) {
            const baseEmissive = newColors[0].clone();
            const flickerIntensity = flickerState ? 0.8 : 0.2;
            const shortCircuitColor = new THREE.Color(0xffff00); // Yellow for electrical effect
            material.emissive.copy(baseEmissive.lerp(shortCircuitColor, shortCircuitIntensity * flickerIntensity));
            material.emissiveIntensity = 0.5 + shortCircuitIntensity * 2;
          } else {
            // Enhanced brightness for all other planets
            const enhancedEmissive = newColors[0].clone().multiplyScalar(1.8); // Much brighter
            material.emissive.copy(enhancedEmissive);
            material.emissiveIntensity = 1.2; // Increased intensity
          }
        }
      }

      // Animate sparkles with extremely slow speed
      sparkleRefs.current.forEach((sparkle, index) => {
        if (sparkle) {
          const speed = verySlowSpeed + Math.sin(index * 0.8) * 0.0005; // Much reduced variation
          const radius = size * (2.2 + Math.sin(index * 0.5) * 0.3);
          const direction = index % 2 === 0 ? 1 : -1;
          const angle = time * speed * direction + (index / sparkleRefs.current.length) * Math.PI * 2;
          
          sparkle.position.x = Math.cos(angle) * radius;
          sparkle.position.z = Math.sin(angle) * radius;
          sparkle.position.y = Math.sin(time * 0.01 + index * 0.1) * size * 0.05; // Much slower vertical movement
          
          // Add short-circuit effect to sparkles
          if (isShortCircuiting && sparkle.material) {
            const sparkleMaterial = sparkle.material as THREE.MeshBasicMaterial;
            const flickerIntensity = flickerState ? 1 : 0.3;
            sparkleMaterial.opacity = 0.6 * flickerIntensity * (1 + shortCircuitIntensity);
            sparkleMaterial.color.setHex(shortCircuitIntensity > 0.5 ? 0xffff00 : parseInt(color.replace('#', '0x')));
          }
        }
      });

      // Animate regular particles with ultra slow speed
      particleRefs.current.forEach((particle, index) => {
        if (particle) {
          const speed = ultraSlowSpeed + Math.sin(index * 0.9) * 0.0005; // Much reduced variation
          const radius = size * (1.8 + Math.cos(index * 0.3) * 0.4);
          const direction = index % 3 === 0 ? 1 : (index % 3 === 1 ? -1 : 0.5);
          const angle = time * speed * direction + (index / particleRefs.current.length) * Math.PI * 2;
          
          particle.position.x = Math.cos(angle) * radius;
          particle.position.z = Math.sin(angle) * radius;
          particle.position.y = Math.sin(time * 0.005 + index * 0.05) * size * 0.02; // Much slower vertical movement
        }
      });
    } catch (error) {
      // Silently handle any animation errors to prevent crashes
      console.warn('Animation error in Planet component:', error);
    }
  });

  // Cleanup function to prevent memory leaks
  React.useEffect(() => {
    return () => {
      // Clear refs on unmount
      particleRefs.current = [];
      sparkleRefs.current = [];
    };
  }, []);

  // Special effects for different entity types
  const renderSpecialEffects = () => {
    if (entityType === 'star') {
      return (
        <>
          {/* Star corona */}
          {[1.2, 1.4, 1.6, 1.8, 2.0].map((scale, index) => (
            <mesh key={`corona-${index}`}>
              <sphereGeometry args={[size * scale, 32, 32]} />
              <meshBasicMaterial
                color={animatedColors[index % animatedColors.length]}
                transparent
                opacity={0.3 - index * 0.05}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
              />
            </mesh>
          ))}
          
          {/* Star flares - reduced count for performance */}
          {Array.from({ length: 4 }, (_, i) => { // Reduced from 8 to 4
            const angle = (i / 4) * Math.PI * 2;
            const x = Math.cos(angle) * size * 2;
            const z = Math.sin(angle) * size * 2;
            
            return (
              <mesh key={`flare-${i}`} position={[x, 0, z]}>
                <planeGeometry args={[size * 0.5, size * 2]} />
                <meshBasicMaterial
                  color={animatedColors[i % animatedColors.length]}
                  transparent
                  opacity={0.6}
                  blending={THREE.AdditiveBlending}
                  side={THREE.DoubleSide}
                />
              </mesh>
            );
          })}
        </>
      );
    } else if (entityType === 'nebula') {
      return (
        <>
          {/* Nebula clouds - reduced count for performance */}
          {Array.from({ length: 6 }, (_, i) => { // Reduced from 15 to 6
            const angle = (i / 6) * Math.PI * 2;
            const radius = size * 1.5 + Math.random() * size;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * size * 0.5;
            
            return (
              <mesh key={`cloud-${i}`} position={[x, y, z]}>
                <sphereGeometry args={[size * 0.3, 16, 16]} />
                <meshBasicMaterial
                  color={animatedColors[i % animatedColors.length]}
                  transparent
                  opacity={0.4}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            );
          })}
        </>
      );
    } else if (entityType === 'blackhole') {
      return (
        <>
          {/* Event horizon */}
          <mesh>
            <sphereGeometry args={[size * 1.1, 32, 32]} />
            <meshBasicMaterial
              color="#000000"
              transparent
              opacity={0.8}
              side={THREE.BackSide}
            />
          </mesh>
          
          {/* Accretion disk */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.2, size * 2.5, 64]} />
            <meshBasicMaterial
              color="#FFD700"
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      );
    } else if (entityType === 'comet') {
      return (
        <>
          {/* Comet tail */}
          <mesh position={[-size * 2, 0, 0]}>
            <cylinderGeometry args={[0, size * 0.5, size * 4, 8]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      );
    }
    
    return null;
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Main Entity Body */}
      <mesh 
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        scale={clicked ? 1.1 : hovered ? 1.05 : 1}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshPhysicalMaterial
          map={texture}
          emissive={new THREE.Color(animatedColors[0])}
          emissiveIntensity={hovered ? 1.2 : entityType === 'star' ? 1.5 : 0.8}
          clearcoat={0.9}
          clearcoatRoughness={0.1}
          transmission={entityType === 'nebula' ? 0.8 : 0.2}
          thickness={0.8}
          roughness={entityType === 'asteroid' ? 0.8 : 0.2}
          metalness={entityType === 'asteroid' ? 0.8 : 0.2}
        />
      </mesh>

      {/* Special Effects */}
      {renderSpecialEffects()}

      {/* Enhanced Atmospheric Glow with Beautiful Color Variations */}
      {(() => {
        const baseColor = new THREE.Color(color);
        const lighterColor = baseColor.clone().multiplyScalar(1.3);
        const complementaryColor = baseColor.clone().offsetHSL(180, 0, 0);
        const warmAccent = baseColor.clone().offsetHSL(30, 0.2, 0.1);
        
        return [1.1, 1.3, 1.5].map((scale, index) => {
          const glowColors = [baseColor, lighterColor, complementaryColor];
          const glowColor = glowColors[index % glowColors.length];
          
          return (
            <mesh key={`atmosphere-${index}`}>
              <sphereGeometry args={[size * scale, 32, 32]} />
              <meshBasicMaterial
                color={glowColor}
                transparent
                opacity={0.2 - index * 0.05}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
              />
            </mesh>
          );
        });
      })()}

      {/* Enhanced Luminous Core with Beautiful Color Variations */}
      {(() => {
        const baseColor = new THREE.Color(color);
        const lighterColor = baseColor.clone().multiplyScalar(1.8);
        const complementaryColor = baseColor.clone().offsetHSL(180, 0, 0);
        const warmAccent = baseColor.clone().offsetHSL(30, 0.3, 0.2);
        const coolAccent = baseColor.clone().offsetHSL(-30, 0.3, 0.2);
        
        const coreColors = [baseColor, lighterColor, complementaryColor, warmAccent, coolAccent, baseColor, lighterColor];
        
        return [0.15, 0.25, 0.35, 0.45, 0.6, 0.8, 1.0].map((scale, index) => (
          <mesh key={`core-${index}`}>
            <sphereGeometry args={[size * scale, 24 + index * 4, 24 + index * 4]} />
            <meshBasicMaterial
              color={coreColors[index % coreColors.length]}
              transparent
              opacity={1.2 - index * 0.15}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ));
      })()}

      {/* Pulsing Core Effect */}
      {[0.2, 0.4, 0.6].map((scale, index) => (
        <mesh key={`pulse-${index}`}>
          <sphereGeometry args={[size * scale, 32, 32]} />
          <meshBasicMaterial
            color={animatedColors[0]}
            transparent
            opacity={0.4 - index * 0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* Enhanced Core Energy Particles - reduced count for performance */}
      {Array.from({ length: 8 }, (_, i) => { // Reduced from 35 to 8
        const angle = (i / 8) * Math.PI * 2;
        const radius = size * 0.3 + Math.random() * size * 0.4;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * size * 0.3;
        
        return (
          <mesh key={`core-particle-${i}`} position={[x, y, z]}>
            <sphereGeometry args={[0.02 + Math.random() * 0.01, 8, 8]} />
            <meshBasicMaterial
              color={animatedColors[i % animatedColors.length]}
              transparent
              opacity={0.8 + Math.random() * 0.2}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Enhanced Inner Core Glow - Brighter and More Luminous */}
      {(() => {
        const baseColor = new THREE.Color(color);
        const brightColor = baseColor.clone().multiplyScalar(2.0); // Much brighter
        const lighterColor = baseColor.clone().multiplyScalar(1.6);
        
        return [0.1, 0.15, 0.2].map((scale, index) => {
          const glowColors = [brightColor, lighterColor, baseColor];
          const glowColor = glowColors[index % glowColors.length];
          
          return (
            <mesh key={`inner-glow-${index}`}>
              <sphereGeometry args={[size * scale, 16, 16]} />
              <meshBasicMaterial
                color={glowColor}
                transparent
                opacity={1.5 - index * 0.4} // Increased opacity for brighter glow
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        });
      })()}

      {/* Enhanced Ring System with Multiple Layers */}
      {entityType === 'planet' && hasRings(ringConfig) ? (
        // Use the new ring configuration with multiple layers
        ringConfig.rings.map((ring, ringIndex) => {
          // Check if this is a wounded planet with tilted rings
          const isWounded = (ringConfig as any).isWounded || false;
          const tilt = (ring as any).tilt || 0;
          const rotation = (ring as any).rotation || 0;
          
          return (
            <mesh 
              key={`ring-${ringIndex}`} 
              rotation={[
                Math.PI / 2 + (isWounded ? tilt : 0), 
                isWounded ? rotation : 0, 
                0
              ]}
            >
              <ringGeometry args={[size * ring.innerRadius, size * ring.outerRadius, 64]} />
              <meshBasicMaterial
                color={ring.color}
                transparent
                opacity={ring.opacity}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })
      ) : (
        // Fallback for non-planet entities or legacy support
        [1.5, 1.8, 2.1, 2.4].map((ringScale, ringIndex) => (
          <mesh key={`ring-${ringIndex}`} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * ringScale, size * (ringScale + 0.1), 64]} />
            <meshBasicMaterial
              color={ringConfig.colors[ringIndex % ringConfig.colors.length]}
              transparent
              opacity={ringConfig.opacity * (1 - ringIndex * 0.2)}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))
      )}

      {/* Ring Particles - Slow Moving Space Particles */}
      {Array.from({ length: ringConfig.particleCount }, (_, i) => {
        const angle = (i / ringConfig.particleCount) * Math.PI * 2;
        const radius = size * 2 + Math.random() * size * 0.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * size * 0.1;
        
        return (
          <mesh 
            key={`particle-${i}`} 
            position={[x, y, z]}
            ref={(el) => {
              if (el) particleRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial
              color={ringConfig.colors[i % ringConfig.colors.length]}
              transparent
              opacity={isShortCircuiting ? 0.4 : 1.2} // Dimmed for short-circuiting planet, bright for others
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Orbiting Sparkles - Medium Speed Space Particles */}
      {Array.from({ length: ringConfig.sparkleCount }, (_, i) => {
        const angle = (i / ringConfig.sparkleCount) * Math.PI * 2;
        const radius = size * 2.5 + Math.random() * size * 0.3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * size * 0.2;
        
        return (
          <mesh 
            key={`sparkle-${i}`} 
            position={[x, y, z]}
            ref={(el) => {
              if (el) sparkleRefs.current[i] = el;
            }}
          >
            <sphereGeometry args={[0.01, 6, 6]} />
            <meshBasicMaterial
              color={ringConfig.colors[i % ringConfig.colors.length]}
              transparent
              opacity={isShortCircuiting ? 0.3 : 1.4} // Dimmed for short-circuiting planet, bright for others
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        );
      })}

      {/* Additional Ring Layer Particles - Simplified */}
      {hasRings(ringConfig) && ringConfig.rings.map((ring, ringIndex) => 
        Array.from({ length: Math.floor(ringConfig.particleCount / ringConfig.rings.length) }, (_, i) => {
          const angle = (i / Math.floor(ringConfig.particleCount / ringConfig.rings.length)) * Math.PI * 2;
          const radius = size * ring.innerRadius + (ring.outerRadius - ring.innerRadius) * Math.random();
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (Math.random() - 0.5) * size * 0.05;
          
          return (
            <mesh 
              key={`ring-particle-${ringIndex}-${i}`} 
              position={[x, y, z]}
              ref={(el) => {
                if (el) particleRefs.current[ringIndex * Math.floor(ringConfig.particleCount / ringConfig.rings.length) + i] = el;
              }}
            >
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshBasicMaterial
                color={ring.color}
                transparent
                opacity={ring.opacity * 0.8}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          );
        })
      )}

      {/* Reduced Enhanced Glow Spheres */}
      {[0.7, 0.9, 1.1].map((glowScale, glowIndex) => (
        <mesh key={`glow-${glowIndex}`}>
          <sphereGeometry args={[size * glowScale, 24, 24]} />
          <meshBasicMaterial
            color={animatedColors[glowIndex % animatedColors.length]}
            transparent
            opacity={0.2 - glowIndex * 0.05}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
      ))}

      {/* Enhanced Hover Effect */}
      {hovered && (
        <>
          {/* Outer Hover Ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.4, size * 1.6, 64]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Hover Glow */}
          <mesh>
            <sphereGeometry args={[size * 1.3, 32, 32]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.2}
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}

      {/* Click Animation Effect */}
      {clicked && (
        <mesh>
          <sphereGeometry args={[size * 1.5, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
} 