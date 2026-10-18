# Aabiskar — Multimedia Creative Director & 3D Artist Portfolio

Transform the current event-template codebase into a world-class, high-impact personal portfolio for **Aabiskar**, an experienced multimedia artist specializing in **3D Design, Video & Motion, Graphic Design, and Interactive Media**. The experience transitions from a generic music festival site to an authentic creative showcase with a Cyberpunk Obsidian, Electric Cyan, and Neon Amber palette, fluid WebGL/Framer shader atmosphere, filterable portfolio showcase, interactive project lightbox, immersive reel player, creative disciplines breakdown, and an interactive project inquiry system.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during clarification:
> - **Color Scheme**: Cyberpunk Obsidian canvas (`#08090D`) with Electric Cyan (`#00F0FF`) and Neon Amber (`#FFB800`) accents.
> - **Core Multimedia Disciplines**: 3D Design, Video & Motion, Graphic Design, and Interactive Media.
> - **Hero Presentation**: Immersive showreel hero with interactive project modal inspection and custom fluid ambient shader.

- **Confirmed Decision 1**: Retain and restyle the fluid canvas shader into Cyberpunk Obsidian / Electric Cyan / Neon Amber luminous plasma gradients with dark grain texture.
- **Confirmed Decision 2**: Transform the lineup grid into a filterable multimedia portfolio showcase (`All`, `3D Design`, `Video & Motion`, `Graphic Design`, `Interactive Media`) with high-resolution imagery, discipline tags, toolstack metadata, and detailed interactive modal inspection.
- **Confirmed Decision 3**: Replace ticket tier cards with an interactive "Project Collaboration & Commissions" inquiry panel with project scope selection, timeline estimates, and direct contact booking.
- **Confirmed Decision 4**: Modernize typography to Outfit / Space Grotesk with anti-slop zero-pill discipline, natural editorial numbering, and strict 60-30-10 color allocation.

---

## 1. Overview & Core Concept

- **What It Does**: Serves as the premier digital monograph and client pitch platform for Aabiskar. Visitors experience Aabiskar's multidisciplinary work through an audiovisual hero showreel, dynamic discipline filtering, high-resolution media modals with project breakdowns (client, software stack, year, role, breakdown notes), interactive technical capabilities breakdown, and an engaging commission inquiry module.
- **Target Audience / Persona**: Creative directors, game studios, commercial film producers, tech agencies, and high-growth brands seeking high-end 3D art, kinetic motion design, brand graphics, and interactive digital experiences.
- **Key Value**: Positions Aabiskar as an elite, end-to-end multimedia visual architect capable of bridging technical 3D engineering with cinematic storytelling and brand aesthetics.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **First Arrival & Hero Impact**:
   - The visitor lands on a full-bleed cinematic hero featuring Aabiskar's brand identity: *"AABISKAR · MULTIMEDIA ARTIST & 3D DIRECTOR"*.
   - Ambient fluid background reacts with deep obsidian depth and electric cyan/amber luminous clouds.
   - Visitor can click "Watch Showreel" to open the interactive reel lightbox or scroll down to explore works.
   - Dynamic marquee ribbon displays verified craft tags: `3D CGI & ENVIRONMENT · MOTION DESIGN · BRAND IDENTITIES · GENERATIVE SHADERS · CINEMATIC EDITING`.

2. **Multimedia Works Showcase**:
   - Filterable category bar (`All`, `3D Design`, `Video & Motion`, `Graphic Design`, `Interactive Media`).
   - Cards present project hero previews, client title, discipline kicker, and subtle hover interaction without pill badges.
   - Clicking any project opens the full-screen Project Inspection Modal with key art, project background, tools used (Blender, Unreal Engine 5, Cinema 4D, After Effects, TouchDesigner, Three.js), role, and deliverables.
   - Arrow keys (`←` / `→`) and onscreen buttons allow seamless browsing between projects.

3. **Creative Disciplines & Philosophy**:
   - Replaces the generic "Experience" section with Aabiskar's 4 core craft pillars:
     1. **01. Spatial 3D & Environments**: Hard-surface modeling, procedural texturing, architectural visualization, and real-time Unreal Engine 5 worlds.
     2. **02. Motion Graphics & Video**: Kinetic typography, commercial editing, color grading (DaVinci Resolve), and high-retention broadcast teasers.
     3. **03. Visual Identity & Graphic Systems**: Brand guidelines, vector iconography, typography systems, and editorial publication layouts.
     4. **04. Interactive & Generative Media**: WebGL experiences, interactive installations, audio-reactive shaders, and experimental micro-interactions.

4. **Collaboration & Commission Inquiries**:
   - Replaces ticket sales with an interactive Project Inquiries & Booking configurator.
   - Visitors choose project scale (*Concept & Art Direction*, *Full Commercial Production*, *Interactive & 3D Web*), specify timeline, and launch an inquiry.
   - Interactive feedback provides immediate confirmation with simulated inquiry submission.

5. **Footer & Global Connections**:
   - Clean 3-zone layout with Aabiskar wordmark, direct social channels (ArtStation, Behance, Vimeo, X, LinkedIn, Email), and copyright statement.

### Visual Identity & Theme

