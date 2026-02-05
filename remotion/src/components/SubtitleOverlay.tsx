/**
 * SubtitleOverlay - Sentence-level subtitles (no word highlight)
 * Uses segments from script text with Whisper timing
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SubtitleData } from '../types/schema';
import { framesToMs } from '../utils/timing';

interface Segment {
  text: string;
  startMs: number;
  endMs: number;
}

interface SubtitleOverlayProps {
  subtitleData: SubtitleData;
  style: {
    fontSize: number;
    color: string;
    position: 'top' | 'center' | 'bottom';
    highlightColor?: string; // Optional, no longer used
  };
}

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  subtitleData,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const currentTimeMs = framesToMs(frame, fps);
  const { segments } = subtitleData;

  // No segments = no subtitles
  if (!segments || segments.length === 0) {
    return null;
  }

  // Find current segment
  const currentSegment = segments.find(
    (seg: Segment) => currentTimeMs >= seg.startMs && currentTimeMs < seg.endMs
  );

  // No current segment = nothing to show
  if (!currentSegment) {
    return null;
  }

  // Calculate vertical position
  const getVerticalPosition = (): number => {
    switch (style.position) {
      case 'top':
        return 80;
      case 'center':
        return height / 2;
      case 'bottom':
      default:
        return height - 100;
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: getVerticalPosition(),
        transform: 'translateY(-50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 100px',
        zIndex: 99,
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 8,
          padding: '12px 24px',
          maxWidth: width * 0.8,
        }}
      >
        <span
          style={{
            fontFamily: 'sans-serif',
            fontSize: style.fontSize,
            color: style.color,
            lineHeight: 1.5,
            wordBreak: 'keep-all',
            textAlign: 'center',
          }}
        >
          {currentSegment.text}
        </span>
      </div>
    </div>
  );
};

export default SubtitleOverlay;
