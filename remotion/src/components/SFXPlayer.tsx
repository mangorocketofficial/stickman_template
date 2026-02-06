/**
 * SFXPlayer - Sound effects player with event-based triggering
 *
 * Features:
 * - Event-based SFX triggering (scene transitions, object enter/exit)
 * - Predefined SFX library
 * - Volume control and delay support
 */

import React from 'react';
import { Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { SFXTrigger, SFXName, SFXEvent } from '../types/schema';
import { msToFrames } from '../utils/timing';

// Default SFX file paths
const SFX_PATHS: Record<SFXName, string> = {
  whoosh: 'audio/sfx/whoosh.mp3',
  pop: 'audio/sfx/pop.mp3',
  chime: 'audio/sfx/chime.mp3',
  tada: 'audio/sfx/tada.mp3',
  impact: 'audio/sfx/impact.mp3',
  alert: 'audio/sfx/alert.mp3',
  notification: 'audio/sfx/notification.mp3',
  footstep: 'audio/sfx/footstep.mp3',
  rumble: 'audio/sfx/rumble.mp3',
  click: 'audio/sfx/click.mp3',
  swoosh: 'audio/sfx/swoosh.mp3',
};

// Default SFX for auto-mapping events
const AUTO_SFX_MAP: Partial<Record<SFXEvent, SFXName>> = {
  scene_transition: 'whoosh',
  object_enter: 'pop',
  counter_start: 'chime',
  counter_end: 'tada',
  emphasis: 'impact',
  warning: 'alert',
  success: 'chime',
  error: 'alert',
};

interface SFXPlayerProps {
  trigger: SFXTrigger;
  triggerFrame: number;  // Frame when the event occurs
}

/**
 * Single SFX audio component
 */
export const SFXPlayer: React.FC<SFXPlayerProps> = ({
  trigger,
  triggerFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const { event, src, name, volume = 0.5, delayMs = 0 } = trigger;

  // Calculate actual play frame with delay
  const delayFrames = msToFrames(delayMs, fps);
  const playFrame = triggerFrame + delayFrames;

  // Get SFX source path
  const sfxPath = src || (name ? SFX_PATHS[name] : null);

  if (!sfxPath) {
    // Try auto-mapping from event
    const autoName = AUTO_SFX_MAP[event];
    if (!autoName) return null;

    return (
      <Audio
        src={staticFile(SFX_PATHS[autoName])}
        volume={volume}
        startFrom={0}
        // Only play when we reach the trigger frame
        // Remotion will handle this with Sequence
      />
    );
  }

  return (
    <Audio
      src={src ? staticFile(src) : staticFile(sfxPath)}
      volume={volume}
      startFrom={0}
    />
  );
};

interface SceneSFXManagerProps {
  sfxTriggers: SFXTrigger[];
  sceneStartMs: number;
  autoSfx?: boolean;
}

/**
 * Manager component for scene-level SFX
 * Renders multiple SFX based on triggers
 */
export const SceneSFXManager: React.FC<SceneSFXManagerProps> = ({
  sfxTriggers,
  sceneStartMs,
  autoSfx = true,
}) => {
  const { fps } = useVideoConfig();
  const sceneStartFrame = msToFrames(sceneStartMs, fps);

  // Auto-generate scene transition SFX if autoSfx is enabled
  const allTriggers = [...sfxTriggers];

  if (autoSfx && !sfxTriggers.some(t => t.event === 'scene_transition')) {
    allTriggers.push({
      event: 'scene_transition',
      name: 'whoosh',
      volume: 0.3,
      delayMs: 0,
    });
  }

  return (
    <>
      {allTriggers.map((trigger, index) => (
        <SFXPlayer
          key={`sfx-${trigger.event}-${index}`}
          trigger={trigger}
          triggerFrame={sceneStartFrame + msToFrames(trigger.delayMs || 0, fps)}
        />
      ))}
    </>
  );
};

export default SFXPlayer;
