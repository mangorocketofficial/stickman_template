import { describe, it, expect } from 'vitest';
import {
  CAMERA_PRESETS,
  CAMERA_PRESET_NAMES,
  CAMERA_PRESETS_MAP,
  getCameraPreset,
  interpolateCameraAtProgress,
  STATIC_FULL,
  STATIC_CLOSEUP,
  STATIC_WIDE,
  ZOOM_IN_SLOW,
  ZOOM_IN_FAST,
} from '../camera';
import { CameraKeyframe, CameraPreset } from '../types';

// Valid easing values
const VALID_EASINGS: CameraKeyframe['easing'][] = ['linear', 'easeInOut', 'easeOut', 'easeIn'];

// Helper to validate a camera keyframe
function isValidKeyframe(keyframe: CameraKeyframe): boolean {
  return (
    typeof keyframe.atPercent === 'number' &&
    keyframe.atPercent >= 0 &&
    keyframe.atPercent <= 100 &&
    typeof keyframe.zoom === 'number' &&
    keyframe.zoom > 0 &&
    typeof keyframe.offsetX === 'number' &&
    typeof keyframe.offsetY === 'number' &&
    VALID_EASINGS.includes(keyframe.easing)
  );
}

// Helper to validate a camera preset
function isValidCameraPreset(preset: CameraPreset): boolean {
  return (
    typeof preset.name === 'string' &&
    preset.name.length > 0 &&
    Array.isArray(preset.keyframes) &&
    preset.keyframes.length >= 1 &&
    preset.keyframes.every(isValidKeyframe)
  );
}

