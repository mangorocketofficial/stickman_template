/**
 * Video Templates Module Tests
 * Testing 5 video templates (2 MVP + 3 V2) - Layer 5
 */

import { describe, it, expect } from 'vitest';
import {
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
} from '../videoTemplates';
import { VideoTemplate, VideoGenre } from '../types';
import { hasSceneTemplate } from '../../templates';

describe('Video Templates Module', () => {
  // ==========================================================================
  // Template Counts
  // ==========================================================================
  describe('Template Counts', () => {
    it('should have exactly 5 video templates', () => {
      expect(Object.keys(VIDEO_TEMPLATES)).toHaveLength(5);
    });

    it('should have 2 MVP template names', () => {
      expect(MVP_VIDEO_TEMPLATE_NAMES).toHaveLength(2);
    });

    it('should have 3 V2 template names', () => {
      expect(V2_VIDEO_TEMPLATE_NAMES).toHaveLength(3);
    });

    it('should have VIDEO_TEMPLATE_NAMES array matching VIDEO_TEMPLATES keys', () => {
      expect(VIDEO_TEMPLATE_NAMES).toHaveLength(5);
      expect(VIDEO_TEMPLATE_NAMES.sort()).toEqual(Object.keys(VIDEO_TEMPLATES).sort());
    });

    it('MVP + V2 should equal total', () => {
      expect(MVP_VIDEO_TEMPLATE_NAMES.length + V2_VIDEO_TEMPLATE_NAMES.length).toBe(5);
    });
  });

  // ==========================================================================
  // MVP Video Templates (2)
  // ==========================================================================
  describe('MVP Video Templates', () => {
    const mvpTemplates = ['concept_explainer', 'news_summary'];

    mvpTemplates.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in VIDEO_TEMPLATES', () => {
          expect(VIDEO_TEMPLATES[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(VIDEO_TEMPLATES[name].name).toBe(name);
        });

        it('should have a valid genre', () => {
          const validGenres: VideoGenre[] = ['educational', 'informational', 'comparison', 'narrative'];
          expect(validGenres).toContain(VIDEO_TEMPLATES[name].genre);
        });

        it('should have description', () => {
          expect(VIDEO_TEMPLATES[name].description).toBeDefined();
          expect(VIDEO_TEMPLATES[name].description.length).toBeGreaterThan(0);
        });

        it('should have at least one section', () => {
          expect(VIDEO_TEMPLATES[name].structure.length).toBeGreaterThan(0);
        });

        it('should have opening section', () => {
          const hasOpening = VIDEO_TEMPLATES[name].structure.some(s => s.role === 'opening');
          expect(hasOpening).toBe(true);
        });

        it('should have closing section', () => {
          const hasClosing = VIDEO_TEMPLATES[name].structure.some(s => s.role === 'closing');
          expect(hasClosing).toBe(true);
        });
      });
    });

    describe('concept_explainer specifics', () => {
      const template = VIDEO_TEMPLATES['concept_explainer'];

      it('should have genre "educational"', () => {
        expect(template.genre).toBe('educational');
      });

      it('should have 6 sections', () => {
        expect(template.structure).toHaveLength(6);
      });

      it('should have explanation section', () => {
        const hasExplanation = template.structure.some(s => s.role === 'explanation');
        expect(hasExplanation).toBe(true);
      });

      it('should have example section', () => {
        const hasExample = template.structure.some(s => s.role === 'example');
        expect(hasExample).toBe(true);
      });

      it('should have emphasis section', () => {
        const hasEmphasis = template.structure.some(s => s.role === 'emphasis');
        expect(hasEmphasis).toBe(true);
      });
    });

    describe('news_summary specifics', () => {
      const template = VIDEO_TEMPLATES['news_summary'];

      it('should have genre "informational"', () => {
        expect(template.genre).toBe('informational');
      });

      it('should have 7 sections', () => {
        expect(template.structure).toHaveLength(7);
      });

      it('should have transition sections', () => {
        const transitionCount = template.structure.filter(s => s.role === 'transition').length;
        expect(transitionCount).toBe(2);
      });
    });
  });

  // ==========================================================================
  // V2 Video Templates (3)
  // ==========================================================================
  describe('V2 Video Templates', () => {
    const v2Templates = ['step_by_step', 'myth_buster', 'list_ranking'];

    v2Templates.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in VIDEO_TEMPLATES', () => {
          expect(VIDEO_TEMPLATES[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(VIDEO_TEMPLATES[name].name).toBe(name);
        });

        it('should have a valid genre', () => {
          const validGenres: VideoGenre[] = ['educational', 'informational', 'comparison', 'narrative'];
          expect(validGenres).toContain(VIDEO_TEMPLATES[name].genre);
        });

        it('should have description', () => {
          expect(VIDEO_TEMPLATES[name].description).toBeDefined();
          expect(VIDEO_TEMPLATES[name].description.length).toBeGreaterThan(0);
        });

        it('should have at least one section', () => {
          expect(VIDEO_TEMPLATES[name].structure.length).toBeGreaterThan(0);
        });

        it('should have opening section', () => {
          const hasOpening = VIDEO_TEMPLATES[name].structure.some(s => s.role === 'opening');
          expect(hasOpening).toBe(true);
        });

        it('should have closing section', () => {
          const hasClosing = VIDEO_TEMPLATES[name].structure.some(s => s.role === 'closing');
          expect(hasClosing).toBe(true);
        });
      });
    });

    describe('step_by_step specifics', () => {
      const template = VIDEO_TEMPLATES['step_by_step'];

      it('should have genre "educational"', () => {
        expect(template.genre).toBe('educational');
      });

      it('should have 8 sections', () => {
        expect(template.structure).toHaveLength(8);
      });

      it('should have multiple explanation sections (steps)', () => {
        const explanationCount = template.structure.filter(s => s.role === 'explanation').length;
        expect(explanationCount).toBe(3);
      });

      it('should have emphasis section (summary)', () => {
        const hasEmphasis = template.structure.some(s => s.role === 'emphasis');
        expect(hasEmphasis).toBe(true);
      });
    });

    describe('myth_buster specifics', () => {
      const template = VIDEO_TEMPLATES['myth_buster'];

      it('should have genre "educational"', () => {
        expect(template.genre).toBe('educational');
      });

      it('should have 6 sections', () => {
        expect(template.structure).toHaveLength(6);
      });

      it('should have comparison section (refutation)', () => {
        const hasComparison = template.structure.some(s => s.role === 'comparison');
        expect(hasComparison).toBe(true);
      });

      it('should have emphasis section (fact reveal)', () => {
        const hasEmphasis = template.structure.some(s => s.role === 'emphasis');
        expect(hasEmphasis).toBe(true);
      });
    });

    describe('list_ranking specifics', () => {
      const template = VIDEO_TEMPLATES['list_ranking'];

      it('should have genre "informational"', () => {
        expect(template.genre).toBe('informational');
      });

      it('should have 7 sections', () => {
        expect(template.structure).toHaveLength(7);
      });

      it('should have emphasis section for top item', () => {
        const hasEmphasis = template.structure.some(s => s.role === 'emphasis');
        expect(hasEmphasis).toBe(true);
      });
    });
  });

  // ==========================================================================
  // L4 Scene Template Validation
  // ==========================================================================
  describe('L4 Scene Template Validation', () => {
    Object.entries(VIDEO_TEMPLATES).forEach(([name, template]) => {
      describe(`${name} scene templates`, () => {
        template.structure.forEach((section, index) => {
          section.suggestedSceneTemplates.forEach((sceneTemplate) => {
            it(`section ${index} should reference valid L4 scene template '${sceneTemplate}'`, () => {
              expect(hasSceneTemplate(sceneTemplate)).toBe(true);
            });
          });
        });
      });
    });

    describe('validateVideoTemplate', () => {
      it('should validate concept_explainer successfully', () => {
        const result = validateVideoTemplate(VIDEO_TEMPLATES['concept_explainer']);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate all MVP templates successfully', () => {
        for (const name of MVP_VIDEO_TEMPLATE_NAMES) {
          const result = validateVideoTemplate(VIDEO_TEMPLATES[name]);
          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);
        }
      });

      it('should validate all V2 templates successfully', () => {
        for (const name of V2_VIDEO_TEMPLATE_NAMES) {
          const result = validateVideoTemplate(VIDEO_TEMPLATES[name]);
          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);
        }
      });

      it('should detect invalid scene template reference', () => {
        const invalidTemplate: VideoTemplate = {
          name: 'invalid_test',
          genre: 'educational',
          description: 'Test template with invalid scene template',
          structure: [
            {
              role: 'opening',
              suggestedSceneTemplates: ['non_existent_scene'],
              minScenes: 1,
              maxScenes: 1,
            },
          ],
        };
        const result = validateVideoTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('non_existent_scene'))).toBe(true);
      });

      it('should detect invalid min/max scenes', () => {
        const invalidTemplate: VideoTemplate = {
          name: 'invalid_test',
          genre: 'educational',
          description: 'Test template with invalid min/max',
          structure: [
            {
              role: 'opening',
              suggestedSceneTemplates: ['intro_greeting'],
              minScenes: 5,
              maxScenes: 2, // Invalid: max < min
            },
          ],
        };
        const result = validateVideoTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('maxScenes'))).toBe(true);
      });
    });

    describe('validateAllVideoTemplates', () => {
      it('should validate all templates successfully', () => {
        const result = validateAllVideoTemplates();
        expect(result.valid).toBe(true);
        expect(Object.keys(result.results)).toHaveLength(5);
        for (const [name, validation] of Object.entries(result.results)) {
          expect(validation.valid).toBe(true);
          expect(validation.errors).toHaveLength(0);
        }
      });
    });
  });

  // ==========================================================================
  // Helper Functions
  // ==========================================================================
  describe('Helper Functions', () => {
    describe('getVideoTemplate', () => {
      it('should return template for valid MVP name', () => {
        const template = getVideoTemplate('concept_explainer');
        expect(template).toBeDefined();
        expect(template?.name).toBe('concept_explainer');
      });

      it('should return template for valid V2 name', () => {
        const template = getVideoTemplate('step_by_step');
        expect(template).toBeDefined();
        expect(template?.name).toBe('step_by_step');
      });

      it('should return undefined for invalid name', () => {
        const template = getVideoTemplate('non_existent_template');
        expect(template).toBeUndefined();
      });
    });

    describe('hasVideoTemplate', () => {
      it('should return true for valid MVP template', () => {
        expect(hasVideoTemplate('concept_explainer')).toBe(true);
        expect(hasVideoTemplate('news_summary')).toBe(true);
      });

      it('should return true for valid V2 template', () => {
        expect(hasVideoTemplate('step_by_step')).toBe(true);
        expect(hasVideoTemplate('myth_buster')).toBe(true);
        expect(hasVideoTemplate('list_ranking')).toBe(true);
      });

      it('should return false for invalid template', () => {
        expect(hasVideoTemplate('invalid')).toBe(false);
        expect(hasVideoTemplate('')).toBe(false);
      });
    });

    describe('getTemplatesByGenre', () => {
      it('should return 3 templates for genre "educational"', () => {
        const templates = getTemplatesByGenre('educational');
        expect(templates).toHaveLength(3);
        const names = templates.map(t => t.name);
        expect(names).toContain('concept_explainer');
        expect(names).toContain('step_by_step');
        expect(names).toContain('myth_buster');
      });

      it('should return 2 templates for genre "informational"', () => {
        const templates = getTemplatesByGenre('informational');
        expect(templates).toHaveLength(2);
        const names = templates.map(t => t.name);
        expect(names).toContain('news_summary');
        expect(names).toContain('list_ranking');
      });

      it('should return 0 templates for unused genres', () => {
        expect(getTemplatesByGenre('comparison')).toHaveLength(0);
        expect(getTemplatesByGenre('narrative')).toHaveLength(0);
      });
    });

    describe('getVideoTemplateStats', () => {
      it('should return correct total count', () => {
        const stats = getVideoTemplateStats();
        expect(stats.totalTemplates).toBe(5);
      });

      it('should return correct genre distribution', () => {
        const stats = getVideoTemplateStats();
        expect(stats.byGenre.educational).toBe(3);
        expect(stats.byGenre.informational).toBe(2);
        expect(stats.byGenre.comparison).toBe(0);
        expect(stats.byGenre.narrative).toBe(0);
      });

      it('should return positive average sections', () => {
        const stats = getVideoTemplateStats();
        expect(stats.avgSectionsPerTemplate).toBeGreaterThan(0);
      });

      it('should return positive unique scene templates count', () => {
        const stats = getVideoTemplateStats();
        expect(stats.uniqueSceneTemplatesReferenced).toBeGreaterThan(0);
      });
    });

    describe('getAllReferencedSceneTemplates', () => {
      it('should return array of scene templates', () => {
        const sceneTemplates = getAllReferencedSceneTemplates();
        expect(Array.isArray(sceneTemplates)).toBe(true);
        expect(sceneTemplates.length).toBeGreaterThan(0);
      });

      it('should return sorted array', () => {
        const sceneTemplates = getAllReferencedSceneTemplates();
        const sorted = [...sceneTemplates].sort();
        expect(sceneTemplates).toEqual(sorted);
      });

      it('should include common templates', () => {
        const sceneTemplates = getAllReferencedSceneTemplates();
        expect(sceneTemplates).toContain('intro_greeting');
        expect(sceneTemplates).toContain('explain_default');
      });
    });

    describe('getSceneCountRange', () => {
      it('should return range for valid template', () => {
        const range = getSceneCountRange('concept_explainer');
        expect(range).toBeDefined();
        expect(range?.min).toBeGreaterThanOrEqual(0);
        expect(range?.max).toBeGreaterThan(range?.min ?? 0);
      });

      it('should return undefined for invalid template', () => {
        const range = getSceneCountRange('non_existent');
        expect(range).toBeUndefined();
      });

      it('should calculate correct range for news_summary', () => {
        const range = getSceneCountRange('news_summary');
        expect(range).toBeDefined();
        // Opening(1-1) + Exp(1-2) + Trans(0-1) + Exp(1-2) + Trans(0-1) + Exp(1-2) + Closing(1-1)
        expect(range?.min).toBe(5);
        expect(range?.max).toBe(10);
      });
    });

    describe('getOptionalSectionCount', () => {
      it('should return count of optional sections', () => {
        const count = getOptionalSectionCount('concept_explainer');
        expect(count).toBeGreaterThanOrEqual(0);
      });

      it('should return 0 for template without optional sections or invalid template', () => {
        const count = getOptionalSectionCount('non_existent');
        expect(count).toBe(0);
      });

      it('should correctly count optional sections in news_summary', () => {
        const count = getOptionalSectionCount('news_summary');
        expect(count).toBe(2); // Two optional transition sections
      });
    });
  });

  // ==========================================================================
  // Genre Distribution
  // ==========================================================================
  describe('Genre Distribution', () => {
    it('should have correct genre distribution', () => {
      const genreCount: Record<string, number> = {};
      for (const template of Object.values(VIDEO_TEMPLATES)) {
        genreCount[template.genre] = (genreCount[template.genre] || 0) + 1;
      }

      expect(genreCount['educational']).toBe(3);
      expect(genreCount['informational']).toBe(2);
    });

    it('should have total of 5 templates across all genres', () => {
      const genreCount: Record<string, number> = {};
      for (const template of Object.values(VIDEO_TEMPLATES)) {
        genreCount[template.genre] = (genreCount[template.genre] || 0) + 1;
      }
      const total = Object.values(genreCount).reduce((sum, count) => sum + count, 0);
      expect(total).toBe(5);
    });
  });

  // ==========================================================================
  // Section Structure Tests
  // ==========================================================================
  describe('Section Structure', () => {
    Object.entries(VIDEO_TEMPLATES).forEach(([name, template]) => {
      describe(`${name} sections`, () => {
        template.structure.forEach((section, index) => {
          describe(`section ${index} (${section.role})`, () => {
            it('should have valid minScenes', () => {
              expect(section.minScenes).toBeGreaterThanOrEqual(0);
            });

            it('should have maxScenes >= minScenes', () => {
              expect(section.maxScenes).toBeGreaterThanOrEqual(section.minScenes);
            });

            it('should have at least one suggested scene template', () => {
              expect(section.suggestedSceneTemplates.length).toBeGreaterThan(0);
            });
          });
        });
      });
    });
  });
});
