/**
 * Video Templates - 10 reusable video structures
 * Layer 5 (Video Templates) for the stickman video system
 *
 * MVP 2:  concept_explainer, news_summary
 * V2 3:   step_by_step, myth_buster, list_ranking
 * V3 5:   a_vs_b, pros_and_cons, story_arc, biography, how_it_works
 */

import { VideoTemplate, VideoSection, VideoGenre, VideoTemplateStats } from './types';
import { hasSceneTemplate, SCENE_TEMPLATE_NAMES } from '../templates';

// ============================================================================
// MVP VIDEO TEMPLATES (2)
// ============================================================================

/**
 * 1. concept_explainer - Educational concept explanation
 * For explaining ideas, theories, or concepts in an educational manner
 */
const concept_explainer: VideoTemplate = {
  name: 'concept_explainer',
  genre: 'educational',
  description: 'Educational video explaining a concept or idea clearly',
  structure: [
    {
      role: 'opening',
      name: 'Introduction',
      suggestedSceneTemplates: ['intro_greeting', 'intro_question', 'intro_title_card'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'definition',
      name: 'Concept Definition',
      suggestedSceneTemplates: ['explain_default', 'explain_with_visual', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'explanation',
      name: 'Detailed Explanation',
      suggestedSceneTemplates: ['explain_default', 'explain_formula', 'explain_reverse', 'explain_with_visual'],
      minScenes: 2,
      maxScenes: 5,
    },
    {
      role: 'example',
      name: 'Examples',
      suggestedSceneTemplates: ['example_with_counter', 'example_story', 'emphasis_number'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'closing',
      name: 'Summary & Closing',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 2,
    },
  ],
  estimatedDuration: { min: 120, max: 300 },
  difficulty: 'beginner',
};

/**
 * 2. news_summary - News/information summary
 * For summarizing news, events, or information
 */
const news_summary: VideoTemplate = {
  name: 'news_summary',
  genre: 'informational',
  description: 'Quick summary of news or informational content',
  structure: [
    {
      role: 'opening',
      name: 'Headline',
      suggestedSceneTemplates: ['intro_title_card', 'intro_greeting'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'overview',
      name: 'Overview',
      suggestedSceneTemplates: ['explain_default', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'details',
      name: 'Key Details',
      suggestedSceneTemplates: ['explain_default', 'explain_reverse', 'emphasis_number', 'explain_with_visual'],
      minScenes: 2,
      maxScenes: 5,
    },
    {
      role: 'impact',
      name: 'Impact & Implications',
      suggestedSceneTemplates: ['emphasis_statement', 'emphasis_spotlight', 'warning_alert', 'warning_subtle'],
      minScenes: 1,
      maxScenes: 2,
      optional: true,
    },
    {
      role: 'closing',
      name: 'Closing',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
  estimatedDuration: { min: 60, max: 180 },
  difficulty: 'beginner',
};

// ============================================================================
// V2 VIDEO TEMPLATES (3)
// ============================================================================

/**
 * 3. step_by_step - Step-by-step tutorial
 * For tutorials and how-to guides with sequential steps
 */
const step_by_step: VideoTemplate = {
  name: 'step_by_step',
  genre: 'educational',
  description: 'Tutorial video with clear sequential steps',
  structure: [
    {
      role: 'opening',
      name: 'Introduction',
      suggestedSceneTemplates: ['intro_greeting', 'intro_title_card'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'overview',
      name: 'Overview of Steps',
      suggestedSceneTemplates: ['explain_default', 'compare_list'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'steps',
      name: 'Step-by-Step Instructions',
      suggestedSceneTemplates: ['explain_default', 'explain_with_visual', 'transition_topic_change', 'explain_formula'],
      minScenes: 3,
      maxScenes: 10,
    },
    {
      role: 'tips',
      name: 'Tips & Warnings',
      suggestedSceneTemplates: ['warning_alert', 'warning_subtle', 'emphasis_statement'],
      minScenes: 0,
      maxScenes: 2,
      optional: true,
    },
    {
      role: 'closing',
      name: 'Summary',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
  estimatedDuration: { min: 180, max: 420 },
  difficulty: 'intermediate',
};

/**
 * 4. myth_buster - Myth vs reality
 * For debunking myths and presenting facts
 */
const myth_buster: VideoTemplate = {
  name: 'myth_buster',
  genre: 'educational',
  description: 'Debunking myths and revealing facts',
  structure: [
    {
      role: 'opening',
      name: 'Hook',
      suggestedSceneTemplates: ['intro_question', 'intro_title_card'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'myth',
      name: 'The Myth',
      suggestedSceneTemplates: ['emphasis_statement', 'explain_default', 'warning_alert'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'reality',
      name: 'The Reality',
      suggestedSceneTemplates: ['compare_side_by_side', 'compare_before_after', 'explain_default', 'emphasis_statement'],
      minScenes: 2,
      maxScenes: 4,
    },
    {
      role: 'evidence',
      name: 'Evidence',
      suggestedSceneTemplates: ['example_with_counter', 'explain_formula', 'example_story', 'emphasis_number'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'closing',
      name: 'Conclusion',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
  estimatedDuration: { min: 120, max: 300 },
  difficulty: 'intermediate',
};

/**
 * 5. list_ranking - Ranked list
 * For top N lists and rankings
 */
const list_ranking: VideoTemplate = {
  name: 'list_ranking',
  genre: 'informational',
  description: 'Ranked list or top N format video',
  structure: [
    {
      role: 'opening',
      name: 'Introduction',
      suggestedSceneTemplates: ['intro_title_card', 'intro_greeting'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'items',
      name: 'List Items',
      suggestedSceneTemplates: ['explain_default', 'explain_with_visual', 'emphasis_number', 'emphasis_spotlight', 'transition_topic_change'],
      minScenes: 3,
      maxScenes: 10,
    },
    {
      role: 'winner',
      name: 'Top Pick / Winner',
      suggestedSceneTemplates: ['emphasis_spotlight', 'emphasis_statement', 'emphasis_dramatic'],
      minScenes: 1,
      maxScenes: 1,
      optional: true,
    },
    {
      role: 'closing',
      name: 'Closing',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
  estimatedDuration: { min: 120, max: 360 },
  difficulty: 'beginner',
};

// ============================================================================
// V3 VIDEO TEMPLATES (5)
// ============================================================================

/**
 * 6. a_vs_b - Comparison between two options
 * For comparing two alternatives, products, or concepts
 */
const a_vs_b: VideoTemplate = {
  name: 'a_vs_b',
  genre: 'comparison',
  description: 'Head-to-head comparison between two options',
  structure: [
    {
      role: 'opening',
      name: 'Introduction',
      suggestedSceneTemplates: ['intro_title_card', 'intro_question'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'option_a',
      name: 'Option A',
      suggestedSceneTemplates: ['explain_default', 'explain_with_visual', 'emphasis_statement', 'example_with_counter'],
      minScenes: 2,
      maxScenes: 4,
    },
    {
      role: 'option_b',
      name: 'Option B',
      suggestedSceneTemplates: ['explain_default', 'explain_with_visual', 'emphasis_statement', 'example_with_counter'],
      minScenes: 2,
      maxScenes: 4,
    },
    {
      role: 'comparison',
      name: 'Direct Comparison',
      suggestedSceneTemplates: ['compare_side_by_side', 'compare_list', 'compare_before_after'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'conclusion',
      name: 'Verdict',
      suggestedSceneTemplates: ['emphasis_spotlight', 'emphasis_statement', 'explain_default'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'closing',
      name: 'Closing',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
  estimatedDuration: { min: 180, max: 360 },
  difficulty: 'intermediate',
};

/**
 * 7. pros_and_cons - Advantages and disadvantages
 * For balanced analysis of pros and cons
 */
const pros_and_cons: VideoTemplate = {
  name: 'pros_and_cons',
  genre: 'comparison',
  description: 'Balanced analysis of advantages and disadvantages',
  structure: [
    {
      role: 'opening',
      name: 'Introduction',
      suggestedSceneTemplates: ['intro_title_card', 'intro_question', 'intro_greeting'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'pros',
      name: 'Advantages',
      suggestedSceneTemplates: ['explain_default', 'explain_with_visual', 'emphasis_statement', 'emphasis_spotlight'],
      minScenes: 2,
      maxScenes: 5,
    },
    {
      role: 'cons',
      name: 'Disadvantages',
      suggestedSceneTemplates: ['explain_default', 'warning_alert', 'warning_subtle', 'emphasis_statement'],
      minScenes: 2,
      maxScenes: 5,
    },
    {
      role: 'summary',
      name: 'Summary & Recommendation',
      suggestedSceneTemplates: ['compare_side_by_side', 'compare_list', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'closing',
      name: 'Closing',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
  estimatedDuration: { min: 150, max: 300 },
  difficulty: 'beginner',
};

/**
 * 8. story_arc - Narrative story structure
 * For telling stories with classic narrative arc
 */
const story_arc: VideoTemplate = {
  name: 'story_arc',
  genre: 'narrative',
  description: 'Story-driven content with dramatic narrative arc',
  structure: [
    {
      role: 'opening',
      name: 'Hook',
      suggestedSceneTemplates: ['intro_question', 'intro_title_card', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'background',
      name: 'Setup & Background',
      suggestedSceneTemplates: ['explain_default', 'example_story', 'explain_with_visual'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'development',
      name: 'Rising Action',
      suggestedSceneTemplates: ['example_story', 'explain_default', 'emphasis_statement', 'transition_topic_change'],
      minScenes: 2,
      maxScenes: 5,
    },
    {
      role: 'crisis',
      name: 'Climax / Crisis',
      suggestedSceneTemplates: ['emphasis_spotlight', 'emphasis_dramatic', 'warning_alert', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'resolution',
      name: 'Resolution',
      suggestedSceneTemplates: ['explain_default', 'example_story', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'lesson',
      name: 'Lesson / Takeaway',
      suggestedSceneTemplates: ['emphasis_statement', 'emphasis_spotlight', 'explain_default'],
      minScenes: 1,
      maxScenes: 1,
      optional: true,
    },
    {
      role: 'closing',
      name: 'Closing',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
  estimatedDuration: { min: 180, max: 420 },
  difficulty: 'advanced',
};

/**
 * 9. biography - Person biography
 * For presenting life stories and biographical content
 */
const biography: VideoTemplate = {
  name: 'biography',
  genre: 'narrative',
  description: 'Biography format for presenting a person\'s life story',
  structure: [
    {
      role: 'opening',
      name: 'Introduction',
      suggestedSceneTemplates: ['intro_title_card', 'intro_greeting', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'early_life',
      name: 'Early Life & Background',
      suggestedSceneTemplates: ['example_story', 'explain_default', 'explain_with_visual'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'turning_point',
      name: 'Turning Point',
      suggestedSceneTemplates: ['emphasis_spotlight', 'emphasis_statement', 'example_story', 'transition_topic_change'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'achievements',
      name: 'Key Achievements',
      suggestedSceneTemplates: ['explain_default', 'emphasis_number', 'emphasis_spotlight', 'example_with_counter'],
      minScenes: 2,
      maxScenes: 5,
    },
    {
      role: 'legacy',
      name: 'Legacy & Impact',
      suggestedSceneTemplates: ['emphasis_statement', 'explain_default', 'emphasis_spotlight'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'closing',
      name: 'Closing',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
  estimatedDuration: { min: 180, max: 360 },
  difficulty: 'intermediate',
};

/**
 * 10. how_it_works - Mechanism explanation
 * For explaining how something works, with components and integration
 */
const how_it_works: VideoTemplate = {
  name: 'how_it_works',
  genre: 'educational',
  description: 'Explains how a system or mechanism works',
  structure: [
    {
      role: 'opening',
      name: 'Introduction',
      suggestedSceneTemplates: ['intro_question', 'intro_title_card', 'intro_greeting'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'overview',
      name: 'High-Level Overview',
      suggestedSceneTemplates: ['explain_default', 'explain_with_visual', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'component1',
      name: 'Component 1',
      suggestedSceneTemplates: ['explain_default', 'explain_with_visual', 'explain_formula', 'example_with_counter'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'component2',
      name: 'Component 2',
      suggestedSceneTemplates: ['explain_default', 'explain_with_visual', 'explain_formula', 'example_with_counter'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'integration',
      name: 'How Components Work Together',
      suggestedSceneTemplates: ['explain_default', 'compare_side_by_side', 'explain_with_visual', 'example_story'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'closing',
      name: 'Summary',
      suggestedSceneTemplates: ['closing_summary', 'closing_cta'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
  estimatedDuration: { min: 180, max: 420 },
  difficulty: 'intermediate',
};

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All video templates indexed by name
 */
export const VIDEO_TEMPLATES: Record<string, VideoTemplate> = {
  // MVP (2)
  concept_explainer,
  news_summary,
  // V2 (3)
  step_by_step,
  myth_buster,
  list_ranking,
  // V3 (5)
  a_vs_b,
  pros_and_cons,
  story_arc,
  biography,
  how_it_works,
};

/**
 * Array of all video template names
 */
export const VIDEO_TEMPLATE_NAMES = Object.keys(VIDEO_TEMPLATES) as string[];

/**
 * MVP template names for easy reference
 */
export const MVP_TEMPLATE_NAMES = [
  'concept_explainer',
  'news_summary',
] as const;

/**
 * V2 template names for easy reference
 */
export const V2_TEMPLATE_NAMES = [
  'step_by_step',
  'myth_buster',
  'list_ranking',
] as const;

/**
 * V3 template names for easy reference
 */
export const V3_TEMPLATE_NAMES = [
  'a_vs_b',
  'pros_and_cons',
  'story_arc',
  'biography',
  'how_it_works',
] as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get a video template by name
 */
export const getVideoTemplate = (name: string): VideoTemplate | undefined => {
  return VIDEO_TEMPLATES[name];
};

/**
 * Check if a video template exists
 */
export const hasVideoTemplate = (name: string): boolean => {
  return name in VIDEO_TEMPLATES;
};

/**
 * Get all templates for a specific genre
 */
export const getTemplatesByGenre = (genre: VideoGenre): VideoTemplate[] => {
  return Object.values(VIDEO_TEMPLATES).filter(template => template.genre === genre);
};

/**
 * Get all templates for a specific difficulty
 */
export const getTemplatesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): VideoTemplate[] => {
  return Object.values(VIDEO_TEMPLATES).filter(template => template.difficulty === difficulty);
};

/**
 * Validate that all referenced scene templates exist
 */
export const validateVideoTemplate = (template: VideoTemplate): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate each section
  for (const section of template.structure) {
    // Check min/max scenes
    if (section.minScenes < 0) {
      errors.push(`Section "${section.name}": minScenes cannot be negative`);
    }
    if (section.maxScenes < section.minScenes) {
      errors.push(`Section "${section.name}": maxScenes (${section.maxScenes}) is less than minScenes (${section.minScenes})`);
    }

    // Check that scene templates exist
    for (const sceneTemplateName of section.suggestedSceneTemplates) {
      if (!hasSceneTemplate(sceneTemplateName)) {
        errors.push(`Section "${section.name}": Unknown scene template "${sceneTemplateName}"`);
      }
    }

    // Warn if no scene templates suggested
    if (section.suggestedSceneTemplates.length === 0) {
      warnings.push(`Section "${section.name}": No scene templates suggested`);
    }
  }

  // Validate duration if provided
  if (template.estimatedDuration) {
    if (template.estimatedDuration.min < 0) {
      errors.push(`Estimated duration min cannot be negative`);
    }
    if (template.estimatedDuration.max < template.estimatedDuration.min) {
      errors.push(`Estimated duration max is less than min`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate all video templates
 */
export const validateAllVideoTemplates = (): {
  valid: boolean;
  invalidTemplates: { name: string; errors: string[]; warnings: string[] }[];
} => {
  const invalidTemplates: { name: string; errors: string[]; warnings: string[] }[] = [];

  for (const [name, template] of Object.entries(VIDEO_TEMPLATES)) {
    const result = validateVideoTemplate(template);
    if (!result.valid || result.warnings.length > 0) {
      invalidTemplates.push({ name, errors: result.errors, warnings: result.warnings });
    }
  }

  return {
    valid: invalidTemplates.every(t => t.errors.length === 0),
    invalidTemplates,
  };
};

/**
 * Get all unique scene templates used across all video templates
 */
export const getUsedSceneTemplates = (): string[] => {
  const usedTemplates = new Set<string>();

  for (const template of Object.values(VIDEO_TEMPLATES)) {
    for (const section of template.structure) {
      for (const sceneTemplate of section.suggestedSceneTemplates) {
        usedTemplates.add(sceneTemplate);
      }
    }
  }

  return Array.from(usedTemplates).sort();
};

/**
 * Get video template statistics
 */
export const getVideoTemplateStats = (): VideoTemplateStats => {
  const byGenre: Record<VideoGenre, number> = {
    educational: 0,
    informational: 0,
    comparison: 0,
    narrative: 0,
  };

  for (const template of Object.values(VIDEO_TEMPLATES)) {
    byGenre[template.genre]++;
  }

  return {
    total: Object.keys(VIDEO_TEMPLATES).length,
    mvp: MVP_TEMPLATE_NAMES.length,
    v2: V2_TEMPLATE_NAMES.length,
    v3: V3_TEMPLATE_NAMES.length,
    byGenre,
  };
};

/**
 * Get section statistics for a template
 */
export const getTemplateSectionStats = (template: VideoTemplate): {
  totalSections: number;
  requiredSections: number;
  optionalSections: number;
  minTotalScenes: number;
  maxTotalScenes: number;
} => {
  let requiredSections = 0;
  let optionalSections = 0;
  let minTotalScenes = 0;
  let maxTotalScenes = 0;

  for (const section of template.structure) {
    if (section.optional) {
      optionalSections++;
    } else {
      requiredSections++;
      minTotalScenes += section.minScenes;
    }
    maxTotalScenes += section.maxScenes;
  }

  return {
    totalSections: template.structure.length,
    requiredSections,
    optionalSections,
    minTotalScenes,
    maxTotalScenes,
  };
};
