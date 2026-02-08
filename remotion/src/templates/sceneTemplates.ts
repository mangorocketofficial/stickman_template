/**
 * Scene Templates - 40 reusable scene packages
 * Layer 4 (Scene Packages) for the stickman video system
 *
 * IMPROVED: All 25 layouts utilized, defaultMotion for all templates
 *
 * Structure by role:
 * - opening (5): greeting, question, title_card, hook, dramatic_intro
 * - explanation (8): default, formula, reverse, visual, timeline, step, diagram, minimal
 * - emphasis (6): number, statement, spotlight, dramatic, pulse, fullscreen
 * - comparison (6): side_by_side, before_after, list, pyramid, grid, pros_cons
 * - example (4): counter, story, visual, minimal
 * - warning (3): alert, subtle, important
 * - closing (4): summary, cta, thanks, recap
 * - transition (4): topic_change, carry_over, wipe, breather
 */

import { SceneTemplate, SceneRole } from './types';
import { hasCameraPreset } from '../direction/camera';
import { hasLayoutPreset } from '../direction/layout';
import { hasTimingPreset } from '../direction/timing';

// ============================================================================
// OPENING TEMPLATES (5)
// ============================================================================

const intro_greeting: SceneTemplate = {
  name: 'intro_greeting',
  role: 'opening',
  description: 'Friendly greeting with waving stickman',
  camera: 'static_full',
  layout: 'split_left_stickman',
  timing: 'stickman_first',
  defaultMotion: 'waving_loop',
  suggestedPoses: ['waving', 'standing'],
  suggestedExpressions: ['happy', 'excited'],
};

const intro_question: SceneTemplate = {
  name: 'intro_question',
  role: 'opening',
  description: 'Hook viewers with an engaging question',
  camera: 'zoom_in_slow',
  layout: 'stickman_center_text_sides',
  timing: 'text_first',
  defaultMotion: 'thinking_loop',
  suggestedPoses: ['thinking', 'shrugging'],
  suggestedExpressions: ['thinking', 'confused'],
};

const intro_title_card: SceneTemplate = {
  name: 'intro_title_card',
  role: 'opening',
  description: 'Bold title card with zoom reveal',
  camera: 'zoom_out_reveal',
  layout: 'overlay_fullscreen_text',
  timing: 'all_at_once',
  defaultMotion: 'breathing',
  suggestedPoses: ['standing'],
  suggestedExpressions: ['neutral', 'confident'],
};

const intro_hook: SceneTemplate = {
  name: 'intro_hook',
  role: 'opening',
  description: 'Attention-grabbing hook with dynamic camera',
  camera: 'cinematic_sweep',
  layout: 'center_hero',
  timing: 'reveal_climax',
  defaultMotion: 'gesturing',
  suggestedPoses: ['pointing_up', 'presenting'],
  suggestedExpressions: ['excited', 'surprised'],
};

const intro_dramatic: SceneTemplate = {
  name: 'intro_dramatic',
  role: 'opening',
  description: 'Dramatic opening with floating elements',
  camera: 'dolly_in',
  layout: 'floating_elements',
  timing: 'spiral_in',
  defaultMotion: 'breathing',
  suggestedPoses: ['standing', 'confident'],
  suggestedExpressions: ['focused', 'neutral'],
};

// ============================================================================
// EXPLANATION TEMPLATES (8)
// ============================================================================

const explain_default: SceneTemplate = {
  name: 'explain_default',
  role: 'explanation',
  description: 'Standard explanation with gesturing stickman',
  camera: 'static_full',
  layout: 'split_left_stickman',
  timing: 'stickman_first',
  defaultMotion: 'gesturing',
  suggestedPoses: ['explaining', 'pointing_right'],
  suggestedExpressions: ['neutral', 'thinking'],
};

const explain_formula: SceneTemplate = {
  name: 'explain_formula',
  role: 'explanation',
  description: 'Formula or calculation with counter focus',
  camera: 'zoom_in_slow',
  layout: 'triple_stickman_text_counter',
  timing: 'counter_focus',
  defaultMotion: 'typing',
  suggestedPoses: ['explaining', 'pointing_right'],
  suggestedExpressions: ['focused', 'thinking'],
};

