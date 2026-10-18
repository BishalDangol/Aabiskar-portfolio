/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MultimediaProject } from '../types';
import { ArrowUpRight, Box, Film, Palette, Sparkles } from 'lucide-react';

interface ProjectCardProps {
  project: MultimediaProject;
  onClick: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case '3d':
      return <Box className="w-3.5 h-3.5 text-[#00f0ff]" />;
    case 'video':
      return <Film className="w-3.5 h-3.5 text-[#ffb800]" />;
    case 'graphic':
      return <Palette className="w-3.5 h-3.5 text-[#00f0ff]" />;
    case 'interactive':
      return <Sparkles className="w-3.5 h-3.5 text-[#ffb800]" />;
    default:
      return null;
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.article
      className="group relative h-[420px] md:h-[500px] w-full overflow-hidden border border-white/10 bg-[#0d1017] cursor-pointer transition-colors duration-300 hover:border-[#00f0ff]/50"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Background Media with Zoom */}
      <div className="absolute inset-0 overflow-hidden bg-[#0a0c12]">
        {!imageError ? (
          <motion.img 
            src={project.image} 
            alt={project.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover grayscale will-change-transform"
            variants={{
              rest: { scale: 1, opacity: 0.65, filter: 'grayscale(70%)' },
              hover: { scale: 1.06, opacity: 0.95, filter: 'grayscale(0%)' }
            }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#0c0f18] to-[#141b2b]">
            <div className="text-center p-6">
              <Box className="w-12 h-12 text-[#00f0ff]/40 mx-auto mb-3" />
              <p className="text-sm font-mono text-gray-400">{project.title}</p>
            </div>
          </div>
        )}
        
        {/* Subtle Cyber Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/40 to-transparent group-hover:via-transparent transition-colors duration-500" />
      </div>

      {/* Top Header: Unboxed Metadata & Hover Affordance */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-300 backdrop-blur-md bg-black/40 px-3 py-1.5 rounded border border-white/10">
            {getCategoryIcon(project.category)}
            <span className="uppercase tracking-wider font-semibold text-white">{project.categoryLabel}</span>
            <span className="text-white/40">·</span>
            <span className="text-[#00f0ff]">{project.year}</span>
          </div>

          <motion.div
            variants={{
              rest: { opacity: 0, x: 10, y: -10 },
              hover: { opacity: 1, x: 0, y: 0 }
            }}
            className="bg-[#00f0ff] text-black rounded-full p-2.5 shadow-[0_0_20px_rgba(0,240,255,0.5)] will-change-transform"
          >
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </motion.div>
        </div>

        {/* Bottom Details */}
        <div className="space-y-2">
          {/* Client & Role */}
          <p className="text-xs font-mono tracking-widest uppercase text-[#ffb800] font-medium">
            {project.client}
          </p>

          {/* Project Title */}
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-2xl md:text-3xl font-bold uppercase text-white leading-tight will-change-transform"
              variants={{
                rest: { y: 0 },
                hover: { y: -3 }
              }}
              transition={{ duration: 0.3 }}
            >
              {project.title}
            </motion.h3>
          </div>

          {/* Tools stack preview */}
          <div className="pt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-400 font-mono">
            {project.tools.slice(0, 3).map((tool, idx) => (
              <React.Fragment key={tool}>
                <span>{tool}</span>
                {idx < Math.min(project.tools.length, 3) - 1 && <span className="text-white/20">/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
