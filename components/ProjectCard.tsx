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
      className="group relative h-[420px] md:h-[500px] w-full overflow-hidden border border-white/10 bg-[#0d1017] cursor-pointer transition-colors duration-200 hover:border-[#00f0ff]"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Background Media */}
      <div className="absolute inset-0 overflow-hidden bg-[#090b10]">
        {!imageError ? (
          <motion.img 
            src={project.image} 
            alt={project.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover grayscale will-change-transform"
            variants={{
              rest: { scale: 1, opacity: 0.7, filter: 'grayscale(60%)' },
              hover: { scale: 1.05, opacity: 0.95, filter: 'grayscale(0%)' }
            }}
            transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-[#0d1017]">
            <div className="text-center p-6">
              <Box className="w-12 h-12 text-[#00f0ff] mx-auto mb-3" />
              <p className="text-sm font-mono text-gray-300">{project.title}</p>
            </div>
          </div>
        )}
        
        {/* Solid Dark Contrast Scrim */}
        <div className="absolute inset-0 bg-black/60 group-hover:bg-black/35 transition-colors duration-300" />
      </div>

      {/* Top Header: Unboxed Metadata & Hover Affordance */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-200 bg-black/70 px-3 py-1.5 rounded border border-white/15">
            {getCategoryIcon(project.category)}
            <span className="uppercase tracking-wider font-semibold text-white">{project.categoryLabel}</span>
            <span className="text-white/40">·</span>
            <span className="text-[#00f0ff]">{project.year}</span>
            {project.images && project.images.length > 1 && (
              <>
                <span className="text-white/40">·</span>
                <span className="text-[#00f0ff] font-bold">{project.images.length} Media</span>
              </>
            )}
          </div>

          <motion.div
            variants={{
              rest: { opacity: 0, x: 8, y: -8 },
              hover: { opacity: 1, x: 0, y: 0 }
            }}
            className="bg-[#00f0ff] text-black rounded-full p-2.5 will-change-transform"
          >
            <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
          </motion.div>
        </div>

        {/* Bottom Details */}
        <div className="space-y-2">
          {/* Client & Role */}
          <p className="text-xs font-mono tracking-widest uppercase text-[#ffb800] font-semibold">
            {project.client}
          </p>

          {/* Project Title */}
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-2xl md:text-3xl font-bold uppercase text-white leading-tight will-change-transform"
              variants={{
                rest: { y: 0 },
                hover: { y: -2 }
              }}
              transition={{ duration: 0.25 }}
            >
              {project.title}
            </motion.h3>
          </div>

          {/* Tools stack preview */}
          <div className="pt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-300 font-mono">
            {project.tools.slice(0, 3).map((tool, idx) => (
              <React.Fragment key={tool}>
                <span>{tool}</span>
                {idx < Math.min(project.tools.length, 3) - 1 && <span className="text-white/30">/</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ProjectCard;
