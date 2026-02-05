// Pose presets for StickMan
// Each pose defines rotation angles in degrees for all joints
// Positive angles = clockwise rotation
// 0 degrees = neutral/vertical position

import { Pose } from '../../types/schema';

// 8 Required pose presets for MVP
export const POSES: Record<string, Pose> = {
  // Neutral idle pose - arms slightly out, legs straight
  standing: {
    torso: 0,
    head: 0,
    upperArmL: 20,      // arms slightly away from body
    lowerArmL: 0,
    upperArmR: -20,
    lowerArmR: 0,
    upperLegL: 5,       // legs slightly apart
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Right arm extended horizontally pointing right
  pointing_right: {
    torso: -5,          // slight lean toward pointing direction
    head: -10,          // looking right
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -90,     // arm horizontal to the right
    lowerArmR: 0,       // forearm straight
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Left arm extended horizontally pointing left
  pointing_left: {
    torso: 5,           // slight lean toward pointing direction
    head: 10,           // looking left
    upperArmL: 90,      // arm horizontal to the left
    lowerArmL: 0,       // forearm straight
    upperArmR: -20,
    lowerArmR: 0,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Thinking pose - hand on chin
  thinking: {
    torso: 5,
    head: 10,           // tilted slightly
    upperArmL: 30,
    lowerArmL: 0,
    upperArmR: -60,     // raised toward face
    lowerArmR: -120,    // bent sharply, hand at chin
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Celebrating - both arms raised high
  celebrating: {
    torso: 0,
    head: -5,           // looking slightly up
    upperArmL: 160,     // arm up to the left
    lowerArmL: 20,      // slight bend
    upperArmR: -160,    // arm up to the right
    lowerArmR: -20,     // slight bend
    upperLegL: 15,      // legs apart
    lowerLegL: 0,
    upperLegR: -15,
    lowerLegR: 0,
  },

  // Explaining - one hand raised, presenting gesture
  explaining: {
    torso: -3,
    head: -5,
    upperArmL: 45,      // left arm raised
    lowerArmL: -90,     // forearm bent up
    upperArmR: -30,
    lowerArmR: -20,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Shrugging - both arms out, palms up gesture
  shrugging: {
    torso: 0,
    head: 0,
    upperArmL: 70,      // arms out to sides
    lowerArmL: -90,     // forearms up
    upperArmR: -70,
    lowerArmR: 90,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Sitting pose - legs bent at 90 degrees
  sitting: {
    torso: 0,
    head: 0,
    upperArmL: 30,
    lowerArmL: -90,     // arms resting on legs
    upperArmR: -30,
    lowerArmR: 90,
    upperLegL: 90,      // thighs horizontal
    lowerLegL: -90,     // shins vertical
    upperLegR: -90,
    lowerLegR: 90,
  },

  // ============================================
  // POSE TRANSITION TARGETS (리팩토링 추가)
  // ============================================

  // Waving pose - right arm raised for wave
  waving: {
    torso: 0,
    head: -5,
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -130,    // 팔 올림
    lowerArmR: -40,     // 손 흔드는 위치
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Thumbs up pose - right arm raised with thumb up gesture
  thumbsUp: {
    torso: 0,
    head: 0,
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -100,    // 팔 올림
    lowerArmR: -30,     // 엄지 척 위치
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Beckoning pose - hand gesture calling someone
  beckoning: {
    torso: 0,
    head: 0,
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -70,     // 팔 들어올림
    lowerArmR: -90,     // 손짓 위치
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },
};

// Default pose when none specified
export const DEFAULT_POSE = POSES.standing;

// Get a pose by name, falling back to standing if not found
export function getPose(name: string): Pose {
  return POSES[name] ?? DEFAULT_POSE;
}

// List of all available pose names
export const POSE_NAMES = Object.keys(POSES);
