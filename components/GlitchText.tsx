/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface SolidTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  color?: 'white' | 'cyan' | 'amber';
}

const GradientText: React.FC<SolidTextProps> = ({ 
  text, 
  as: Component = 'span', 
  className = '',
  color = 'cyan'
}) => {
  const textColorClass = color === 'cyan' 
    ? 'text-[#00f0ff]' 
    : color === 'amber' 
      ? 'text-[#ffb800]' 
      : 'text-white';

  return (
    <Component className={`font-black tracking-tighter ${textColorClass} ${className}`}>
      {text}
    </Component>
  );
};

export default GradientText;
