/**
 * Video Templates - 2 MVP Video Templates
 * Layer 5 (Video Templates) for the stickman video system
 *
 * These templates define complete video structures by combining L4 scene templates
 * into logical sections for different video genres.
 *
 * MVP Templates (2):
 * - concept_explainer (educational) - Educational concept explanation
 * - news_summary (news) - News/information summary
 */

import {
  VideoTemplate,
  VideoTemplateRecord,
  VideoGenre,
  VideoSection,
  VideoTemplateStats,
  VideoTemplateValidationResult,
} from './types';
import { hasSceneTemplate, SCENE_TEMPLATES } from '../templates';

// ============================================================================
// MVP VIDEO TEMPLATES (2)
// ============================================================================

/**
 * 1. concept_explainer - Educational concept explanation video
 * Structure: opening -> explanation -> example -> comparison -> emphasis -> closing
 */
const concept_explainer: VideoTemplate = {
  name: 'concept_explainer',
  genre: 'educational',
  description: 'Educational video explaining a concept with examples and comparisons',
  structure: [
    {
      role: 'opening',
      suggestedSceneTemplates: ['intro_greeting'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'explanation',
      suggestedSceneTemplates: ['explain_default', 'explain_formula', 'explain_reverse'],
      minScenes: 2,
      maxScenes: 5,
    },
    {
      role: 'example',
      suggestedSceneTemplates: ['explain_default', 'explain_reverse'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'comparison',
      suggestedSceneTemplates: ['compare_side_by_side'],
      minScenes: 0,
      maxScenes: 2,
    },
    {
      role: 'emphasis',
      suggestedSceneTemplates: ['emphasis_number', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 3,
    },
    {
      role: 'closing',
      suggestedSceneTemplates: ['intro_greeting'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
};

/**
 * 2. news_summary - News/information summary video
 * Structure: opening -> point1 -> point2 -> point3 -> closing
 * Note: point1, point2, point3 are mapped to explanation role
 */
const news_summary: VideoTemplate = {
  name: 'news_summary',
  genre: 'news',
  description: 'News or information summary with key points',
  structure: [
    {
      role: 'opening',
      suggestedSceneTemplates: ['intro_greeting'],
      minScenes: 1,
      maxScenes: 1,
    },
    {
      role: 'explanation', // Point 1
      suggestedSceneTemplates: ['explain_default', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'transition',
      suggestedSceneTemplates: ['transition_topic_change'],
      minScenes: 0,
      maxScenes: 1,
    },
    {
      role: 'explanation', // Point 2
      suggestedSceneTemplates: ['explain_default', 'explain_reverse', 'emphasis_number'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'transition',
      suggestedSceneTemplates: ['transition_topic_change'],
      minScenes: 0,
      maxScenes: 1,
    },
    {
      role: 'explanation', // Point 3
      suggestedSceneTemplates: ['explain_default', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 2,
    },
    {
      role: 'closing',
      suggestedSceneTemplates: ['intro_greeting', 'emphasis_statement'],
      minScenes: 1,
      maxScenes: 1,
    },
  ],
};

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * All video templates indexed by name
 */
export const VIDEO_TEMPLATES: VideoTemplateRecord = {
  concept_explainer,
  news_summary,
};

/**
 * Array of all video template names
 */
export const VIDEO_TEMPLATE_NAMES = Object.keys(VIDEO_TEMPLATES) as string[];

/**
 * Array of MVP template names for easy reference
 */
export const MVP_VIDEO_TEMPLATE_NAMES = [
  'concept_explainer',
  'news_summary',
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
 * Get all templates by genre
 */
export const getTemplatesByGenre = (genre: VideoGenre): VideoTemplate[] => {
  return Object.values(VIDEO_TEMPLATES).filter(template => template.genre === genre);
};

/**
 * Get statistics about video templates
 */
export const getVideoTemplateStats = (): VideoTemplateStats => {
  const templates = Object.values(VIDEO_TEMPLATES);

  // Count templates by genre
  const byGenre: Record<VideoGenre, number> = {
    educational: 0,
    news: 0,
    marketing: 0,
    entertainment: 0,
  };

  for (const template of templates) {
    byGenre[template.genre]++;
  }

  // Calculate average sections per template
  const totalSections = templates.reduce(
    (sum, template) => sum + template.structure.length,
    0
  );
  const avgSectionsPerTemplate = templates.length > 0
    ? totalSections / templates.length
    : 0;

  // Count unique scene templates referenced
  const uniqueSceneTemplates = new Set<string>();
  for (const template of templates) {
    for (const section of template.structure) {
      for (const sceneTemplate of section.suggestedSceneTemplates) {
        uniqueSceneTemplates.add(sceneTemplate);
      }
    }
  }

  return {
    totalTemplates: templates.length,
    byGenre,
    avgSectionsPerTemplate,
    uniqueSceneTemplatesReferenced: uniqueSceneTemplates.size,
  };
};

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate a single section of a video template
 */
const validateSection = (
  section: VideoSection,
  sectionIndex: number
): { errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate min/max scenes
  if (section.minScenes < 0) {
    errors.push(`Section ${sectionIndex}: minScenes cannot be negative`);
  }
  if (section.maxScenes < section.minScenes) {
    errors.push(`Section ${sectionIndex}: maxScenes (${section.maxScenes}) cannot be less than minScenes (${section.minScenes})`);
  }

  // Validate suggested scene templates exist
  if (section.suggestedSceneTemplates.length === 0) {
    warnings.push(`Section ${sectionIndex}: no scene templates suggested`);
  }

  for (const templateName of section.suggestedSceneTemplates) {
    if (!hasSceneTemplate(templateName)) {
      errors.push(`Section ${sectionIndex}: scene template '${templateName}' does not exist in L4`);
    }
  }

  return { errors, warnings };
};

/**
 * Validate a video template
 */
export const validateVideoTemplate = (
  template: VideoTemplate
): VideoTemplateValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate basic properties
  if (!template.name || template.name.trim() === '') {
    errors.push('Template name is required');
  }

  if (!template.description || template.description.trim() === '') {
    warnings.push('Template description is empty');
  }

  // Validate structure
  if (!template.structure || template.structure.length === 0) {
    errors.push('Template must have at least one section');
  } else {
    // Validate each section
    for (let i = 0; i < template.structure.length; i++) {
      const sectionValidation = validateSection(template.structure[i], i);
      errors.push(...sectionValidation.errors);
      warnings.push(...sectionValidation.warnings);
    }

    // Check for opening and closing sections
    const hasOpening = template.structure.some(s => s.role === 'opening');
    const hasClosing = template.structure.some(s => s.role === 'closing');

    if (!hasOpening) {
      warnings.push('Template does not have an opening section');
    }
    if (!hasClosing) {
      warnings.push('Template does not have a closing section');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate all video templates in the module
 */
export const validateAllVideoTemplates = (): {
  valid: boolean;
  results: Record<string, VideoTemplateValidationResult>;
} => {
  const results: Record<string, VideoTemplateValidationResult> = {};
  let allValid = true;

  for (const [name, template] of Object.entries(VIDEO_TEMPLATES)) {
    const validation = validateVideoTemplate(template);
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

/**
 * Get all unique scene templates used across all video templates
 */
export const getAllReferencedSceneTemplates = (): string[] => {
  const sceneTemplates = new Set<string>();

  for (const template of Object.values(VIDEO_TEMPLATES)) {
    for (const section of template.structure) {
      for (const sceneTemplate of section.suggestedSceneTemplates) {
        sceneTemplates.add(sceneTemplate);
      }
    }
  }

  return Array.from(sceneTemplates).sort();
};

/**
 * Calculate min and max total scenes for a video template
 */
export const getSceneCountRange = (
  templateName: string
): { min: number; max: number } | undefined => {
  const template = getVideoTemplate(templateName);
  if (!template) {
    return undefined;
  }

  let min = 0;
  let max = 0;

  for (const section of template.structure) {
    min += section.minScenes;
    max += section.maxScenes;
  }

  return { min, max };
};
