/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export type MultimediaCategory = 'all' | '3d' | 'video' | 'graphic' | 'interactive';

export interface MultimediaProject {
  id: string;
  title: string;
  category: '3d' | 'video' | 'graphic' | 'interactive';
  categoryLabel: string;
  year: string;
  client: string;
  image: string;
  images?: string[];
  tools: string[];
  summary: string;
  deliverables: string[];
  featured?: boolean;
}

export interface CraftPillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tools: string[];
  highlights: string[];
}

export interface InquiryTier {
  id: string;
  title: string;
  timeline: string;
  description: string;
  deliverables: string[];
  featured?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
