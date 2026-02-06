/**
 * Camera Module Tests
 * Testing 15 camera presets (5 MVP + 5 V2 + 5 V3)
 */

import { describe, it, expect } from 'vitest';
import {
  CAMERA_PRESETS,
  CAMERA_NAMES,
  getCameraPreset,
  hasCameraPreset,
  calculateCameraState,
  MVP_CAMERA_NAMES,
  V2_CAMERA_NAMES,
  V3_CAMERA_NAMES,
} from '../camera';
import { CameraPreset, CameraKeyframe } from '../types';

describe('Camera Module', () => {
  // ==========================================================================
  // Preset Counts
  // ==========================================================================
  describe('Preset Counts', () => {
    it('should have exactly 15 camera presets', () => {
      expect(Object.keys(CAMERA_PRESETS)).toHaveLength(15);
    });

    it('should have 5 MVP presets', () => {
      expect(MVP_CAMERA_NAMES).toHaveLength(5);
    });

    it('should have 5 V2 presets', () => {
      expect(V2_CAMERA_NAMES).toHaveLength(5);
    });

    it('should have 5 V3 presets', () => {
      expect(V3_CAMERA_NAMES).toHaveLength(5);
    });

    it('should have CAMERA_NAMES array matching CAMERA_PRESETS keys', () => {
      expect(CAMERA_NAMES).toHaveLength(15);
      expect(CAMERA_NAMES.sort()).toEqual(Object.keys(CAMERA_PRESETS).sort());
    });
  });

  // ==========================================================================
  // MVP Camera Presets (5)
  // ==========================================================================
  describe('MVP Camera Presets', () => {
    const mvpPresets = ['static_full', 'static_closeup', 'static_wide', 'zoom_in_slow', 'zoom_in_fast'];

    mvpPresets.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in CAMERA_PRESETS', () => {
          expect(CAMERA_PRESETS[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(CAMERA_PRESETS[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(CAMERA_PRESETS[name].description).toBeDefined();
          expect(CAMERA_PRESETS[name].description.length).toBeGreaterThan(0);
        });

        it('should have at least 2 keyframes', () => {
          expect(CAMERA_PRESETS[name].keyframes.length).toBeGreaterThanOrEqual(2);
        });

        it('should have keyframes starting at 0%', () => {
          expect(CAMERA_PRESETS[name].keyframes[0].atPercent).toBe(0);
        });

        it('should have keyframes ending at 100%', () => {
          const kf = CAMERA_PRESETS[name].keyframes;
          expect(kf[kf.length - 1].atPercent).toBe(100);
        });
      });
    });

    describe('static_full', () => {
      it('should have zoom of 1.0 at both keyframes', () => {
        const preset = CAMERA_PRESETS['static_full'];
        preset.keyframes.forEach(kf => {
          expect(kf.zoom).toBe(1.0);
        });
      });

      it('should have no offset', () => {
        const preset = CAMERA_PRESETS['static_full'];
        preset.keyframes.forEach(kf => {
          expect(kf.offsetX).toBe(0);
          expect(kf.offsetY).toBe(0);
        });
      });
    });

    describe('static_closeup', () => {
      it('should have zoom of 1.3', () => {
        const preset = CAMERA_PRESETS['static_closeup'];
        preset.keyframes.forEach(kf => {
          expect(kf.zoom).toBe(1.3);
        });
      });
    });

    describe('static_wide', () => {
      it('should have zoom of 0.8', () => {
        const preset = CAMERA_PRESETS['static_wide'];
        preset.keyframes.forEach(kf => {
          expect(kf.zoom).toBe(0.8);
        });
      });
    });

    describe('zoom_in_slow', () => {
      it('should zoom from 1.0 to 1.2', () => {
        const preset = CAMERA_PRESETS['zoom_in_slow'];
        expect(preset.keyframes[0].zoom).toBe(1.0);
        expect(preset.keyframes[preset.keyframes.length - 1].zoom).toBe(1.2);
      });
    });

    describe('zoom_in_fast', () => {
      it('should have 3 keyframes for fast effect', () => {
        const preset = CAMERA_PRESETS['zoom_in_fast'];
        expect(preset.keyframes.length).toBe(3);
      });

      it('should zoom to 1.3 by 20%', () => {
        const preset = CAMERA_PRESETS['zoom_in_fast'];
        expect(preset.keyframes[1].atPercent).toBe(20);
        expect(preset.keyframes[1].zoom).toBe(1.3);
      });
    });
  });

  // ==========================================================================
  // V2 Camera Presets (5)
  // ==========================================================================
  describe('V2 Camera Presets', () => {
    const v2Presets = ['zoom_out_reveal', 'zoom_pulse', 'pan_left_to_right', 'pan_right_to_left', 'dolly_in'];

    v2Presets.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in CAMERA_PRESETS', () => {
          expect(CAMERA_PRESETS[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(CAMERA_PRESETS[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(CAMERA_PRESETS[name].description).toBeDefined();
        });

        it('should have valid keyframes', () => {
          const preset = CAMERA_PRESETS[name];
          expect(preset.keyframes[0].atPercent).toBe(0);
          expect(preset.keyframes[preset.keyframes.length - 1].atPercent).toBe(100);
        });
      });
    });

    describe('zoom_out_reveal', () => {
      it('should zoom from 1.3 to 1.0', () => {
        const preset = CAMERA_PRESETS['zoom_out_reveal'];
        expect(preset.keyframes[0].zoom).toBe(1.3);
        expect(preset.keyframes[preset.keyframes.length - 1].zoom).toBe(1.0);
      });
    });

    describe('zoom_pulse', () => {
      it('should have multiple keyframes for pulse effect', () => {
        const preset = CAMERA_PRESETS['zoom_pulse'];
        expect(preset.keyframes.length).toBeGreaterThanOrEqual(4);
      });

      it('should return to zoom 1.0 at end', () => {
        const preset = CAMERA_PRESETS['zoom_pulse'];
        expect(preset.keyframes[preset.keyframes.length - 1].zoom).toBe(1.0);
      });
    });

    describe('pan_left_to_right', () => {
      it('should pan from negative to positive offsetX', () => {
        const preset = CAMERA_PRESETS['pan_left_to_right'];
        expect(preset.keyframes[0].offsetX).toBeLessThan(0);
        expect(preset.keyframes[preset.keyframes.length - 1].offsetX).toBeGreaterThan(0);
      });
    });

    describe('pan_right_to_left', () => {
      it('should pan from positive to negative offsetX', () => {
        const preset = CAMERA_PRESETS['pan_right_to_left'];
        expect(preset.keyframes[0].offsetX).toBeGreaterThan(0);
        expect(preset.keyframes[preset.keyframes.length - 1].offsetX).toBeLessThan(0);
      });
    });

    describe('dolly_in', () => {
      it('should combine zoom and vertical pan', () => {
        const preset = CAMERA_PRESETS['dolly_in'];
        expect(preset.keyframes[0].zoom).toBeLessThan(preset.keyframes[preset.keyframes.length - 1].zoom);
        expect(preset.keyframes[0].offsetY).toBeGreaterThan(preset.keyframes[preset.keyframes.length - 1].offsetY);
      });
    });
  });

  // ==========================================================================
  // V3 Camera Presets (5)
  // ==========================================================================
  describe('V3 Camera Presets', () => {
    const v3Presets = ['pan_follow_stickman', 'reveal_pan_zoom', 'shake', 'zoom_breathe', 'cinematic_sweep'];

    v3Presets.forEach((name) => {
      describe(`${name}`, () => {
        it('should exist in CAMERA_PRESETS', () => {
          expect(CAMERA_PRESETS[name]).toBeDefined();
        });

        it('should have correct name property', () => {
          expect(CAMERA_PRESETS[name].name).toBe(name);
        });

        it('should have description', () => {
          expect(CAMERA_PRESETS[name].description).toBeDefined();
        });

        it('should have valid keyframe structure', () => {
          const preset = CAMERA_PRESETS[name];
          preset.keyframes.forEach((kf) => {
            expect(kf.atPercent).toBeGreaterThanOrEqual(0);
            expect(kf.atPercent).toBeLessThanOrEqual(100);
            expect(typeof kf.zoom).toBe('number');
            expect(typeof kf.offsetX).toBe('number');
            expect(typeof kf.offsetY).toBe('number');
            expect(kf.easing).toBeDefined();
          });
        });
      });
    });

    describe('pan_follow_stickman', () => {
      it('should be marked as dynamic', () => {
        const preset = CAMERA_PRESETS['pan_follow_stickman'];
        expect(preset.isDynamic).toBe(true);
      });
    });

    describe('reveal_pan_zoom', () => {
      it('should have 3 keyframes', () => {
        const preset = CAMERA_PRESETS['reveal_pan_zoom'];
        expect(preset.keyframes.length).toBe(3);
      });

      it('should start zoomed in and end at normal', () => {
        const preset = CAMERA_PRESETS['reveal_pan_zoom'];
        expect(preset.keyframes[0].zoom).toBeGreaterThan(1.0);
        expect(preset.keyframes[preset.keyframes.length - 1].zoom).toBe(1.0);
      });
    });

    describe('shake', () => {
      it('should have many keyframes for shake effect', () => {
        const preset = CAMERA_PRESETS['shake'];
        expect(preset.keyframes.length).toBeGreaterThanOrEqual(8);
      });

      it('should return to neutral position at end', () => {
        const preset = CAMERA_PRESETS['shake'];
        const lastKf = preset.keyframes[preset.keyframes.length - 1];
        expect(lastKf.offsetX).toBe(0);
        expect(lastKf.offsetY).toBe(0);
        expect(lastKf.zoom).toBe(1.0);
      });
    });

    describe('zoom_breathe', () => {
      it('should have subtle zoom variations', () => {
        const preset = CAMERA_PRESETS['zoom_breathe'];
        const zooms = preset.keyframes.map(kf => kf.zoom);
        const maxZoom = Math.max(...zooms);
        const minZoom = Math.min(...zooms);
        expect(maxZoom - minZoom).toBeLessThanOrEqual(0.1);
      });
    });

    describe('cinematic_sweep', () => {
      it('should have 4 keyframes', () => {
        const preset = CAMERA_PRESETS['cinematic_sweep'];
        expect(preset.keyframes.length).toBe(4);
      });

      it('should end at neutral position', () => {
        const preset = CAMERA_PRESETS['cinematic_sweep'];
        const lastKf = preset.keyframes[preset.keyframes.length - 1];
        expect(lastKf.zoom).toBe(1.0);
        expect(lastKf.offsetX).toBe(0);
        expect(lastKf.offsetY).toBe(0);
      });
    });
  });

  // ==========================================================================
  // Helper Functions
  // ==========================================================================
  describe('Helper Functions', () => {
    describe('getCameraPreset', () => {
      it('should return preset for valid name', () => {
        const preset = getCameraPreset('static_full');
        expect(preset).toBeDefined();
        expect(preset?.name).toBe('static_full');
      });

      it('should return undefined for invalid name', () => {
        const preset = getCameraPreset('non_existent_preset');
        expect(preset).toBeUndefined();
      });
    });

    describe('hasCameraPreset', () => {
      it('should return true for valid preset', () => {
        expect(hasCameraPreset('static_full')).toBe(true);
        expect(hasCameraPreset('zoom_in_slow')).toBe(true);
        expect(hasCameraPreset('shake')).toBe(true);
      });

      it('should return false for invalid preset', () => {
        expect(hasCameraPreset('invalid')).toBe(false);
        expect(hasCameraPreset('')).toBe(false);
      });
    });

    describe('calculateCameraState', () => {
      it('should return start state at progress 0', () => {
        const preset = CAMERA_PRESETS['static_full'];
        const state = calculateCameraState(preset, 0);
        expect(state.zoom).toBe(1.0);
        expect(state.offsetX).toBe(0);
        expect(state.offsetY).toBe(0);
      });

      it('should return end state at progress 1', () => {
        const preset = CAMERA_PRESETS['zoom_in_slow'];
        const state = calculateCameraState(preset, 1);
        expect(state.zoom).toBeCloseTo(1.2, 1);
      });

      it('should interpolate correctly at progress 0.5', () => {
        const preset = CAMERA_PRESETS['zoom_in_slow'];
        const state = calculateCameraState(preset, 0.5);
        // Should be between 1.0 and 1.2
        expect(state.zoom).toBeGreaterThan(1.0);
        expect(state.zoom).toBeLessThan(1.2);
      });

      it('should clamp progress to valid range', () => {
        const preset = CAMERA_PRESETS['static_full'];
        const stateNegative = calculateCameraState(preset, -0.5);
        const stateOver = calculateCameraState(preset, 1.5);
        expect(stateNegative.zoom).toBe(1.0);
        expect(stateOver.zoom).toBe(1.0);
      });

      it('should handle pan presets correctly', () => {
        const preset = CAMERA_PRESETS['pan_left_to_right'];
        const stateStart = calculateCameraState(preset, 0);
        const stateEnd = calculateCameraState(preset, 1);
        expect(stateStart.offsetX).toBeLessThan(0);
        expect(stateEnd.offsetX).toBeGreaterThan(0);
      });
    });
  });

  // ==========================================================================
  // Keyframe Validation
  // ==========================================================================
  describe('Keyframe Validation', () => {
    Object.entries(CAMERA_PRESETS).forEach(([name, preset]) => {
      describe(`${name} keyframes`, () => {
        it('should have atPercent values in ascending order', () => {
          for (let i = 1; i < preset.keyframes.length; i++) {
            expect(preset.keyframes[i].atPercent).toBeGreaterThanOrEqual(
              preset.keyframes[i - 1].atPercent
            );
          }
        });

        it('should have valid easing values', () => {
          const validEasings = [
            'linear', 'easeIn', 'easeOut', 'easeInOut',
            'easeInQuad', 'easeOutQuad', 'easeInOutQuad',
            'easeInCubic', 'easeOutCubic', 'easeInOutCubic',
            'easeOutBack', 'spring'
          ];
          preset.keyframes.forEach((kf) => {
            expect(validEasings).toContain(kf.easing);
          });
        });

        it('should have reasonable zoom values (0.5 to 2.0)', () => {
          preset.keyframes.forEach((kf) => {
            expect(kf.zoom).toBeGreaterThanOrEqual(0.5);
            expect(kf.zoom).toBeLessThanOrEqual(2.0);
          });
        });

        it('should have reasonable offset values (-500 to 500)', () => {
          preset.keyframes.forEach((kf) => {
            expect(kf.offsetX).toBeGreaterThanOrEqual(-500);
            expect(kf.offsetX).toBeLessThanOrEqual(500);
            expect(kf.offsetY).toBeGreaterThanOrEqual(-500);
            expect(kf.offsetY).toBeLessThanOrEqual(500);
          });
        });
      });
    });
  });
});
