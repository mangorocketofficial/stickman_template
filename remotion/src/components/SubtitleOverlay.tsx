/**
 * SubtitleOverlay - Word-level highlight subtitles
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { SubtitleData, WordTimestamp } from '../types/schema';
import { framesToMs } from '../utils/timing';

interface SubtitleOverlayProps {
  subtitleData: SubtitleData;
  style: {
    fontSize: number;
    color: string;
    position: 'top' | 'center' | 'bottom';
    highlightColor: string;
  };
}

// How many words to show around the current word
const CONTEXT_WORDS = 3;

export const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({
  subtitleData,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const currentTimeMs = framesToMs(frame, fps);
  const { words } = subtitleData;

  if (!words || words.length === 0) {
    return null;
  }

  // Find current word index
  let currentWordIndex = -1;
  for (let i = 0; i < words.length; i++) {
    if (currentTimeMs >= words[i].startMs && currentTimeMs < words[i].endMs) {
      currentWordIndex = i;
      break;
    }
    // If between words, show the previous word
    if (i < words.length - 1 && currentTimeMs >= words[i].endMs && currentTimeMs < words[i + 1].startMs) {
      currentWordIndex = i;
      break;
    }
  }

  // If no current word found and we're past the last word, don't show anything
  if (currentWordIndex === -1) {
    // Check if we're before the first word
    if (words.length > 0 && currentTimeMs < words[0].startMs) {
      return null;
    }
    // Check if we're after the last word
    if (words.length > 0 && currentTimeMs >= words[words.length - 1].endMs) {
      return null;
    }
    return null;
  }

  // Get context words around current word
  const startIndex = Math.max(0, currentWordIndex - CONTEXT_WORDS);
  const endIndex = Math.min(words.length - 1, currentWordIndex + CONTEXT_WORDS);

  const contextWords = words.slice(startIndex, endIndex + 1);

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
            lineHeight: 1.5,
            wordBreak: 'keep-all',
          }}
        >
          {contextWords.map((wordItem, index) => {
            const absoluteIndex = startIndex + index;
            const isCurrentWord = absoluteIndex === currentWordIndex;

            return (
              <React.Fragment key={`${wordItem.word}-${absoluteIndex}`}>
                <span
                  style={{
                    color: isCurrentWord ? style.highlightColor : style.color,
                    fontWeight: isCurrentWord ? 'bold' : 'normal',
                    transition: 'color 0.1s, font-weight 0.1s',
                  }}
                >
                  {wordItem.word}
                </span>
                {index < contextWords.length - 1 && ' '}
              </React.Fragment>
            );
          })}
        </span>
      </div>
    </div>
  );
};

export default SubtitleOverlay;
