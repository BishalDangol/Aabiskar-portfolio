/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpRight, 
  Box, 
  Film, 
  Palette, 
  Sparkles, 
  Check, 
  Send, 
  Menu, 
  ExternalLink,
  Layers,
  Volume2,
  VolumeX,
  Clock,
  Briefcase,
  Monitor
} from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ProjectCard from './components/ProjectCard';
import { MultimediaProject, MultimediaCategory, CraftPillar, InquiryTier } from './types';

// Authentic Multimedia Portfolio Works for Aabiskar
const PROJECTS: MultimediaProject[] = [
  { 
    id: '1', 
    title: 'Cybernetic Exoskeleton 01', 
    category: '3d', 
    categoryLabel: '3D Hard Surface', 
    year: '2025', 
    client: 'Apex Robotics Lab', 
    image: '/src/assets/images/cyber_mecha_3d_1792333944258.jpg',
    tools: ['Blender', 'Octane Render', 'ZBrush', 'Substance Painter'],
    summary: 'An intricate hard-surface character sculpt and mechanical assembly, featuring high-tolerance carbon fiber weave, illuminated micro-circuit routing, and articulating gold-plated cervical joints designed for real-time virtual production.',
    deliverables: ['High-Poly 3D Sculpt', '4K UDIM Texturing', 'Lighting & Rigging', 'Cinematic Lookdev'],
    featured: true
  },
  { 
    id: '2', 
    title: 'Kinetic Typographic Odyssey', 
    category: 'video', 
    categoryLabel: 'Motion & Film', 
    year: '2025', 
    client: 'Teknow Sound Systems', 
    image: '/src/assets/images/motion_video_reel_1792333960450.jpg',
    tools: ['After Effects', 'Cinema 4D', 'Redshift', 'DaVinci Resolve'],
    summary: 'High-octane title sequence and commercial audio visualizer exploring dynamic spatial typography, particle dispersion physics, and anamorphic optical grading for broadcast.',
    deliverables: ['Broadcast Title Sequence', 'Kinetic Typography System', 'Audio-Reactive Compositing', 'Color Grading'],
    featured: true
  },
  { 
    id: '3', 
    title: 'Design // Brut Exhibition Identity', 
    category: 'graphic', 
    categoryLabel: 'Visual Identity', 
    year: '2024', 
    client: 'Matte Gallery London', 
    image: '/src/assets/images/graphic_design_system_1792333976150.jpg',
    tools: ['Adobe Illustrator', 'InDesign', 'Photoshop', 'Figma'],
    summary: 'A progressive visual identity and exhibition system exploring architectural brutalism, vector wireframe hierarchies, and holographic foil print production for contemporary art institutions.',
    deliverables: ['Exhibition Brand Guidelines', 'Custom Geometric Glyph Set', 'Screenprint & Foil Posters', 'Digital Identity Assets']
  },
  { 
    id: '4', 
    title: 'Resonance Waveform Matrix', 
    category: 'interactive', 
    categoryLabel: 'Interactive Media', 
    year: '2025', 
    client: 'Soma Spatial Audio', 
    image: '/src/assets/images/interactive_generative_art_1792333989351.jpg',
    tools: ['TouchDesigner', 'WebGL', 'GLSL Shaders', 'Three.js'],
    summary: 'An interactive audio-reactive installation deployed across a 36-meter curved LED architectural array, interpreting real-time sound frequencies into undulating luminous particle ribbons.',
    deliverables: ['Real-Time GLSL Shaders', 'TouchDesigner Network', 'Multi-Display Output Sync', 'Interactive Sensor Hookup'],
    featured: true
  },
  { 
    id: '5', 
    title: 'Monolith Citadel IX', 
    category: '3d', 
    categoryLabel: '3D Environment', 
    year: '2024', 
    client: 'Vanguard Interactive', 
    image: '/src/assets/images/unreal_environment_3d_1792334005686.jpg',
    tools: ['Unreal Engine 5', 'Houdini', 'Megascans', 'Lumen & Nanite'],
    summary: 'Real-time cinematic worldbuilding for a speculative sci-fi production, featuring brutalist megaliths, atmospheric storm dynamics, and procedural terrain generation built in UE5.',
    deliverables: ['UE5 Environment Level', 'Procedural Houdini Assets', 'Dynamic Weather Systems', 'Lighting & Sequence Direction']
  },
  { 
    id: '6', 
    title: 'Apex Velocity: Midnight Rush', 
    category: 'video', 
    categoryLabel: 'Commercial Video & VFX', 
    year: '2024', 
    client: 'Hyperion Automotive', 
    image: '/src/assets/images/vfx_commercial_film_1792334018715.jpg',
    tools: ['Premiere Pro', 'DaVinci Resolve', 'Nuke', 'After Effects'],
    summary: 'A high-impact commercial video edit and VFX color treatment celebrating nocturnal automotive speed, neon city reflections, and pulse-raising sound design.',
    deliverables: ['Commercial Cut (60s & 30s)', 'VFX Cleanups & Neon Glow', '35mm Film Emulation', 'Dolby Vision Color Grade']
  },
];

