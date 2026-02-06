/**
 * Scene Templates - 16 Scene Templates (8 MVP + 8 V2)
 * Layer 4 (Scene Templates) for the stickman video system
 *
 * These templates combine L3 direction elements (camera, layout, timing)
 * into reusable scene packages for specific roles in video production.
 *
 * MVP Templates (8):
 * - intro_greeting, explain_default, explain_formula, explain_reverse
 * - emphasis_number, emphasis_statement, compare_side_by_side, transition_topic_change
 *
 * V2 Templates (8):
 * - intro_question, intro_title_card, explain_with_visual, emphasis_spotlight
 * - compare_before_after, compare_list, example_with_counter, example_story
 */

import { SceneTemplate, SceneTemplateRecord } from './types';
import {
  hasCameraPreset,
  hasLayoutPreset,
  hasTimingPreset,
} from '../direction';

// ============================================================================
// MVP SCENE TEMPLATES (8)
// ============================================================================

/**
 * 1. intro_greeting - Opening scene with welcoming stickman
 */
const intro_greeting: SceneTemplate = {
  name: 'intro_greeting',
  role: 'opening',
  description: 'Opening scene with stickman greeting the viewer',
  camera: 'static_full',
  layout: 'center_stack',
  timing: 'stickman_first',
  suggestedPoses: ['standing', 'waving'],
  suggestedExpressions: ['happy', 'neutral'],
};

/**
 * 2. explain_default - Standard explanation with stickman on left
 */
const explain_default: SceneTemplate = {
  name: 'explain_default',
  role: 'explanation',
  description: 'Standard explanation scene with stickman on left and content on right',
  camera: 'static_full',
  layout: 'split_left_stickman',
  timing: 'stickman_first',
};

/**
 * 3. explain_formula - Formula or concept explanation with close-up focus
 */
const explain_formula: SceneTemplate = {
  name: 'explain_formula',
  role: 'explanation',
  description: 'Formula or concept explanation with close-up view and text-first timing',
  camera: 'static_closeup',
  layout: 'center_stack',
  timing: 'text_first',
};

/**
 * 4. explain_reverse - Explanation with stickman on right
 */
const explain_reverse: SceneTemplate = {
  name: 'explain_reverse',
  role: 'explanation',
  description: 'Explanation scene with content on left and stickman on right',
  camera: 'static_full',
  layout: 'split_right_stickman',
  timing: 'text_first',
};

/**
 * 5. emphasis_number - Number emphasis with fast zoom
 */
const emphasis_number: SceneTemplate = {
  name: 'emphasis_number',
  role: 'emphasis',
  description: 'Emphasize a key number or statistic with fast zoom and climax reveal',
  camera: 'zoom_in_fast',
  layout: 'center_stack',
  timing: 'reveal_climax',
};

/**
 * 6. emphasis_statement - Statement emphasis with slow zoom
 */
const emphasis_statement: SceneTemplate = {
  name: 'emphasis_statement',
  role: 'emphasis',
  description: 'Emphasize a key statement with slow zoom and full-screen text',
  camera: 'zoom_in_slow',
  layout: 'overlay_fullscreen_text',
  timing: 'all_at_once',
};

/**
 * 7. compare_side_by_side - Side-by-side comparison
 */
const compare_side_by_side: SceneTemplate = {
  name: 'compare_side_by_side',
  role: 'comparison',
  description: 'Side-by-side comparison with wide view and staggered timing',
  camera: 'static_wide',
  layout: 'split_equal',
  timing: 'all_at_once_stagger',
};

/**
 * 8. transition_topic_change - Topic transition
 */
const transition_topic_change: SceneTemplate = {
  name: 'transition_topic_change',
  role: 'transition',
  description: 'Transition between topics with single centered element',
  camera: 'static_full',
  layout: 'center_single',
  timing: 'all_at_once',
};

// ============================================================================
// V2 SCENE TEMPLATES (8)
// ============================================================================

/**
 * 9. intro_question - Opening with a question to engage viewers
 */
const intro_question: SceneTemplate = {
  name: 'intro_question',
  role: 'opening',
  description: 'Opening scene with a compelling question using zoom and reveal',
  camera: 'zoom_in_slow',
  layout: 'center_hero',
  timing: 'reveal_climax',
  suggestedPoses: ['thinking', 'explaining'],
  suggestedExpressions: ['thinking', 'curious'],
};

/**
 * 10. intro_title_card - Title card opening
 */
const intro_title_card: SceneTemplate = {
  name: 'intro_title_card',
  role: 'opening',
  description: 'Full-screen title card for video introduction',
  camera: 'static_wide',
  layout: 'overlay_fullscreen_text',
  timing: 'all_at_once',
};

/**
 * 11. explain_with_visual - Explanation with visual elements panning
 */
const explain_with_visual: SceneTemplate = {
  name: 'explain_with_visual',
  role: 'explanation',
  description: 'Explanation with multiple visual elements appearing left to right',
  camera: 'pan_left_to_right',
  layout: 'triple_horizontal',
  timing: 'left_to_right',
  suggestedPoses: ['pointing_right', 'explaining'],
};

