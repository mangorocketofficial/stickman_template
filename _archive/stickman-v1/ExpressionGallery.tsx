/**
 * ExpressionGallery - Displays all available expressions in a grid layout
 * For visual testing and preview in Remotion Studio
 */

import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { StickMan } from './components/StickMan';
import { EXPRESSION_NAMES } from './components/StickMan/expressions';

interface ExpressionGalleryProps {
  columns?: number;
  showLabels?: boolean;
}

export const ExpressionGallery: React.FC<ExpressionGalleryProps> = ({
  columns = 5,
  showLabels = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const expressionNames = EXPRESSION_NAMES;
  const rows = Math.ceil(expressionNames.length / columns);

  // Cell dimensions
  const cellWidth = 1920 / columns;
  const cellHeight = 1080 / rows;

  // Highlight animation - cycles through expressions
  const cycleDuration = fps * 1.5; // 1.5 seconds per expression
  const currentHighlight = Math.floor((frame / cycleDuration) % expressionNames.length);

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
        Expression Gallery ({expressionNames.length} expressions)
      </div>

      {/* Expression Grid */}
      {expressionNames.map((expressionName, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);

        const isHighlighted = index === currentHighlight;
        const borderColor = isHighlighted ? '#FFD700' : '#333';
        const scale = isHighlighted ? 1.15 : 1;

        return (
          <div
            key={expressionName}
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
            }}
          >
            <svg
              width={cellWidth - 40}
              height={cellHeight - 120}
              viewBox="-100 -150 200 300"
            >
              <StickMan
                pose="standing"
                expression={expressionName}
                position={{ x: 0, y: 50 }}
                scale={scale}
                color="#FFFFFF"
                lineWidth={2}
              />
            </svg>

            {showLabels && (
              <div
                style={{
                  color: isHighlighted ? '#FFD700' : '#FFFFFF',
                  fontSize: 16,
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  marginTop: 5,
                }}
              >
                {expressionName}
              </div>
            )}
          </div>
        );
      })}

      {/* Current expression info */}
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
        Current: {expressionNames[currentHighlight]} ({currentHighlight + 1}/{expressionNames.length})
      </div>
    </AbsoluteFill>
  );
};
