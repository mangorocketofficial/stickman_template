/**
 * WhiteboardText - Text component for whiteboard-style videos
 *
 * Supports three enter animation modes:
 * - typing: character-by-character reveal with blinking cursor
 * - handwriting: character reveal with handwriting font + wobble
 * - highlight: text appears, then colored marker sweeps behind
 */

import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { TextProps, AnimationDef } from '../types/schema';
import { useAnimationPhases } from '../hooks/useAnimationPhases';
import { WHITEBOARD } from '../constants';

interface WhiteboardTextProps {
  props: TextProps;
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

export const WhiteboardText: React.FC<WhiteboardTextProps> = ({
  props,
  position,
  scale = 1,
  animation,
  sceneStartFrame,
  sceneDurationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const {
    content,
    fontSize = WHITEBOARD.KEYWORD_FONT_SIZE,
    fontWeight = 'bold',
    color = WHITEBOARD.TEXT_COLOR,
    maxWidth = 1400,
    align = 'center',
  } = props;

  const enterType = animation?.enter?.type || 'typing';
  const duringType = animation?.during?.type || 'none';

  const {
    finalOpacity,
    enterProgress,
    isInEnterPhase,
    exitAnim,
    isInExitPhase,
  } = useAnimationPhases(
    animation,
    sceneStartFrame,
    sceneDurationFrames,
    { enterType: 'typing', duringType: 'none', exitType: 'none' }
  );

  // Highlight sweep progress (during phase)
  const highlightProgress = duringType === 'highlightSweep'
    ? (isInEnterPhase ? 0 : Math.min(1, (enterProgress - 1) * 2 + 1))
    : 0;

  // For highlightSweep, calculate separate sweep progress after enter completes
  const highlightSweepProgress = (() => {
    if (duringType !== 'highlightSweep') return 0;
    if (isInEnterPhase) return 0;
    const enterDurationMs = animation?.enter?.durationMs || 500;
    const sweepDurationMs = animation?.during?.durationMs || 1000;
    const enterFrames = Math.round((enterDurationMs / 1000) * fps);
    const sweepFrames = Math.round((sweepDurationMs / 1000) * fps);
    const sweepStart = sceneStartFrame + enterFrames;
    const sweepProgress = Math.min(1, Math.max(0, (frame - sweepStart) / sweepFrames));
    return sweepProgress;
  })();

  const highlightColor = props.background?.color || WHITEBOARD.HIGHLIGHT_COLOR;

  const opacity = isInExitPhase ? exitAnim.opacity : finalOpacity;

  if (enterType === 'typing') {
    return renderTyping(
      content, position, scale, fontSize, fontWeight, color, maxWidth, align,
      enterProgress, isInEnterPhase, frame, opacity,
      highlightSweepProgress, highlightColor, duringType
    );
  }

  if (enterType === 'handwriting') {
    return renderHandwriting(
      content, position, scale, fontSize, fontWeight, color, maxWidth, align,
      enterProgress, isInEnterPhase, opacity,
      highlightSweepProgress, highlightColor, duringType
    );
  }

  // Fallback: simple fade
  return renderSimple(
    content, position, scale, fontSize, fontWeight, color, maxWidth, align,
    opacity, highlightSweepProgress, highlightColor, duringType
  );
};

// =============================================================================
// TYPING MODE
// =============================================================================

function renderTyping(
  content: string,
  position: { x: number; y: number },
  scale: number,
  fontSize: number,
  fontWeight: string,
  color: string,
  maxWidth: number,
  align: string,
  enterProgress: number,
  isInEnterPhase: boolean,
  frame: number,
  opacity: number,
  highlightProgress: number,
  highlightColor: string,
  duringType: string,
) {
  const visibleChars = Math.floor(content.length * enterProgress);
  const displayText = content.slice(0, visibleChars);
  const cursorVisible = isInEnterPhase && Math.sin(frame * 0.4) > 0;

  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      maxWidth,
      textAlign: align as React.CSSProperties['textAlign'],
      fontFamily: WHITEBOARD.FONT_FAMILY_TYPING,
      fontSize,
      fontWeight,
      color,
      whiteSpace: 'pre-wrap',
      wordBreak: 'keep-all',
      lineHeight: 1.4,
    }}>
      {duringType === 'highlightSweep' && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '10%',
          width: `${highlightProgress * 100}%`,
          height: '80%',
          backgroundColor: highlightColor,
          borderRadius: 4,
          zIndex: -1,
          opacity: 0.6,
        }} />
      )}
      <span style={{ position: 'relative' }}>
        {displayText}
        {cursorVisible && (
          <span style={{
            borderRight: `3px solid ${WHITEBOARD.CURSOR_COLOR}`,
            marginLeft: 1,
            paddingRight: 1,
          }}>&nbsp;</span>
        )}
        {!isInEnterPhase && enterProgress >= 1 && !cursorVisible && null}
      </span>
    </div>
  );
}