/**
 * 12. emphasis_spotlight - Spotlight emphasis for key points
 */
const emphasis_spotlight: SceneTemplate = {
  name: 'emphasis_spotlight',
  role: 'emphasis',
  description: 'Spotlight effect on key content with dimmed background',
  camera: 'static_closeup',
  layout: 'overlay_spotlight',
  timing: 'reveal_climax',
  suggestedExpressions: ['surprised', 'excited'],
};

/**
 * 13. compare_before_after - Before/after comparison with pan
 */
const compare_before_after: SceneTemplate = {
  name: 'compare_before_after',
  role: 'comparison',
  description: 'Before and after comparison with panning camera',
  camera: 'pan_left_to_right',
  layout: 'grid_2x1',
  timing: 'left_to_right',
};

/**
 * 14. compare_list - List comparison with multiple items
 */
const compare_list: SceneTemplate = {
  name: 'compare_list',
  role: 'comparison',
  description: 'List comparison with three columns appearing top to bottom',
  camera: 'static_full',
  layout: 'grid_3x1',
  timing: 'top_to_bottom',
};

/**
 * 15. example_with_counter - Example with animated counter
 */
const example_with_counter: SceneTemplate = {
  name: 'example_with_counter',
  role: 'example',
  description: 'Example demonstration with stickman, text, and animated counter',
  camera: 'static_full',
  layout: 'triple_stickman_text_counter',
  timing: 'stickman_first',
  suggestedPoses: ['pointing_right', 'explaining'],
  suggestedExpressions: ['happy', 'excited'],
};

/**
 * 16. example_story - Story-based example
 */
const example_story: SceneTemplate = {
  name: 'example_story',
  role: 'example',
  description: 'Story-based example with gradual zoom and stickman focus',
  camera: 'zoom_in_slow',
  layout: 'split_left_stickman',
  timing: 'stickman_first',
  suggestedPoses: ['standing', 'sitting', 'thinking'],
  suggestedExpressions: ['neutral', 'thinking', 'happy'],
};

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All scene templates indexed by name
 */
export const SCENE_TEMPLATES: SceneTemplateRecord = {
  // MVP (8)
  intro_greeting,
  explain_default,
  explain_formula,
  explain_reverse,
  emphasis_number,
  emphasis_statement,
  compare_side_by_side,
  transition_topic_change,
  // V2 (8)
  intro_question,
  intro_title_card,
  explain_with_visual,
  emphasis_spotlight,
  compare_before_after,
  compare_list,
  example_with_counter,
  example_story,
};

/**
 * Array of all scene template names
 */
export const SCENE_TEMPLATE_NAMES = Object.keys(SCENE_TEMPLATES) as string[];

/**
 * Array of MVP template names for easy reference
 */
export const MVP_TEMPLATE_NAMES = [
  'intro_greeting',
  'explain_default',
  'explain_formula',
  'explain_reverse',
  'emphasis_number',
  'emphasis_statement',
  'compare_side_by_side',
  'transition_topic_change',
] as const;

/**
 * Array of V2 template names for easy reference
 */
export const V2_TEMPLATE_NAMES = [
  'intro_question',
  'intro_title_card',
  'explain_with_visual',
  'emphasis_spotlight',
  'compare_before_after',
  'compare_list',
  'example_with_counter',
  'example_story',
] as const;

/**
 * Get a scene template by name
 */
export const getSceneTemplate = (name: string): SceneTemplate | undefined => {
  return SCENE_TEMPLATES[name];
};

/**
 * Check if a scene template exists
 */
export const hasSceneTemplate = (name: string): boolean => {
  return name in SCENE_TEMPLATES;
};

/**
 * Get all templates by role
 */
export const getTemplatesByRole = (role: SceneTemplate['role']): SceneTemplate[] => {
  return Object.values(SCENE_TEMPLATES).filter(template => template.role === role);
};

/**
 * Validate that all L3 presets referenced by a template exist
 */
export const validateTemplatePresets = (template: SceneTemplate): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!hasCameraPreset(template.camera)) {
    errors.push(`Camera preset '${template.camera}' not found in L3 direction module`);
  }

  if (!hasLayoutPreset(template.layout)) {
    errors.push(`Layout preset '${template.layout}' not found in L3 direction module`);
  }

  if (!hasTimingPreset(template.timing)) {
    errors.push(`Timing preset '${template.timing}' not found in L3 direction module`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate all templates in the module
 */
export const validateAllTemplates = (): {
  valid: boolean;
  results: Record<string, { valid: boolean; errors: string[] }>;
} => {
  const results: Record<string, { valid: boolean; errors: string[] }> = {};
  let allValid = true;

  for (const [name, template] of Object.entries(SCENE_TEMPLATES)) {
    const validation = validateTemplatePresets(template);
    results[name] = validation;
    if (!validation.valid) {
      allValid = false;
    }
  }

  return {
    valid: allValid,
    results,
  };
};
