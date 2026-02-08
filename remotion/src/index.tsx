/**
 * Remotion entry point - Composition registration (v2: AI Image Pipeline)
 */

import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import React from 'react';
import { MainVideo } from './MainVideo';
import { VideoProject, SubtitleData } from './types/schema';

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
    </>
  );
};

registerRoot(RemotionRoot);
