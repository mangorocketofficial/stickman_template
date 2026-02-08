/**
 * Remotion entry point - Composition registration
 */

import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import React from 'react';
import { MainVideo } from './MainVideo';
import { MotionTester } from './MotionTester';
import { InteractiveTuner } from './InteractiveTuner';
import { MotionKeyframeTuner } from './MotionKeyframeTuner';
import { PoseGallery } from './PoseGallery';
import { ExpressionGallery } from './ExpressionGallery';
import { PoseExpressionShowcase } from './PoseExpressionShowcase';
import { MotionGallery } from './MotionGallery';
import { VideoProject, SubtitleData } from './types/schema';
import { MOTION_NAMES } from './components/StickMan/motions';
import { POSE_NAMES } from './components/StickMan/poses';
import { EXPRESSION_NAMES } from './components/StickMan/expressions';

// Load actual scene data from public/scene.json
import sceneJson from '../public/scene.json';
import wordsJson from '../public/subtitles/words.json';
// Load L3 Direction demo scene
import l3DemoJson from '../public/scene_l3_demo.json';
// Load L4 Scene Templates demo scene
import l4DemoJson from '../public/scene_l4_demo.json';
// Load L4 Improved demo scene (diverse layouts & motions)
import l4ImprovedDemoJson from '../public/scene_l4_improved_demo.json';

// Use actual scene data from Python pipeline output
const defaultSceneData: VideoProject = sceneJson as VideoProject;
const l3DemoSceneData: VideoProject = l3DemoJson as VideoProject;
const l4DemoSceneData: VideoProject = l4DemoJson as VideoProject;
const l4ImprovedDemoSceneData: VideoProject = l4ImprovedDemoJson as VideoProject;

// Use actual subtitle data from Python pipeline output
const defaultSubtitleData: SubtitleData = wordsJson as SubtitleData;

// Calculate total duration from scenes
const calculateTotalDuration = (scenes: VideoProject['scenes'], fps: number): number => {
  if (scenes.length === 0) return fps * 10; // Default 10 seconds
  const lastScene = scenes[scenes.length - 1];
  return Math.ceil((lastScene.endMs / 1000) * fps);
};

export const RemotionRoot: React.FC = () => {
  const fps = defaultSceneData.meta.fps;
  const totalFrames = calculateTotalDuration(defaultSceneData.scenes, fps);

  return (
    <>
      {/* Main Video Composition */}
      <Composition
        id="MainVideo"
        component={MainVideo as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={totalFrames}
        fps={fps}
        width={defaultSceneData.meta.width}
        height={defaultSceneData.meta.height}
        defaultProps={{
          sceneData: defaultSceneData,
          subtitleData: defaultSubtitleData,
        }}
      />

      {/* L3 Direction Demo - Camera presets showcase */}
      <Composition
        id="L3-Direction-Demo"
        component={MainVideo as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={Math.ceil((34000 / 1000) * fps)}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          sceneData: l3DemoSceneData,
          subtitleData: undefined,
        }}
      />

      {/* L4 Scene Templates Demo - Scene template showcase */}
      <Composition
        id="L4-Scene-Templates-Demo"
        component={MainVideo as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={Math.ceil((31000 / 1000) * fps)}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          sceneData: l4DemoSceneData,
          subtitleData: undefined,
        }}
      />

      {/* L4 Improved Demo - Diverse layouts and motions showcase */}
      <Composition
        id="L4-Improved-Demo"
        component={MainVideo as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={Math.ceil((34000 / 1000) * fps)}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          sceneData: l4ImprovedDemoSceneData,
          subtitleData: undefined,
        }}
      />

      {/* Interactive Pose Tuner - for finding optimal joint angles */}
      <Composition
        id="PoseTuner"
        component={InteractiveTuner as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={fps * 60}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* Motion Keyframe Tuner - for editing motion keyframes */}
      <Composition
        id="MotionEditor"
        component={MotionKeyframeTuner as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={fps * 60}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* Pose Gallery - shows all poses in a grid */}
      <Composition
        id="PoseGallery"
        component={PoseGallery as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={fps * POSE_NAMES.length * 2} // 2 seconds per pose
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          columns: 8,
          showLabels: true,
        }}
      />

      {/* Expression Gallery - shows all expressions in a grid */}
      <Composition
        id="ExpressionGallery"
        component={ExpressionGallery as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={fps * EXPRESSION_NAMES.length * 1.5} // 1.5 seconds per expression
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          columns: 5,
          showLabels: true,
        }}
      />

      {/* Pose & Expression Showcase - large StickMan cycling through all combinations */}
      <Composition
        id="PoseExpressionShowcase"
        component={PoseExpressionShowcase as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={fps * POSE_NAMES.length * 2} // Full cycle through all poses
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* Motion Gallery - shows all motions in a grid with live animation */}
      <Composition
        id="MotionGallery"
        component={MotionGallery as unknown as React.FC<Record<string, unknown>>}
        durationInFrames={fps * MOTION_NAMES.length * 3} // 3 seconds per motion
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          columns: 7,
          showLabels: true,
        }}
      />

      {/* Motion Tester Compositions - one for each motion */}
      {MOTION_NAMES.map((motionName) => (
        <Composition
          key={motionName}
          id={`Motion-${motionName.replace(/_/g, '-')}`}
          component={MotionTester as unknown as React.FC<Record<string, unknown>>}
          durationInFrames={fps * 10}
          fps={fps}
          width={1920}
          height={1080}
          defaultProps={{
            motionName,
          }}
        />
      ))}
    </>
  );
};

registerRoot(RemotionRoot);