- **Aesthetic Direction**: High-fidelity Cyberpunk Obsidian editorial portfolio. Sharp, atmospheric, restrained, with cinematic lighting and premium finish.
- **Color Palette & Theme Tokens**:
  - `Canvas Neutral (60%)`: Obsidian Black (`#08090D`), deep charcoal card surfaces (`#0F121B`), subtle slate borders (`rgba(255, 255, 255, 0.08)`).
  - `Structural Surfaces (30%)`: Dark carbon cards (`#131722`), semi-transparent backdrop blur (`rgba(15, 18, 27, 0.85)`), hairline borders.
  - `Accent Budget (10%)`: Electric Cyan (`#00F0FF`) for active states and primary focus highlights; Neon Amber (`#FFB800`) for secondary badges, warmth, and hover accents.
- **Typography & Hierarchy**:
  - Display / Hero: `Syncopate` & `Space Grotesk` uppercase tracking (`tracking-tight` / `tracking-widest`).
  - Body & Descriptions: `Space Grotesk` (400 regular, 500 medium, line-height 1.6).
  - Tabular & Metadata: Tabular numerals with subtle typographic separators (`·`, `/`).
- **Component Styling & Anti-Slop Rules**:
  - No static pill capsules for metadata — clean unboxed inline text with subtle dot separators.
  - No fake comment headers (`// 01`) or mock compiler tags; clean editorial numbering (`01. Spatial 3D & Environments`).
  - Strict Top Bar Contract: 1-line wordmark, 4 clean nav links (`Works`, `Disciplines`, `About`, `Contact`), and 1 primary CTA button (`Book Project`).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Specialized Multimedia Data Model instead of Generic Band Lineup**:
  - *Chosen Approach*: Replace `LINEUP: Artist[]` with `PROJECTS: MultimediaProject[]` containing rich metadata: category, client, year, software tools (`Blender`, `UE5`, `After Effects`, `TouchDesigner`), hero visual, video preview link, and narrative case study summary.
  - *Why*: Directly communicates Aabiskar's breadth and technical mastery to prospective clients and agencies.
- **Decision 2: Interactive Showreel & Modal Lightbox**:
  - *Chosen Approach*: Embed an interactive Showreel player modal in the hero alongside the rich project inspector modal.
  - *Why*: Multimedia clients demand instant visual proof within 5 seconds of landing.
- **Decision 3: Retaining Fluid Canvas Shader with Restyled Obsidian Palette**:
  - *Chosen Approach*: Reconfigure `FluidBackground.tsx` to emit Electric Cyan (`#00F0FF`), Neon Amber (`#FFB800`), and Deep Midnight Cobalt (`#151C38`) on obsidian black.
  - *Why*: Preserves the fluid, interactive 60fps ambient visual signature that sets the portfolio apart while matching the cyber aesthetic requested.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                              App.tsx                                   │
│  - Active Filter State ('all' | '3d' | 'video' | 'graphic' | 'media')   │
│  - Selected Project State (MultimediaProject | null)                   │
│  - Showreel Modal State (boolean)                                      │
│  - Inquiry Form State (scope, timeline, email, message)                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│  TopNavBar   │             │   HeroReel   │             │ FilterBar    │
│  - Wordmark  │             │  - GlitchText│             │  - Category  │
│  - Nav Links │             │  - CTA Reel  │             │    Buttons   │
│  - Book CTA  │             │  - Marquee   │             │  - Counts    │
└──────────────┘             └──────────────┘             └──────┬───────┘
                                                                 │
       ┌─────────────────────────────────────────────────────────┘
       ▼
┌────────────────────────────┐    ┌────────────────────────────┐
│      ProjectsGrid          │    │     DisciplinesSection     │
│  - ProjectCard (3D/Video)  │    │  - 01 Spatial 3D / UE5     │
│  - Hover Zoom & Lighting   │    │  - 02 Motion & Film        │
│  - Tag & Tool Preview      │    │  - 03 Brand Identity       │
└──────────────┬─────────────┘    │  - 04 Interactive Shaders  │
               │                  └────────────────────────────┘
               ▼
┌────────────────────────────┐    ┌────────────────────────────┐
│   ProjectModal (Lightbox)  │    │      InquirySection        │
│  - High-res Media Viewer   │    │  - Service Selection       │
│  - Toolstack Badges        │    │  - Budget & Timeline       │
│  - Next / Prev Keyboard Nav│    │  - Interactive Submission  │
└────────────────────────────┘    └────────────────────────────┘
               │
               ▼
┌────────────────────────────┐
│      FluidBackground       │
│  - Cyan & Amber Blobs      │
│  - Optimized Grain & Stars │
└────────────────────────────┘
```

### Data Model & State (`types.ts`)

```typescript
export type MultimediaCategory = '3d' | 'video' | 'graphic' | 'interactive';

export interface MultimediaProject {
  id: string;
  title: string;
  category: MultimediaCategory;
  categoryLabel: string;
  year: string;
  client: string;
  image: string;
  videoUrl?: string;
  tools: string[];
  summary: string;
  deliverables: string[];
  aspectRatio?: 'landscape' | 'portrait' | 'square';
}
```

### Verification Plan

1. Verify TypeScript types and clean exports across `types.ts`, `App.tsx`, `components/ArtistCard.tsx` (migrated to `components/ProjectCard.tsx` or updated with backward compatibility), `FluidBackground.tsx`, and `GlitchText.tsx`.
2. Ensure `compile_applet` succeeds without errors or missing imports.
3. Verify interactive features: project category filtering, project lightbox opening/closing and keyboard navigation (`ESC`, `ArrowLeft`, `ArrowRight`), showreel modal, and commission inquiry interactive feedback.
4. Check responsive layout and visual fidelity across mobile and 1440px desktop viewports.
