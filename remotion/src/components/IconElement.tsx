/**
 * IconElement - SVG icon display with animation
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { IconProps, AnimationDef } from '../types/schema';
import {
  calculateEnterAnimation,
  ENTER_DURATIONS,
} from '../animations/enter';
import {
  calculateDuringAnimation,
  DURING_CYCLES,
} from '../animations/during';
import {
  calculateExitAnimation,
  EXIT_DURATIONS,
} from '../animations/exit';
import { msToFrames } from '../utils/timing';

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
  // L1 V3 추가 아이콘
  // ============================================

  // 금융/비즈니스 아이콘
  'dollar': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M12 6V18M9 9C9 7.9 10.3 7 12 7C13.7 7 15 7.9 15 9C15 10.1 13.7 11 12 11C10.3 11 9 11.9 9 13C9 14.1 10.3 15 12 15C13.7 15 15 14.1 15 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'wallet': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="14" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M3 10H21" stroke={color} strokeWidth="1.5" />
      <circle cx="17" cy="14" r="1.5" fill={color} />
    </svg>
  ),

  'bank': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 21H21M3 10H21M5 10V21M9 10V21M15 10V21M19 10V21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 3L3 10H21L12 3Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  'credit-card': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="5" width="20" height="14" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M2 10H22" stroke={color} strokeWidth="1.5" />
      <path d="M6 15H10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'coins': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="9" cy="14" rx="6" ry="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M15 14V10C15 8.34 12.31 7 9 7S3 8.34 3 10V14" stroke={color} strokeWidth="1.5" />
      <ellipse cx="9" cy="10" rx="6" ry="3" stroke={color} strokeWidth="1.5" />
      <path d="M21 10V14C21 15.66 18.31 17 15 17" stroke={color} strokeWidth="1.5" />
      <ellipse cx="15" cy="10" rx="6" ry="3" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'chart-down': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 4L9 10L13 6L21 14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 14H21V10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'chart-bar': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="12" width="4" height="8" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <rect x="10" y="6" width="4" height="14" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <rect x="17" y="9" width="4" height="11" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'chart-pie': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M12 3V12L19 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // 일반 아이콘
  'heart': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21C12 21 3 15 3 9C3 6 5.5 3 9 3C10.5 3 12 4 12 4C12 4 13.5 3 15 3C18.5 3 21 6 21 9C21 15 12 21 12 21Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  'thumbs-up': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 22V11M2 13V20C2 21.1 2.9 22 4 22H17C18.3 22 19.4 21.1 19.6 19.8L21 12.8C21.3 11.3 20.1 10 18.6 10H14V5C14 3.9 13.1 3 12 3L7 11" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'thumbs-down': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M17 2V13M22 11V4C22 2.9 21.1 2 20 2H7C5.7 2 4.6 2.9 4.4 4.2L3 11.2C2.7 12.7 3.9 14 5.4 14H10V19C10 20.1 10.9 21 12 21L17 13" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'target': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill={color} />
    </svg>
  ),

  'trophy': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M8 21H16M12 17V21M6 4H18V9C18 12.3 15.3 15 12 15C8.7 15 6 12.3 6 9V4Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 4H4V7C4 8.1 4.9 9 6 9" stroke={color} strokeWidth="1.5" />
      <path d="M18 4H20V7C20 8.1 19.1 9 18 9" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'medal': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="15" r="6" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M9 3L7 9H17L15 3H9Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 12V15M10 14L12 15L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'rocket': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 8 6 8 12C8 16 10 20 12 22C14 20 16 16 16 12C16 6 12 2 12 2Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2" fill={color} />
      <path d="M5 15L8 12M19 15L16 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'calendar': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="18" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M3 10H21M8 2V6M16 2V6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="15" r="1" fill={color} />
      <circle cx="12" cy="15" r="1" fill={color} />
      <circle cx="16" cy="15" r="1" fill={color} />
    </svg>
  ),

  'calculator': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="2" width="16" height="20" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <rect x="7" y="5" width="10" height="4" fill={color} fillOpacity="0.5" rx="1" />
      <circle cx="8" cy="13" r="1" fill={color} />
      <circle cx="12" cy="13" r="1" fill={color} />
      <circle cx="16" cy="13" r="1" fill={color} />
      <circle cx="8" cy="17" r="1" fill={color} />
      <circle cx="12" cy="17" r="1" fill={color} />
      <circle cx="16" cy="17" r="1" fill={color} />
    </svg>
  ),

  'percent': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="8" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M19 5L5 19" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  'trending': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M2 20L8 14L12 18L22 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 8H22V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  // 커뮤니케이션/미디어
  'speech-bubble': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 12C21 16.4 16.9 20 12 20C10.3 20 8.7 19.6 7.3 18.9L3 20L4.1 15.7C3.4 14.3 3 12.7 3 11C3 6.6 7.1 3 12 3C16.9 3 21 6.6 21 11V12Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  'megaphone': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 11V13C3 14.1 3.9 15 5 15H6L8 21H10L8 15H9L18 19V5L9 9H5C3.9 9 3 9.9 3 11Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M21 10V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  'question': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M9 9C9 7.3 10.3 6 12 6C13.7 6 15 7.3 15 9C15 10.4 14.1 11.5 12.8 11.9C12.3 12 12 12.4 12 12.9V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1" fill={color} />
    </svg>
  ),

  'info': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M12 16V12M12 8V8.01" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  'x-mark': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M8 8L16 16M16 8L8 16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  'plus': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M12 8V16M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  'minus': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // 사람/그룹
  'user': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M4 20C4 16.7 7.6 14 12 14C16.4 14 20 16.7 20 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'users': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="8" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <circle cx="16" cy="8" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M3 20C3 17 5.7 15 9 15C9.7 15 10.4 15.1 11 15.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 15.3C11.6 15.1 12.3 15 13 15C16.3 15 19 17 19 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  // 기타 유용한 아이콘
  'lock': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill={color} />
    </svg>
  ),

  'unlock': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M8 11V7C8 4.8 9.8 3 12 3C13.5 3 14.8 3.8 15.5 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill={color} />
    </svg>
  ),

  'shield': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L4 6V12C4 16.4 7.4 20.4 12 22C16.6 20.4 20 16.4 20 12V6L12 2Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'gear': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M12 1V4M12 20V23M23 12H20M4 12H1M20.5 3.5L18.4 5.6M5.6 18.4L3.5 20.5M20.5 20.5L18.4 18.4M5.6 5.6L3.5 3.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'home': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10L12 3L21 10V20C21 20.6 20.6 21 20 21H4C3.4 21 3 20.6 3 20V10Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 21V14H15V21" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  'briefcase': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M8 7V5C8 3.9 8.9 3 10 3H14C15.1 3 16 3.9 16 5V7" stroke={color} strokeWidth="1.5" />
      <path d="M2 12H22" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'book': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 4C4 4 4 3 6 3H20V21H6C4 21 4 20 4 20V4Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 17C4 17 4 16 6 16H20" stroke={color} strokeWidth="1.5" />
      <path d="M8 7H16M8 11H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  'bulb': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.1 2 5 5.1 5 9C5 11.4 6.2 13.5 8 14.7V17C8 17.6 8.4 18 9 18H15C15.6 18 16 17.6 16 17V14.7C17.8 13.5 19 11.4 19 9C19 5.1 15.9 2 12 2Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M9 21H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 18V21M14 18V21" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'fire': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2C12 2 8 6 8 10C8 12 9 14 12 14C15 14 16 12 16 10C16 6 12 2 12 2Z" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 22C8 22 5 19 5 15C5 11 8 8 12 10C16 8 19 11 19 15C19 19 16 22 12 22Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  'lightning': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  'arrow-up': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 19V5M5 12L12 5L19 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'arrow-down': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5V19M19 12L12 19L5 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'arrow-left': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M19 12H5M12 5L5 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'arrow-right': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 12H19M12 5L19 12L12 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'refresh': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M4 12C4 7.6 7.6 4 12 4C15.4 4 18.3 6.1 19.4 9" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M20 12C20 16.4 16.4 20 12 20C8.6 20 5.7 17.9 4.6 15" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M16 9H20V5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15H4V19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),

  'flag': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 4V21" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M5 4H19L15 9L19 14H5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  'globe': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="4" ry="9" stroke={color} strokeWidth="1.5" />
      <path d="M3 12H21M4 8H20M4 16H20" stroke={color} strokeWidth="1" />
    </svg>
  ),

  'gift': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="8" width="18" height="14" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M12 8V22M3 12H21" stroke={color} strokeWidth="1.5" />
      <path d="M12 8C12 8 12 4 9 4C7 4 6 5 6 6.5C6 8 8 8 12 8Z" stroke={color} strokeWidth="1.5" />
      <path d="M12 8C12 8 12 4 15 4C17 4 18 5 18 6.5C18 8 16 8 12 8Z" stroke={color} strokeWidth="1.5" />
    </svg>
  ),

  'phone': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 4H9L11 9L8.5 10.5C9.5 12.6 11.4 14.5 13.5 15.5L15 13L20 15V19C20 20.1 19.1 21 18 21C9.7 21 3 14.3 3 6C3 4.9 3.9 4 5 4Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),

  'email': ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" />
      <path d="M3 7L12 13L21 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { name, size = 80, color = '#FFFFFF' } = props;

  // Animation phases
  const enterType = animation?.enter?.type || 'popIn';
  const enterDurationMs = animation?.enter?.durationMs || ENTER_DURATIONS[enterType] || 400;
  const enterDelayMs = animation?.enter?.delayMs || 0;
  const enterStartFrame = sceneStartFrame + msToFrames(enterDelayMs, fps);

  const duringType = animation?.during?.type || 'floating';

  const exitType = animation?.exit?.type || 'none';
  const exitDurationMs = animation?.exit?.durationMs || EXIT_DURATIONS[exitType] || 300;
  const exitStartFrame = sceneStartFrame + sceneDurationFrames - msToFrames(exitDurationMs, fps);

  // Enter animation
  const enterAnim = calculateEnterAnimation(
    enterType,
    frame,
    fps,
    enterStartFrame,
    enterDurationMs
  );

  // During animation
  const duringAnim = calculateDuringAnimation(
    duringType,
    frame,
    fps,
    animation?.during?.durationMs || DURING_CYCLES[duringType]
  );

  // Exit animation
  const exitAnim = calculateExitAnimation(exitType, frame, fps, exitStartFrame, exitDurationMs);

  const isInExitPhase = frame >= exitStartFrame && exitType !== 'none';
  const finalOpacity = isInExitPhase ? exitAnim.opacity : enterAnim.opacity;

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