// Core Disciplines Breakdown
const CRAFT_PILLARS: CraftPillar[] = [
  {
    number: '01',
    title: 'Spatial 3D & Environments',
    subtitle: 'Hard-surface modeling, procedural texturing, and Unreal Engine 5 worlds',
    description: 'Bridging physical realism and futuristic sci-fi aesthetics. From intricate cybernetic prop modeling to vast atmospheric environments rendered with Lumen and Nanite in Unreal Engine 5.',
    tools: ['Unreal Engine 5', 'Blender', 'Houdini', 'Octane Render', 'Substance 3D'],
    highlights: ['Photorealistic Lookdev', 'Procedural Geometry & Shaders', 'Real-Time Virtual Production']
  },
  {
    number: '02',
    title: 'Motion Design & Commercial Film',
    subtitle: 'Kinetic typography, high-impact edits, and broadcast visual effects',
    description: 'Transforming sound and story into electrifying motion sequences. Specializing in commercial launch spots, music videos, Title sequences, and anamorphic color grading in DaVinci Resolve.',
    tools: ['After Effects', 'Cinema 4D', 'DaVinci Resolve', 'Premiere Pro', 'Redshift'],
    highlights: ['Kinetic Kinetic Typography', 'Dynamic Audio Synchronization', '35mm Film & Optical Grading']
  },
  {
    number: '03',
    title: 'Visual Identity & Graphic Systems',
    subtitle: 'Brutalist typography systems, exhibition design, and brand identity',
    description: 'Disciplined graphic design anchored in geometric harmony and architectural weight. Crafting iconic brand identities, bespoke typographic glyphs, and screenprint-ready editorial layouts.',
    tools: ['Adobe Illustrator', 'InDesign', 'Figma', 'Photoshop'],
    highlights: ['Complete Brand Guidelines', 'Custom Display Typography', 'Spatial Exhibition Graphics']
  },
  {
    number: '04',
    title: 'Interactive & Generative Media',
    subtitle: 'Real-time WebGL, TouchDesigner installations, and audio-reactive shaders',
    description: 'Merging code and creative vision to build living, reactive digital canvases. Engineering WebGL browser experiences, immersive gallery installations, and custom shader pipelines.',
    tools: ['Three.js', 'TouchDesigner', 'GLSL Shaders', 'React / TypeScript'],
    highlights: ['Real-Time Audio Reactivity', 'Hardware Sensor Integration', 'High-FPS WebGL Visualizers']
  }
];

