/**
 * Camera Presets Tests
 */

import { describe, it, expect } from 'vitest';
import {
  CAMERA_PRESETS,
  CAMERA_PRESET_NAMES,
  MVP_CAMERA_PRESET_NAMES,
  V2_CAMERA_PRESET_NAMES,
  getCameraPreset,
  DEFAULT_CAMERA_PRESET,
} from '../camera';
import { CameraPresetName } from '../types';

describe('Camera Presets', () => {
  describe('Preset Counts', () => {
    it('should have exactly 10 camera presets', () => {
      expect(Object.keys(CAMERA_PRESETS).length).toBe(10);
    });

    it('should have exactly 10 preset names in array', () => {
      expect(CAMERA_PRESET_NAMES.length).toBe(10);
    });

    it('should have 5 MVP presets', () => {
      expect(MVP_CAMERA_PRESET_NAMES.length).toBe(5);
    });

    it('should have 5 V2 presets', () => {
      expect(V2_CAMERA_PRESET_NAMES.length).toBe(5);
    });
  });

  describe('MVP Presets (5)', () => {
    const mvpPresets: CameraPresetName[] = [
      'static_full',
      'static_closeup',
      'static_wide',
      'zoom_in_slow',
      'zoom_in_fast',
    ];

    mvpPresets.forEach((presetName) => {
      it(`should have MVP preset: ${presetName}`, () => {
        expect(CAMERA_PRESETS[presetName]).toBeDefined();
        expect(CAMERA_PRESETS[presetName].name).toBe(presetName);
      });
    });
  });

  describe('V2 Presets (5)', () => {
    const v2Presets: CameraPresetName[] = [
      'zoom_out_reveal',
      'zoom_pulse',
      'pan_left_to_right',
      'pan_right_to_left',
      'dolly_in',
    ];

    v2Presets.forEach((presetName) => {
      it(`should have V2 preset: ${presetName}`, () => {
        expect(CAMERA_PRESETS[presetName]).toBeDefined();
        expect(CAMERA_PRESETS[presetName].name).toBe(presetName);
      });
    });
  });

  describe('Preset Structure', () => {
    Object.entries(CAMERA_PRESETS).forEach(([name, preset]) => {
      describe(`Preset: ${name}`, () => {
        it('should have a name property', () => {
          expect(preset.name).toBe(name);
        });

        it('should have at least 2 keyframes', () => {
          expect(preset.keyframes.length).toBeGreaterThanOrEqual(2);
        });

        it('should start at 0%', () => {
          expect(preset.keyframes[0].atPercent).toBe(0);
        });

        it('should end at 100%', () => {
          expect(preset.keyframes[preset.keyframes.length - 1].atPercent).toBe(100);
        });

        preset.keyframes.forEach((keyframe, index) => {
          it(`keyframe ${index} should have valid zoom (0.5-2.0)`, () => {
            expect(keyframe.zoom).toBeGreaterThanOrEqual(0.5);
            expect(keyframe.zoom).toBeLessThanOrEqual(2.0);
          });

          it(`keyframe ${index} should have numeric offsetX`, () => {
            expect(typeof keyframe.offsetX).toBe('number');
          });

          it(`keyframe ${index} should have numeric offsetY`, () => {
            expect(typeof keyframe.offsetY).toBe('number');
          });

          it(`keyframe ${index} should have easing string`, () => {
            expect(typeof keyframe.easing).toBe('string');
            expect(keyframe.easing.length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  describe('getCameraPreset', () => {
    it('should return correct preset by name', () => {
      expect(getCameraPreset('static_full').name).toBe('static_full');
      expect(getCameraPreset('zoom_pulse').name).toBe('zoom_pulse');
    });

    it('should return static_full for unknown preset', () => {
      expect(getCameraPreset('unknown_preset').name).toBe('static_full');
    });

    it('should return static_full for empty string', () => {
      expect(getCameraPreset('').name).toBe('static_full');
    });
  });

  describe('DEFAULT_CAMERA_PRESET', () => {
    it('should be static_full', () => {
      expect(DEFAULT_CAMERA_PRESET.name).toBe('static_full');
    });
  });
});