const explain_reverse: SceneTemplate = {
  name: 'explain_reverse',
  role: 'explanation',
  description: 'Content-first layout with stickman on right',
  camera: 'static_full',
  layout: 'split_right_stickman',
  timing: 'text_first',
  defaultMotion: 'nodding',
  suggestedPoses: ['standing', 'thinking'],
  suggestedExpressions: ['neutral', 'thinking'],
};

const explain_with_visual: SceneTemplate = {
  name: 'explain_with_visual',
  role: 'explanation',
  description: 'Explanation with icon/visual emphasis',
  camera: 'static_full',
  layout: 'triple_stickman_icon_text',
  timing: 'icon_burst',
  defaultMotion: 'pointing',
  suggestedPoses: ['explaining', 'pointing_up'],
  suggestedExpressions: ['happy', 'excited'],
};

const explain_timeline: SceneTemplate = {
  name: 'explain_timeline',
  role: 'explanation',
  description: 'Timeline-based explanation with horizontal flow',
  camera: 'pan_left_to_right',
  layout: 'timeline_horizontal',
  timing: 'left_to_right',
  defaultMotion: 'pointing',
  suggestedPoses: ['pointing_right', 'explaining'],
  suggestedExpressions: ['focused', 'neutral'],
};

const explain_step: SceneTemplate = {
  name: 'explain_step',
  role: 'explanation',
  description: 'Step-by-step explanation in vertical stack',
  camera: 'static_full',
  layout: 'triple_top_bottom',
  timing: 'top_to_bottom',
  defaultMotion: 'nodding',
  suggestedPoses: ['explaining', 'pointing_up'],
  suggestedExpressions: ['focused', 'neutral'],
};

const explain_diagram: SceneTemplate = {
  name: 'explain_diagram',
  role: 'explanation',
  description: 'Diagram-style explanation with circular layout',
  camera: 'zoom_breathe',
  layout: 'circular_layout',
  timing: 'bounce_sequence',
  defaultMotion: 'gesturing',
  suggestedPoses: ['presenting', 'explaining'],
  suggestedExpressions: ['focused', 'thinking'],
};

const explain_minimal: SceneTemplate = {
  name: 'explain_minimal',
  role: 'explanation',
  description: 'Minimal text-only explanation',
  camera: 'static_closeup',
  layout: 'text_only',
  timing: 'typewriter_reveal',
  defaultMotion: 'breathing',
  suggestedPoses: ['standing'],
  suggestedExpressions: ['neutral'],
};

// ============================================================================
// EMPHASIS TEMPLATES (6)
// ============================================================================

const emphasis_number: SceneTemplate = {
  name: 'emphasis_number',
  role: 'emphasis',
  description: 'Dramatic number reveal with fast zoom',
  camera: 'zoom_in_fast',
  layout: 'triple_stickman_text_counter',
  timing: 'reveal_climax',
  defaultMotion: 'clapping',
  suggestedPoses: ['celebrating', 'surprised_pose'],
  suggestedExpressions: ['surprised', 'excited'],
};

const emphasis_statement: SceneTemplate = {
  name: 'emphasis_statement',
  role: 'emphasis',
  description: 'Key statement with fullscreen text',
  camera: 'zoom_in_slow',
  layout: 'overlay_fullscreen_text',
  timing: 'reveal_climax',
  defaultMotion: 'breathing',
  suggestedPoses: ['standing'],
  suggestedExpressions: ['neutral', 'focused'],
};

const emphasis_spotlight: SceneTemplate = {
  name: 'emphasis_spotlight',
  role: 'emphasis',
  description: 'Spotlight effect on key element',
  camera: 'static_closeup',
  layout: 'overlay_spotlight',
  timing: 'reveal_climax',
  defaultMotion: 'nodding',
  suggestedPoses: ['celebrating', 'thumbsUp'],
  suggestedExpressions: ['excited', 'proud'],
};

const emphasis_dramatic: SceneTemplate = {
  name: 'emphasis_dramatic',
  role: 'emphasis',
  description: 'Dramatic emphasis with cinematic sweep',
  camera: 'cinematic_sweep',
  layout: 'center_hero',
  timing: 'spiral_in',
  defaultMotion: 'gesturing',
  suggestedPoses: ['celebrating', 'presenting'],
  suggestedExpressions: ['excited', 'proud'],
};

