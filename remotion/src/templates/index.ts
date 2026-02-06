/**
 * Templates Module - Scene Templates
 * Layer 4 (Scene Templates) for the stickman video system
 *
 * Total Templates: 8 MVP
 * - Opening: 1 (intro_greeting)
 * - Explanation: 3 (explain_default, explain_formula, explain_reverse)
 * - Emphasis: 2 (emphasis_number, emphasis_statement)
 * - Comparison: 1 (compare_side_by_side)
 * - Transition: 1 (transition_topic_change)
 */

// Export all types
export * from './types';

// Export scene templates module
export {
  SCENE_TEMPLATES,
  SCENE_TEMPLATE_NAMES,
  MVP_TEMPLATE_NAMES,
  getSceneTemplate,
  hasSceneTemplate,
  getTemplatesByRole,
  validateTemplatePresets,
  validateAllTemplates,
} from './sceneTemplates';
