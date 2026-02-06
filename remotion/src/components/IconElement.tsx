/**
 * IconElement - SVG icon display with animation
 *
 * Refactored to use useAnimationPhases hook for cleaner code
 */

import React from 'react';
import { staticFile } from 'remotion';
import { IconProps, AnimationDef } from '../types/schema';
import { useAnimationPhases } from '../hooks/useAnimationPhases';
import { ICON } from '../constants';

interface IconElementProps {
  props: IconProps;
  position: { x: number; y: number };
  scale?: number;
  animation?: {
    enter?: AnimationDef;
    during?: AnimationDef;
    exit?: AnimationDef;
  };
  sceneStartFrame: number;
  sceneDurationFrames: number;
}

// Inline SVG icons for MVP - common infographic icons
const INLINE_ICONS: Record<string, React.FC<{ size: number; color: string }>> = {
  'money-bag': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L9 6H15L12 2Z"
        fill={color}
      />
      <path
        d="M7 8C5 10 4 13 4 16C4 20 7 22 12 22C17 22 20 20 20 16C20 13 19 10 17 8H7Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M12 12V18M10 14H14M10 16H14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  'chart-up': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 20L9 14L13 18L21 10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 10H21V14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'piggy-bank': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse
        cx="12"
        cy="13"
        rx="8"
        ry="6"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="16" cy="11" r="1" fill={color} />
      <path d="M12 7V9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 15L3 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 15L21 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 19V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'lightbulb': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M9 21H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 24H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'warning': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L2 20H22L12 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill={color} />
    </svg>
  ),

  'clock': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M12 6V12L16 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'star': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'check': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M8 12L11 15L16 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  // ============================================
  // MVP 아이콘 (10개)
  // ============================================

  'coin': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill={color}
        fontSize="10"
        fontWeight="bold"
      >$</text>
    </svg>
  ),

  'bank': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 21H21"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5 21V11"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M9 21V11"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M15 21V11"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M19 21V11"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M12 3L3 9H21L12 3Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'wallet': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="6"
        width="18"
        height="14"
        rx="2"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M3 10H21"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="17" cy="14" r="1.5" fill={color} />
    </svg>
  ),

  'checkmark': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12L10 17L20 7"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'cross': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  'target': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2" fill={color} />
    </svg>
  ),

  'book': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 4C4 4 5 3 8 3C11 3 12 4 12 4V20C12 20 11 19 8 19C5 19 4 20 4 20V4Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M20 4C20 4 19 3 16 3C13 3 12 4 12 4V20C12 20 13 19 16 19C19 19 20 20 20 20V4Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'arrow-up': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 19V5M12 5L5 12M12 5L19 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'arrow-down': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5V19M12 19L5 12M12 19L19 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'question': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M9 9C9 7.5 10.5 6 12 6C13.5 6 15 7.5 15 9C15 10.5 13 11 12 12V14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="1" fill={color} />
    </svg>
  ),

  // ============================================
  // V2 아이콘 (25개)
  // ============================================

  'credit-card': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="2"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M2 9H22" stroke={color} strokeWidth="1.5" />
      <path d="M6 15H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'chart-down': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 4L9 10L13 6L21 14"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 14H21V10"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'calculator': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect x="6" y="4" width="12" height="4" rx="1" stroke={color} strokeWidth="1" />
      <circle cx="8" cy="12" r="1" fill={color} />
      <circle cx="12" cy="12" r="1" fill={color} />
      <circle cx="16" cy="12" r="1" fill={color} />
      <circle cx="8" cy="16" r="1" fill={color} />
      <circle cx="12" cy="16" r="1" fill={color} />
      <circle cx="16" cy="16" r="1" fill={color} />
      <circle cx="8" cy="20" r="1" fill={color} />
      <circle cx="12" cy="20" r="1" fill={color} />
      <circle cx="16" cy="20" r="1" fill={color} />
    </svg>
  ),

  'briefcase': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="7"
        width="20"
        height="13"
        rx="2"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M12 11V15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 13H22" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'heart': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21C12 21 3 14 3 8.5C3 5.5 5.5 3 8.5 3C10.24 3 11.91 3.81 12 5C12.09 3.81 13.76 3 15.5 3C18.5 3 21 5.5 21 8.5C21 14 12 21 12 21Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'lock': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.5" fill={color} />
    </svg>
  ),

  'gear': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  'graduation': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3L1 9L12 15L23 9L12 3Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M5 11V17C5 17 8 20 12 20C16 20 19 17 19 17V11"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M21 9V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'magnifier': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="10"
        cy="10"
        r="7"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M15 15L21 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),

  'globe': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke={color} strokeWidth="1.5" />
      <path d="M3 12H21" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'trophy': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M8 21H16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 17V21"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M7 3H17V9C17 12 15 17 12 17C9 17 7 12 7 9V3Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M7 5H4V7C4 9 5 10 7 10"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M17 5H20V7C20 9 19 10 17 10"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  ),

  'arrow-right': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'arrow-left': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M19 12H5M5 12L12 5M5 12L12 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'compare': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fill={color}
        fontSize="14"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >VS</text>
    </svg>
  ),

  'percentage': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="7" cy="7" r="3" stroke={color} strokeWidth="1.5" />
      <circle cx="17" cy="17" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M18 6L6 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'money-stack': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="2"
        y="6"
        width="20"
        height="12"
        rx="2"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
      <path d="M2 10H4" stroke={color} strokeWidth="1.5" />
      <path d="M20 10H22" stroke={color} strokeWidth="1.5" />
      <path d="M2 14H4" stroke={color} strokeWidth="1.5" />
      <path d="M20 14H22" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'savings': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M19 10C19 5 15.5 2 12 2C8.5 2 5 5 5 10C5 15 8 18 8 18H16C16 18 19 15 19 10Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M9 22H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 18V22" stroke={color} strokeWidth="1.5" />
      <path d="M10 7L14 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 7L10 11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'document': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 2V8H20" stroke={color} strokeWidth="1.5" />
      <path d="M8 13H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 17H12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'calendar': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M3 9H21" stroke={color} strokeWidth="1.5" />
      <path d="M8 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="14" r="1" fill={color} />
      <circle cx="12" cy="14" r="1" fill={color} />
      <circle cx="16" cy="14" r="1" fill={color} />
    </svg>
  ),

  'rocket': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22C14 20 16 16 16 12C16 6 12 2 12 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2" stroke={color} strokeWidth="1.5" />
      <path d="M8 14L4 16L6 12" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M16 14L20 16L18 12" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  'shield': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L4 6V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V6L12 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'bell': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8C18 4.7 15.3 2 12 2C8.7 2 6 4.7 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M13.7 21C13.5 21.4 13 21.7 12.4 21.9C11.5 22.1 10.5 21.9 9.9 21.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'home': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M3 12L12 3L21 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 10V20C5 20.6 5.4 21 6 21H18C18.6 21 19 20.6 19 20V10"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect x="9" y="14" width="6" height="7" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'user': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="8"
        r="4"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M4 20C4 17 7.6 14 12 14C16.4 14 20 17 20 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  'users': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="7" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M2 20C2 17 5 14 9 14C13 14 16 17 16 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="7" r="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M18 14C20.5 14.5 22 17 22 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'thumbs-up': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M7 22V11L10 3C11 3 13 4 13 7V10H20C21 10 22 11 21.8 12L20 20C19.8 21 19 22 18 22H7Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7 11H4V22H7" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'thumbs-down': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M7 2V13L10 21C11 21 13 20 13 17V14H20C21 14 22 13 21.8 12L20 4C19.8 3 19 2 18 2H7Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7 13H4V2H7" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'fire': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 8 6 8 10C8 12 9 14 10 15C9 16 8 18 8 19C8 21 10 23 12 23C14 23 16 21 16 19C16 18 15 16 14 15C15 14 16 12 16 10C16 6 12 2 12 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M12 15C11 16 10 17 10 18C10 19.5 11 20 12 20C13 20 14 19.5 14 18C14 17 13 16 12 15Z" fill={color} />
    </svg>
  ),

  'bolt': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2L4 14H12L11 22L20 10H12L13 2Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'sun': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="4"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M12 2V4M12 20V22M2 12H4M20 12H22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),

  'moon': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M21 12.79C20.8 14.4 20 15.9 19 17C16.8 19.5 13.2 20.5 10 19.5C6.8 18.5 4.2 15.9 3.5 12.5C2.8 9.2 4 5.5 6.5 3.3C5.5 6.3 6.2 9.7 8.3 12C10.4 14.3 13.8 15.2 16.8 14.3C18.3 13.8 19.8 12.9 21 12.79Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'cloud': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M18 10C19.7 10 21 11.3 21 13C21 14.7 19.7 16 18 16H7C4.8 16 3 14.2 3 12C3 9.8 4.8 8 7 8C7.4 8 7.8 8.1 8.2 8.2C9 5.8 11.3 4 14 4C17.3 4 20 6.7 20 10C20 10 19 10 18 10Z"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  ),

  'gift': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="8"
        width="18"
        height="4"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <rect
        x="5"
        y="12"
        width="14"
        height="9"
        fill={color}
        fillOpacity="0.3"
        stroke={color}
        strokeWidth="1.5"
      />
      <path d="M12 8V21" stroke={color} strokeWidth="1.5" />
      <path
        d="M12 8C12 8 9 8 8 6C7 4 9 2 11 3C12 3.5 12 5 12 8Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M12 8C12 8 15 8 16 6C17 4 15 2 13 3C12 3.5 12 5 12 8Z"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  ),
};

export const IconElement: React.FC<IconElementProps> = ({
  props,
  position,
  scale = 1,
  animation,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const { name, size = ICON.DEFAULT_SIZE, color = ICON.DEFAULT_COLOR } = props;

  // Use centralized animation hook with icon-specific defaults
  const {
    enterAnim,
    duringAnim,
    finalOpacity,
  } = useAnimationPhases(
    animation,
    sceneStartFrame,
    sceneDurationFrames,
    {
      enterType: ICON.DEFAULT_ENTER_ANIMATION,
      duringType: ICON.DEFAULT_DURING_ANIMATION,
      exitType: 'none',
    }
  );

  // Get icon component or fallback
  const IconComponent = INLINE_ICONS[name];

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${scale}) ${enterAnim.transform} ${duringAnim.transform}`,
        opacity: finalOpacity,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {IconComponent ? (
        <IconComponent size={size} color={color} />
      ) : (
        // Fallback: try to load from public/icons folder
        <img
          src={staticFile(`icons/${name}.svg`)}
          width={size}
          height={size}
          style={{
            filter: color !== '#FFFFFF' ? `drop-shadow(0 0 0 ${color})` : undefined,
          }}
          alt={name}
        />
      )}
    </div>
  );
};

export default IconElement;