const emphasis_pulse: SceneTemplate = {
  name: 'emphasis_pulse',
  role: 'emphasis',
  description: 'Pulsing zoom for rhythmic emphasis',
  camera: 'zoom_pulse',
  layout: 'center_stack',
  timing: 'all_at_once_stagger',
  defaultMotion: 'jumping',
  suggestedPoses: ['celebrating', 'thumbsUp'],
  suggestedExpressions: ['excited', 'happy'],
};

const emphasis_fullscreen: SceneTemplate = {
  name: 'emphasis_fullscreen',
  role: 'emphasis',
  description: 'Picture-in-picture with stickman reaction',
  camera: 'static_full',
  layout: 'overlay_picture_in_picture',
  timing: 'reveal_climax',
  defaultMotion: 'clapping',
  suggestedPoses: ['celebrating', 'thumbsUp'],
  suggestedExpressions: ['excited', 'surprised'],
};

// ============================================================================
// COMPARISON TEMPLATES (6)
// ============================================================================

const compare_side_by_side: SceneTemplate = {
  name: 'compare_side_by_side',
  role: 'comparison',
  description: 'Classic side-by-side comparison',
  camera: 'static_wide',
  layout: 'split_equal',
  timing: 'left_to_right',
  defaultMotion: 'gesturing',
  suggestedPoses: ['explaining', 'shrugging'],
  suggestedExpressions: ['thinking', 'neutral'],
};

const compare_before_after: SceneTemplate = {
  name: 'compare_before_after',
  role: 'comparison',
  description: 'Before/after with panning camera',
  camera: 'pan_left_to_right',
  layout: 'grid_2x1',
  timing: 'left_to_right',
  defaultMotion: 'pointing',
  suggestedPoses: ['pointing_left', 'pointing_right'],
  suggestedExpressions: ['neutral', 'happy'],
};

const compare_list: SceneTemplate = {
  name: 'compare_list',
  role: 'comparison',
  description: 'Table-style comparison list',
  camera: 'static_wide',
  layout: 'comparison_table',
  timing: 'top_to_bottom',
  defaultMotion: 'nodding',
  suggestedPoses: ['explaining'],
  suggestedExpressions: ['focused', 'thinking'],
};

const compare_pyramid: SceneTemplate = {
  name: 'compare_pyramid',
  role: 'comparison',
  description: 'Hierarchical pyramid comparison',
  camera: 'cinematic_sweep',
  layout: 'pyramid_layout',
  timing: 'bounce_sequence',
  defaultMotion: 'gesturing',
  suggestedPoses: ['presenting', 'explaining'],
  suggestedExpressions: ['proud', 'focused'],
};

const compare_grid: SceneTemplate = {
  name: 'compare_grid',
  role: 'comparison',
  description: 'Four-way comparison grid',
  camera: 'static_wide',
  layout: 'grid_2x2',
  timing: 'all_at_once_stagger',
  defaultMotion: 'nodding',
  suggestedPoses: ['explaining', 'thinking'],
  suggestedExpressions: ['focused', 'neutral'],
};

const compare_pros_cons: SceneTemplate = {
  name: 'compare_pros_cons',
  role: 'comparison',
  description: 'Diagonal split for pros/cons',
  camera: 'pan_right_to_left',
  layout: 'diagonal_split',
  timing: 'left_to_right',
  defaultMotion: 'gesturing',
  suggestedPoses: ['shrugging', 'explaining'],
  suggestedExpressions: ['thinking', 'neutral'],
};

// ============================================================================
// EXAMPLE TEMPLATES (4)
// ============================================================================

const example_with_counter: SceneTemplate = {
  name: 'example_with_counter',
  role: 'example',
  description: 'Example with animated counter',
  camera: 'zoom_in_slow',
  layout: 'triple_stickman_text_counter',
  timing: 'counter_focus',
  defaultMotion: 'typing',
  suggestedPoses: ['pointing_right', 'explaining'],
  suggestedExpressions: ['focused', 'excited'],
};

const example_story: SceneTemplate = {
  name: 'example_story',
  role: 'example',
  description: 'Narrative-style example',
  camera: 'dolly_in',
  layout: 'split_left_stickman',
  timing: 'stickman_first',
  defaultMotion: 'gesturing',
  suggestedPoses: ['explaining', 'thinking', 'celebrating'],
  suggestedExpressions: ['neutral', 'thinking', 'happy'],
};

