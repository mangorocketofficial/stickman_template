// Bone definitions for StickMan skeleton
// Forward Kinematics only - each joint has a single rotation angle

export interface BoneDefinition {
  id: string;
  length: number;      // length in pixels (0 for head which uses radius)
  radius?: number;     // only for head
  parentId: string | null;
  anchorPoint: 'start' | 'end';  // where child bones attach
}

// Bone hierarchy and dimensions based on DEV_SPEC
// hip (root) → torso → head, arms
// hip (root) → legs

export const BONE_LENGTHS = {
  torso: 70,
  head: 30,           // radius, not length (diameter 60)
  upperArmL: 35,
  lowerArmL: 30,
  upperArmR: 35,
  lowerArmR: 30,
  upperLegL: 50,
  lowerLegL: 45,
  upperLegR: 50,
  lowerLegR: 45,
} as const;

// Skeleton hierarchy definition
// Each bone knows its parent and where it connects
export const SKELETON: BoneDefinition[] = [
  // Torso - connects to hip (root)
  { id: 'torso', length: BONE_LENGTHS.torso, parentId: null, anchorPoint: 'start' },

  // Head - connects to top of torso
  { id: 'head', length: 0, radius: BONE_LENGTHS.head, parentId: 'torso', anchorPoint: 'end' },

  // Left Arm chain - connects to top of torso (shoulder)
  { id: 'upperArmL', length: BONE_LENGTHS.upperArmL, parentId: 'torso', anchorPoint: 'end' },
  { id: 'lowerArmL', length: BONE_LENGTHS.lowerArmL, parentId: 'upperArmL', anchorPoint: 'end' },

  // Right Arm chain - connects to top of torso (shoulder)
  { id: 'upperArmR', length: BONE_LENGTHS.upperArmR, parentId: 'torso', anchorPoint: 'end' },
  { id: 'lowerArmR', length: BONE_LENGTHS.lowerArmR, parentId: 'upperArmR', anchorPoint: 'end' },

  // Left Leg chain - connects to hip (bottom of torso)
  { id: 'upperLegL', length: BONE_LENGTHS.upperLegL, parentId: null, anchorPoint: 'start' },
  { id: 'lowerLegL', length: BONE_LENGTHS.lowerLegL, parentId: 'upperLegL', anchorPoint: 'end' },

  // Right Leg chain - connects to hip (bottom of torso)
  { id: 'upperLegR', length: BONE_LENGTHS.upperLegR, parentId: null, anchorPoint: 'start' },
  { id: 'lowerLegR', length: BONE_LENGTHS.lowerLegR, parentId: 'upperLegR', anchorPoint: 'end' },
];

// Joint names for pose definition (matches Pose interface in schema.ts)
export const JOINT_NAMES = [
  'torso',
  'head',
  'upperArmL',
  'lowerArmL',
  'upperArmR',
  'lowerArmR',
  'upperLegL',
  'lowerLegL',
  'upperLegR',
  'lowerLegR',
] as const;

export type JointName = typeof JOINT_NAMES[number];

// Shoulder offset from torso center for arm attachment
export const SHOULDER_OFFSET = 18;

// Hip width for leg attachment spread
export const HIP_WIDTH = 12;
