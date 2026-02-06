/**
 * Scene Templates Module Tests
 * Testing 8 MVP scene templates (Layer 4)
 */

import { describe, it, expect } from 'vitest';
import {
  SCENE_TEMPLATES,
  SCENE_TEMPLATE_NAMES,
  MVP_TEMPLATE_NAMES,
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
    it('should have exactly 8 MVP scene templates', () => {
      expect(Object.keys(SCENE_TEMPLATES)).toHaveLength(8);
    });

    it('should have 8 MVP template names', () => {
      expect(MVP_TEMPLATE_NAMES).toHaveLength(8);
    });

    it('should have SCENE_TEMPLATE_NAMES array matching SCENE_TEMPLATES keys', () => {
      expect(SCENE_TEMPLATE_NAMES).toHaveLength(8);
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

    // Specific template tests
    describe('intro_greeting', () => {
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

    describe('explain_default', () => {
      const template = SCENE_TEMPLATES['explain_default'];

      it('should have role "explanation"', () => {
        expect(template.role).toBe('explanation');
      });

      it('should use static_full camera', () => {
        expect(template.camera).toBe('static_full');
      });

      it('should use split_left_stickman layout', () => {
        expect(template.layout).toBe('split_left_stickman');
      });

      it('should use stickman_first timing', () => {
        expect(template.timing).toBe('stickman_first');
      });
    });

    describe('explain_formula', () => {
      const template = SCENE_TEMPLATES['explain_formula'];

      it('should have role "explanation"', () => {
        expect(template.role).toBe('explanation');
      });

      it('should use static_closeup camera', () => {
        expect(template.camera).toBe('static_closeup');
      });

      it('should use center_stack layout', () => {
        expect(template.layout).toBe('center_stack');
      });

      it('should use text_first timing', () => {
        expect(template.timing).toBe('text_first');
      });
    });

    describe('explain_reverse', () => {
      const template = SCENE_TEMPLATES['explain_reverse'];

      it('should have role "explanation"', () => {
        expect(template.role).toBe('explanation');
      });

      it('should use static_full camera', () => {
        expect(template.camera).toBe('static_full');
      });

      it('should use split_right_stickman layout', () => {
        expect(template.layout).toBe('split_right_stickman');
      });

      it('should use text_first timing', () => {
        expect(template.timing).toBe('text_first');
      });
    });

    describe('emphasis_number', () => {
      const template = SCENE_TEMPLATES['emphasis_number'];

      it('should have role "emphasis"', () => {
        expect(template.role).toBe('emphasis');
      });

      it('should use zoom_in_fast camera', () => {
        expect(template.camera).toBe('zoom_in_fast');
      });

      it('should use center_stack layout', () => {
        expect(template.layout).toBe('center_stack');
      });

      it('should use reveal_climax timing', () => {
        expect(template.timing).toBe('reveal_climax');
      });
    });

    describe('emphasis_statement', () => {
      const template = SCENE_TEMPLATES['emphasis_statement'];

      it('should have role "emphasis"', () => {
        expect(template.role).toBe('emphasis');
      });

      it('should use zoom_in_slow camera', () => {
        expect(template.camera).toBe('zoom_in_slow');
      });

      it('should use overlay_fullscreen_text layout', () => {
        expect(template.layout).toBe('overlay_fullscreen_text');
      });

      it('should use all_at_once timing', () => {
        expect(template.timing).toBe('all_at_once');
      });
    });

    describe('compare_side_by_side', () => {
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

      it('should use all_at_once_stagger timing', () => {
        expect(template.timing).toBe('all_at_once_stagger');
      });
    });

    describe('transition_topic_change', () => {
      const template = SCENE_TEMPLATES['transition_topic_change'];

      it('should have role "transition"', () => {
        expect(template.role).toBe('transition');
      });

      it('should use static_full camera', () => {
        expect(template.camera).toBe('static_full');
      });

      it('should use center_single layout', () => {
        expect(template.layout).toBe('center_single');
      });

      it('should use all_at_once timing', () => {
        expect(template.timing).toBe('all_at_once');
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
        expect(Object.keys(result.results)).toHaveLength(8);
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
      it('should return template for valid name', () => {
        const template = getSceneTemplate('intro_greeting');
        expect(template).toBeDefined();
        expect(template?.name).toBe('intro_greeting');
      });

      it('should return undefined for invalid name', () => {
        const template = getSceneTemplate('non_existent_template');
        expect(template).toBeUndefined();
      });
    });

    describe('hasSceneTemplate', () => {
      it('should return true for valid template', () => {
        expect(hasSceneTemplate('intro_greeting')).toBe(true);
        expect(hasSceneTemplate('explain_default')).toBe(true);
        expect(hasSceneTemplate('emphasis_number')).toBe(true);
      });

      it('should return false for invalid template', () => {
        expect(hasSceneTemplate('invalid')).toBe(false);
        expect(hasSceneTemplate('')).toBe(false);
      });
    });

    describe('getTemplatesByRole', () => {
      it('should return 1 template for role "opening"', () => {
        const templates = getTemplatesByRole('opening');
        expect(templates).toHaveLength(1);
        expect(templates[0].name).toBe('intro_greeting');
      });

      it('should return 3 templates for role "explanation"', () => {
        const templates = getTemplatesByRole('explanation');
        expect(templates).toHaveLength(3);
        const names = templates.map(t => t.name);
        expect(names).toContain('explain_default');
        expect(names).toContain('explain_formula');
        expect(names).toContain('explain_reverse');
      });

      it('should return 2 templates for role "emphasis"', () => {
        const templates = getTemplatesByRole('emphasis');
        expect(templates).toHaveLength(2);
        const names = templates.map(t => t.name);
        expect(names).toContain('emphasis_number');
        expect(names).toContain('emphasis_statement');
      });

      it('should return 1 template for role "comparison"', () => {
        const templates = getTemplatesByRole('comparison');
        expect(templates).toHaveLength(1);
        expect(templates[0].name).toBe('compare_side_by_side');
      });

      it('should return 1 template for role "transition"', () => {
        const templates = getTemplatesByRole('transition');
        expect(templates).toHaveLength(1);
        expect(templates[0].name).toBe('transition_topic_change');
      });

      it('should return 0 templates for unused roles', () => {
        expect(getTemplatesByRole('example')).toHaveLength(0);
        expect(getTemplatesByRole('warning')).toHaveLength(0);
        expect(getTemplatesByRole('closing')).toHaveLength(0);
      });
    });
  });

  // ==========================================================================
  // Role Distribution
  // ==========================================================================
  describe('Role Distribution', () => {
    it('should have correct role distribution', () => {
      const roleCount: Record<string, number> = {};
      for (const template of Object.values(SCENE_TEMPLATES)) {
        roleCount[template.role] = (roleCount[template.role] || 0) + 1;
      }

      expect(roleCount['opening']).toBe(1);
      expect(roleCount['explanation']).toBe(3);
      expect(roleCount['emphasis']).toBe(2);
      expect(roleCount['comparison']).toBe(1);
      expect(roleCount['transition']).toBe(1);
    });
  });
});
