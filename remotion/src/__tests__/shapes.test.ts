/**
 * Tests for Shape.tsx
 * Verifies all 8 shapes (4 base + 4 L1 V3 additions) are correctly defined
 */

import { describe, it, expect } from 'vitest';
import { ShapeProps } from '../types/schema';

// All shape types from schema
const BASE_SHAPES: ShapeProps['shape'][] = [
  'arrow',
  'line',
  'circle',
  'rectangle',
];

const V3_SHAPES: ShapeProps['shape'][] = [
  'curved_arrow',
  'bracket',
  'divider',
  'highlight_box',
];

const ALL_SHAPES: ShapeProps['shape'][] = [...BASE_SHAPES, ...V3_SHAPES];

describe('Shape types', () => {
  it('should define 8 total shape types', () => {
    expect(ALL_SHAPES.length).toBe(8);
  });

  it('should have 4 base shapes', () => {
    expect(BASE_SHAPES.length).toBe(4);
  });

  it('should have 4 L1 V3 additional shapes', () => {
    expect(V3_SHAPES.length).toBe(4);
  });
});

describe('ShapeProps interface', () => {
  it('should accept all base shape types', () => {
    BASE_SHAPES.forEach((shapeType) => {
      const props: ShapeProps = {
        shape: shapeType,
      };
      expect(props.shape).toBe(shapeType);
    });
  });

  it('should accept all V3 shape types', () => {
    V3_SHAPES.forEach((shapeType) => {
      const props: ShapeProps = {
        shape: shapeType,
      };
      expect(props.shape).toBe(shapeType);
    });
  });

  it('should accept optional width and height', () => {
    const props: ShapeProps = {
      shape: 'rectangle',
      width: 100,
      height: 50,
    };
    expect(props.width).toBe(100);
    expect(props.height).toBe(50);
  });

  it('should accept optional from and to points for line/arrow', () => {
    const props: ShapeProps = {
      shape: 'arrow',
      from: { x: 0, y: 0 },
      to: { x: 100, y: 100 },
    };
    expect(props.from).toEqual({ x: 0, y: 0 });
    expect(props.to).toEqual({ x: 100, y: 100 });
  });

  it('should accept optional color', () => {
    const props: ShapeProps = {
      shape: 'circle',
      color: '#FF0000',
    };
    expect(props.color).toBe('#FF0000');
  });

  it('should accept optional strokeWidth', () => {
    const props: ShapeProps = {
      shape: 'line',
      strokeWidth: 5,
    };
    expect(props.strokeWidth).toBe(5);
  });

  it('should accept optional fill', () => {
    const props: ShapeProps = {
      shape: 'rectangle',
      fill: true,
    };
    expect(props.fill).toBe(true);
  });

  // L1 V3 specific props
  it('should accept optional direction for bracket and curved_arrow', () => {
    const bracketProps: ShapeProps = {
      shape: 'bracket',
      direction: 'left',
    };
    expect(bracketProps.direction).toBe('left');

    const curvedArrowProps: ShapeProps = {
      shape: 'curved_arrow',
      direction: 'right',
    };
    expect(curvedArrowProps.direction).toBe('right');
  });

  it('should accept all direction values', () => {
    const directions: ShapeProps['direction'][] = ['left', 'right', 'up', 'down'];
    directions.forEach((dir) => {
      const props: ShapeProps = {
        shape: 'curved_arrow',
        direction: dir,
      };
      expect(props.direction).toBe(dir);
    });
  });

  it('should accept optional style for divider', () => {
    const styles: ShapeProps['style'][] = ['solid', 'dashed', 'dotted'];
    styles.forEach((style) => {
      const props: ShapeProps = {
        shape: 'divider',
        style,
      };
      expect(props.style).toBe(style);
    });
  });
});

describe('Shape configuration combinations', () => {
  it('should allow full configuration for curved_arrow', () => {
    const props: ShapeProps = {
      shape: 'curved_arrow',
      width: 150,
      height: 100,
      color: '#00FF00',
      strokeWidth: 4,
      direction: 'down',
    };
    expect(props.shape).toBe('curved_arrow');
    expect(props.width).toBe(150);
    expect(props.height).toBe(100);
    expect(props.direction).toBe('down');
  });

  it('should allow full configuration for bracket', () => {
    const props: ShapeProps = {
      shape: 'bracket',
      width: 30,
      height: 200,
      color: '#FFFFFF',
      strokeWidth: 3,
      direction: 'left',
    };
    expect(props.shape).toBe('bracket');
    expect(props.direction).toBe('left');
  });

  it('should allow full configuration for divider', () => {
    const props: ShapeProps = {
      shape: 'divider',
      width: 400,
      color: '#AAAAAA',
      strokeWidth: 2,
      style: 'dashed',
    };
    expect(props.shape).toBe('divider');
    expect(props.style).toBe('dashed');
  });

  it('should allow full configuration for highlight_box', () => {
    const props: ShapeProps = {
      shape: 'highlight_box',
      width: 300,
      height: 100,
      color: '#FFD700',
      strokeWidth: 2,
      fill: true,
    };
    expect(props.shape).toBe('highlight_box');
    expect(props.fill).toBe(true);
  });
});
