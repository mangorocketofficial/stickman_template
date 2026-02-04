// Motion loop presets for StickMan
// Motions use poseOverride - they modify specific joints on top of the base pose
// All motions are looping animations

import { Pose } from '../../types/schema';
import { JointName } from './skeleton';

export interface MotionKeyframe {
  progress: number;   // 0-1, position in cycle
  overrides: Partial<Pose>;
}

export interface Motion {
  name: string;
  cycleDurationMs: number;
  keyframes: MotionKeyframe[];
  affectedJoints: JointName[];  // which joints this motion modifies
}

// 4 Required motion presets for MVP
export const MOTIONS: Record<string, Motion> = {
  // Subtle torso oscillation for idle breathing effect
  breathing: {
    name: 'breathing',
    cycleDurationMs: 2000,
    affectedJoints: ['torso'],
    keyframes: [
      { progress: 0, overrides: { torso: 0 } },
      { progress: 0.5, overrides: { torso: 1 } },  // subtle forward lean
      { progress: 1, overrides: { torso: 0 } },
    ],
  },

  // Head nodding motion
  nodding: {
    name: 'nodding',
    cycleDurationMs: 600,
    affectedJoints: ['head'],
    keyframes: [
      { progress: 0, overrides: { head: 0 } },
      { progress: 0.5, overrides: { head: 15 } },  // nod down
      { progress: 1, overrides: { head: 0 } },
    ],
  },

  // Arm waving motion (right arm)
  waving: {
    name: 'waving',
    cycleDurationMs: 500,
    affectedJoints: ['upperArmR', 'lowerArmR'],
    keyframes: [
      { progress: 0, overrides: { upperArmR: -150, lowerArmR: -30 } },
      { progress: 0.5, overrides: { upperArmR: -150, lowerArmR: 30 } },
      { progress: 1, overrides: { upperArmR: -150, lowerArmR: -30 } },
    ],
  },

  // Walking cycle - alternating leg and arm swing
  walkCycle: {
    name: 'walkCycle',
    cycleDurationMs: 800,
    affectedJoints: ['upperArmL', 'upperArmR', 'upperLegL', 'lowerLegL', 'upperLegR', 'lowerLegR'],
    keyframes: [
      {
        progress: 0,
        overrides: {
          upperArmL: 30,
          upperArmR: -30,
          upperLegL: -20,
          lowerLegL: 10,
          upperLegR: 20,
          lowerLegR: -30,
        },
      },
      {
        progress: 0.25,
        overrides: {
          upperArmL: 10,
          upperArmR: -10,
          upperLegL: 0,
          lowerLegL: 0,
          upperLegR: 0,
          lowerLegR: 0,
        },
      },
      {
        progress: 0.5,
        overrides: {
          upperArmL: -30,
          upperArmR: 30,
          upperLegL: 20,
          lowerLegL: -30,
          upperLegR: -20,
          lowerLegR: 10,
        },
      },
      {
        progress: 0.75,
        overrides: {
          upperArmL: -10,
          upperArmR: 10,
          upperLegL: 0,
          lowerLegL: 0,
          upperLegR: 0,
          lowerLegR: 0,
        },
      },
      {
        progress: 1,
        overrides: {
          upperArmL: 30,
          upperArmR: -30,
          upperLegL: -20,
          lowerLegL: 10,
          upperLegR: 20,
          lowerLegR: -30,
        },
      },
    ],
  },
};

// Get motion by name
export function getMotion(name: string): Motion | undefined {
  return MOTIONS[name];
}

// List of all available motion names
export const MOTION_NAMES = Object.keys(MOTIONS);
