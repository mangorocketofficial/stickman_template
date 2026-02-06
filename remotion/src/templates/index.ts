/**
 * Templates Module - Scene Templates (Layer 4)
 * Combines Layer 3 direction elements (camera + layout + timing) into reusable scene packages
 *
 * Total Templates: 25
 * - MVP: 8 templates
 * - V2: 8 templates
 * - V3: 9 templates
 */

// Export all types
export * from './types';

// Export scene templates and utilities
export {
  SCENE_TEMPLATES,
  SCENE_TEMPLATE_NAMES,
  MVP_TEMPLATE_NAMES,
  V2_TEMPLATE_NAMES,
  V3_TEMPLATE_NAMES,
  getSceneTemplate,
  hasSceneTemplate,
  getTemplatesByRole,
  validateTemplate,
  validateAllTemplates,
  getTemplateStats,
} from './sceneTemplates';
