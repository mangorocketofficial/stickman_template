/**
 * Scene Templates - 25 reusable scene packages
 * Layer 4 (Scene Packages) for the stickman video system
 *
 * MVP 8:  intro_greeting, explain_default, explain_formula, explain_reverse,
 *         emphasis_number, emphasis_statement, compare_side_by_side, transition_topic_change
 * V2 8:   intro_question, intro_title_card, explain_with_visual, emphasis_spotlight,
 *         compare_before_after, compare_list, example_with_counter, example_story
 * V3 9:   warning_alert, warning_subtle, closing_summary, closing_cta,
 *         transition_carry_over, transition_wipe, explain_timeline, compare_pyramid, emphasis_dramatic
 */

import { SceneTemplate, SceneRole } from './types';
import { hasCameraPreset } from '../direction/camera';
import { hasLayoutPreset } from '../direction/layout';
import { hasTimingPreset } from '../direction/timing';

// ============================================================================
// MVP SCENE TEMPLATES (8)
// ============================================================================

/**
 * 1. intro_greeting - Opening with stickman greeting
 */
const intro_greeting: SceneTemplate = {
  name: 'intro_greeting',
  role: 'opening',
  description: 'Opening scene with stickman waving and greeting text',
  camera: 'static_full',
  layout: 'split_left_stickman',
  timing: 'stickman_first',
  defaultMotion: 'wave',
  suggestedPoses: ['waving', 'standing'],
  suggestedExpressions: ['happy', 'excited'],
};

/**
 * 2. explain_default - Default explanation layout
 */
const explain_default: SceneTemplate = {
  name: 'explain_default',
  role: 'explanation',
  description: 'Standard explanation with stickman and text',
  camera: 'static_full',
  layout: 'split_left_stickman',
  timing: 'stickman_first',
  suggestedPoses: ['explaining', 'pointing_right'],
  suggestedExpressions: ['neutral', 'thinking'],
};

/**
 * 3. explain_formula - Explanation with formula/counter
 */
const explain_formula: SceneTemplate = {
  name: 'explain_formula',
  role: 'explanation',
  description: 'Explanation focused on formula or counter display',
  camera: 'zoom_in_slow',
  layout: 'triple_stickman_text_counter',
  timing: 'counter_focus',
  suggestedPoses: ['explaining', 'pointing_right'],
  suggestedExpressions: ['focused', 'thinking'],
};

/**
 * 4. explain_reverse - Explanation with stickman on right
 */
const explain_reverse: SceneTemplate = {
  name: 'explain_reverse',
  role: 'explanation',
  description: 'Explanation with content on left, stickman on right',
  camera: 'static_full',
  layout: 'split_right_stickman',
  timing: 'text_first',
  suggestedPoses: ['standing', 'thinking'],
  suggestedExpressions: ['neutral', 'thinking'],
};

/**
 * 5. emphasis_number - Emphasis on a key number/stat
 */
const emphasis_number: SceneTemplate = {
  name: 'emphasis_number',
  role: 'emphasis',
  description: 'Emphasize a key number or statistic',
  camera: 'zoom_in_fast',
  layout: 'triple_stickman_text_counter',
  timing: 'reveal_climax',
  suggestedPoses: ['celebrating', 'surprised_pose'],
  suggestedExpressions: ['surprised', 'excited'],
};

/**
 * 6. emphasis_statement - Emphasis on a key statement
 */
const emphasis_statement: SceneTemplate = {
  name: 'emphasis_statement',
  role: 'emphasis',
  description: 'Emphasize a key statement or quote',
  camera: 'zoom_in_slow',
  layout: 'overlay_fullscreen_text',
  timing: 'reveal_climax',
  suggestedPoses: ['standing'],
  suggestedExpressions: ['neutral', 'focused'],
};

/**
 * 7. compare_side_by_side - Side by side comparison
 */
const compare_side_by_side: SceneTemplate = {
  name: 'compare_side_by_side',
  role: 'comparison',
  description: 'Side by side comparison of two concepts',
  camera: 'static_wide',
  layout: 'split_equal',
  timing: 'left_to_right',
  suggestedPoses: ['explaining', 'shrugging'],
  suggestedExpressions: ['thinking', 'neutral'],
};

/**
 * 8. transition_topic_change - Transition between topics
 */
const transition_topic_change: SceneTemplate = {
  name: 'transition_topic_change',
  role: 'transition',
  description: 'Transition scene when changing topics',
  camera: 'static_full',
  layout: 'center_single',
  timing: 'all_at_once',
  suggestedPoses: ['standing', 'pointing_right'],
  suggestedExpressions: ['neutral', 'happy'],
};

// ============================================================================
// V2 SCENE TEMPLATES (8)
// ============================================================================

/**
 * 9. intro_question - Opening with a question
 */
const intro_question: SceneTemplate = {
  name: 'intro_question',
  role: 'opening',
  description: 'Opening scene posing a question to engage viewers',
  camera: 'zoom_in_slow',
  layout: 'split_left_stickman',
  timing: 'text_first',
  suggestedPoses: ['thinking', 'shrugging'],
  suggestedExpressions: ['thinking', 'confused'],
};

