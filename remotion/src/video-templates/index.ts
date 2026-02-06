/**
 * Video Templates Module - Layer 5 (Video Templates)
 * Orchestrates Layer 4 scene templates into complete video structures
 *
 * Total Templates: 10
 * - MVP: 2 templates (concept_explainer, news_summary)
 * - V2: 3 templates (step_by_step, myth_buster, list_ranking)
 * - V3: 5 templates (a_vs_b, pros_and_cons, story_arc, biography, how_it_works)
 */

// Export all types
export * from './types';

// Export video templates and utilities
export {
  VIDEO_TEMPLATES,
  VIDEO_TEMPLATE_NAMES,
  MVP_TEMPLATE_NAMES,
  V2_TEMPLATE_NAMES,
  V3_TEMPLATE_NAMES,
  getVideoTemplate,
  hasVideoTemplate,
  getTemplatesByGenre,
  getTemplatesByDifficulty,
  validateVideoTemplate,
  validateAllVideoTemplates,
  getUsedSceneTemplates,
  getVideoTemplateStats,
  getTemplateSectionStats,
} from './videoTemplates';
