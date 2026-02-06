/**
 * PoseGallery - Displays all available poses in a grid layout
 * For visual testing and preview in Remotion Studio
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { StickMan } from './components/StickMan';
import { POSES, POSE_NAMES } from './components/StickMan/poses';

interface PoseGalleryProps {
  columns?: number;
  showLabels?: boolean;
}

export const PoseGallery: React.FC<PoseGalleryProps> = ({
  columns = 8,
  showLabels = true,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const poseNames = POSE_NAMES;
  const rows = Math.ceil(poseNames.length / columns);

  // Cell dimensions
  const cellWidth = 1920 / columns;
  const cellHeight = 1080 / rows;
  const stickmanScale = Math.min(cellWidth, cellHeight) / 300;

  // Highlight animation - cycles through poses
  const cycleDuration = fps * 2; // 2 seconds per pose
  const totalCycles = poseNames.length;
  const currentHighlight = Math.floor((frame / cycleDuration) % totalCycles);

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e' }}>
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#FFD700',
          fontSize: 32,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          zIndex: 100,
        }}
      >
        Pose Gallery ({poseNames.length} poses)
      </div>

      {/* Pose Grid */}
      {poseNames.map((poseName, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const x = col * cellWidth + cellWidth / 2;
        const y = row * cellHeight + cellHeight / 2 + 40; // offset for title

        const isHighlighted = index === currentHighlight;
        const highlightScale = isHighlighted ? 1.1 : 1;
        const borderColor = isHighlighted ? '#FFD700' : '#333';

        return (
          <div
            key={poseName}
            style={{
              position: 'absolute',
              left: col * cellWidth,
              top: row * cellHeight + 60,
              width: cellWidth,
              height: cellHeight - 60 / rows,
              border: `2px solid ${borderColor}`,
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: isHighlighted ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <svg
              width={cellWidth - 20}
              height={cellHeight - 100}
              viewBox="-100 -150 200 300"
            >
              <StickMan
                pose={poseName}
                expression="neutral"
                position={{ x: 0, y: 50 }}
                scale={highlightScale}
                color="#FFFFFF"
                lineWidth={2}
              />
            </svg>

            {showLabels && (
              <div
                style={{
                  color: isHighlighted ? '#FFD700' : '#FFFFFF',
                  fontSize: Math.max(12, 18 - columns),
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  marginTop: 5,
                }}
              >
                {poseName}
              </div>
            )}
          </div>
        );
      })}

      {/* Current pose info */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: '#FFD700',
          fontSize: 24,
          fontFamily: 'monospace',
        }}
      >
        Current: {poseNames[currentHighlight]} ({currentHighlight + 1}/{poseNames.length})
      </div>
    </AbsoluteFill>
  );
};
