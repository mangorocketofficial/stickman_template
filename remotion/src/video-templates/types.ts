/**
 * Video Template Types - Layer 5 (Video Templates)
 * Orchestrates Layer 4 scene templates into complete video structures
 */

/**
 * Video genre categories
 */
export type VideoGenre = 'educational' | 'informational' | 'comparison' | 'narrative';

/**
 * Template difficulty level (V3)
 */
export type TemplateDifficulty = 'beginner' | 'intermediate' | 'advanced';

/**
 * Estimated duration range in seconds (V3)
 */
export interface DurationRange {
  min: number;
  max: number;
}

/**
 * Video section configuration
 * Defines a segment of the video with scene template suggestions
 */
export interface VideoSection {
  /** Role/purpose of this section in the video structure */
  role: string;
  /** Display name for the section (V3) */
  name: string;
  /** Suggested L4 scene templates for this section */
  suggestedSceneTemplates: string[];
  /** Minimum number of scenes in this section */
  minScenes: number;
  /** Maximum number of scenes in this section */
  maxScenes: number;
  /** Whether this section is optional */
  optional?: boolean;
}

/**
 * Video Template interface
 * Defines a complete video structure with ordered sections
 */
export interface VideoTemplate {
  /** Unique identifier for the template */
  name: string;
  /** Genre/category of the video */
  genre: VideoGenre;
  /** Human-readable description */
  description: string;
  /** Ordered list of video sections */
  structure: VideoSection[];
  /** Estimated duration in seconds (V3) */
  estimatedDuration?: DurationRange;
  /** Difficulty level for content creators (V3) */
  difficulty?: TemplateDifficulty;
}

/**
 * Validation result for video templates
 */
export interface VideoTemplateValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Statistics for video templates
 */
export interface VideoTemplateStats {
  total: number;
  mvp: number;
  v2: number;
  v3: number;
  byGenre: Record<VideoGenre, number>;
}
