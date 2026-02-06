/**
 * Video Templates Module Tests
 * Testing 2 MVP video templates (Layer 5)
 */

import { describe, it, expect } from 'vitest';
import {
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
} from '../videoTemplates';
import {
  VideoTemplate,
  VideoGenre,
  VideoSection,
} from '../types';
import { hasSceneTemplate, SCENE_TEMPLATES } from '../../templates';

describe('Video Templates Module', () => {
  // ==========================================================================
  // Template Counts
  // ==========================================================================
  describe('Template Counts', () => {
    it('should have exactly 2 MVP video templates', () => {
      expect(Object.keys(VIDEO_TEMPLATES)).toHaveLength(2);
    });

    it('should have 2 MVP template names', () => {
      expect(MVP_VIDEO_TEMPLATE_NAMES).toHaveLength(2);
    });

    it('should have VIDEO_TEMPLATE_NAMES array matching VIDEO_TEMPLATES keys', () => {
      expect(VIDEO_TEMPLATE_NAMES).toHaveLength(2);
      expect(VIDEO_TEMPLATE_NAMES.sort()).toEqual(Object.keys(VIDEO_TEMPLATES).sort());
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
          const validGenres: VideoGenre[] = [
            'educational', 'news', 'marketing', 'entertainment'
          ];
          expect(validGenres).toContain(VIDEO_TEMPLATES[name].genre);
        });

        it('should have description', () => {
          expect(VIDEO_TEMPLATES[name].description).toBeDefined();
          expect(VIDEO_TEMPLATES[name].description.length).toBeGreaterThan(0);
        });

        it('should have at least one section', () => {
          expect(VIDEO_TEMPLATES[name].structure).toBeDefined();
          expect(VIDEO_TEMPLATES[name].structure.length).toBeGreaterThan(0);
        });

        it('should have valid sections', () => {
          const template = VIDEO_TEMPLATES[name];
          for (const section of template.structure) {
            expect(section.role).toBeDefined();
            expect(section.suggestedSceneTemplates).toBeDefined();
            expect(Array.isArray(section.suggestedSceneTemplates)).toBe(true);
            expect(section.minScenes).toBeGreaterThanOrEqual(0);
            expect(section.maxScenes).toBeGreaterThanOrEqual(section.minScenes);
          }
        });
      });
    });

    // Specific template tests
    describe('concept_explainer', () => {
      const template = VIDEO_TEMPLATES['concept_explainer'];

      it('should have genre "educational"', () => {
        expect(template.genre).toBe('educational');
      });

      it('should have 6 sections', () => {
        expect(template.structure).toHaveLength(6);
      });

      it('should have correct section roles in order', () => {
        const roles = template.structure.map(s => s.role);
        expect(roles).toEqual([
          'opening',
          'explanation',
          'example',
          'comparison',
          'emphasis',
          'closing',
        ]);
      });

      it('should have opening section with intro_greeting', () => {
        const openingSection = template.structure[0];
        expect(openingSection.role).toBe('opening');
        expect(openingSection.suggestedSceneTemplates).toContain('intro_greeting');
        expect(openingSection.minScenes).toBe(1);
        expect(openingSection.maxScenes).toBe(1);
      });

      it('should have explanation section with explain templates', () => {
        const explanationSection = template.structure[1];
        expect(explanationSection.role).toBe('explanation');
        expect(explanationSection.suggestedSceneTemplates).toContain('explain_default');
        expect(explanationSection.suggestedSceneTemplates).toContain('explain_formula');
        expect(explanationSection.suggestedSceneTemplates).toContain('explain_reverse');
        expect(explanationSection.minScenes).toBe(2);
        expect(explanationSection.maxScenes).toBe(5);
      });

      it('should have example section', () => {
        const exampleSection = template.structure[2];
        expect(exampleSection.role).toBe('example');
        expect(exampleSection.minScenes).toBe(1);
        expect(exampleSection.maxScenes).toBe(3);
      });

      it('should have optional comparison section', () => {
        const comparisonSection = template.structure[3];
        expect(comparisonSection.role).toBe('comparison');
        expect(comparisonSection.suggestedSceneTemplates).toContain('compare_side_by_side');
        expect(comparisonSection.minScenes).toBe(0);
        expect(comparisonSection.maxScenes).toBe(2);
      });

      it('should have emphasis section', () => {
        const emphasisSection = template.structure[4];
        expect(emphasisSection.role).toBe('emphasis');
        expect(emphasisSection.suggestedSceneTemplates).toContain('emphasis_number');
        expect(emphasisSection.suggestedSceneTemplates).toContain('emphasis_statement');
        expect(emphasisSection.minScenes).toBe(1);
        expect(emphasisSection.maxScenes).toBe(3);
      });

      it('should have closing section', () => {
        const closingSection = template.structure[5];
        expect(closingSection.role).toBe('closing');
        expect(closingSection.minScenes).toBe(1);
        expect(closingSection.maxScenes).toBe(1);
      });
    });

    describe('news_summary', () => {
      const template = VIDEO_TEMPLATES['news_summary'];

      it('should have genre "news"', () => {
        expect(template.genre).toBe('news');
      });

      it('should have 7 sections', () => {
        expect(template.structure).toHaveLength(7);
      });

      it('should have opening as first section', () => {
        expect(template.structure[0].role).toBe('opening');
        expect(template.structure[0].suggestedSceneTemplates).toContain('intro_greeting');
      });

      it('should have closing as last section', () => {
        const lastSection = template.structure[template.structure.length - 1];
        expect(lastSection.role).toBe('closing');
      });

      it('should have 3 explanation sections (points)', () => {
        const explanationSections = template.structure.filter(s => s.role === 'explanation');
        expect(explanationSections).toHaveLength(3);
      });

      it('should have 2 optional transition sections', () => {
        const transitionSections = template.structure.filter(s => s.role === 'transition');
        expect(transitionSections).toHaveLength(2);
        for (const section of transitionSections) {
          expect(section.minScenes).toBe(0);
          expect(section.maxScenes).toBe(1);
          expect(section.suggestedSceneTemplates).toContain('transition_topic_change');
        }
      });

      it('should have correct section order', () => {
        const roles = template.structure.map(s => s.role);
        expect(roles).toEqual([
          'opening',
          'explanation',
          'transition',
          'explanation',
          'transition',
          'explanation',
          'closing',
        ]);
      });
    });
  });

  // ==========================================================================
  // L4 Scene Template References
  // ==========================================================================
  describe('L4 Scene Template References', () => {
    Object.entries(VIDEO_TEMPLATES).forEach(([name, template]) => {
      describe(`${name} scene template references`, () => {
        template.structure.forEach((section, index) => {
          section.suggestedSceneTemplates.forEach((sceneTemplateName) => {
            it(`should reference valid L4 template "${sceneTemplateName}" in section ${index}`, () => {
              expect(hasSceneTemplate(sceneTemplateName)).toBe(true);
            });
          });
        });
      });
    });

    it('should only reference MVP scene templates', () => {
      const allReferencedTemplates = getAllReferencedSceneTemplates();
      const mvpSceneTemplates = Object.keys(SCENE_TEMPLATES);

      for (const referenced of allReferencedTemplates) {
        expect(mvpSceneTemplates).toContain(referenced);
      }
    });
  });

  // ==========================================================================
  // Helper Functions
  // ==========================================================================
  describe('Helper Functions', () => {
    describe('getVideoTemplate', () => {
      it('should return template for valid name', () => {
        const template = getVideoTemplate('concept_explainer');
        expect(template).toBeDefined();
        expect(template?.name).toBe('concept_explainer');
      });

      it('should return undefined for invalid name', () => {
        const template = getVideoTemplate('non_existent_template');
        expect(template).toBeUndefined();
      });

      it('should return news_summary template', () => {
        const template = getVideoTemplate('news_summary');
        expect(template).toBeDefined();
        expect(template?.genre).toBe('news');
      });
    });

    describe('hasVideoTemplate', () => {
      it('should return true for valid templates', () => {
        expect(hasVideoTemplate('concept_explainer')).toBe(true);
        expect(hasVideoTemplate('news_summary')).toBe(true);
      });

      it('should return false for invalid templates', () => {
        expect(hasVideoTemplate('invalid')).toBe(false);
        expect(hasVideoTemplate('')).toBe(false);
        expect(hasVideoTemplate('random_name')).toBe(false);
      });
    });

    describe('getTemplatesByGenre', () => {
      it('should return 1 template for genre "educational"', () => {
        const templates = getTemplatesByGenre('educational');
        expect(templates).toHaveLength(1);
        expect(templates[0].name).toBe('concept_explainer');
      });

      it('should return 1 template for genre "news"', () => {
        const templates = getTemplatesByGenre('news');
        expect(templates).toHaveLength(1);
        expect(templates[0].name).toBe('news_summary');
      });

      it('should return 0 templates for genre "marketing"', () => {
        const templates = getTemplatesByGenre('marketing');
        expect(templates).toHaveLength(0);
      });

      it('should return 0 templates for genre "entertainment"', () => {
        const templates = getTemplatesByGenre('entertainment');
        expect(templates).toHaveLength(0);
      });
    });

    describe('getVideoTemplateStats', () => {
      it('should return correct total templates count', () => {
        const stats = getVideoTemplateStats();
        expect(stats.totalTemplates).toBe(2);
      });

      it('should return correct genre distribution', () => {
        const stats = getVideoTemplateStats();
        expect(stats.byGenre.educational).toBe(1);
        expect(stats.byGenre.news).toBe(1);
        expect(stats.byGenre.marketing).toBe(0);
        expect(stats.byGenre.entertainment).toBe(0);
      });

      it('should calculate average sections correctly', () => {
        const stats = getVideoTemplateStats();
        // concept_explainer has 6 sections, news_summary has 7 sections
        // Average = (6 + 7) / 2 = 6.5
        expect(stats.avgSectionsPerTemplate).toBe(6.5);
      });

      it('should count unique scene templates referenced', () => {
        const stats = getVideoTemplateStats();
        // Should count all unique scene templates used across both video templates
        expect(stats.uniqueSceneTemplatesReferenced).toBeGreaterThan(0);
        expect(stats.uniqueSceneTemplatesReferenced).toBeLessThanOrEqual(8); // Max 8 MVP scene templates
      });
    });

    describe('getAllReferencedSceneTemplates', () => {
      it('should return an array of strings', () => {
        const templates = getAllReferencedSceneTemplates();
        expect(Array.isArray(templates)).toBe(true);
        for (const template of templates) {
          expect(typeof template).toBe('string');
        }
      });

      it('should return sorted array', () => {
        const templates = getAllReferencedSceneTemplates();
        const sorted = [...templates].sort();
        expect(templates).toEqual(sorted);
      });

      it('should contain intro_greeting', () => {
        const templates = getAllReferencedSceneTemplates();
        expect(templates).toContain('intro_greeting');
      });

      it('should contain explain templates', () => {
        const templates = getAllReferencedSceneTemplates();
        expect(templates).toContain('explain_default');
      });

      it('should not contain duplicates', () => {
        const templates = getAllReferencedSceneTemplates();
        const uniqueTemplates = [...new Set(templates)];
        expect(templates).toEqual(uniqueTemplates);
      });
    });

    describe('getSceneCountRange', () => {
      it('should return correct range for concept_explainer', () => {
        const range = getSceneCountRange('concept_explainer');
        expect(range).toBeDefined();
        // min: 1 + 2 + 1 + 0 + 1 + 1 = 6
        // max: 1 + 5 + 3 + 2 + 3 + 1 = 15
        expect(range?.min).toBe(6);
        expect(range?.max).toBe(15);
      });

      it('should return correct range for news_summary', () => {
        const range = getSceneCountRange('news_summary');
        expect(range).toBeDefined();
        // min: 1 + 1 + 0 + 1 + 0 + 1 + 1 = 5
        // max: 1 + 2 + 1 + 2 + 1 + 2 + 1 = 10
        expect(range?.min).toBe(5);
        expect(range?.max).toBe(10);
      });

      it('should return undefined for non-existent template', () => {
        const range = getSceneCountRange('non_existent');
        expect(range).toBeUndefined();
      });
    });
  });

  // ==========================================================================
  // Validation Functions
  // ==========================================================================
  describe('Validation Functions', () => {
    describe('validateVideoTemplate', () => {
      it('should validate concept_explainer successfully', () => {
        const template = VIDEO_TEMPLATES['concept_explainer'];
        const result = validateVideoTemplate(template);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate news_summary successfully', () => {
        const template = VIDEO_TEMPLATES['news_summary'];
        const result = validateVideoTemplate(template);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should detect missing name', () => {
        const invalidTemplate: VideoTemplate = {
          name: '',
          genre: 'educational',
          description: 'Test template',
          structure: [
            {
              role: 'opening',
              suggestedSceneTemplates: ['intro_greeting'],
              minScenes: 1,
              maxScenes: 1,
            },
          ],
        };
        const result = validateVideoTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Template name is required');
      });

      it('should detect empty structure', () => {
        const invalidTemplate: VideoTemplate = {
          name: 'test',
          genre: 'educational',
          description: 'Test template',
          structure: [],
        };
        const result = validateVideoTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Template must have at least one section');
      });

      it('should detect invalid minScenes', () => {
        const invalidTemplate: VideoTemplate = {
          name: 'test',
          genre: 'educational',
          description: 'Test template',
          structure: [
            {
              role: 'opening',
              suggestedSceneTemplates: ['intro_greeting'],
              minScenes: -1,
              maxScenes: 1,
            },
          ],
        };
        const result = validateVideoTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('minScenes cannot be negative'))).toBe(true);
      });

      it('should detect maxScenes less than minScenes', () => {
        const invalidTemplate: VideoTemplate = {
          name: 'test',
          genre: 'educational',
          description: 'Test template',
          structure: [
            {
              role: 'opening',
              suggestedSceneTemplates: ['intro_greeting'],
              minScenes: 5,
              maxScenes: 2,
            },
          ],
        };
        const result = validateVideoTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes('maxScenes') && e.includes('minScenes'))).toBe(true);
      });

      it('should detect invalid scene template reference', () => {
        const invalidTemplate: VideoTemplate = {
          name: 'test',
          genre: 'educational',
          description: 'Test template',
          structure: [
            {
              role: 'opening',
              suggestedSceneTemplates: ['non_existent_template'],
              minScenes: 1,
              maxScenes: 1,
            },
          ],
        };
        const result = validateVideoTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors.some(e => e.includes("'non_existent_template' does not exist"))).toBe(true);
      });

      it('should warn about missing opening section', () => {
        const templateWithoutOpening: VideoTemplate = {
          name: 'test',
          genre: 'educational',
          description: 'Test template',
          structure: [
            {
              role: 'explanation',
              suggestedSceneTemplates: ['explain_default'],
              minScenes: 1,
              maxScenes: 1,
            },
            {
              role: 'closing',
              suggestedSceneTemplates: ['intro_greeting'],
              minScenes: 1,
              maxScenes: 1,
            },
          ],
        };
        const result = validateVideoTemplate(templateWithoutOpening);
        expect(result.valid).toBe(true); // Still valid, just a warning
        expect(result.warnings).toContain('Template does not have an opening section');
      });

      it('should warn about missing closing section', () => {
        const templateWithoutClosing: VideoTemplate = {
          name: 'test',
          genre: 'educational',
          description: 'Test template',
          structure: [
            {
              role: 'opening',
              suggestedSceneTemplates: ['intro_greeting'],
              minScenes: 1,
              maxScenes: 1,
            },
            {
              role: 'explanation',
              suggestedSceneTemplates: ['explain_default'],
              minScenes: 1,
              maxScenes: 1,
            },
          ],
        };
        const result = validateVideoTemplate(templateWithoutClosing);
        expect(result.valid).toBe(true); // Still valid, just a warning
        expect(result.warnings).toContain('Template does not have a closing section');
      });

      it('should warn about empty scene templates', () => {
        const templateWithEmptySceneTemplates: VideoTemplate = {
          name: 'test',
          genre: 'educational',
          description: 'Test template',
          structure: [
            {
              role: 'opening',
              suggestedSceneTemplates: [],
              minScenes: 1,
              maxScenes: 1,
            },
          ],
        };
        const result = validateVideoTemplate(templateWithEmptySceneTemplates);
        expect(result.valid).toBe(true); // Still valid, just a warning
        expect(result.warnings.some(w => w.includes('no scene templates suggested'))).toBe(true);
      });
    });

    describe('validateAllVideoTemplates', () => {
      it('should validate all templates successfully', () => {
        const result = validateAllVideoTemplates();
        expect(result.valid).toBe(true);
        expect(Object.keys(result.results)).toHaveLength(2);
      });

      it('should have results for each template', () => {
        const result = validateAllVideoTemplates();
        expect(result.results['concept_explainer']).toBeDefined();
        expect(result.results['news_summary']).toBeDefined();
      });

      it('should have all templates pass validation', () => {
        const result = validateAllVideoTemplates();
        for (const [name, validation] of Object.entries(result.results)) {
          expect(validation.valid).toBe(true);
          expect(validation.errors).toHaveLength(0);
        }
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

      expect(genreCount['educational']).toBe(1);
      expect(genreCount['news']).toBe(1);
      expect(genreCount['marketing']).toBeUndefined();
      expect(genreCount['entertainment']).toBeUndefined();
    });
  });

  // ==========================================================================
  // Section Role Coverage
  // ==========================================================================
  describe('Section Role Coverage', () => {
    it('should cover essential roles across templates', () => {
      const allRoles = new Set<string>();
      for (const template of Object.values(VIDEO_TEMPLATES)) {
        for (const section of template.structure) {
          allRoles.add(section.role);
        }
      }

      expect(allRoles.has('opening')).toBe(true);
      expect(allRoles.has('closing')).toBe(true);
      expect(allRoles.has('explanation')).toBe(true);
    });

    it('should have opening and closing in all templates', () => {
      for (const [name, template] of Object.entries(VIDEO_TEMPLATES)) {
        const hasOpening = template.structure.some(s => s.role === 'opening');
        const hasClosing = template.structure.some(s => s.role === 'closing');
        expect(hasOpening).toBe(true);
        expect(hasClosing).toBe(true);
      }
    });
  });

  // ==========================================================================
  // Template Structure Consistency
  // ==========================================================================
  describe('Template Structure Consistency', () => {
    it('should have opening as first section in all templates', () => {
      for (const template of Object.values(VIDEO_TEMPLATES)) {
        expect(template.structure[0].role).toBe('opening');
      }
    });

    it('should have closing as last section in all templates', () => {
      for (const template of Object.values(VIDEO_TEMPLATES)) {
        const lastSection = template.structure[template.structure.length - 1];
        expect(lastSection.role).toBe('closing');
      }
    });
  });
});
