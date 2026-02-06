/**
 * Scene Template Types - Layer 4 (Scene Packages)
 * Combines Layer 3 direction elements (camera + layout + timing) into reusable scene packages
 */

/**
 * Scene role categories for content classification
 */
export type SceneRole =
  | 'opening'
  | 'explanation'
  | 'emphasis'
  | 'comparison'
  | 'transition'
  | 'example'
  | 'warning'
  | 'closing';

/**
 * Scene Template interface
 * Combines L3 direction presets into a cohesive scene package
 */
export interface SceneTemplate {
  /** Unique identifier for the template */
  name: string;
  /** Role/purpose of this scene in the video narrative */
  role: SceneRole;
  /** Human-readable description of the template */
  description: string;
  /** Camera preset name from L3 direction/camera */
  camera: string;
  /** Layout preset name from L3 direction/layout */
  layout: string;
  /** Timing preset name from L3 direction/timing */
  timing: string;
  /** Default motion animation for stickman (optional) */
  defaultMotion?: string;
  /** Suggested poses for this template (optional) */
  suggestedPoses?: string[];
  /** Suggested expressions for this template (optional) */
  suggestedExpressions?: string[];
}

/**
 * Template validation result
 */
export interface TemplateValidationResult {
  valid: boolean;
  errors: string[];
}