// =============================================================================
// HANDWRITING MODE
// =============================================================================

function renderHandwriting(
  content: string,
  position: { x: number; y: number },
  scale: number,
  fontSize: number,
  fontWeight: string,
  color: string,
  maxWidth: number,
  align: string,
  enterProgress: number,
  isInEnterPhase: boolean,
  opacity: number,
  highlightProgress: number,
  highlightColor: string,
  duringType: string,
) {
  const visibleChars = Math.floor(content.length * enterProgress);

  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      maxWidth,
      textAlign: align as React.CSSProperties['textAlign'],
      fontFamily: WHITEBOARD.FONT_FAMILY_HANDWRITING,
      fontSize: fontSize * 1.1,
      fontWeight,
      color,
      whiteSpace: 'pre-wrap',
      wordBreak: 'keep-all',
      lineHeight: 1.5,
    }}>
      {duringType === 'highlightSweep' && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '10%',
          width: `${highlightProgress * 100}%`,
          height: '80%',
          backgroundColor: highlightColor,
          borderRadius: 4,
          zIndex: -1,
          opacity: 0.6,
        }} />
      )}
      {content.split('').map((char, i) => {
        if (i >= visibleChars) return null;

        // Per-character wobble for hand-drawn feel
        const wobbleRotation = Math.sin(i * 7.3) * 1.5;
        const wobbleY = Math.cos(i * 5.1) * 0.8;

        // Last few characters fade in
        const charProgress = i >= visibleChars - 2 && isInEnterPhase
          ? Math.min(1, (enterProgress * content.length - i))
          : 1;

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              transform: `rotate(${wobbleRotation}deg) translateY(${wobbleY}px)`,
              opacity: charProgress,
              transition: 'none',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
}

// =============================================================================
// SIMPLE MODE (fallback)
// =============================================================================

function renderSimple(
  content: string,
  position: { x: number; y: number },
  scale: number,
  fontSize: number,
  fontWeight: string,
  color: string,
  maxWidth: number,
  align: string,
  opacity: number,
  highlightProgress: number,
  highlightColor: string,
  duringType: string,
) {
  return (
    <div style={{
      position: 'absolute',
      left: position.x,
      top: position.y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      maxWidth,
      textAlign: align as React.CSSProperties['textAlign'],
      fontFamily: WHITEBOARD.FONT_FAMILY_TYPING,
      fontSize,
      fontWeight,
      color,
      whiteSpace: 'pre-wrap',
      wordBreak: 'keep-all',
      lineHeight: 1.4,
    }}>
      {duringType === 'highlightSweep' && (
        <div style={{
          position: 'absolute',
          left: 0,
          top: '10%',
          width: `${highlightProgress * 100}%`,
          height: '80%',
          backgroundColor: highlightColor,
          borderRadius: 4,
          zIndex: -1,
          opacity: 0.6,
        }} />
      )}
      {content}
    </div>
  );
}

export default WhiteboardText;
