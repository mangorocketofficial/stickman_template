/**
 * Video Templates Module - Layer 5 (Video Templates)
 * Combines Layer 4 scene templates into complete video structures
 *
 * Total Templates: 5
 * - MVP: 2 templates
 * - V2: 3 templates
 */

// Export all types
export * from './types';

// Export video templates and utilities
export {
  VIDEO_TEMPLATES,
  VIDEO_TEMPLATE_NAMES,
  MVP_VIDEO_TEMPLATE_NAMES,
  V2_VIDEO_TEMPLATE_NAMES,
  getVideoTemplate,
  hasVideoTemplate,
  getTemplatesByGenre,
  getVideoTemplateStats,
  validateVideoTemplate,
  validateAllVideoTemplates,
  getAllReferencedSceneTemplates,
  getSceneCountRange,
  getOptionalSectionCount,
} from './videoTemplates';