/**
 * 10. intro_title_card - Title card opening
 */
const intro_title_card: SceneTemplate = {
  name: 'intro_title_card',
  role: 'opening',
  description: 'Title card style opening with large text',
  camera: 'zoom_out_reveal',
  layout: 'overlay_fullscreen_text',
  timing: 'all_at_once',
  suggestedPoses: ['standing'],
  suggestedExpressions: ['neutral'],
};

/**
 * 11. explain_with_visual - Explanation with icon/visual
 */
const explain_with_visual: SceneTemplate = {
  name: 'explain_with_visual',
  role: 'explanation',
  description: 'Explanation accompanied by visual icon',
  camera: 'static_full',
  layout: 'triple_stickman_icon_text',
  timing: 'icon_burst',
  suggestedPoses: ['explaining', 'pointing_up'],
  suggestedExpressions: ['happy', 'excited'],
};

/**
 * 12. emphasis_spotlight - Spotlight emphasis effect
 */
const emphasis_spotlight: SceneTemplate = {
  name: 'emphasis_spotlight',
  role: 'emphasis',
  description: 'Spotlight effect drawing attention to key element',
  camera: 'static_closeup',
  layout: 'overlay_spotlight',
  timing: 'reveal_climax',
  suggestedPoses: ['celebrating', 'thumbsUp'],
  suggestedExpressions: ['excited', 'proud'],
};

/**
 * 13. compare_before_after - Before/after comparison
 */
const compare_before_after: SceneTemplate = {
  name: 'compare_before_after',
  role: 'comparison',
  description: 'Before and after comparison layout',
  camera: 'pan_left_to_right',
  layout: 'grid_2x1',
  timing: 'left_to_right',
  suggestedPoses: ['pointing_left', 'pointing_right'],
  suggestedExpressions: ['neutral', 'happy'],
};

/**
 * 14. compare_list - List comparison
 */
const compare_list: SceneTemplate = {
  name: 'compare_list',
  role: 'comparison',
  description: 'Comparison presented as parallel lists',
  camera: 'static_wide',
  layout: 'comparison_table',
  timing: 'top_to_bottom',
  suggestedPoses: ['explaining'],
  suggestedExpressions: ['focused', 'thinking'],
};

/**
 * 15. example_with_counter - Example with counter animation
 */
const example_with_counter: SceneTemplate = {
  name: 'example_with_counter',
  role: 'example',
  description: 'Example demonstration with animated counter',
  camera: 'zoom_in_slow',
  layout: 'triple_stickman_text_counter',
  timing: 'counter_focus',
  suggestedPoses: ['pointing_right', 'explaining'],
  suggestedExpressions: ['focused', 'excited'],
};

/**
 * 16. example_story - Story-style example
 */
const example_story: SceneTemplate = {
  name: 'example_story',
  role: 'example',
  description: 'Narrative-style example with progression',
  camera: 'dolly_in',
  layout: 'split_left_stickman',
  timing: 'stickman_first',
  defaultMotion: 'talk',
  suggestedPoses: ['explaining', 'thinking', 'celebrating'],
  suggestedExpressions: ['neutral', 'thinking', 'happy'],
};

// ============================================================================
// V3 SCENE TEMPLATES (9)
// ============================================================================

/**
 * 17. warning_alert - Alert-style warning
 */
const warning_alert: SceneTemplate = {
  name: 'warning_alert',
  role: 'warning',
  description: 'Dramatic alert-style warning with camera shake',
  camera: 'shake',
  layout: 'center_stack',
  timing: 'reveal_climax',
  suggestedPoses: ['stop', 'raising_hand'],
  suggestedExpressions: ['surprised', 'worried'],
};

/**
 * 18. warning_subtle - Subtle warning
 */
const warning_subtle: SceneTemplate = {
  name: 'warning_subtle',
  role: 'warning',
  description: 'Subtle warning with calm presentation',
  camera: 'static_full',
  layout: 'split_left_stickman',
  timing: 'text_first',
  suggestedPoses: ['thinking', 'hand_on_hip'],
  suggestedExpressions: ['thinking', 'neutral'],
};

/**
 * 19. closing_summary - Summary closing
 */
const closing_summary: SceneTemplate = {
  name: 'closing_summary',
  role: 'closing',
  description: 'Closing scene summarizing key points',
  camera: 'zoom_out_reveal',
  layout: 'center_stack',
  timing: 'all_at_once',
  suggestedPoses: ['presenting', 'explaining'],
  suggestedExpressions: ['happy', 'proud'],
};

/**
 * 20. closing_cta - Call-to-action closing
 */
const closing_cta: SceneTemplate = {
  name: 'closing_cta',
  role: 'closing',
  description: 'Closing with call-to-action',
  camera: 'static_full',
  layout: 'overlay_fullscreen_text',
  timing: 'reveal_climax',
  suggestedPoses: ['pointing_right', 'thumbsUp'],
  suggestedExpressions: ['excited', 'happy'],
};

/**
 * 21. transition_carry_over - Carry-over transition
 */
