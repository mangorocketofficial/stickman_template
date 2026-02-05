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
import { VideoProject, SubtitleData } from './types/schema';
import { MOTION_NAMES } from './components/StickMan/motions';

// Load actual scene data from public/scene.json
import sceneJson from '../public/scene.json';
import wordsJson from '../public/subtitles/words.json';

// Use actual scene data from Python pipeline output
const defaultSceneData: VideoProject = sceneJson as VideoProject;

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

      {/* Motion Tester Compositions - one for each motion */}
      {MOTION_NAMES.map((motionName) => (
        <Composition
          key={motionName}
          id={`Motion-${motionName}`}
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
