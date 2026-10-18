/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ text, as: Component = 'span', className = '' }) => {
  return (
    <Component className={`relative inline-block font-black tracking-tighter isolate ${className}`}>
      {/* Main Kinetic Gradient Text */}
      <motion.span
        className="absolute inset-0 z-10 block bg-gradient-to-r from-white via-[#00f0ff] via-[#38bdf8] via-[#ffb800] to-white bg-[length:200%_auto] bg-clip-text text-transparent will-change-[background-position]"
        animate={{
          backgroundPosition: ['0% center', '200% center'],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "linear",
        }}
        aria-hidden="true"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden'
        }}
      >
        {text}
      </motion.span>
      
      {/* Base layer for crisp white legibility */}
      <span 
        className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 opacity-60"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent' 
        }}
      >
        {text}
      </span>
      
      {/* Electric Cyan & Neon Amber Ambient Glow */}
      <span
        className="absolute inset-0 -z-10 block bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] via-[#ffb800] to-[#00f0ff] bg-[length:200%_auto] bg-clip-text text-transparent blur-xl md:blur-2xl opacity-40"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)' 
        }}
      >
        {text}
      </span>
    </Component>
  );
};

export default GradientText;