const transition_carry_over: SceneTemplate = {
  name: 'transition_carry_over',
  role: 'transition',
  description: 'Transition carrying stickman from previous scene',
  camera: 'static_full',
  layout: 'split_left_stickman',
  timing: 'carry_stickman',
  defaultMotion: 'walk',
  suggestedPoses: ['standing', 'pointing_right'],
  suggestedExpressions: ['neutral', 'happy'],
};

/**
 * 22. transition_wipe - Wipe transition
 */
const transition_wipe: SceneTemplate = {
  name: 'transition_wipe',
  role: 'transition',
  description: 'Wipe-style transition between scenes',
  camera: 'static_full',
  layout: 'center_single',
  timing: 'wipe_replace',
  suggestedPoses: ['standing'],
  suggestedExpressions: ['neutral'],
};

/**
 * 23. explain_timeline - Timeline explanation
 */
const explain_timeline: SceneTemplate = {
  name: 'explain_timeline',
  role: 'explanation',
  description: 'Explanation using horizontal timeline layout',
  camera: 'pan_left_to_right',
  layout: 'timeline_horizontal',
  timing: 'left_to_right',
  suggestedPoses: ['pointing_right', 'explaining'],
  suggestedExpressions: ['focused', 'neutral'],
};

/**
 * 24. compare_pyramid - Pyramid comparison
 */
const compare_pyramid: SceneTemplate = {
  name: 'compare_pyramid',
  role: 'comparison',
  description: 'Hierarchical comparison in pyramid layout',
  camera: 'cinematic_sweep',
  layout: 'pyramid_layout',
  timing: 'bounce_sequence',
  suggestedPoses: ['presenting', 'explaining'],
  suggestedExpressions: ['proud', 'focused'],
};

/**
 * 25. emphasis_dramatic - Dramatic emphasis
 */
const emphasis_dramatic: SceneTemplate = {
  name: 'emphasis_dramatic',
  role: 'emphasis',
  description: 'Dramatic emphasis with cinematic camera and spiral animation',
  camera: 'cinematic_sweep',
  layout: 'center_hero',
  timing: 'spiral_in',
  suggestedPoses: ['celebrating', 'presenting'],
  suggestedExpressions: ['excited', 'proud'],
};

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All scene templates indexed by name
 */
export const SCENE_TEMPLATES: Record<string, SceneTemplate> = {
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
  // V3 (9)
  warning_alert,
  warning_subtle,
  closing_summary,
  closing_cta,
  transition_carry_over,
  transition_wipe,
  explain_timeline,
  compare_pyramid,
  emphasis_dramatic,
};

/**
 * Array of all scene template names
 */
export const SCENE_TEMPLATE_NAMES = Object.keys(SCENE_TEMPLATES) as string[];

/**
 * MVP template names for easy reference
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
 * V2 template names for easy reference
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
 * V3 template names for easy reference
 */
export const V3_TEMPLATE_NAMES = [
  'warning_alert',
  'warning_subtle',
  'closing_summary',
  'closing_cta',
  'transition_carry_over',
  'transition_wipe',
  'explain_timeline',
  'compare_pyramid',
  'emphasis_dramatic',
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
 * Get all templates for a specific role
 */
export const getTemplatesByRole = (role: SceneRole): SceneTemplate[] => {
  return Object.values(SCENE_TEMPLATES).filter(template => template.role === role);
};

/**
 * Validate a scene template's L3 preset references
 */
export const validateTemplate = (template: SceneTemplate): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!hasCameraPreset(template.camera)) {
    errors.push(`Unknown camera preset: ${template.camera}`);
  }

  if (!hasLayoutPreset(template.layout)) {
    errors.push(`Unknown layout preset: ${template.layout}`);
  }

  if (!hasTimingPreset(template.timing)) {
    errors.push(`Unknown timing preset: ${template.timing}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate all scene templates
 */
export const validateAllTemplates = (): {
  valid: boolean;
  invalidTemplates: { name: string; errors: string[] }[];
} => {
  const invalidTemplates: { name: string; errors: string[] }[] = [];

  for (const [name, template] of Object.entries(SCENE_TEMPLATES)) {
    const result = validateTemplate(template);
    if (!result.valid) {
      invalidTemplates.push({ name, errors: result.errors });
    }
  }

  return {
    valid: invalidTemplates.length === 0,
    invalidTemplates,
  };
};

/**
 * Get template count statistics
 */
export const getTemplateStats = (): {
  total: number;
  mvp: number;
  v2: number;
  v3: number;
  byRole: Record<SceneRole, number>;
} => {
  const byRole: Record<SceneRole, number> = {
    opening: 0,
    explanation: 0,
    emphasis: 0,
    comparison: 0,
    transition: 0,
    example: 0,
    warning: 0,
    closing: 0,
  };

  for (const template of Object.values(SCENE_TEMPLATES)) {
    byRole[template.role]++;
  }

  return {
    total: Object.keys(SCENE_TEMPLATES).length,
    mvp: MVP_TEMPLATE_NAMES.length,
    v2: V2_TEMPLATE_NAMES.length,
    v3: V3_TEMPLATE_NAMES.length,
    byRole,
  };
};