const example_visual: SceneTemplate = {
  name: 'example_visual',
  role: 'example',
  description: 'Visual example with icon grid',
  camera: 'static_full',
  layout: 'icon_grid',
  timing: 'bounce_sequence',
  defaultMotion: 'pointing',
  suggestedPoses: ['explaining', 'pointing_up'],
  suggestedExpressions: ['happy', 'excited'],
};

const example_minimal: SceneTemplate = {
  name: 'example_minimal',
  role: 'example',
  description: 'Simple three-column example',
  camera: 'static_wide',
  layout: 'grid_3x1',
  timing: 'left_to_right',
  defaultMotion: 'nodding',
  suggestedPoses: ['explaining'],
  suggestedExpressions: ['neutral', 'focused'],
};

// ============================================================================
// WARNING TEMPLATES (3)
// ============================================================================

const warning_alert: SceneTemplate = {
  name: 'warning_alert',
  role: 'warning',
  description: 'Dramatic alert with camera shake',
  camera: 'shake',
  layout: 'center_stack',
  timing: 'reveal_climax',
  defaultMotion: 'nervous',
  suggestedPoses: ['stop', 'raising_hand'],
  suggestedExpressions: ['surprised', 'worried'],
};

const warning_subtle: SceneTemplate = {
  name: 'warning_subtle',
  role: 'warning',
  description: 'Subtle cautionary warning',
  camera: 'static_full',
  layout: 'split_left_stickman',
  timing: 'text_first',
  defaultMotion: 'headShake',
  suggestedPoses: ['thinking', 'hand_on_hip'],
  suggestedExpressions: ['thinking', 'worried'],
};

const warning_important: SceneTemplate = {
  name: 'warning_important',
  role: 'warning',
  description: 'Important notice with emphasis',
  camera: 'zoom_in_fast',
  layout: 'triple_horizontal',
  timing: 'reveal_climax',
  defaultMotion: 'nodding',
  suggestedPoses: ['pointing_up', 'explaining'],
  suggestedExpressions: ['focused', 'neutral'],
};

// ============================================================================
// CLOSING TEMPLATES (4)
// ============================================================================

const closing_summary: SceneTemplate = {
  name: 'closing_summary',
  role: 'closing',
  description: 'Summary with zoom out reveal',
  camera: 'zoom_out_reveal',
  layout: 'center_stack',
  timing: 'all_at_once',
  defaultMotion: 'nodding',
  suggestedPoses: ['presenting', 'explaining'],
  suggestedExpressions: ['happy', 'proud'],
};

const closing_cta: SceneTemplate = {
  name: 'closing_cta',
  role: 'closing',
  description: 'Call-to-action with fullscreen text',
  camera: 'zoom_in_slow',
  layout: 'overlay_fullscreen_text',
  timing: 'reveal_climax',
  defaultMotion: 'pointing',
  suggestedPoses: ['pointing_right', 'thumbsUp'],
  suggestedExpressions: ['excited', 'happy'],
};

const closing_thanks: SceneTemplate = {
  name: 'closing_thanks',
  role: 'closing',
  description: 'Thank you ending with waving',
  camera: 'static_full',
  layout: 'center_single',
  timing: 'all_at_once',
  defaultMotion: 'waving_loop',
  suggestedPoses: ['waving', 'thumbsUp'],
  suggestedExpressions: ['happy', 'excited'],
};

const closing_recap: SceneTemplate = {
  name: 'closing_recap',
  role: 'closing',
  description: 'Quick recap with stickman center',
  camera: 'zoom_breathe',
  layout: 'stickman_center_text_sides',
  timing: 'all_at_once_stagger',
  defaultMotion: 'gesturing',
  suggestedPoses: ['presenting', 'explaining'],
  suggestedExpressions: ['happy', 'confident'],
};

// ============================================================================
// TRANSITION TEMPLATES (4)
// ============================================================================

const transition_topic_change: SceneTemplate = {
  name: 'transition_topic_change',
  role: 'transition',
  description: 'Clean topic change transition',
  camera: 'static_full',
  layout: 'center_single',
  timing: 'all_at_once',
  defaultMotion: 'breathing',
  suggestedPoses: ['standing', 'pointing_right'],
  suggestedExpressions: ['neutral', 'happy'],
};

const transition_carry_over: SceneTemplate = {
  name: 'transition_carry_over',
  role: 'transition',
  description: 'Stickman walks to next topic',
  camera: 'pan_left_to_right',
  layout: 'split_left_stickman',
  timing: 'carry_stickman',
  defaultMotion: 'walkCycle',
  suggestedPoses: ['walking', 'standing'],
  suggestedExpressions: ['neutral', 'happy'],
};

