/**
 * Visual Effects Utilities for Track B-3
 *
 * Provides CSS filter and style generation for visual effects:
 * - glow: Outer glow effect using box-shadow or filter
 * - drop_shadow: Drop shadow effect
 * - text_outline: Text stroke for better readability
 * - vignette: Edge darkening overlay
 * - blur_background: Background blur effect
 */

import { VisualEffect, VisualEffectType } from '../types/schema';

export interface EffectStyles {
  filter?: string;
  boxShadow?: string;
  textShadow?: string;
  WebkitTextStroke?: string;
  // Additional styles that might be needed
  [key: string]: string | number | undefined;
}

/**
 * Generate CSS styles for a visual effect
 */
export const getEffectStyles = (effect: VisualEffect): EffectStyles => {
  const {
    type,
    intensity = 0.5,
    color = '#FFFFFF',
    options = {},
  } = effect;

  switch (type) {
    case 'glow': {
      const radius = options.radius || Math.round(20 * intensity);
      const spread = Math.round(radius * 0.5);
      return {
        boxShadow: `0 0 ${radius}px ${spread}px ${color}`,
        filter: `drop-shadow(0 0 ${radius / 2}px ${color})`,
      };
    }

    case 'drop_shadow': {
      const offsetX = options.offsetX ?? 4;
      const offsetY = options.offsetY ?? 4;
      const blur = options.radius || Math.round(10 * intensity);
      const shadowColor = adjustColorOpacity(color, intensity);
      return {
        boxShadow: `${offsetX}px ${offsetY}px ${blur}px ${shadowColor}`,
        filter: `drop-shadow(${offsetX}px ${offsetY}px ${blur}px ${shadowColor})`,
      };
    }

    case 'text_outline': {
      const strokeWidth = Math.round(2 * intensity);
      return {
        WebkitTextStroke: `${strokeWidth}px ${color}`,
        textShadow: generateTextOutlineShadow(strokeWidth, color),
      };
    }

    case 'blur_background': {
      const blurAmount = options.radius || Math.round(10 * intensity);
      return {
        backdropFilter: `blur(${blurAmount}px)`,
        WebkitBackdropFilter: `blur(${blurAmount}px)`,
      };
    }

    case 'motion_blur': {
      const blurAmount = Math.round(5 * intensity);
      return {
        filter: `blur(${blurAmount}px)`,
      };
    }

    default:
      return {};
  }
};

/**
 * Generate CSS filter string for combining multiple effects
 */
export const combineEffectFilters = (effects: VisualEffect[]): string => {
  const filters: string[] = [];

  effects.forEach((effect) => {
    const styles = getEffectStyles(effect);
    if (styles.filter && !styles.filter.includes('drop-shadow')) {
      filters.push(styles.filter);
    }
  });

  return filters.length > 0 ? filters.join(' ') : 'none';
};

/**
 * Generate vignette overlay styles
 */
export const getVignetteStyles = (intensity: number = 0.5): React.CSSProperties => {
  const opacity = intensity * 0.8;
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${opacity}) 100%)`,
  };
};

/**
 * Generate spotlight overlay styles
 */
export const getSpotlightStyles = (
  x: number,
  y: number,
  radius: number = 200,
  intensity: number = 0.7
): React.CSSProperties => {
  const opacity = intensity * 0.9;
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    background: `radial-gradient(circle ${radius}px at ${x}px ${y}px, transparent 0%, rgba(0,0,0,${opacity}) 100%)`,
  };
};

/**
 * Generate screen shake transform
 */
export const getScreenShakeTransform = (
  frame: number,
  intensity: number = 0.5,
  frequency: number = 30
): string => {
  const amplitude = 10 * intensity;
  const time = frame / frequency;

  // Use sine waves with different frequencies for organic shake
  const x = Math.sin(time * 17.3) * amplitude + Math.sin(time * 31.7) * amplitude * 0.5;
  const y = Math.sin(time * 23.1) * amplitude + Math.sin(time * 29.3) * amplitude * 0.5;
  const rotation = Math.sin(time * 13.7) * intensity * 2;

  return `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
};

// ===== Helper Functions =====

/**
 * Adjust color opacity
 */
function adjustColorOpacity(color: string, opacity: number): string {
  // If color is hex, convert to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  // If color is already rgba, adjust opacity
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/, `${opacity})`);
  }
  return color;
}

/**
 * Generate text outline using multiple text-shadows
 */
function generateTextOutlineShadow(width: number, color: string): string {
  const shadows: string[] = [];
  const steps = 8;

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const x = Math.cos(angle) * width;
    const y = Math.sin(angle) * width;
    shadows.push(`${x.toFixed(1)}px ${y.toFixed(1)}px 0 ${color}`);
  }

  return shadows.join(', ');
}

export default getEffectStyles;
