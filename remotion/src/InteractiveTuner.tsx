/**
 * InteractiveTuner - Component for interactively adjusting joint angles
 * Use in Remotion Studio to find optimal angle values for poses/motions
 *
 * NOTE: This component uses React state which works in Studio preview
 * but will not work during actual rendering (render will use defaultProps)
 */

import React, { useState, useCallback } from 'react';
import { AbsoluteFill } from 'remotion';
import { StickMan } from './components/StickMan';
import { Pose } from './types/schema';
import { JOINT_NAMES } from './components/StickMan/skeleton';

// Joint angle limits based on anatomical constraints
const JOINT_LIMITS: Record<string, { min: number; max: number; label: string }> = {
  torso: { min: -20, max: 20, label: 'Torso (body lean)' },
  head: { min: -45, max: 45, label: 'Head (neck rotation)' },
  upperArmL: { min: -180, max: 180, label: 'L Upper Arm' },
  lowerArmL: { min: -150, max: 30, label: 'L Lower Arm (elbow)' },
  upperArmR: { min: -180, max: 180, label: 'R Upper Arm' },
  lowerArmR: { min: -150, max: 30, label: 'R Lower Arm (elbow)' },
  upperLegL: { min: -45, max: 45, label: 'L Upper Leg (hip)' },
  lowerLegL: { min: -60, max: 10, label: 'L Lower Leg (knee)' },
  upperLegR: { min: -45, max: 45, label: 'R Upper Leg (hip)' },
  lowerLegR: { min: -60, max: 10, label: 'R Lower Leg (knee)' },
};

// Default standing pose
const DEFAULT_POSE: Pose = {
  torso: 0,
  head: 0,
  upperArmL: 20,
  lowerArmL: 0,
  upperArmR: -20,
  lowerArmR: 0,
  upperLegL: 0,
  lowerLegL: 0,
  upperLegR: 0,
  lowerLegR: 0,
};

export interface InteractiveTunerProps {
  initialPose?: Partial<Pose>;
}

export const InteractiveTuner: React.FC<InteractiveTunerProps> = ({
  initialPose = {},
}) => {
  const [pose, setPose] = useState<Pose>({ ...DEFAULT_POSE, ...initialPose });
  const [copied, setCopied] = useState(false);

  const handleSliderChange = useCallback((joint: keyof Pose, value: number) => {
    setPose((prev) => ({ ...prev, [joint]: value }));
  }, []);

  const handleReset = useCallback(() => {
    setPose(DEFAULT_POSE);
  }, []);

  const handleCopyJson = useCallback(() => {
    const json = JSON.stringify(pose, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [pose]);

  const handleCopyKeyframe = useCallback(() => {
    // Generate keyframe format for motions.ts
    const overrides: Record<string, number> = {};
    Object.entries(pose).forEach(([key, value]) => {
      if (value !== 0) {
        overrides[key] = value;
      }
    });
    const keyframeStr = `{ progress: 0, overrides: ${JSON.stringify(overrides)} }`;
    navigator.clipboard.writeText(keyframeStr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [pose]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a2e', display: 'flex' }}>
      {/* Left side - StickMan preview */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: '#ffffff',
            fontSize: 32,
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
          }}
        >
          Interactive Pose Tuner
        </div>

        <StickMan
          pose={pose}
          expression="neutral"
          position={{ x: 400, y: 600 }}
          scale={3}
          color="#FFFFFF"
          lineWidth={4}
        />
      </div>

      {/* Right side - Sliders */}
      <div
        style={{
          width: 500,
          backgroundColor: '#252540',
          padding: 20,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            color: '#ffffff',
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            fontFamily: 'sans-serif',
          }}
        >
          Joint Angles
        </div>

        {JOINT_NAMES.map((joint) => {
          const limits = JOINT_LIMITS[joint];
          const value = pose[joint];

          return (
            <div key={joint} style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#aaaaaa',
                  fontSize: 14,
                  fontFamily: 'monospace',
                  marginBottom: 4,
                }}
              >
                <span>{limits.label}</span>
                <span style={{ color: '#00ff88', fontWeight: 'bold' }}>
                  {value}°
                </span>
              </div>
              <input
                type="range"
                min={limits.min}
                max={limits.max}
                value={value}
                onChange={(e) => handleSliderChange(joint, Number(e.target.value))}
                style={{
                  width: '100%',
                  height: 20,
                  cursor: 'pointer',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#666666',
                  fontSize: 11,
                  fontFamily: 'monospace',
                }}
              >
                <span>{limits.min}°</span>
                <span>{limits.max}°</span>
              </div>
            </div>
          );
        })}

        {/* Buttons */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={handleCopyJson}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied!' : 'Copy Pose JSON'}
          </button>

          <button
            onClick={handleCopyKeyframe}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            Copy as Keyframe
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              fontSize: 14,
              backgroundColor: '#ff5722',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>

        {/* Current JSON preview */}
        <div
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: '#1a1a2e',
            borderRadius: 5,
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#00ff88',
            whiteSpace: 'pre',
            overflow: 'auto',
            maxHeight: 200,
          }}
        >
          {JSON.stringify(pose, null, 2)}
        </div>
      </div>
    </AbsoluteFill>
  );
};
