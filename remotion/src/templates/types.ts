/**
 * Scene Template Types - Layer 4 (Scene Templates)
 * Combines L3 direction elements (camera + layout + timing) into reusable scene packages
 */

/**
 * Scene role types defining the purpose of a scene in a video
 */
export type SceneRole =
  | 'opening'      // Video introduction
  | 'explanation'  // Main content explanation
  | 'emphasis'     // Key point emphasis
  | 'comparison'   // Side-by-side comparison
  | 'transition'   // Scene transition
  | 'example'      // Example demonstration
  | 'warning'      // Warning or caution
  | 'closing';     // Video conclusion

/**
 * A scene template combining camera, layout, and timing presets
 * into a reusable package for specific scene roles
 */
export interface SceneTemplate {
  /** Unique identifier for the template */
  name: string;

  /** Role of the scene in the video */
  role: SceneRole;

  /** Human-readable description of the template */
  description: string;

  /** Camera preset name from L3 direction module */
  camera: string;

  /** Layout preset name from L3 direction module */
  layout: string;

  /** Timing preset name from L3 direction module */
  timing: string;

  /** Default motion for stickman (if applicable) */
  defaultMotion?: string;

  /** Suggested poses for the scene */
  suggestedPoses?: string[];

  /** Suggested expressions for the scene */
  suggestedExpressions?: string[];
}

/**
 * Record type for scene template collection
 */
export type SceneTemplateRecord = Record<string, SceneTemplate>;
