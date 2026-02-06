/**
 * Scene Templates Module Tests
 * Testing 16 scene templates (8 MVP + 8 V2) - Layer 4
 */

import { describe, it, expect } from 'vitest';
import {
  SCENE_TEMPLATES,
  SCENE_TEMPLATE_NAMES,
  MVP_TEMPLATE_NAMES,
  V2_TEMPLATE_NAMES,
  getSceneTemplate,
  hasSceneTemplate,
  getTemplatesByRole,
  validateTemplatePresets,
  validateAllTemplates,
} from '../sceneTemplates';
import { SceneTemplate, SceneRole } from '../types';
import {
  hasCameraPreset,
  hasLayoutPreset,
  hasTimingPreset,
} from '../../direction';

describe('Scene Templates Module', () => {
  // ==========================================================================
  // Template Counts
  // ==========================================================================
  describe('Template Counts', () => {
    it('should have exactly 16 scene templates (8 MVP + 8 V2)', () => {
      expect(Object.keys(SCENE_TEMPLATES)).toHaveLength(16);
    });

    it('should have 8 MVP template names', () => {
      expect(MVP_TEMPLATE_NAMES).toHaveLength(8);
    });

    it('should have 8 V2 template names', () => {
      expect(V2_TEMPLATE_NAMES).toHaveLength(8);
    });

    it('should have SCENE_TEMPLATE_NAMES array matching SCENE_TEMPLATES keys', () => {
      expect(SCENE_TEMPLATE_NAMES).toHaveLength(16);
      expect(SCENE_TEMPLATE_NAMES.sort()).toEqual(Object.keys(SCENE_TEMPLATES).sort());
    });
  });

  // ==========================================================================
  // MVP Scene Templates (8)
  // ==========================================================================
  describe('MVP Scene Templates', () => {
    const mvpTemplates = [
      'intro_greeting',
      'explain_default',
      'explain_formula',
      'explain_reverse',
      'emphasis_number',
      'emphasis_statement',
      'compare_side_by_side',
      'transition_topic_change',
    ];

    mvpTemplates.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in SCENE_TEMPLATES', () => {
          expect(SCENE_TEMPLATES[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(SCENE_TEMPLATES[name].name).toBe(name);
        });

        it('should have a valid role', () => {
          const validRoles: SceneRole[] = [
            'opening', 'explanation', 'emphasis', 'comparison',
            'transition', 'example', 'warning', 'closing'
          ];
          expect(validRoles).toContain(SCENE_TEMPLATES[name].role);
        });

        it('should have description', () => {
          expect(SCENE_TEMPLATES[name].description).toBeDefined();
          expect(SCENE_TEMPLATES[name].description.length).toBeGreaterThan(0);
        });

        it('should have camera preset', () => {
          expect(SCENE_TEMPLATES[name].camera).toBeDefined();
          expect(SCENE_TEMPLATES[name].camera.length).toBeGreaterThan(0);
        });

        it('should have layout preset', () => {
          expect(SCENE_TEMPLATES[name].layout).toBeDefined();
          expect(SCENE_TEMPLATES[name].layout.length).toBeGreaterThan(0);
        });

        it('should have timing preset', () => {
          expect(SCENE_TEMPLATES[name].timing).toBeDefined();
          expect(SCENE_TEMPLATES[name].timing.length).toBeGreaterThan(0);
        });
      });
    });

    // Specific MVP template tests
    describe('intro_greeting specifics', () => {
      const template = SCENE_TEMPLATES['intro_greeting'];

      it('should have role "opening"', () => {
        expect(template.role).toBe('opening');
      });

      it('should use static_full camera', () => {
        expect(template.camera).toBe('static_full');
      });

      it('should use center_stack layout', () => {
        expect(template.layout).toBe('center_stack');
      });

      it('should use stickman_first timing', () => {
        expect(template.timing).toBe('stickman_first');
      });

      it('should have suggested poses', () => {
        expect(template.suggestedPoses).toBeDefined();
        expect(template.suggestedPoses).toContain('standing');
        expect(template.suggestedPoses).toContain('waving');
      });

      it('should have suggested expressions', () => {
        expect(template.suggestedExpressions).toBeDefined();
        expect(template.suggestedExpressions).toContain('happy');
        expect(template.suggestedExpressions).toContain('neutral');
      });
    });

    describe('explain_default specifics', () => {
      const template = SCENE_TEMPLATES['explain_default'];

      it('should have role "explanation"', () => {
        expect(template.role).toBe('explanation');
      });

      it('should use split_left_stickman layout', () => {
        expect(template.layout).toBe('split_left_stickman');
      });
    });

    describe('emphasis_number specifics', () => {
      const template = SCENE_TEMPLATES['emphasis_number'];

      it('should have role "emphasis"', () => {
        expect(template.role).toBe('emphasis');
      });

      it('should use zoom_in_fast camera', () => {
        expect(template.camera).toBe('zoom_in_fast');
      });

      it('should use reveal_climax timing', () => {
        expect(template.timing).toBe('reveal_climax');
      });
    });

    describe('compare_side_by_side specifics', () => {
      const template = SCENE_TEMPLATES['compare_side_by_side'];

      it('should have role "comparison"', () => {
        expect(template.role).toBe('comparison');
      });

      it('should use static_wide camera', () => {
        expect(template.camera).toBe('static_wide');
      });

      it('should use split_equal layout', () => {
        expect(template.layout).toBe('split_equal');
      });
    });
  });

  // ==========================================================================
  // V2 Scene Templates (8)
  // ==========================================================================
  describe('V2 Scene Templates', () => {
    const v2Templates = [
      'intro_question',
      'intro_title_card',
      'explain_with_visual',
      'emphasis_spotlight',
      'compare_before_after',
      'compare_list',
      'example_with_counter',
      'example_story',
    ];

    v2Templates.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in SCENE_TEMPLATES', () => {
          expect(SCENE_TEMPLATES[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(SCENE_TEMPLATES[name].name).toBe(name);
        });

        it('should have a valid role', () => {
          const validRoles: SceneRole[] = [
            'opening', 'explanation', 'emphasis', 'comparison',
            'transition', 'example', 'warning', 'closing'
          ];
          expect(validRoles).toContain(SCENE_TEMPLATES[name].role);
        });

        it('should have description', () => {
          expect(SCENE_TEMPLATES[name].description).toBeDefined();
          expect(SCENE_TEMPLATES[name].description.length).toBeGreaterThan(0);
        });

        it('should have camera preset', () => {
          expect(SCENE_TEMPLATES[name].camera).toBeDefined();
          expect(SCENE_TEMPLATES[name].camera.length).toBeGreaterThan(0);
        });

        it('should have layout preset', () => {
          expect(SCENE_TEMPLATES[name].layout).toBeDefined();
          expect(SCENE_TEMPLATES[name].layout.length).toBeGreaterThan(0);
        });

        it('should have timing preset', () => {
          expect(SCENE_TEMPLATES[name].timing).toBeDefined();
          expect(SCENE_TEMPLATES[name].timing.length).toBeGreaterThan(0);
        });
      });
    });

    // Specific V2 template tests
    describe('intro_question specifics', () => {
      const template = SCENE_TEMPLATES['intro_question'];

      it('should have role "opening"', () => {
        expect(template.role).toBe('opening');
      });

      it('should use zoom_in_slow camera', () => {
        expect(template.camera).toBe('zoom_in_slow');
      });

      it('should use center_hero layout', () => {
        expect(template.layout).toBe('center_hero');
      });

      it('should use reveal_climax timing', () => {
        expect(template.timing).toBe('reveal_climax');
      });

      it('should have suggested poses', () => {
        expect(template.suggestedPoses).toBeDefined();
        expect(template.suggestedPoses).toContain('thinking');
        expect(template.suggestedPoses).toContain('explaining');
      });

      it('should have suggested expressions', () => {
        expect(template.suggestedExpressions).toBeDefined();
        expect(template.suggestedExpressions).toContain('thinking');
        expect(template.suggestedExpressions).toContain('curious');
      });
    });

    describe('intro_title_card specifics', () => {
      const template = SCENE_TEMPLATES['intro_title_card'];

      it('should have role "opening"', () => {
        expect(template.role).toBe('opening');
      });

      it('should use static_wide camera', () => {
        expect(template.camera).toBe('static_wide');
      });

      it('should use overlay_fullscreen_text layout', () => {
        expect(template.layout).toBe('overlay_fullscreen_text');
      });
    });

    describe('explain_with_visual specifics', () => {
      const template = SCENE_TEMPLATES['explain_with_visual'];

      it('should have role "explanation"', () => {
        expect(template.role).toBe('explanation');
      });

      it('should use pan_left_to_right camera', () => {
        expect(template.camera).toBe('pan_left_to_right');
      });

      it('should use triple_horizontal layout', () => {
        expect(template.layout).toBe('triple_horizontal');
      });

      it('should use left_to_right timing', () => {
        expect(template.timing).toBe('left_to_right');
      });
    });

    describe('emphasis_spotlight specifics', () => {
      const template = SCENE_TEMPLATES['emphasis_spotlight'];

      it('should have role "emphasis"', () => {
        expect(template.role).toBe('emphasis');
      });

      it('should use static_closeup camera', () => {
        expect(template.camera).toBe('static_closeup');
      });

      it('should use overlay_spotlight layout', () => {
        expect(template.layout).toBe('overlay_spotlight');
      });
    });

    describe('compare_before_after specifics', () => {
      const template = SCENE_TEMPLATES['compare_before_after'];

      it('should have role "comparison"', () => {
        expect(template.role).toBe('comparison');
      });

      it('should use pan_left_to_right camera', () => {
        expect(template.camera).toBe('pan_left_to_right');
      });

      it('should use grid_2x1 layout', () => {
        expect(template.layout).toBe('grid_2x1');
      });
    });

    describe('compare_list specifics', () => {
      const template = SCENE_TEMPLATES['compare_list'];

      it('should have role "comparison"', () => {
        expect(template.role).toBe('comparison');
      });

      it('should use static_full camera', () => {
        expect(template.camera).toBe('static_full');
      });

      it('should use grid_3x1 layout', () => {
        expect(template.layout).toBe('grid_3x1');
      });

      it('should use top_to_bottom timing', () => {
        expect(template.timing).toBe('top_to_bottom');
      });
    });

    describe('example_with_counter specifics', () => {
      const template = SCENE_TEMPLATES['example_with_counter'];

      it('should have role "example"', () => {
        expect(template.role).toBe('example');
      });

      it('should use triple_stickman_text_counter layout', () => {
        expect(template.layout).toBe('triple_stickman_text_counter');
      });

      it('should have suggested poses', () => {
        expect(template.suggestedPoses).toBeDefined();
        expect(template.suggestedPoses).toContain('pointing_right');
      });
    });

    describe('example_story specifics', () => {
      const template = SCENE_TEMPLATES['example_story'];

      it('should have role "example"', () => {
        expect(template.role).toBe('example');
      });

      it('should use zoom_in_slow camera', () => {
        expect(template.camera).toBe('zoom_in_slow');
      });

      it('should use split_left_stickman layout', () => {
        expect(template.layout).toBe('split_left_stickman');
      });

      it('should have multiple suggested poses', () => {
        expect(template.suggestedPoses).toBeDefined();
        expect(template.suggestedPoses?.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  // ==========================================================================
  // L3 Preset Validation
  // ==========================================================================
  describe('L3 Preset Validation', () => {
    Object.entries(SCENE_TEMPLATES).forEach(([name, template]) => {
      describe(`${name} presets`, () => {
        it('should reference a valid L3 camera preset', () => {
          expect(hasCameraPreset(template.camera)).toBe(true);
        });

        it('should reference a valid L3 layout preset', () => {
          expect(hasLayoutPreset(template.layout)).toBe(true);
        });

        it('should reference a valid L3 timing preset', () => {
          expect(hasTimingPreset(template.timing)).toBe(true);
        });
      });
    });

    describe('validateTemplatePresets', () => {
      it('should validate intro_greeting successfully', () => {
        const template = SCENE_TEMPLATES['intro_greeting'];
        const result = validateTemplatePresets(template);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should validate all MVP templates successfully', () => {
        for (const name of MVP_TEMPLATE_NAMES) {
          const template = SCENE_TEMPLATES[name];
          const result = validateTemplatePresets(template);
          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);
        }
      });

      it('should validate all V2 templates successfully', () => {
        for (const name of V2_TEMPLATE_NAMES) {
          const template = SCENE_TEMPLATES[name];
          const result = validateTemplatePresets(template);
          expect(result.valid).toBe(true);
          expect(result.errors).toHaveLength(0);
        }
      });

      it('should detect invalid camera preset', () => {
        const invalidTemplate: SceneTemplate = {
          name: 'invalid_test',
          role: 'opening',
          description: 'Test template with invalid camera',
          camera: 'non_existent_camera',
          layout: 'center_stack',
          timing: 'stickman_first',
        };
        const result = validateTemplatePresets(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Camera preset 'non_existent_camera' not found in L3 direction module");
      });

      it('should detect invalid layout preset', () => {
        const invalidTemplate: SceneTemplate = {
          name: 'invalid_test',
          role: 'opening',
          description: 'Test template with invalid layout',
          camera: 'static_full',
          layout: 'non_existent_layout',
          timing: 'stickman_first',
        };
        const result = validateTemplatePresets(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Layout preset 'non_existent_layout' not found in L3 direction module");
      });

      it('should detect invalid timing preset', () => {
        const invalidTemplate: SceneTemplate = {
          name: 'invalid_test',
          role: 'opening',
          description: 'Test template with invalid timing',
          camera: 'static_full',
          layout: 'center_stack',
          timing: 'non_existent_timing',
        };
        const result = validateTemplatePresets(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain("Timing preset 'non_existent_timing' not found in L3 direction module");
      });

      it('should detect multiple invalid presets', () => {
        const invalidTemplate: SceneTemplate = {
          name: 'invalid_test',
          role: 'opening',
          description: 'Test template with all invalid presets',
          camera: 'bad_camera',
          layout: 'bad_layout',
          timing: 'bad_timing',
        };
        const result = validateTemplatePresets(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors).toHaveLength(3);
      });
    });

    describe('validateAllTemplates', () => {
      it('should validate all templates successfully', () => {
        const result = validateAllTemplates();
        expect(result.valid).toBe(true);
        expect(Object.keys(result.results)).toHaveLength(16);
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
    describe('getSceneTemplate', () => {
      it('should return template for valid MVP name', () => {
        const template = getSceneTemplate('intro_greeting');
        expect(template).toBeDefined();
        expect(template?.name).toBe('intro_greeting');
      });

      it('should return template for valid V2 name', () => {
        const template = getSceneTemplate('intro_question');
        expect(template).toBeDefined();
        expect(template?.name).toBe('intro_question');
      });

      it('should return undefined for invalid name', () => {
        const template = getSceneTemplate('non_existent_template');
        expect(template).toBeUndefined();
      });
    });

    describe('hasSceneTemplate', () => {
      it('should return true for valid MVP template', () => {
        expect(hasSceneTemplate('intro_greeting')).toBe(true);
        expect(hasSceneTemplate('explain_default')).toBe(true);
        expect(hasSceneTemplate('emphasis_number')).toBe(true);
      });

      it('should return true for valid V2 template', () => {
        expect(hasSceneTemplate('intro_question')).toBe(true);
        expect(hasSceneTemplate('explain_with_visual')).toBe(true);
        expect(hasSceneTemplate('example_story')).toBe(true);
      });

      it('should return false for invalid template', () => {
        expect(hasSceneTemplate('invalid')).toBe(false);
        expect(hasSceneTemplate('')).toBe(false);
      });
    });

    describe('getTemplatesByRole', () => {
      it('should return 3 templates for role "opening" (MVP + V2)', () => {
        const templates = getTemplatesByRole('opening');
        expect(templates).toHaveLength(3);
        const names = templates.map(t => t.name);
        expect(names).toContain('intro_greeting');
        expect(names).toContain('intro_question');
        expect(names).toContain('intro_title_card');
      });

      it('should return 4 templates for role "explanation"', () => {
        const templates = getTemplatesByRole('explanation');
        expect(templates).toHaveLength(4);
        const names = templates.map(t => t.name);
        expect(names).toContain('explain_default');
        expect(names).toContain('explain_formula');
        expect(names).toContain('explain_reverse');
        expect(names).toContain('explain_with_visual');
      });

      it('should return 3 templates for role "emphasis"', () => {
        const templates = getTemplatesByRole('emphasis');
        expect(templates).toHaveLength(3);
        const names = templates.map(t => t.name);
        expect(names).toContain('emphasis_number');
        expect(names).toContain('emphasis_statement');
        expect(names).toContain('emphasis_spotlight');
      });

      it('should return 3 templates for role "comparison"', () => {
        const templates = getTemplatesByRole('comparison');
        expect(templates).toHaveLength(3);
        const names = templates.map(t => t.name);
        expect(names).toContain('compare_side_by_side');
        expect(names).toContain('compare_before_after');
        expect(names).toContain('compare_list');
      });

      it('should return 1 template for role "transition"', () => {
        const templates = getTemplatesByRole('transition');
        expect(templates).toHaveLength(1);
        expect(templates[0].name).toBe('transition_topic_change');
      });

      it('should return 2 templates for role "example" (V2 only)', () => {
        const templates = getTemplatesByRole('example');
        expect(templates).toHaveLength(2);
        const names = templates.map(t => t.name);
        expect(names).toContain('example_with_counter');
        expect(names).toContain('example_story');
      });

      it('should return 0 templates for unused roles', () => {
        expect(getTemplatesByRole('warning')).toHaveLength(0);
        expect(getTemplatesByRole('closing')).toHaveLength(0);
      });
    });
  });

  // ==========================================================================
  // Role Distribution
  // ==========================================================================
  describe('Role Distribution', () => {
    it('should have correct role distribution for 16 templates', () => {
      const roleCount: Record<string, number> = {};
      for (const template of Object.values(SCENE_TEMPLATES)) {
        roleCount[template.role] = (roleCount[template.role] || 0) + 1;
      }

      expect(roleCount['opening']).toBe(3);      // intro_greeting, intro_question, intro_title_card
      expect(roleCount['explanation']).toBe(4);  // explain_default, explain_formula, explain_reverse, explain_with_visual
      expect(roleCount['emphasis']).toBe(3);     // emphasis_number, emphasis_statement, emphasis_spotlight
      expect(roleCount['comparison']).toBe(3);   // compare_side_by_side, compare_before_after, compare_list
      expect(roleCount['transition']).toBe(1);   // transition_topic_change
      expect(roleCount['example']).toBe(2);      // example_with_counter, example_story
    });

    it('should have total of 16 templates across all roles', () => {
      const roleCount: Record<string, number> = {};
      for (const template of Object.values(SCENE_TEMPLATES)) {
        roleCount[template.role] = (roleCount[template.role] || 0) + 1;
      }
      const total = Object.values(roleCount).reduce((sum, count) => sum + count, 0);
      expect(total).toBe(16);
    });
  });
});
