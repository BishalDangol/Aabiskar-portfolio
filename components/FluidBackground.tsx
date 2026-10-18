/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StarField = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.6 + 0.2,
      color: i % 3 === 0 ? '#00f0ff' : i % 3 === 1 ? '#ffb800' : '#ffffff'
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full will-change-[opacity,transform]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            transform: 'translateZ(0)'
          }}
          initial={{ opacity: star.opacity, scale: 1 }}
          animate={{
            opacity: [star.opacity, 0.9, star.opacity],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: star.duration * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#08090d] via-[#0d1117] to-[#050608]">
      <StarField />

      {/* Blob 1: Electric Cyan Glow */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[85vw] h-[85vw] bg-[#00f0ff] rounded-full mix-blend-screen filter blur-[50px] opacity-20 will-change-transform"
        animate={{
          x: [0, 45, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 2: Neon Amber Glow */}
      <motion.div
        className="absolute top-[25%] right-[-15%] w-[80vw] h-[80vw] bg-[#ffb800] rounded-full mix-blend-screen filter blur-[55px] opacity-15 will-change-transform"
        animate={{
          x: [0, -45, 20, 0],
          y: [0, 40, -20, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Blob 3: Deep Midnight Cobalt Glow */}
      <motion.div
        className="absolute bottom-[-15%] left-[25%] w-[75vw] h-[75vw] bg-[#1a2d4c] rounded-full mix-blend-screen filter blur-[60px] opacity-35 will-change-transform"
        animate={{
          x: [0, 60, -60, 0],
          y: [0, -40, 40, 0],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transform: 'translateZ(0)' }}
      />

      {/* Film Grain Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Vignette Depth */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black/80 pointer-events-none" />
    </div>
  );
};

export default FluidBackground;