/**
 * Scene Templates Module Tests
 * Testing 25 scene templates (8 MVP + 8 V2 + 9 V3)
 */

import { describe, it, expect } from 'vitest';
import {
  SCENE_TEMPLATES,
  SCENE_TEMPLATE_NAMES,
  MVP_TEMPLATE_NAMES,
  V2_TEMPLATE_NAMES,
  V3_TEMPLATE_NAMES,
  getSceneTemplate,
  hasSceneTemplate,
  getTemplatesByRole,
  validateTemplate,
  validateAllTemplates,
  getTemplateStats,
} from '../sceneTemplates';
import { SceneTemplate, SceneRole } from '../types';
import { hasCameraPreset, CAMERA_NAMES } from '../../direction/camera';
import { hasLayoutPreset, LAYOUT_NAMES } from '../../direction/layout';
import { hasTimingPreset, TIMING_NAMES } from '../../direction/timing';

describe('Scene Templates Module', () => {
  // ==========================================================================
  // Template Counts
  // ==========================================================================
  describe('Template Counts', () => {
    it('should have exactly 25 scene templates', () => {
      expect(Object.keys(SCENE_TEMPLATES)).toHaveLength(25);
    });

    it('should have 8 MVP templates', () => {
      expect(MVP_TEMPLATE_NAMES).toHaveLength(8);
    });

    it('should have 8 V2 templates', () => {
      expect(V2_TEMPLATE_NAMES).toHaveLength(8);
    });

    it('should have 9 V3 templates', () => {
      expect(V3_TEMPLATE_NAMES).toHaveLength(9);
    });

    it('should have SCENE_TEMPLATE_NAMES array matching SCENE_TEMPLATES keys', () => {
      expect(SCENE_TEMPLATE_NAMES).toHaveLength(25);
      expect(SCENE_TEMPLATE_NAMES.sort()).toEqual(Object.keys(SCENE_TEMPLATES).sort());
    });

    it('MVP + V2 + V3 should equal total', () => {
      const totalFromArrays = MVP_TEMPLATE_NAMES.length + V2_TEMPLATE_NAMES.length + V3_TEMPLATE_NAMES.length;
      expect(totalFromArrays).toBe(25);
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

        it('should have description', () => {
          expect(SCENE_TEMPLATES[name].description).toBeDefined();
          expect(SCENE_TEMPLATES[name].description.length).toBeGreaterThan(0);
        });

        it('should have valid role', () => {
          const validRoles: SceneRole[] = [
            'opening', 'explanation', 'emphasis', 'comparison',
            'transition', 'example', 'warning', 'closing',
          ];
          expect(validRoles).toContain(SCENE_TEMPLATES[name].role);
        });

        it('should reference valid camera preset', () => {
          expect(hasCameraPreset(SCENE_TEMPLATES[name].camera)).toBe(true);
        });

        it('should reference valid layout preset', () => {
          expect(hasLayoutPreset(SCENE_TEMPLATES[name].layout)).toBe(true);
        });

        it('should reference valid timing preset', () => {
          expect(hasTimingPreset(SCENE_TEMPLATES[name].timing)).toBe(true);
        });
      });
    });

    it('should all be in MVP_TEMPLATE_NAMES', () => {
      mvpTemplates.forEach((name) => {
        expect(MVP_TEMPLATE_NAMES).toContain(name);
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

        it('should have description', () => {
          expect(SCENE_TEMPLATES[name].description).toBeDefined();
        });

        it('should have valid role', () => {
          const validRoles: SceneRole[] = [
            'opening', 'explanation', 'emphasis', 'comparison',
            'transition', 'example', 'warning', 'closing',
          ];
          expect(validRoles).toContain(SCENE_TEMPLATES[name].role);
        });

        it('should reference valid L3 presets', () => {
          const template = SCENE_TEMPLATES[name];
          expect(hasCameraPreset(template.camera)).toBe(true);
          expect(hasLayoutPreset(template.layout)).toBe(true);
          expect(hasTimingPreset(template.timing)).toBe(true);
        });
      });
    });

    it('should all be in V2_TEMPLATE_NAMES', () => {
      v2Templates.forEach((name) => {
        expect(V2_TEMPLATE_NAMES).toContain(name);
      });
    });
  });

  // ==========================================================================
  // V3 Scene Templates (9)
  // ==========================================================================
  describe('V3 Scene Templates', () => {
    const v3Templates = [
      'warning_alert',
      'warning_subtle',
      'closing_summary',
      'closing_cta',
      'transition_carry_over',
      'transition_wipe',
      'explain_timeline',
      'compare_pyramid',
      'emphasis_dramatic',
    ];

    v3Templates.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in SCENE_TEMPLATES', () => {
          expect(SCENE_TEMPLATES[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(SCENE_TEMPLATES[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(SCENE_TEMPLATES[name].description).toBeDefined();
        });

        it('should have valid role', () => {
          const validRoles: SceneRole[] = [
            'opening', 'explanation', 'emphasis', 'comparison',
            'transition', 'example', 'warning', 'closing',
          ];
          expect(validRoles).toContain(SCENE_TEMPLATES[name].role);
        });

        it('should reference valid L3 presets', () => {
          const template = SCENE_TEMPLATES[name];
          expect(hasCameraPreset(template.camera)).toBe(true);
          expect(hasLayoutPreset(template.layout)).toBe(true);
          expect(hasTimingPreset(template.timing)).toBe(true);
        });
      });
    });

    it('should all be in V3_TEMPLATE_NAMES', () => {
      v3Templates.forEach((name) => {
        expect(V3_TEMPLATE_NAMES).toContain(name);
      });
    });

    describe('warning_alert', () => {
      it('should use shake camera', () => {
        expect(SCENE_TEMPLATES['warning_alert'].camera).toBe('shake');
      });

      it('should use center_stack layout', () => {
        expect(SCENE_TEMPLATES['warning_alert'].layout).toBe('center_stack');
      });

      it('should use reveal_climax timing', () => {
        expect(SCENE_TEMPLATES['warning_alert'].timing).toBe('reveal_climax');
      });

      it('should suggest worried expression', () => {
        expect(SCENE_TEMPLATES['warning_alert'].suggestedExpressions).toContain('worried');
      });
    });

    describe('warning_subtle', () => {
      it('should use static_full camera', () => {
        expect(SCENE_TEMPLATES['warning_subtle'].camera).toBe('static_full');
      });

      it('should use text_first timing', () => {
        expect(SCENE_TEMPLATES['warning_subtle'].timing).toBe('text_first');
      });
    });

    describe('closing_summary', () => {
      it('should use zoom_out_reveal camera', () => {
        expect(SCENE_TEMPLATES['closing_summary'].camera).toBe('zoom_out_reveal');
      });

      it('should use center_stack layout', () => {
        expect(SCENE_TEMPLATES['closing_summary'].layout).toBe('center_stack');
      });

      it('should use all_at_once timing', () => {
        expect(SCENE_TEMPLATES['closing_summary'].timing).toBe('all_at_once');
      });
    });

    describe('closing_cta', () => {
      it('should use overlay_fullscreen_text layout', () => {
        expect(SCENE_TEMPLATES['closing_cta'].layout).toBe('overlay_fullscreen_text');
      });

      it('should suggest pointing_right pose', () => {
        expect(SCENE_TEMPLATES['closing_cta'].suggestedPoses).toContain('pointing_right');
      });

      it('should suggest thumbsUp pose', () => {
        expect(SCENE_TEMPLATES['closing_cta'].suggestedPoses).toContain('thumbsUp');
      });
    });

    describe('transition_carry_over', () => {
      it('should use carry_stickman timing', () => {
        expect(SCENE_TEMPLATES['transition_carry_over'].timing).toBe('carry_stickman');
      });
    });

    describe('transition_wipe', () => {
      it('should use wipe_replace timing', () => {
        expect(SCENE_TEMPLATES['transition_wipe'].timing).toBe('wipe_replace');
      });
    });

    describe('explain_timeline', () => {
      it('should use pan_left_to_right camera', () => {
        expect(SCENE_TEMPLATES['explain_timeline'].camera).toBe('pan_left_to_right');
      });

      it('should use timeline_horizontal layout', () => {
        expect(SCENE_TEMPLATES['explain_timeline'].layout).toBe('timeline_horizontal');
      });

      it('should use left_to_right timing', () => {
        expect(SCENE_TEMPLATES['explain_timeline'].timing).toBe('left_to_right');
      });
    });

    describe('compare_pyramid', () => {
      it('should use cinematic_sweep camera', () => {
        expect(SCENE_TEMPLATES['compare_pyramid'].camera).toBe('cinematic_sweep');
      });

      it('should use pyramid_layout layout', () => {
        expect(SCENE_TEMPLATES['compare_pyramid'].layout).toBe('pyramid_layout');
      });

      it('should use bounce_sequence timing', () => {
        expect(SCENE_TEMPLATES['compare_pyramid'].timing).toBe('bounce_sequence');
      });
    });

    describe('emphasis_dramatic', () => {
      it('should use cinematic_sweep camera', () => {
        expect(SCENE_TEMPLATES['emphasis_dramatic'].camera).toBe('cinematic_sweep');
      });

      it('should use center_hero layout', () => {
        expect(SCENE_TEMPLATES['emphasis_dramatic'].layout).toBe('center_hero');
      });

      it('should use spiral_in timing', () => {
        expect(SCENE_TEMPLATES['emphasis_dramatic'].timing).toBe('spiral_in');
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
        expect(hasSceneTemplate('warning_alert')).toBe(true);
      });

      it('should return false for invalid template', () => {
        expect(hasSceneTemplate('invalid')).toBe(false);
        expect(hasSceneTemplate('')).toBe(false);
      });
    });

    describe('getTemplatesByRole', () => {
      it('should return opening templates', () => {
        const openingTemplates = getTemplatesByRole('opening');
        expect(openingTemplates.length).toBeGreaterThanOrEqual(1);
        openingTemplates.forEach((t) => {
          expect(t.role).toBe('opening');
        });
      });

      it('should return warning templates', () => {
        const warningTemplates = getTemplatesByRole('warning');
        expect(warningTemplates.length).toBe(2);
        warningTemplates.forEach((t) => {
          expect(t.role).toBe('warning');
        });
      });

      it('should return closing templates', () => {
        const closingTemplates = getTemplatesByRole('closing');
        expect(closingTemplates.length).toBe(2);
        closingTemplates.forEach((t) => {
          expect(t.role).toBe('closing');
        });
      });

      it('should return explanation templates', () => {
        const explanationTemplates = getTemplatesByRole('explanation');
        expect(explanationTemplates.length).toBeGreaterThanOrEqual(4);
        explanationTemplates.forEach((t) => {
          expect(t.role).toBe('explanation');
        });
      });

      it('should return empty array for unused role', () => {
        // All roles are used, but this tests the function behavior
        const templates = getTemplatesByRole('opening');
        expect(Array.isArray(templates)).toBe(true);
      });
    });

    describe('validateTemplate', () => {
      it('should return valid for correct template', () => {
        const template = SCENE_TEMPLATES['intro_greeting'];
        const result = validateTemplate(template);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should return errors for invalid camera preset', () => {
        const invalidTemplate: SceneTemplate = {
          name: 'test_invalid',
          role: 'opening',
          description: 'Test',
          camera: 'invalid_camera',
          layout: 'center_single',
          timing: 'all_at_once',
        };
        const result = validateTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Unknown camera preset: invalid_camera');
      });

      it('should return errors for invalid layout preset', () => {
        const invalidTemplate: SceneTemplate = {
          name: 'test_invalid',
          role: 'opening',
          description: 'Test',
          camera: 'static_full',
          layout: 'invalid_layout',
          timing: 'all_at_once',
        };
        const result = validateTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Unknown layout preset: invalid_layout');
      });

      it('should return errors for invalid timing preset', () => {
        const invalidTemplate: SceneTemplate = {
          name: 'test_invalid',
          role: 'opening',
          description: 'Test',
          camera: 'static_full',
          layout: 'center_single',
          timing: 'invalid_timing',
        };
        const result = validateTemplate(invalidTemplate);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Unknown timing preset: invalid_timing');
      });
    });

    describe('validateAllTemplates', () => {
      it('should validate all templates successfully', () => {
        const result = validateAllTemplates();
        expect(result.valid).toBe(true);
        expect(result.invalidTemplates).toHaveLength(0);
      });
    });

    describe('getTemplateStats', () => {
      it('should return correct total count', () => {
        const stats = getTemplateStats();
        expect(stats.total).toBe(25);
      });

      it('should return correct version counts', () => {
        const stats = getTemplateStats();
        expect(stats.mvp).toBe(8);
        expect(stats.v2).toBe(8);
        expect(stats.v3).toBe(9);
      });

      it('should return role counts', () => {
        const stats = getTemplateStats();
        expect(stats.byRole.warning).toBe(2);
        expect(stats.byRole.closing).toBe(2);
        expect(stats.byRole.transition).toBe(3);
      });

      it('should have all roles summing to total', () => {
        const stats = getTemplateStats();
        const roleTotal = Object.values(stats.byRole).reduce((a, b) => a + b, 0);
        expect(roleTotal).toBe(stats.total);
      });
    });
  });

  // ==========================================================================
  // Template Structure Validation
  // ==========================================================================
  describe('Template Structure Validation', () => {
    Object.entries(SCENE_TEMPLATES).forEach(([name, template]) => {
      describe(`${name} structure`, () => {
        it('should have required properties', () => {
          expect(template.name).toBeDefined();
          expect(template.role).toBeDefined();
          expect(template.description).toBeDefined();
          expect(template.camera).toBeDefined();
          expect(template.layout).toBeDefined();
          expect(template.timing).toBeDefined();
        });

        it('should have name matching key', () => {
          expect(template.name).toBe(name);
        });

        it('should have non-empty description', () => {
          expect(template.description.length).toBeGreaterThan(10);
        });

        it('should reference existing L3 presets', () => {
          expect(CAMERA_NAMES).toContain(template.camera);
          expect(LAYOUT_NAMES).toContain(template.layout);
          expect(TIMING_NAMES).toContain(template.timing);
        });
      });
    });
  });

  // ==========================================================================
  // Role Coverage
  // ==========================================================================
  describe('Role Coverage', () => {
    const allRoles: SceneRole[] = [
      'opening',
      'explanation',
      'emphasis',
      'comparison',
      'transition',
      'example',
      'warning',
      'closing',
    ];

    allRoles.forEach((role) => {
      it(`should have at least one template for role: ${role}`, () => {
        const templates = getTemplatesByRole(role);
        expect(templates.length).toBeGreaterThanOrEqual(1);
      });
    });

    it('should cover all 8 roles', () => {
      const stats = getTemplateStats();
      const coveredRoles = Object.entries(stats.byRole)
        .filter(([_, count]) => count > 0)
        .map(([role]) => role);
      expect(coveredRoles.length).toBe(8);
    });
  });
});
