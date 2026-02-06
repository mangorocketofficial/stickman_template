/**
 * Video Template Types - Layer 5 (Video Templates)
 * Defines the structure for complete video templates that combine multiple scene templates
 *
 * Video templates provide a blueprint for entire videos, specifying:
 * - The sequence of sections (opening, explanation, closing, etc.)
 * - Which L4 scene templates are appropriate for each section
 * - Constraints on scene counts per section
 */

import { SceneRole } from '../templates/types';

/**
 * Video genre types defining the category of video
 */
export type VideoGenre =
  | 'educational'    // Educational/tutorial content
  | 'news'           // News and information
  | 'marketing'      // Marketing and promotional
  | 'entertainment'; // Entertainment content

/**
 * A section within a video template
 * Defines a logical segment of the video with its role and scene template suggestions
 */
export interface VideoSection {
  /** The role/purpose of this section in the video */
  role: SceneRole;

  /** L4 scene template names suggested for this section */
  suggestedSceneTemplates: string[];

  /** Minimum number of scenes in this section */
  minScenes: number;

  /** Maximum number of scenes in this section */
  maxScenes: number;
}

/**
 * A complete video template defining the structure of an entire video
 */
export interface VideoTemplate {
  /** Unique identifier for the template */
  name: string;

  /** Genre/category of the video */
  genre: VideoGenre;

  /** Human-readable description of the template */
  description: string;

  /** Ordered sequence of sections that make up the video */
  structure: VideoSection[];
}

/**
 * Record type for video template collection
 */
export type VideoTemplateRecord = Record<string, VideoTemplate>;

/**
 * Statistics about video templates
 */
export interface VideoTemplateStats {
  /** Total number of video templates */
  totalTemplates: number;

  /** Number of templates per genre */
  byGenre: Record<VideoGenre, number>;

  /** Average number of sections per template */
  avgSectionsPerTemplate: number;

  /** Total number of unique scene templates referenced */
  uniqueSceneTemplatesReferenced: number;
}

/**
 * Validation result for a video template
 */
export interface VideoTemplateValidationResult {
  /** Whether the template is valid */
  valid: boolean;

  /** List of validation errors */
  errors: string[];

  /** List of validation warnings */
  warnings: string[];
}