describe('L3 Camera Presets', () => {
  describe('CAMERA_PRESETS array', () => {
    it('should have exactly 5 presets', () => {
      expect(CAMERA_PRESETS.length).toBe(5);
    });

    it('should have all required preset names', () => {
      const names = CAMERA_PRESETS.map((p) => p.name);
      expect(names).toContain('static_full');
      expect(names).toContain('static_closeup');
      expect(names).toContain('static_wide');
      expect(names).toContain('zoom_in_slow');
      expect(names).toContain('zoom_in_fast');
    });
  });

  describe('CAMERA_PRESET_NAMES list', () => {
    it('should have exactly 5 names', () => {
      expect(CAMERA_PRESET_NAMES.length).toBe(5);
    });

    it('should match CAMERA_PRESETS', () => {
      expect(CAMERA_PRESET_NAMES).toEqual(CAMERA_PRESETS.map((p) => p.name));
    });
  });

  describe('CAMERA_PRESETS_MAP', () => {
    it('should have all presets accessible by name', () => {
      CAMERA_PRESET_NAMES.forEach((name) => {
        expect(CAMERA_PRESETS_MAP[name]).toBeDefined();
        expect(CAMERA_PRESETS_MAP[name].name).toBe(name);
      });
    });
  });

  describe('Individual presets validation', () => {
    describe('static_full', () => {
      it('should exist and be valid', () => {
        expect(isValidCameraPreset(STATIC_FULL)).toBe(true);
      });

      it('should have zoom 1.0 throughout', () => {
        STATIC_FULL.keyframes.forEach((kf) => {
          expect(kf.zoom).toBe(1.0);
        });
      });

      it('should have no offset', () => {
        STATIC_FULL.keyframes.forEach((kf) => {
          expect(kf.offsetX).toBe(0);
          expect(kf.offsetY).toBe(0);
        });
      });
    });

    describe('static_closeup', () => {
      it('should exist and be valid', () => {
        expect(isValidCameraPreset(STATIC_CLOSEUP)).toBe(true);
      });

      it('should have zoom 1.3 throughout', () => {
        STATIC_CLOSEUP.keyframes.forEach((kf) => {
          expect(kf.zoom).toBe(1.3);
        });
      });
    });

    describe('static_wide', () => {
      it('should exist and be valid', () => {
        expect(isValidCameraPreset(STATIC_WIDE)).toBe(true);
      });

      it('should have zoom 0.8 throughout', () => {
        STATIC_WIDE.keyframes.forEach((kf) => {
          expect(kf.zoom).toBe(0.8);
        });
      });
    });

    describe('zoom_in_slow', () => {
      it('should exist and be valid', () => {
        expect(isValidCameraPreset(ZOOM_IN_SLOW)).toBe(true);
      });

      it('should start at zoom 1.0 and end at 1.2', () => {
        const first = ZOOM_IN_SLOW.keyframes[0];
        const last = ZOOM_IN_SLOW.keyframes[ZOOM_IN_SLOW.keyframes.length - 1];
        expect(first.zoom).toBe(1.0);
        expect(last.zoom).toBe(1.2);
      });

      it('should use easeInOut easing', () => {
        ZOOM_IN_SLOW.keyframes.forEach((kf) => {
          expect(kf.easing).toBe('easeInOut');
        });
      });
    });

    describe('zoom_in_fast', () => {
      it('should exist and be valid', () => {
        expect(isValidCameraPreset(ZOOM_IN_FAST)).toBe(true);
      });

      it('should start at zoom 1.0 and end at 1.3', () => {
        const first = ZOOM_IN_FAST.keyframes[0];
        const last = ZOOM_IN_FAST.keyframes[ZOOM_IN_FAST.keyframes.length - 1];
        expect(first.zoom).toBe(1.0);
        expect(last.zoom).toBe(1.3);
      });

      it('should use easeOut easing for snappy feel', () => {
        const last = ZOOM_IN_FAST.keyframes[ZOOM_IN_FAST.keyframes.length - 1];
        expect(last.easing).toBe('easeOut');
      });
    });
  });

  describe('All presets have valid structure', () => {
    CAMERA_PRESET_NAMES.forEach((name) => {
      it(`${name} should have valid preset structure`, () => {
        const preset = CAMERA_PRESETS_MAP[name];
        expect(isValidCameraPreset(preset)).toBe(true);
      });

      it(`${name} should have keyframes starting at 0%`, () => {
        const preset = CAMERA_PRESETS_MAP[name];
        expect(preset.keyframes[0].atPercent).toBe(0);
      });

      it(`${name} should have keyframes ending at 100%`, () => {
        const preset = CAMERA_PRESETS_MAP[name];
        const lastKf = preset.keyframes[preset.keyframes.length - 1];
        expect(lastKf.atPercent).toBe(100);
      });

      it(`${name} should have positive zoom values`, () => {
        const preset = CAMERA_PRESETS_MAP[name];
        preset.keyframes.forEach((kf) => {
          expect(kf.zoom).toBeGreaterThan(0);
        });
      });
    });
  });

  describe('getCameraPreset function', () => {
    it('should return correct preset by name', () => {
      expect(getCameraPreset('static_full')).toEqual(STATIC_FULL);
      expect(getCameraPreset('zoom_in_slow')).toEqual(ZOOM_IN_SLOW);
    });

    it('should return STATIC_FULL for unknown names', () => {
      expect(getCameraPreset('unknown_preset')).toEqual(STATIC_FULL);
      expect(getCameraPreset('')).toEqual(STATIC_FULL);
    });
  });

  describe('interpolateCameraAtProgress function', () => {
    it('should return start values at 0%', () => {
      const result = interpolateCameraAtProgress(ZOOM_IN_SLOW, 0);
      expect(result.zoom).toBe(1.0);
      expect(result.offsetX).toBe(0);
      expect(result.offsetY).toBe(0);
    });

    it('should return end values at 100%', () => {
      const result = interpolateCameraAtProgress(ZOOM_IN_SLOW, 100);
      expect(result.zoom).toBe(1.2);
    });

    it('should interpolate values at 50%', () => {
      const result = interpolateCameraAtProgress(ZOOM_IN_SLOW, 50);
      expect(result.zoom).toBeGreaterThan(1.0);
      expect(result.zoom).toBeLessThan(1.2);
    });

    it('should clamp progress below 0', () => {
      const result = interpolateCameraAtProgress(ZOOM_IN_SLOW, -10);
      expect(result.zoom).toBe(1.0);
    });

    it('should clamp progress above 100', () => {
      const result = interpolateCameraAtProgress(ZOOM_IN_SLOW, 150);
      expect(result.zoom).toBe(1.2);
    });

    it('should return constant values for static presets', () => {
      const result0 = interpolateCameraAtProgress(STATIC_FULL, 0);
      const result50 = interpolateCameraAtProgress(STATIC_FULL, 50);
      const result100 = interpolateCameraAtProgress(STATIC_FULL, 100);

      expect(result0.zoom).toBe(result50.zoom);
      expect(result50.zoom).toBe(result100.zoom);
    });
  });
});
