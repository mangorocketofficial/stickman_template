/**
 * MotionKeyframeTuner - Interactive editor for motion keyframes
 * Allows real-time adjustment of joint angles for each keyframe in a motion
 */

import React, { useState, useCallback, useEffect } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { StickMan } from './components/StickMan';
import { MOTIONS, Motion, MotionKeyframe } from './components/StickMan/motions';
import { JOINT_NAMES } from './components/StickMan/skeleton';
import { Pose } from './types/schema';
import { POSES } from './components/StickMan/poses';

const MOTION_LIST = Object.keys(MOTIONS);

// Joint angle limits
const JOINT_LIMITS: Record<string, { min: number; max: number; label: string }> = {
  torso: { min: -20, max: 20, label: 'Torso' },
  head: { min: -45, max: 45, label: 'Head' },
  upperArmL: { min: -180, max: 180, label: 'L Arm (up)' },
  lowerArmL: { min: -150, max: 30, label: 'L Arm (low)' },
  upperArmR: { min: -180, max: 180, label: 'R Arm (up)' },
  lowerArmR: { min: -150, max: 30, label: 'R Arm (low)' },
  upperLegL: { min: -45, max: 45, label: 'L Leg (up)' },
  lowerLegL: { min: -60, max: 10, label: 'L Leg (low)' },
  upperLegR: { min: -45, max: 45, label: 'R Leg (up)' },
  lowerLegR: { min: -60, max: 10, label: 'R Leg (low)' },
};

export interface MotionKeyframeTunerProps {
  initialMotion?: string;
}

