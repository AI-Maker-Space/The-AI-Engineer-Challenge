/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00f3ff',
        'neon-purple': '#9d00ff',
        'cyber-black': '#0a0a0a',
        'cyber-gray': '#1a1a1a',
        'hologram': 'rgba(0, 243, 255, 0.1)',
        // Prehistoric-inspired colors
        'stone-gray': '#2c3e50',
        'cave-brown': '#8B4513',
        'amber-glow': '#FFB300',
        'obsidian': '#1a1a1a',
        'crystal-blue': '#4FC3F7',
        'ancient-gold': '#FFD700',
        // Chrome and liquid glass colors
        'chrome-light': '#E8E8E8',
        'chrome-dark': '#2A2A2A',
        'liquid-silver': 'rgba(255, 255, 255, 0.8)',
        'liquid-gold': 'rgba(255, 215, 0, 0.15)',
        'metallic-blue': '#4A90E2',
        // Ultra-vibrant color palette
        'neon-pink': '#FF00FF',
        'electric-blue': '#00FFFF',
        'plasma-purple': '#B026FF',
        'quantum-green': '#39FF14',
        'cosmic-orange': '#FF6B00',
        'cyber-yellow': '#FFE600',
        'hologram-teal': '#00FFB2',
        'neon-lavender': '#FF00FF',
        'metallic-silver': '#FFFFFF',
        'deep-space': '#0A0A2A',
        'mist-white': 'rgba(255, 255, 255, 0.1)',
        'mist-blue': 'rgba(0, 255, 255, 0.1)',
        'mist-purple': 'rgba(255, 0, 255, 0.1)',
        // Additional vibrant colors
        'vibrant-red': '#FF0000',
        'vibrant-green': '#00FF00',
        'vibrant-blue': '#0000FF',
        'vibrant-yellow': '#FFFF00',
        'vibrant-purple': '#FF00FF',
        'vibrant-cyan': '#00FFFF',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'liquid-flow': 'liquidFlow 8s ease-in-out infinite',
        'chrome-shine': 'chromeShine 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'metallic-shimmer': 'metallicShimmer 4s linear infinite',
        'rainbow-flow': 'rainbowFlow 4s ease infinite',
        'neon-pulse': 'neonPulse 1s ease-in-out infinite',
        'quantum-shift': 'quantumShift 5s ease-in-out infinite',
        'cosmic-spin': 'cosmicSpin 5s linear infinite',
        'hologram-flicker': 'hologramFlicker 2s ease-in-out infinite',
        'vibrant-shift': 'vibrantShift 6s ease infinite',
        'color-burst': 'colorBurst 4s ease infinite',
        // Subtle yet impressive animations
        'float-hover': 'floatHover 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'morph-shape': 'morphShape 8s ease-in-out infinite',
        'ripple-effect': 'rippleEffect 3s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 2s ease-in-out infinite',
        'cosmic-float': 'cosmicFloat 7s ease-in-out infinite',
        'hologram-wave': 'hologramWave 4s ease-in-out infinite',
        'mist-fade': 'mistFade 0.5s ease-in-out',
        'mist-flow': 'mist-flow 8s ease-in-out infinite',
        'mist-ripple': 'mistRipple 3s ease-in-out infinite',
        'layered-mist': 'layeredMist 2s ease-in-out',
        'position-mist': 'positionMist 6s ease-in-out infinite',
        'neon-flicker': 'neon-flicker 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'mist-flow': 'mist-flow 8s ease-in-out infinite',
        'mist-pulse': 'mist-pulse 4s ease-in-out infinite',
        'mist-drift': 'mist-drift 6s ease-in-out infinite',
        'planet-pulse': 'planet-pulse 8s ease-in-out infinite',
        'surface-shift': 'surface-shift 15s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            textShadow: '0 0 10px #FFD700, 0 0 20px #FFB300, 0 0 30px #FFB300',
            filter: 'brightness(1)'
          },
          '100%': { 
            textShadow: '0 0 20px #FFD700, 0 0 30px #FFB300, 0 0 40px #FFB300',
            filter: 'brightness(1.2)'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        liquidFlow: {
          '0%': { 
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(0deg) blur(0px)'
          },
          '50%': { 
            backgroundPosition: '100% 50%',
            filter: 'hue-rotate(180deg) blur(1px)'
          },
          '100%': { 
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(360deg) blur(0px)'
          },
        },
        chromeShine: {
          '0%': { 
            backgroundPosition: '-200% 0',
            opacity: 0.5
          },
          '100%': { 
            backgroundPosition: '200% 0',
            opacity: 0.8
          },
        },
        gradientShift: {
          '0%': {
            backgroundPosition: '0% 0%',
            filter: 'hue-rotate(0deg) saturate(1)'
          },
          '25%': {
            backgroundPosition: '100% 0%',
            filter: 'hue-rotate(90deg) saturate(1.2)'
          },
          '50%': {
            backgroundPosition: '100% 100%',
            filter: 'hue-rotate(180deg) saturate(1)'
          },
          '75%': {
            backgroundPosition: '0% 100%',
            filter: 'hue-rotate(270deg) saturate(1.2)'
          },
          '100%': {
            backgroundPosition: '0% 0%',
            filter: 'hue-rotate(360deg) saturate(1)'
          }
        },
        metallicShimmer: {
          '0%': {
            backgroundPosition: '0% 50%',
            opacity: 0.7
          },
          '50%': {
            backgroundPosition: '100% 50%',
            opacity: 0.9
          },
          '100%': {
            backgroundPosition: '0% 50%',
            opacity: 0.7
          },
        },
        rainbowFlow: {
          '0%': {
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(0deg) saturate(2) brightness(1.2)'
          },
          '50%': {
            backgroundPosition: '100% 50%',
            filter: 'hue-rotate(180deg) saturate(2.5) brightness(1.4)'
          },
          '100%': {
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(360deg) saturate(2) brightness(1.2)'
          },
        },
        neonPulse: {
          '0%, 100%': {
            opacity: 1,
            filter: 'brightness(1.2) drop-shadow(0 0 20px currentColor) saturate(2)'
          },
          '50%': {
            opacity: 0.9,
            filter: 'brightness(1.5) drop-shadow(0 0 30px currentColor) saturate(2.5)'
          },
        },
        floatHover: {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg)',
            filter: 'brightness(1) saturate(1)'
          },
          '50%': {
            transform: 'translateY(-10px) rotate(1deg)',
            filter: 'brightness(1.1) saturate(1.2)'
          }
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 0, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.2)',
            transform: 'scale(1)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 0, 255, 0.5), 0 0 60px rgba(0, 255, 255, 0.3)',
            transform: 'scale(1.02)'
          }
        },
        morphShape: {
          '0%': {
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
            transform: 'rotate(0deg)'
          },
          '50%': {
            borderRadius: '30% 60% 70% 40%/50% 60% 30% 60%',
            transform: 'rotate(180deg)'
          },
          '100%': {
            borderRadius: '60% 40% 30% 70%/60% 30% 70% 40%',
            transform: 'rotate(360deg)'
          }
        },
        rippleEffect: {
          '0%': {
            boxShadow: '0 0 0 0 rgba(255, 0, 255, 0.4)',
            transform: 'scale(1)'
          },
          '70%': {
            boxShadow: '0 0 0 20px rgba(255, 0, 255, 0)',
            transform: 'scale(1.05)'
          },
          '100%': {
            boxShadow: '0 0 0 0 rgba(255, 0, 255, 0)',
            transform: 'scale(1)'
          }
        },
        neonFlicker: {
          '0%, 100%': {
            opacity: 1,
            filter: 'brightness(1) drop-shadow(0 0 10px currentColor)'
          },
          '50%': {
            opacity: 0.8,
            filter: 'brightness(1.1) drop-shadow(0 0 15px currentColor)'
          }
        },
        cosmicFloat: {
          '0%, 100%': {
            transform: 'translateY(0) rotate(0deg) scale(1)',
            filter: 'brightness(1) saturate(1)'
          },
          '25%': {
            transform: 'translateY(-5px) rotate(1deg) scale(1.02)',
            filter: 'brightness(1.1) saturate(1.1)'
          },
          '75%': {
            transform: 'translateY(5px) rotate(-1deg) scale(0.98)',
            filter: 'brightness(0.9) saturate(0.9)'
          }
        },
        hologramWave: {
          '0%': {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'translateY(0)'
          },
          '50%': {
            clipPath: 'polygon(0% 5%, 100% 0%, 100% 95%, 0% 100%)',
            transform: 'translateY(-5px)'
          },
          '100%': {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            transform: 'translateY(0)'
          }
        },
        quantumShift: {
          '0%': {
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(0deg) brightness(1)'
          },
          '50%': {
            backgroundPosition: '100% 50%',
            filter: 'hue-rotate(180deg) brightness(1.1)'
          },
          '100%': {
            backgroundPosition: '0% 50%',
            filter: 'hue-rotate(360deg) brightness(1)'
          }
        },
        mistFade: {
          '0%': {
            opacity: 0,
            transform: 'translateY(10px)',
            filter: 'blur(20px)'
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
            filter: 'blur(0px)'
          }
        },
        mistFlow: {
          '0%': {
            backgroundPosition: '0% 50%',
            filter: 'blur(8px) opacity(0.3)'
          },
          '50%': {
            backgroundPosition: '100% 50%',
            filter: 'blur(12px) opacity(0.5)'
          },
          '100%': {
            backgroundPosition: '0% 50%',
            filter: 'blur(8px) opacity(0.3)'
          }
        },
        mistRipple: {
          '0%': {
            transform: 'scale(1)',
            filter: 'blur(8px) opacity(0.3)'
          },
          '50%': {
            transform: 'scale(1.1)',
            filter: 'blur(12px) opacity(0.5)'
          },
          '100%': {
            transform: 'scale(1)',
            filter: 'blur(8px) opacity(0.3)'
          }
        },
        layeredMist: {
          '0%': {
            opacity: 0,
            transform: 'translateY(20px) scale(0.95)',
            filter: 'blur(20px)'
          },
          '20%': {
            opacity: 0.8,
            transform: 'translateY(10px) scale(0.98)',
            filter: 'blur(15px)'
          },
          '40%': {
            opacity: 0.6,
            transform: 'translateY(5px) scale(1)',
            filter: 'blur(10px)'
          },
          '60%': {
            opacity: 0.4,
            transform: 'translateY(0) scale(1.02)',
            filter: 'blur(5px)'
          },
          '80%': {
            opacity: 0.2,
            transform: 'translateY(-5px) scale(1)',
            filter: 'blur(2px)'
          },
          '100%': {
            opacity: 0,
            transform: 'translateY(-10px) scale(0.98)',
            filter: 'blur(0px)'
          }
        },
        positionMist: {
          '0%': {
            backgroundPosition: '0% 0%',
            filter: 'blur(8px) opacity(0.3) hue-rotate(0deg)'
          },
          '25%': {
            backgroundPosition: '100% 0%',
            filter: 'blur(12px) opacity(0.5) hue-rotate(90deg)'
          },
          '50%': {
            backgroundPosition: '100% 100%',
            filter: 'blur(8px) opacity(0.3) hue-rotate(180deg)'
          },
          '75%': {
            backgroundPosition: '0% 100%',
            filter: 'blur(12px) opacity(0.5) hue-rotate(270deg)'
          },
          '100%': {
            backgroundPosition: '0% 0%',
            filter: 'blur(8px) opacity(0.3) hue-rotate(360deg)'
          }
        },
        'neon-flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 0.8 },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'mist-flow': {
          '0%, 100%': { 
            transform: 'translateX(-10%) translateY(-10%)',
            backgroundPosition: '0% 0%',
          },
          '50%': { 
            transform: 'translateX(10%) translateY(10%)',
            backgroundPosition: '100% 100%',
          },
        },
        'mist-pulse': {
          '0%, 100%': { 
            opacity: 0.6,
            transform: 'scale(1)',
          },
          '50%': { 
            opacity: 0.8,
            transform: 'scale(1.1)',
          },
        },
        'mist-drift': {
          '0%, 100%': { 
            transform: 'translateX(-5%) translateY(-5%)',
            opacity: 0.7,
          },
          '50%': { 
            transform: 'translateX(5%) translateY(5%)',
            opacity: 0.9,
          },
        },
        'planet-pulse': {
          '0%, 100%': { 
            transform: 'translate(30%, 30%) scale(1)',
            opacity: 0.4,
          },
          '50%': { 
            transform: 'translate(30%, 30%) scale(1.2)',
            opacity: 0.5,
          },
        },
        'surface-shift': {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
        },
        'twinkle': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.5 },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(transparent 0%, rgba(0, 243, 255, 0.1) 2%, transparent 3%)',
        'stone-texture': 'url("/stone-texture.png")',
        'cave-wall': 'url("/cave-wall.png")',
        'ancient-symbols': 'url("/ancient-symbols.png")',
        'liquid-chrome': 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)',
        'metallic-gradient': 'linear-gradient(135deg, #E8E8E8 0%, #2A2A2A 100%)',
        'prehistoric-chrome': 'linear-gradient(135deg, #FFD700 0%, #4A90E2 50%, #2A2A2A 100%)',
        'liquid-metal': 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,215,0,0.2) 25%, rgba(74,144,226,0.2) 50%, rgba(255,215,0,0.2) 75%, rgba(255,255,255,0.1) 100%)',
        'ancient-chrome': 'linear-gradient(135deg, #FFB300 0%, #4FC3F7 50%, #2A2A2A 100%)',
        'crystal-shine': 'linear-gradient(45deg, rgba(79,195,247,0.1) 0%, rgba(255,215,0,0.2) 50%, rgba(79,195,247,0.1) 100%)',
        'rainbow-splash': 'linear-gradient(45deg, #FF00FF, #00FFFF, #FF00AA, #00FF00, #FF3300)',
        'quantum-wave': 'linear-gradient(135deg, #00FFFF, #FF00AA, #FF00FF, #00FF00)',
        'cosmic-burst': 'radial-gradient(circle at center, #FF00FF, #00FFFF, #FF00AA, #00FF00)',
        'neon-mesh': 'linear-gradient(45deg, #FF00FF 0%, #00FFFF 25%, #FF00AA 50%, #00FF00 75%, #FF3300 100%)',
        'hologram-grid': 'linear-gradient(45deg, rgba(255,16,240,0.1) 0%, rgba(0,240,255,0.1) 25%, rgba(176,38,255,0.1) 50%, rgba(57,255,20,0.1) 75%, rgba(255,107,0,0.1) 100%)',
        'plasma-glow': 'radial-gradient(circle at 50% 50%, #FF00FF, #00FFFF, #FF00AA)',
        'neon-burst': 'conic-gradient(from 0deg, #FF0000, #00FF00, #0000FF, #FFFF00, #FF00FF, #00FFFF, #FF0000)',
        'vibrant-grid': 'linear-gradient(45deg, #FF0000 0%, #00FF00 25%, #0000FF 50%, #FFFF00 75%, #FF00FF 100%)',
        'mist-gradient': 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(0,255,255,0.1), rgba(255,0,255,0.1))',
        'positional-mist': 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(0,255,255,0.1) 25%, rgba(255,0,255,0.1) 50%, rgba(0,255,255,0.1) 75%, rgba(255,255,255,0.1) 100%)',
        'layered-mist': 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(0,255,255,0.1) 50%, rgba(255,0,255,0.2) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '20px',
        '2xl': '40px',
      },
      fontFamily: {
        'ancient': ['Cinzel', 'serif'],
        'futuristic': ['Orbitron', 'sans-serif'],
        'neon': ['Orbitron', 'sans-serif'],
        'quantum': ['Rajdhani', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 