// Commission Inquiry Tiers
const INQUIRY_TIERS: InquiryTier[] = [
  {
    id: 'lookdev',
    title: 'Concept & Lookdev',
    timeline: '1–2 Weeks',
    description: 'Art direction, 3D style frames, moodboarding, and aesthetic exploration for new products or film concepts.',
    deliverables: ['Creative Direction Deck', '3D Styleframes & Lighting Tests', 'Color Palette & Typography System', 'High-Res Hero Keyframes']
  },
  {
    id: 'production',
    title: 'Commercial 3D & Motion',
    timeline: '3–4 Weeks',
    description: 'Complete commercial production from 3D modeling to kinetic sequence animation, sound design, and broadcast master.',
    deliverables: ['Custom 3D Assets & Rigging', '30s/60s Commercial Video Cut', 'VFX Compositing & Color Grade', 'Social & Broadcast Formats'],
    featured: true
  },
  {
    id: 'interactive',
    title: 'Interactive Web & Installation',
    timeline: '4–6 Weeks',
    description: 'Custom WebGL experiences, interactive 3D digital showrooms, or hardware-reactive TouchDesigner gallery displays.',
    deliverables: ['Three.js / WebGL Development', 'TouchDesigner Node Network', 'Custom Audio-Reactive Shaders', 'Deployment & Technical Support']
  }
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MultimediaCategory>('all');
  const [selectedProject, setSelectedProject] = useState<MultimediaProject | null>(null);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [isPlayingReel, setIsPlayingReel] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  
  // Commission form state
  const [selectedTier, setSelectedTier] = useState<string>('production');
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Keyboard navigation for project modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === 'ArrowLeft') navigateProject('prev');
      if (e.key === 'ArrowRight') navigateProject('next');
      if (e.key === 'Escape') setSelectedProject(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProject]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredProjects = activeCategory === 'all' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory);

  const navigateProject = (direction: 'next' | 'prev') => {
    if (!selectedProject) return;
    const currentList = filteredProjects.length > 0 ? filteredProjects : PROJECTS;
    const currentIndex = currentList.findIndex(p => p.id === selectedProject.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % currentList.length;
    } else {
      nextIndex = (currentIndex - 1 + currentList.length) % currentList.length;
    }
    setSelectedProject(currentList[nextIndex]);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-[#00f0ff] selection:text-black cursor-auto md:cursor-none overflow-x-hidden bg-[#08090d]">
      <CustomCursor />
      <FluidBackground />
      
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4 Links) — Zone 3 (1 Primary Action) */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 py-5 bg-[#08090d]/80 backdrop-blur-xl border-b border-white/[0.08]">
        {/* Zone 1: Wordmark */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-heading text-lg md:text-xl font-bold tracking-tighter text-white hover:text-[#00f0ff] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer bg-transparent border-none"
        >
          AABISKAR
        </button>
        
        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-medium tracking-widest uppercase">
          {[
            { label: 'Works', id: 'works' },
            { label: 'Disciplines', id: 'disciplines' },
            { label: 'About', id: 'about' },
            { label: 'Inquiries', id: 'inquiries' }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => scrollToSection(item.id)}
              className="text-gray-300 hover:text-[#00f0ff] transition-colors whitespace-nowrap shrink-0 cursor-pointer bg-transparent border-none py-1"
              data-hover="true"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden md:flex items-center shrink-0">
          <button 
            onClick={() => scrollToSection('inquiries')}
            className="border border-[#00f0ff]/50 px-6 py-2.5 text-xs font-mono font-semibold tracking-widest uppercase bg-[#00f0ff]/10 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer"
            data-hover="true"
          >
            Book Project
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 p-2 text-gray-200 hover:text-[#00f0ff]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#08090d]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden px-6"
          >
            {[
              { label: 'Selected Works', id: 'works' },
              { label: 'Disciplines', id: 'disciplines' },
              { label: 'About Aabiskar', id: 'about' },
              { label: 'Start an Inquiry', id: 'inquiries' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-2xl font-heading font-bold text-white hover:text-[#00f0ff] transition-colors uppercase bg-transparent border-none"
              >
                {item.label}
              </button>
            ))}
            
            <button 
              onClick={() => scrollToSection('inquiries')}
              className="mt-6 w-full max-w-xs border border-[#00f0ff] px-8 py-3.5 text-xs font-mono font-bold tracking-widest uppercase bg-[#00f0ff] text-black shadow-[0_0_25px_rgba(0,240,255,0.4)]"
            >
              Book Project
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-16">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-5xl"
        >
          {/* Editorial Unboxed Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2.5 text-xs md:text-sm font-mono tracking-[0.25em] text-[#00f0ff] uppercase mb-6"
          >
            <span>MULTIMEDIA DIRECTOR</span>
            <span className="text-white/30">·</span>
            <span>3D ARTIST</span>
            <span className="text-white/30">·</span>
            <span className="text-[#ffb800]">MOTION DESIGNER</span>
          </motion.div>

          {/* Main Name Heading with Cyber Glitch Gradient */}
          <div className="relative w-full flex justify-center items-center my-2">
            <GradientText 
              text="AABISKAR" 
              as="h1" 
              className="text-[16vw] md:text-[13vw] leading-[0.88] font-black tracking-tighter text-center" 
            />
            
            {/* Luminous Core Glow Orb */}
            <motion.div 
              className="absolute -z-20 w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-[#00f0ff]/10 blur-[60px] rounded-full pointer-events-none will-change-transform"
              animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transform: 'translateZ(0)' }}
            />
          </div>
          
          {/* Subtle Hairline Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "circOut" }}
            className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent my-6"
          />

          {/* High-Impact Hero Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-base md:text-xl font-light max-w-2xl mx-auto text-gray-200 leading-relaxed px-4"
          >
            Pioneering hyper-dimensional 3D spaces, kinetic motion narratives, and real-time interactive media for visionary brands and entertainment.
          </motion.p>

          {/* Dual Action Buttons: Reel & Explore */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-8"
          >
            <button
              onClick={() => setShowreelOpen(true)}
              className="group flex items-center gap-3 px-7 py-3.5 bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] text-black font-mono text-xs font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(0,240,255,0.35)] hover:shadow-[0_0_40px_rgba(0,240,255,0.6)] transition-all duration-300 cursor-pointer"
              data-hover="true"
            >
              <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
              <span>Watch 2025 Showreel</span>
            </button>

            <button
              onClick={() => scrollToSection('works')}
              className="px-7 py-3.5 border border-white/20 text-white font-mono text-xs font-semibold uppercase tracking-widest hover:border-white hover:bg-white/5 transition-all duration-300 cursor-pointer"
              data-hover="true"
            >
              Explore Selected Works
            </button>
          </motion.div>
        </motion.div>

        {/* MARQUEE CRAFT RIBBON */}
        <div className="w-full mt-16 md:mt-24 py-3.5 bg-[#00f0ff] text-black z-20 overflow-hidden shadow-[0_0_35px_rgba(0,240,255,0.35)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-sm md:text-base font-heading font-black px-8 flex items-center gap-4 tracking-wider">
                    3D ENVIRONMENTS <span className="text-black text-xs">◆</span> 
                    MOTION DESIGN <span className="text-black text-xs">◆</span> 
                    VFX & EDITING <span className="text-black text-xs">◆</span> 
                    BRAND IDENTITIES <span className="text-black text-xs">◆</span>
                    TOUCHDESIGNER <span className="text-black text-xs">◆</span>
                    UNREAL ENGINE 5 <span className="text-black text-xs">◆</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* WORKS SECTION */}
      <section id="works" className="relative z-10 py-20 md:py-28">
        <div className="max-w-[1500px] mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8">
            <div>
              <p className="text-xs font-mono text-[#00f0ff] tracking-[0.2em] uppercase mb-2">Portfolio Monograph</p>
              <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase leading-none text-white">
                Selected <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#ffb800]">
                  Creations
                </span>
              </h2>
            </div>

            {/* Interactive Discipline Filter Bar */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#121622] rounded-lg border border-white/10">
              {[
                { key: 'all', label: 'All Projects', count: PROJECTS.length },
                { key: '3d', label: '3D Design', count: PROJECTS.filter(p => p.category === '3d').length },
                { key: 'video', label: 'Video & Motion', count: PROJECTS.filter(p => p.category === 'video').length },
                { key: 'graphic', label: 'Graphic Design', count: PROJECTS.filter(p => p.category === 'graphic').length },
                { key: 'interactive', label: 'Interactive Media', count: PROJECTS.filter(p => p.category === 'interactive').length },
              ].map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveCategory(tab.key as MultimediaCategory)}
                    className={`px-3.5 py-2 text-xs font-mono tracking-wider transition-all duration-200 rounded-md flex items-center gap-2 cursor-pointer ${
                      isActive 
                        ? 'bg-[#00f0ff] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] tabular-nums ${isActive ? 'text-black/70 font-semibold' : 'text-gray-500'}`}>
                      ({tab.count})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onClick={() => setSelectedProject(project)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* CRAFT DISCIPLINES SECTION */}
      <section id="disciplines" className="relative z-10 py-20 md:py-32 bg-[#0c0f17]/80 backdrop-blur-md border-t border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <p className="text-xs font-mono text-[#ffb800] tracking-[0.2em] uppercase mb-3">Multidisciplinary Practice</p>
            <h2 className="text-3xl md:text-6xl font-heading font-bold uppercase leading-tight text-white mb-4">
              Creative <GradientText text="Disciplines" className="text-4xl md:text-7xl" />
            </h2>
            <p className="text-base text-gray-300 font-light leading-relaxed">
              Synthesizing cinematic 3D realism, kinetic motion graphics, architectural brand systems, and living code to construct holistic sensory narratives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {CRAFT_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="group relative p-8 md:p-10 bg-[#121622]/90 border border-white/10 hover:border-[#00f0ff]/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-heading text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#ffb800]">
                      {pillar.number}
                    </span>
                    <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Discipline</span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-heading font-bold text-white mb-2 group-hover:text-[#00f0ff] transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-mono text-[#ffb800] mb-4">
                    {pillar.subtitle}
                  </p>
                  <p className="text-sm text-gray-300 font-light leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">Key Highlights</p>
                    <div className="space-y-1.5">
                      {pillar.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-xs text-gray-200">
                          <span className="text-[#00f0ff]">▸</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-1.5">Software & Stack</p>
                    <p className="text-xs font-mono text-[#00f0ff]">
                      {pillar.tools.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT AABISKAR SECTION */}
      <section id="about" className="relative z-10 py-20 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Portrait / Creative Director Anchor */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-[#0c0f18] group">
                <img 
                  src="/src/assets/images/cyber_mecha_3d_1792333944258.jpg" 
                  alt="Aabiskar Studio Lookdev"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs font-mono text-[#00f0ff] uppercase tracking-wider mb-1">Creative Director</p>
                  <p className="text-2xl font-heading font-bold text-white">AABISKAR</p>
                  <p className="text-xs text-gray-300 font-mono mt-1">Multi-Disciplinary Visual Engineer</p>
                </div>
              </div>
            </div>

            {/* Editorial Bio & Claims */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs font-mono text-[#00f0ff] tracking-[0.2em] uppercase">Artist Statement</p>
              <h2 className="text-3xl md:text-5xl font-heading font-bold leading-tight text-white">
                Designing at the intersection of <br />
                <span className="text-[#00f0ff]">Synthetic Light</span> & <span className="text-[#ffb800]">Cinematic Chaos</span>
              </h2>
              
              <p className="text-base md:text-lg text-gray-300 font-light leading-relaxed">
                With a deep background spanning 3D CGI worldbuilding, kinetic broadcast motion, experimental visual systems, and real-time interactive shaders, Aabiskar translates abstract concepts into unforgettable sensory realities.
              </p>
              
              <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed">
                Whether directing hyper-detailed product commercial reels, architecting visual identities for forward-looking tech companies, or engineering audio-reactive spatial installations, each project is crafted with unyielding precision and aesthetic discipline.
              </p>

              {/* Verified Metrics / Proof strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                {[
                  { value: '8+', label: 'Years Experience' },
                  { value: '120+', label: 'Finished Works' },
                  { value: '40+', label: 'Global Clients' },
                  { value: '15+', label: 'Design Accolades' },
                ].map((stat, idx) => (
                  <div key={idx} className="p-4 bg-[#121622]/60 rounded-lg border border-white/5">
                    <p className="text-2xl md:text-3xl font-heading font-bold text-[#00f0ff] tabular-nums">
                      {stat.value}
                    </p>
                    <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMISSIONS & INQUIRIES SECTION */}
      <section id="inquiries" className="relative z-10 py-20 md:py-32 bg-[#0a0d14]/90 backdrop-blur-xl border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-mono text-[#00f0ff] tracking-[0.25em] uppercase mb-3">Project Commissions & Bookings</p>
            <h2 className="text-4xl md:text-7xl font-heading font-bold uppercase text-white mb-4">
              Initiate <GradientText text="COLLABORATION" className="text-4xl md:text-7xl" />
            </h2>
            <p className="text-gray-300 font-light max-w-xl mx-auto text-base">
              Accepting select commercial commissions, 3D direction, motion sequences, and interactive installations.
            </p>
          </div>

          {/* Interactive Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {INQUIRY_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => setSelectedTier(tier.id)}
                  className={`relative p-8 md:p-10 border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                    isSelected 
                      ? 'bg-[#131929] border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.2)]' 
                      : 'bg-[#0f131f]/70 border-white/10 hover:border-white/30'
                  }`}
                  data-hover="true"
                >
                  {tier.featured && (
                    <div className="absolute top-0 right-0 bg-[#00f0ff] text-black text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1">
                      Recommended
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl md:text-2xl font-heading font-bold text-white">{tier.title}</h3>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#00f0ff] bg-[#00f0ff] text-black' : 'border-white/30'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#ffb800] mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Turnaround: {tier.timeline}</span>
                    </div>

                    <p className="text-sm text-gray-300 font-light leading-relaxed mb-6">
                      {tier.description}
                    </p>

                    <div className="space-y-2 border-t border-white/10 pt-4">
                      <p className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2">Scope Inclusions</p>
                      {tier.deliverables.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-gray-300">
                          <span className="text-[#00f0ff] mt-0.5">▪</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTier(tier.id);
                    }}
                    className={`w-full mt-8 py-3 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#00f0ff] text-black border-[#00f0ff]'
                        : 'bg-transparent text-white border-white/20 hover:border-white hover:bg-white/5'
                    }`}
                  >
                    {isSelected ? 'Package Selected' : 'Select Package'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Interactive Direct Inquiry Form */}
          <div className="max-w-3xl mx-auto bg-[#121622] border border-white/10 p-8 md:p-12 rounded-xl">
            <h3 className="text-2xl font-heading font-bold uppercase text-white mb-2">
              Send Project Brief
            </h3>
            <p className="text-sm text-gray-400 font-light mb-8">
              Selected package: <span className="text-[#00f0ff] font-mono font-medium">{INQUIRY_TIERS.find(t => t.id === selectedTier)?.title}</span>
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center bg-[#00f0ff]/10 border border-[#00f0ff]/40 rounded-lg space-y-3"
              >
                <div className="w-12 h-12 bg-[#00f0ff] text-black rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-xl font-heading font-bold text-white uppercase">Inquiry Transmitted</h4>
                <p className="text-sm text-gray-300 max-w-md mx-auto">
                  Thank you for reaching out. Aabiskar reviews all inquiries within 24–48 hours. We will be in touch via <span className="text-[#00f0ff] font-mono">{formEmail}</span>.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormDetails('');
                  }}
                  className="mt-4 text-xs font-mono text-[#00f0ff] underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                      Your Name / Organization
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Elena Rostova / Studio Monolith"
                      className="w-full bg-[#0a0d14] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f0ff] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="client@company.com"
                      className="w-full bg-[#0a0d14] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f0ff] font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-gray-300 mb-2">
                    Project Scope & Objectives
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formDetails}
                    onChange={(e) => setFormDetails(e.target.value)}
                    placeholder="Describe your deliverables, target dates, or creative vision..."
                    className="w-full bg-[#0a0d14] border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#00f0ff] font-mono resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#00f0ff] text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-[#38bdf8] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  data-hover="true"
                >
                  {isSubmitting ? (
                    <span>Transmitting Brief...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Project Brief</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/[0.08] py-14 md:py-20 bg-[#06080b]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <div className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              AABISKAR
            </div>
            <p className="text-xs font-mono text-gray-400 tracking-wider uppercase">
              MULTIMEDIA ARTIST · 3D DIRECTOR · MOTION DESIGN
            </p>
            <p className="text-xs text-gray-500 font-mono mt-4">
              © {new Date().getFullYear()} Aabiskar. All creative rights reserved.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-6 md:gap-8 font-mono text-xs tracking-widest uppercase">
            {[
              { label: 'ArtStation', href: 'https://artstation.com' },
              { label: 'Behance', href: 'https://behance.net' },
              { label: 'Vimeo', href: 'https://vimeo.com' },
              { label: 'X / Twitter', href: 'https://x.com' },
              { label: 'LinkedIn', href: 'https://linkedin.com' },
              { label: 'Email Aabiskar', href: 'mailto:contact@aabiskar.studio' },
            ].map((link) => (
              <a 
                key={link.label}
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#00f0ff] transition-colors cursor-pointer"
                data-hover="true"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* SHOWREEL MODAL */}
      <AnimatePresence>
        {showreelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowreelOpen(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-[#0d1017] border border-[#00f0ff]/30 overflow-hidden shadow-2xl shadow-[#00f0ff]/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#08090d]">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-wider text-white">
                    Aabiskar — Official 2025 Showreel · 4K UHD
                  </span>
                </div>
                <button
                  onClick={() => setShowreelOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close Showreel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cinematic Video Showcase Canvas */}
              <div className="relative aspect-video bg-black overflow-hidden group">
                <img 
                  src="/src/assets/images/motion_video_reel_1792333960450.jpg" 
                  alt="Showreel Preview" 
                  className={`w-full h-full object-cover transition-transform duration-1000 ${isPlayingReel ? 'scale-105' : 'scale-100'}`}
                />
                
                {/* Dynamic waveform visualizer overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-end p-6">
                  {/* Waveform bars simulation */}
                  <div className="flex items-end gap-1 h-8 mb-4">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-gradient-to-t from-[#00f0ff] to-[#ffb800] rounded-t-sm"
                        animate={{
                          height: isPlayingReel 
                            ? [`${Math.sin(i * 0.4) * 15 + 18}px`, `${Math.cos(i * 0.5) * 20 + 24}px`, `${Math.sin(i * 0.3) * 12 + 15}px`] 
                            : '4px'
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: 'reverse',
                          delay: i * 0.03
                        }}
                      />
                    ))}
                  </div>

                  {/* Playback Controls Strip */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setIsPlayingReel(!isPlayingReel)}
                        className="p-2 bg-[#00f0ff] text-black rounded-full hover:bg-white transition-colors cursor-pointer"
                      >
                        {isPlayingReel ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <button
                        onClick={() => setIsAudioMuted(!isAudioMuted)}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                      >
                        {isAudioMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-[#00f0ff]" />}
                      </button>

                      <span className="text-gray-300">01:42 / 02:48</span>
                    </div>

                    <div className="text-[#00f0ff] tracking-widest uppercase">
                      Directorial Reel
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROJECT INSPECTION MODAL (LIGHTBOX) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-[#0e121a] border border-white/10 flex flex-col md:flex-row shadow-2xl shadow-[#00f0ff]/10"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 text-white hover:bg-[#00f0ff] hover:text-black transition-colors cursor-pointer"
                data-hover="true"
                aria-label="Close Project"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Prev / Next Keyboard Navigation */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateProject('prev'); }}
                className="absolute left-4 bottom-4 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-[#00f0ff] hover:text-black transition-colors border border-white/10 cursor-pointer"
                data-hover="true"
                aria-label="Previous Project"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateProject('next'); }}
                className="absolute right-4 bottom-4 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/60 text-white hover:bg-[#00f0ff] hover:text-black transition-colors border border-white/10 cursor-pointer"
                data-hover="true"
                aria-label="Next Project"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Media Visual Container */}
              <div className="w-full md:w-1/2 min-h-[300px] md:min-h-[550px] relative overflow-hidden bg-black flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedProject.id}
                    src={selectedProject.image} 
                    alt={selectedProject.title} 
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e121a] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Project Metadata & Narrative */}
              <div className="w-full md:w-1/2 p-8 md:p-12 pb-20 md:pb-12 flex flex-col justify-between">
                <motion.div
                  key={selectedProject.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[#00f0ff]">
                    <span className="uppercase tracking-widest font-semibold">{selectedProject.categoryLabel}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-gray-300">{selectedProject.year}</span>
                    <span className="text-white/30">·</span>
                    <span className="text-[#ffb800]">{selectedProject.client}</span>
                  </div>
                  
                  <h3 className="text-3xl md:text-5xl font-heading font-bold uppercase leading-none text-white">
                    {selectedProject.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed text-sm md:text-base font-light">
                    {selectedProject.summary}
                  </p>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                        Deliverables & Scope
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {selectedProject.deliverables.map((item) => (
                          <div key={item} className="flex items-center gap-2 text-xs text-gray-200">
                            <span className="text-[#00f0ff]">▸</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                        Software & Tools
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedProject.tools.map((tool) => (
                          <span 
                            key={tool} 
                            className="text-xs font-mono px-2.5 py-1 bg-white/5 border border-white/10 text-gray-200"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="pt-8">
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      scrollToSection('inquiries');
                    }}
                    className="w-full py-3.5 bg-[#00f0ff] text-black font-mono text-xs font-bold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
                  >
                    Inquire About Similar Work
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;