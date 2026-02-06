/**
 * Video Templates Tests - Layer 5 (Video Templates)
 * Comprehensive tests for video template definitions and utilities
 */

import {
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
  VideoTemplate,
  VideoGenre,
} from '../index';

import { SCENE_TEMPLATE_NAMES } from '../../templates';

describe('Video Templates Module', () => {
  // ============================================================================
  // TEMPLATE COUNT TESTS
  // ============================================================================
  describe('Template Counts', () => {
    it('should have 10 total video templates', () => {
      expect(VIDEO_TEMPLATE_NAMES.length).toBe(10);
      expect(Object.keys(VIDEO_TEMPLATES).length).toBe(10);
    });

    it('should have 2 MVP templates', () => {
      expect(MVP_TEMPLATE_NAMES.length).toBe(2);
    });

    it('should have 3 V2 templates', () => {
      expect(V2_TEMPLATE_NAMES.length).toBe(3);
    });

    it('should have 5 V3 templates', () => {
      expect(V3_TEMPLATE_NAMES.length).toBe(5);
    });

    it('MVP + V2 + V3 should equal total', () => {
      expect(MVP_TEMPLATE_NAMES.length + V2_TEMPLATE_NAMES.length + V3_TEMPLATE_NAMES.length).toBe(10);
    });
  });

  // ============================================================================
  // MVP TEMPLATES TESTS
  // ============================================================================
  describe('MVP Templates', () => {
    it('should include concept_explainer', () => {
      expect(hasVideoTemplate('concept_explainer')).toBe(true);
      const template = getVideoTemplate('concept_explainer');
      expect(template?.genre).toBe('educational');
    });

    it('should include news_summary', () => {
      expect(hasVideoTemplate('news_summary')).toBe(true);
      const template = getVideoTemplate('news_summary');
      expect(template?.genre).toBe('informational');
    });

    it('all MVP templates should be in VIDEO_TEMPLATES', () => {
      for (const name of MVP_TEMPLATE_NAMES) {
        expect(VIDEO_TEMPLATES[name]).toBeDefined();
      }
    });
  });

  // ============================================================================
  // V2 TEMPLATES TESTS
  // ============================================================================
  describe('V2 Templates', () => {
    it('should include step_by_step', () => {
      expect(hasVideoTemplate('step_by_step')).toBe(true);
      const template = getVideoTemplate('step_by_step');
      expect(template?.genre).toBe('educational');
    });

    it('should include myth_buster', () => {
      expect(hasVideoTemplate('myth_buster')).toBe(true);
      const template = getVideoTemplate('myth_buster');
      expect(template?.genre).toBe('educational');
    });

    it('should include list_ranking', () => {
      expect(hasVideoTemplate('list_ranking')).toBe(true);
      const template = getVideoTemplate('list_ranking');
      expect(template?.genre).toBe('informational');
    });

    it('all V2 templates should be in VIDEO_TEMPLATES', () => {
      for (const name of V2_TEMPLATE_NAMES) {
        expect(VIDEO_TEMPLATES[name]).toBeDefined();
      }
    });
  });

  // ============================================================================
  // V3 TEMPLATES TESTS
  // ============================================================================
  describe('V3 Templates', () => {
    it('should include a_vs_b', () => {
      expect(hasVideoTemplate('a_vs_b')).toBe(true);
      const template = getVideoTemplate('a_vs_b');
      expect(template?.genre).toBe('comparison');
    });

    it('should include pros_and_cons', () => {
      expect(hasVideoTemplate('pros_and_cons')).toBe(true);
      const template = getVideoTemplate('pros_and_cons');
      expect(template?.genre).toBe('comparison');
    });

    it('should include story_arc', () => {
      expect(hasVideoTemplate('story_arc')).toBe(true);
      const template = getVideoTemplate('story_arc');
      expect(template?.genre).toBe('narrative');
    });

    it('should include biography', () => {
      expect(hasVideoTemplate('biography')).toBe(true);
      const template = getVideoTemplate('biography');
      expect(template?.genre).toBe('narrative');
    });

    it('should include how_it_works', () => {
      expect(hasVideoTemplate('how_it_works')).toBe(true);
      const template = getVideoTemplate('how_it_works');
      expect(template?.genre).toBe('educational');
    });

    it('all V3 templates should be in VIDEO_TEMPLATES', () => {
      for (const name of V3_TEMPLATE_NAMES) {
        expect(VIDEO_TEMPLATES[name]).toBeDefined();
      }
    });
  });

  // ============================================================================
  // V3 STRUCTURE TESTS
  // ============================================================================
  describe('V3 Template Structures', () => {
    it('a_vs_b should have correct structure', () => {
      const template = getVideoTemplate('a_vs_b');
      const roles = template?.structure.map(s => s.role);
      expect(roles).toContain('opening');
      expect(roles).toContain('option_a');
      expect(roles).toContain('option_b');
      expect(roles).toContain('comparison');
      expect(roles).toContain('conclusion');
      expect(roles).toContain('closing');
    });

    it('pros_and_cons should have correct structure', () => {
      const template = getVideoTemplate('pros_and_cons');
      const roles = template?.structure.map(s => s.role);
      expect(roles).toContain('opening');
      expect(roles).toContain('pros');
      expect(roles).toContain('cons');
      expect(roles).toContain('summary');
      expect(roles).toContain('closing');
    });

    it('story_arc should have correct structure', () => {
      const template = getVideoTemplate('story_arc');
      const roles = template?.structure.map(s => s.role);
      expect(roles).toContain('opening');
      expect(roles).toContain('background');
      expect(roles).toContain('development');
      expect(roles).toContain('crisis');
      expect(roles).toContain('resolution');
      expect(roles).toContain('lesson');
      expect(roles).toContain('closing');
    });

    it('biography should have correct structure', () => {
      const template = getVideoTemplate('biography');
      const roles = template?.structure.map(s => s.role);
      expect(roles).toContain('opening');
      expect(roles).toContain('early_life');
      expect(roles).toContain('turning_point');
      expect(roles).toContain('achievements');
      expect(roles).toContain('legacy');
      expect(roles).toContain('closing');
    });

    it('how_it_works should have correct structure', () => {
      const template = getVideoTemplate('how_it_works');
      const roles = template?.structure.map(s => s.role);
      expect(roles).toContain('opening');
      expect(roles).toContain('overview');
      expect(roles).toContain('component1');
      expect(roles).toContain('component2');
      expect(roles).toContain('integration');
      expect(roles).toContain('closing');
    });
  });

  // ============================================================================
  // TEMPLATE STRUCTURE TESTS
  // ============================================================================
  describe('Template Structure', () => {
    it('all templates should have required fields', () => {
      for (const template of Object.values(VIDEO_TEMPLATES)) {
        expect(template.name).toBeDefined();
        expect(template.genre).toBeDefined();
        expect(template.description).toBeDefined();
        expect(template.structure).toBeDefined();
        expect(Array.isArray(template.structure)).toBe(true);
        expect(template.structure.length).toBeGreaterThan(0);
      }
    });

    it('all templates should have V3 fields (estimatedDuration, difficulty)', () => {
      for (const template of Object.values(VIDEO_TEMPLATES)) {
        expect(template.estimatedDuration).toBeDefined();
        expect(template.estimatedDuration?.min).toBeGreaterThan(0);
        expect(template.estimatedDuration?.max).toBeGreaterThanOrEqual(template.estimatedDuration?.min || 0);
        expect(template.difficulty).toBeDefined();
        expect(['beginner', 'intermediate', 'advanced']).toContain(template.difficulty);
      }
    });

    it('all sections should have required fields', () => {
      for (const template of Object.values(VIDEO_TEMPLATES)) {
        for (const section of template.structure) {
          expect(section.role).toBeDefined();
          expect(section.name).toBeDefined();
          expect(section.suggestedSceneTemplates).toBeDefined();
          expect(Array.isArray(section.suggestedSceneTemplates)).toBe(true);
          expect(section.minScenes).toBeDefined();
          expect(section.maxScenes).toBeDefined();
          expect(section.minScenes).toBeLessThanOrEqual(section.maxScenes);
        }
      }
    });

    it('all templates should start with opening and end with closing', () => {
      for (const template of Object.values(VIDEO_TEMPLATES)) {
        const firstSection = template.structure[0];
        const lastSection = template.structure[template.structure.length - 1];
        expect(firstSection.role).toBe('opening');
        expect(lastSection.role).toBe('closing');
      }
    });
  });

  // ============================================================================
  // SCENE TEMPLATE REFERENCE VALIDATION
  // ============================================================================
  describe('Scene Template References', () => {
    it('all referenced scene templates should exist', () => {
      const result = validateAllVideoTemplates();

      // Check for any errors related to unknown scene templates
      const sceneTemplateErrors = result.invalidTemplates
        .flatMap(t => t.errors)
        .filter(e => e.includes('Unknown scene template'));

      expect(sceneTemplateErrors).toHaveLength(0);
    });

    it('validateVideoTemplate should detect invalid scene templates', () => {
      const invalidTemplate: VideoTemplate = {
        name: 'test_invalid',
        genre: 'educational',
        description: 'Test template with invalid references',
        structure: [
          {
            role: 'opening',
            name: 'Test Opening',
            suggestedSceneTemplates: ['nonexistent_template'],
            minScenes: 1,
            maxScenes: 1,
          },
        ],
      };

      const result = validateVideoTemplate(invalidTemplate);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Unknown scene template'))).toBe(true);
    });

    it('getUsedSceneTemplates should return all used scene templates', () => {
      const usedTemplates = getUsedSceneTemplates();
      expect(usedTemplates.length).toBeGreaterThan(0);

      // All used templates should exist in L4 scene templates
      for (const templateName of usedTemplates) {
        expect(SCENE_TEMPLATE_NAMES).toContain(templateName);
      }
    });
  });

  // ============================================================================
  // HELPER FUNCTIONS TESTS
  // ============================================================================
  describe('Helper Functions', () => {
    describe('getVideoTemplate', () => {
      it('should return template for valid name', () => {
        const template = getVideoTemplate('concept_explainer');
        expect(template).toBeDefined();
        expect(template?.name).toBe('concept_explainer');
      });

      it('should return undefined for invalid name', () => {
        const template = getVideoTemplate('nonexistent');
        expect(template).toBeUndefined();
      });
    });

    describe('hasVideoTemplate', () => {
      it('should return true for valid name', () => {
        expect(hasVideoTemplate('concept_explainer')).toBe(true);
        expect(hasVideoTemplate('news_summary')).toBe(true);
      });

      it('should return false for invalid name', () => {
        expect(hasVideoTemplate('nonexistent')).toBe(false);
      });
    });

    describe('getTemplatesByGenre', () => {
      it('should return educational templates', () => {
        const templates = getTemplatesByGenre('educational');
        expect(templates.length).toBeGreaterThan(0);
        for (const t of templates) {
          expect(t.genre).toBe('educational');
        }
      });

      it('should return informational templates', () => {
        const templates = getTemplatesByGenre('informational');
        expect(templates.length).toBeGreaterThan(0);
        for (const t of templates) {
          expect(t.genre).toBe('informational');
        }
      });

      it('should return comparison templates', () => {
        const templates = getTemplatesByGenre('comparison');
        expect(templates.length).toBeGreaterThan(0);
        for (const t of templates) {
          expect(t.genre).toBe('comparison');
        }
      });

      it('should return narrative templates', () => {
        const templates = getTemplatesByGenre('narrative');
        expect(templates.length).toBeGreaterThan(0);
        for (const t of templates) {
          expect(t.genre).toBe('narrative');
        }
      });
    });

    describe('getTemplatesByDifficulty', () => {
      it('should return beginner templates', () => {
        const templates = getTemplatesByDifficulty('beginner');
        expect(templates.length).toBeGreaterThan(0);
        for (const t of templates) {
          expect(t.difficulty).toBe('beginner');
        }
      });

      it('should return intermediate templates', () => {
        const templates = getTemplatesByDifficulty('intermediate');
        expect(templates.length).toBeGreaterThan(0);
        for (const t of templates) {
          expect(t.difficulty).toBe('intermediate');
        }
      });

      it('should return advanced templates', () => {
        const templates = getTemplatesByDifficulty('advanced');
        expect(templates.length).toBeGreaterThan(0);
        for (const t of templates) {
          expect(t.difficulty).toBe('advanced');
        }
      });
    });
  });

  // ============================================================================
  // VALIDATION TESTS
  // ============================================================================
  describe('Validation', () => {
    it('all templates should pass validation', () => {
      const result = validateAllVideoTemplates();

      if (!result.valid) {
        // Log errors for debugging
        console.log('Invalid templates:', result.invalidTemplates);
      }

      expect(result.valid).toBe(true);
    });

    it('validateVideoTemplate should detect invalid minScenes/maxScenes', () => {
      const invalidTemplate: VideoTemplate = {
        name: 'test_invalid',
        genre: 'educational',
        description: 'Test template',
        structure: [
          {
            role: 'opening',
            name: 'Test Opening',
            suggestedSceneTemplates: ['intro_greeting'],
            minScenes: 5,
            maxScenes: 2, // maxScenes < minScenes
          },
        ],
      };

      const result = validateVideoTemplate(invalidTemplate);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('maxScenes'))).toBe(true);
    });

    it('validateVideoTemplate should warn about empty scene templates', () => {
      const templateWithEmptyScenes: VideoTemplate = {
        name: 'test_empty',
        genre: 'educational',
        description: 'Test template',
        structure: [
          {
            role: 'opening',
            name: 'Test Opening',
            suggestedSceneTemplates: [], // Empty
            minScenes: 1,
            maxScenes: 1,
          },
        ],
      };

      const result = validateVideoTemplate(templateWithEmptyScenes);
      expect(result.warnings.some(w => w.includes('No scene templates'))).toBe(true);
    });
  });

  // ============================================================================
  // STATISTICS TESTS
  // ============================================================================
  describe('Statistics', () => {
    describe('getVideoTemplateStats', () => {
      it('should return correct counts', () => {
        const stats = getVideoTemplateStats();
        expect(stats.total).toBe(10);
        expect(stats.mvp).toBe(2);
        expect(stats.v2).toBe(3);
        expect(stats.v3).toBe(5);
      });

      it('should return correct genre counts', () => {
        const stats = getVideoTemplateStats();
        const totalByGenre = Object.values(stats.byGenre).reduce((a, b) => a + b, 0);
        expect(totalByGenre).toBe(stats.total);
      });

      it('should have all genres represented', () => {
        const stats = getVideoTemplateStats();
        expect(stats.byGenre.educational).toBeGreaterThan(0);
        expect(stats.byGenre.informational).toBeGreaterThan(0);
        expect(stats.byGenre.comparison).toBeGreaterThan(0);
        expect(stats.byGenre.narrative).toBeGreaterThan(0);
      });
    });

    describe('getTemplateSectionStats', () => {
      it('should return correct section stats', () => {
        const template = getVideoTemplate('concept_explainer')!;
        const stats = getTemplateSectionStats(template);

        expect(stats.totalSections).toBe(template.structure.length);
        expect(stats.requiredSections + stats.optionalSections).toBe(stats.totalSections);
        expect(stats.minTotalScenes).toBeGreaterThan(0);
        expect(stats.maxTotalScenes).toBeGreaterThanOrEqual(stats.minTotalScenes);
      });

      it('should correctly count optional sections', () => {
        const template = getVideoTemplate('news_summary')!;
        const stats = getTemplateSectionStats(template);

        const optionalCount = template.structure.filter(s => s.optional).length;
        expect(stats.optionalSections).toBe(optionalCount);
      });
    });
  });

  // ============================================================================
  // GENRE DISTRIBUTION TESTS
  // ============================================================================
  describe('Genre Distribution', () => {
    it('should have at least one template per genre', () => {
      const genres: VideoGenre[] = ['educational', 'informational', 'comparison', 'narrative'];
      for (const genre of genres) {
        const templates = getTemplatesByGenre(genre);
        expect(templates.length).toBeGreaterThan(0);
      }
    });

    it('educational genre should have concept_explainer, step_by_step, myth_buster, how_it_works', () => {
      const educational = getTemplatesByGenre('educational');
      const names = educational.map(t => t.name);
      expect(names).toContain('concept_explainer');
      expect(names).toContain('step_by_step');
      expect(names).toContain('myth_buster');
      expect(names).toContain('how_it_works');
    });

    it('informational genre should have news_summary, list_ranking', () => {
      const informational = getTemplatesByGenre('informational');
      const names = informational.map(t => t.name);
      expect(names).toContain('news_summary');
      expect(names).toContain('list_ranking');
    });

    it('comparison genre should have a_vs_b, pros_and_cons', () => {
      const comparison = getTemplatesByGenre('comparison');
      const names = comparison.map(t => t.name);
      expect(names).toContain('a_vs_b');
      expect(names).toContain('pros_and_cons');
    });

    it('narrative genre should have story_arc, biography', () => {
      const narrative = getTemplatesByGenre('narrative');
      const names = narrative.map(t => t.name);
      expect(names).toContain('story_arc');
      expect(names).toContain('biography');
    });
  });

  // ============================================================================
  // DIFFICULTY DISTRIBUTION TESTS
  // ============================================================================
  describe('Difficulty Distribution', () => {
    it('should have templates at each difficulty level', () => {
      const beginner = getTemplatesByDifficulty('beginner');
      const intermediate = getTemplatesByDifficulty('intermediate');
      const advanced = getTemplatesByDifficulty('advanced');

      expect(beginner.length).toBeGreaterThan(0);
      expect(intermediate.length).toBeGreaterThan(0);
      expect(advanced.length).toBeGreaterThan(0);
    });

    it('total difficulty counts should equal total templates', () => {
      const beginner = getTemplatesByDifficulty('beginner');
      const intermediate = getTemplatesByDifficulty('intermediate');
      const advanced = getTemplatesByDifficulty('advanced');

      expect(beginner.length + intermediate.length + advanced.length).toBe(10);
    });
  });
});