const transition_wipe: SceneTemplate = {
  name: 'transition_wipe',
  role: 'transition',
  description: 'Wipe transition effect',
  camera: 'static_full',
  layout: 'center_single',
  timing: 'wipe_replace',
  defaultMotion: 'breathing',
  suggestedPoses: ['standing'],
  suggestedExpressions: ['neutral'],
};

const transition_breather: SceneTemplate = {
  name: 'transition_breather',
  role: 'transition',
  description: 'Pause moment with breathing animation',
  camera: 'zoom_breathe',
  layout: 'center_hero',
  timing: 'all_at_once',
  defaultMotion: 'breathing',
  suggestedPoses: ['standing', 'thinking'],
  suggestedExpressions: ['neutral', 'thinking'],
};

// ============================================================================
// EXPORTS
// ============================================================================

export const SCENE_TEMPLATES: Record<string, SceneTemplate> = {
  // Opening (5)
  intro_greeting,
  intro_question,
  intro_title_card,
  intro_hook,
  intro_dramatic,
  // Explanation (8)
  explain_default,
  explain_formula,
  explain_reverse,
  explain_with_visual,
  explain_timeline,
  explain_step,
  explain_diagram,
  explain_minimal,
  // Emphasis (6)
  emphasis_number,
  emphasis_statement,
  emphasis_spotlight,
  emphasis_dramatic,
  emphasis_pulse,
  emphasis_fullscreen,
  // Comparison (6)
  compare_side_by_side,
  compare_before_after,
  compare_list,
  compare_pyramid,
  compare_grid,
  compare_pros_cons,
  // Example (4)
  example_with_counter,
  example_story,
  example_visual,
  example_minimal,
  // Warning (3)
  warning_alert,
  warning_subtle,
  warning_important,
  // Closing (4)
  closing_summary,
  closing_cta,
  closing_thanks,
  closing_recap,
  // Transition (4)
  transition_topic_change,
  transition_carry_over,
  transition_wipe,
  transition_breather,
};

export const SCENE_TEMPLATE_NAMES = Object.keys(SCENE_TEMPLATES) as string[];

// Template names by phase
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

export const V2_TEMPLATE_NAMES = [
  'intro_question',
  'intro_title_card',
  'explain_with_visual',
  'emphasis_spotlight',
  'compare_before_after',
  'compare_list',
  'example_with_counter',
  'example_story',
  'warning_alert',
  'warning_subtle',
  'closing_summary',
  'closing_cta',
] as const;

export const V3_TEMPLATE_NAMES = [
  'intro_hook',
  'intro_dramatic',
  'explain_timeline',
  'explain_step',
  'explain_diagram',
  'explain_minimal',
  'emphasis_dramatic',
  'emphasis_pulse',
  'emphasis_fullscreen',
  'compare_pyramid',
  'compare_grid',
  'compare_pros_cons',
  'example_visual',
  'example_minimal',
  'warning_important',
  'closing_thanks',
  'closing_recap',
  'transition_carry_over',
  'transition_wipe',
  'transition_breather',
] as const;

// Utility functions
export const getSceneTemplate = (name: string): SceneTemplate | undefined => {
  return SCENE_TEMPLATES[name];
};

export const hasSceneTemplate = (name: string): boolean => {
  return name in SCENE_TEMPLATES;
};

export const getTemplatesByRole = (role: SceneRole): SceneTemplate[] => {
  return Object.values(SCENE_TEMPLATES).filter(template => template.role === role);
};

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

/**
 * Get layout usage statistics
 */
export const getLayoutUsageStats = (): Record<string, number> => {
  const usage: Record<string, number> = {};

  for (const template of Object.values(SCENE_TEMPLATES)) {
    usage[template.layout] = (usage[template.layout] || 0) + 1;
  }

  return usage;
};

/**
 * Get motion usage statistics
 */
export const getMotionUsageStats = (): Record<string, number> => {
  const usage: Record<string, number> = {};

  for (const template of Object.values(SCENE_TEMPLATES)) {
    if (template.defaultMotion) {
      usage[template.defaultMotion] = (usage[template.defaultMotion] || 0) + 1;
    }
  }

  return usage;
};
