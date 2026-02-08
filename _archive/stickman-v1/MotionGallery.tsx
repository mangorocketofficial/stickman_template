/**
 * MotionGallery - Displays all available motions in a grid layout
 * For visual testing and preview in Remotion Studio
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { StickMan } from './components/StickMan';
import { MOTION_NAMES } from './components/StickMan/motions';

interface MotionGalleryProps {
  columns?: number;
  showLabels?: boolean;
}

export const MotionGallery: React.FC<MotionGalleryProps> = ({
  columns = 7,
  showLabels = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const motionNames = MOTION_NAMES;
  const rows = Math.ceil(motionNames.length / columns);

  // Cell dimensions
  const cellWidth = 1920 / columns;
  const cellHeight = 1080 / rows;

  // Highlight animation - cycles through motions
  const cycleDuration = fps * 3; // 3 seconds per motion
  const currentHighlight = Math.floor((frame / cycleDuration) % motionNames.length);

  // Time in ms for motion animation
  const timeMs = (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 15,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#00FF88',
          fontSize: 28,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          zIndex: 100,
        }}
      >
        Motion Gallery ({motionNames.length} motions)
      </div>

      {/* Motion Grid */}
      {motionNames.map((motionName, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);

        const isHighlighted = index === currentHighlight;
        const borderColor = isHighlighted ? '#00FF88' : '#333';

        return (
          <div
            key={motionName}
            style={{
              position: 'absolute',
              left: col * cellWidth,
              top: row * cellHeight + 50,
              width: cellWidth,
              height: cellHeight - 50 / rows,
              border: `2px solid ${borderColor}`,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isHighlighted ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
            }}
          >
            <svg
              width={cellWidth - 10}
              height={cellHeight - 80}
              viewBox="-80 -120 160 240"
            >
              <StickMan
                pose="standing"
                expression="neutral"
                position={{ x: 0, y: 40 }}
                scale={0.9}
                color="#FFFFFF"
                lineWidth={2}
                motion={motionName}
                startTimeMs={0}
              />
            </svg>

            {showLabels && (
              <div
                style={{
                  color: isHighlighted ? '#00FF88' : '#AAAAAA',
                  fontSize: Math.max(9, 13 - columns),
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  marginTop: 2,
                  maxWidth: cellWidth - 10,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {motionName}
              </div>
            )}
          </div>
        );
      })}

      {/* Current motion info */}
      <div
        style={{
          position: 'absolute',
          bottom: 15,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#00FF88',
          fontSize: 20,
          fontFamily: 'monospace',
        }}
      >
        Highlighted: {motionNames[currentHighlight]} ({currentHighlight + 1}/{motionNames.length})
      </div>
    </AbsoluteFill>
  );
};