export const MotionKeyframeTuner: React.FC<MotionKeyframeTunerProps> = ({
  initialMotion = 'breathing',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // State
  const [selectedMotion, setSelectedMotion] = useState(initialMotion);
  const [selectedKeyframeIndex, setSelectedKeyframeIndex] = useState(0);
  const [keyframes, setKeyframes] = useState<MotionKeyframe[]>([]);
  const [cycleDurationMs, setCycleDurationMs] = useState(2000);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load motion data when selection changes
  useEffect(() => {
    const motion = MOTIONS[selectedMotion];
    if (motion) {
      setKeyframes(JSON.parse(JSON.stringify(motion.keyframes)));
      setCycleDurationMs(motion.cycleDurationMs);
      setSelectedKeyframeIndex(0);
    }
  }, [selectedMotion]);

  // Get base pose
  const basePose = POSES.standing;

  // Current keyframe
  const currentKeyframe = keyframes[selectedKeyframeIndex];

  // Build current pose from base + overrides
  const getCurrentPose = (): Pose => {
    if (!currentKeyframe) return basePose;
    return { ...basePose, ...currentKeyframe.overrides };
  };

  // Handle slider change
  const handleSliderChange = useCallback((joint: string, value: number) => {
    setKeyframes((prev) => {
      const updated = [...prev];
      if (updated[selectedKeyframeIndex]) {
        updated[selectedKeyframeIndex] = {
          ...updated[selectedKeyframeIndex],
          overrides: {
            ...updated[selectedKeyframeIndex].overrides,
            [joint]: value,
          },
        };
      }
      return updated;
    });
  }, [selectedKeyframeIndex]);

  // Copy full motion JSON
  const handleCopyMotion = useCallback(() => {
    const motion = MOTIONS[selectedMotion];
    const output = {
      name: selectedMotion,
      cycleDurationMs,
      affectedJoints: motion?.affectedJoints || [],
      keyframes: keyframes.map(kf => ({
        progress: kf.progress,
        overrides: kf.overrides,
      })),
    };

    const jsonStr = JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(jsonStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [selectedMotion, cycleDurationMs, keyframes]);

  // Calculate playback pose
  const getPlaybackPose = (): Pose => {
    if (!isPlaying || keyframes.length === 0) return getCurrentPose();

    const currentTimeMs = (frame / fps) * 1000;
    const progress = (currentTimeMs % cycleDurationMs) / cycleDurationMs;

    // Find surrounding keyframes
    let prevKf = keyframes[0];
    let nextKf = keyframes[0];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (progress >= keyframes[i].progress && progress <= keyframes[i + 1].progress) {
        prevKf = keyframes[i];
        nextKf = keyframes[i + 1];
        break;
      }
    }

    // Interpolate
    const range = nextKf.progress - prevKf.progress;
    const localProgress = range > 0 ? (progress - prevKf.progress) / range : 0;

    const interpolatedOverrides: Partial<Pose> = {};
    const allJoints = new Set([
      ...Object.keys(prevKf.overrides),
      ...Object.keys(nextKf.overrides),
    ]);

    allJoints.forEach((joint) => {
      const prevVal = (prevKf.overrides as Record<string, number>)[joint] ?? 0;
      const nextVal = (nextKf.overrides as Record<string, number>)[joint] ?? 0;
      (interpolatedOverrides as Record<string, number>)[joint] =
        prevVal + (nextVal - prevVal) * localProgress;
    });

    return { ...basePose, ...interpolatedOverrides };
  };

  const displayPose = isPlaying ? getPlaybackPose() : getCurrentPose();

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e', display: 'flex' }}>
      {/* Left - StickMan Preview */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#fff',
          fontSize: 28,
          fontWeight: 'bold',
        }}>
          Motion Keyframe Tuner
        </div>

        <StickMan
          pose={displayPose}
          expression="neutral"
          position={{ x: 450, y: 550 }}
          scale={3.5}
          color="#FFFFFF"
          lineWidth={4}
        />

        {/* Playback indicator */}
        {isPlaying && (
          <div style={{
            position: 'absolute',
            bottom: 100,
            left: 20,
            color: '#00ff88',
            fontSize: 20,
          }}>
            Playing: {((frame / fps * 1000) % cycleDurationMs).toFixed(0)}ms / {cycleDurationMs}ms
          </div>
        )}
      </div>

      {/* Right - Controls */}
      <div style={{
        width: 550,
        backgroundColor: '#252540',
        padding: 20,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {/* Motion Selector */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ color: '#aaa', fontSize: 14 }}>Motion:</label>
          <select
            value={selectedMotion}
            onChange={(e) => setSelectedMotion(e.target.value)}
            style={{
              width: '100%',
              padding: 8,
              fontSize: 16,
              marginTop: 5,
              backgroundColor: '#1a1a2e',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: 4,
            }}
          >
            {MOTION_LIST.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Keyframe Selector */}
        <div style={{ marginBottom: 10 }}>
          <label style={{ color: '#aaa', fontSize: 14 }}>
            Keyframe ({keyframes.length} total):
          </label>
          <div style={{ display: 'flex', gap: 5, marginTop: 5, flexWrap: 'wrap' }}>
            {keyframes.map((kf, idx) => (
              <button
                key={idx}
                onClick={() => { setSelectedKeyframeIndex(idx); setIsPlaying(false); }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: selectedKeyframeIndex === idx ? '#4CAF50' : '#333',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontSize: 14,
                }}
              >
                {idx} ({(kf.progress * 100).toFixed(0)}%)
              </button>
            ))}
          </div>
        </div>

        {/* Joint Sliders */}
        <div style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>
          Joint Angles (Keyframe {selectedKeyframeIndex})
        </div>

        {currentKeyframe && JOINT_NAMES.map((joint) => {
          const limits = JOINT_LIMITS[joint];
          const value = (currentKeyframe.overrides as Record<string, number>)[joint]
            ?? (basePose as unknown as Record<string, number>)[joint]
            ?? 0;

          return (
            <div key={joint} style={{ marginBottom: 4 }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: '#aaa',
                fontSize: 12,
              }}>
                <span>{limits.label}</span>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>{value}°</span>
              </div>
              <input
                type="range"
                min={limits.min}
                max={limits.max}
                value={value}
                onChange={(e) => handleSliderChange(joint, Number(e.target.value))}
                style={{ width: '100%', height: 16, cursor: 'pointer' }}
              />
            </div>
          );
        })}

        {/* Buttons */}
        <div style={{ marginTop: 15, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              padding: '10px 20px',
              backgroundColor: isPlaying ? '#ff5722' : '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>

          <button
            onClick={handleCopyMotion}
            style={{
              padding: '10px 20px',
              backgroundColor: copied ? '#4CAF50' : '#9C27B0',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            {copied ? 'Copied!' : 'Copy Motion JSON'}
          </button>
        </div>

        {/* Current Keyframe JSON */}
        <div style={{
          marginTop: 15,
          padding: 10,
          backgroundColor: '#1a1a2e',
          borderRadius: 4,
          fontFamily: 'monospace',
          fontSize: 10,
          color: '#00ff88',
          whiteSpace: 'pre',
          overflow: 'auto',
          maxHeight: 150,
        }}>
          {currentKeyframe && JSON.stringify(currentKeyframe, null, 2)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
