/**
 * Video Templates Module - Layer 5 (Video Templates)
 * Complete video structure templates for the stickman video system
 *
 * Total Templates: 2 MVP
 * - Educational: 1 (concept_explainer)
 * - News: 1 (news_summary)
 *
 * These templates combine L4 scene templates into complete video blueprints,
 * defining the structure, flow, and scene composition of entire videos.
 */

// Export all types
export * from './types';

// Export video templates module
export {
  VIDEO_TEMPLATES,
  VIDEO_TEMPLATE_NAMES,
  MVP_VIDEO_TEMPLATE_NAMES,
  getVideoTemplate,
  hasVideoTemplate,
  getTemplatesByGenre,
  getVideoTemplateStats,
  validateVideoTemplate,
  validateAllVideoTemplates,
  getAllReferencedSceneTemplates,
  getSceneCountRange,
} from './videoTemplates';
