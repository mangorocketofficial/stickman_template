/**
 * Remotion entry point - Composition registration
 */

import { registerRoot } from 'remotion';
import { Composition } from 'remotion';
import React from 'react';
import { MainVideo } from './MainVideo';
import { VideoProject, SubtitleData } from './types/schema';

// Default/mock scene data for preview
const defaultSceneData: VideoProject = {
  meta: {
    title: '테스트 비디오',
    fps: 30,
    width: 1920,
    height: 1080,
    audioSrc: 'audio/tts_output.wav',
  },
  subtitles: {
    src: 'subtitles/words.json',
    style: {
      fontSize: 48,
      color: '#FFFFFF',
      position: 'bottom',
      highlightColor: '#FFD700',
    },
  },
  scenes: [
    {
      id: 'scene_01',
      startMs: 0,
      endMs: 5000,
      background: '#1a1a2e',
      transition: {
        in: 'fadeIn',
        out: 'fadeOut',
        durationMs: 300,
      },
      objects: [
        {
          id: 'stickman_01',
          type: 'stickman',
          position: { x: 350, y: 600 },
          scale: 1,
          layer: 2,
          props: {
            pose: 'standing',
            expression: 'happy',
            color: '#FFFFFF',
            lineWidth: 3,
          },
          animation: {
            enter: { type: 'fadeIn', durationMs: 500 },
          },
        },
        {
          id: 'text_01',
          type: 'text',
          position: { x: 1100, y: 350 },
          scale: 1,
          layer: 3,
          props: {
            content: '복리의 마법',
            fontSize: 64,
            fontWeight: 'bold',
            color: '#FFFFFF',
            align: 'center',
          },
          animation: {
            enter: { type: 'fadeInUp', durationMs: 600, delayMs: 200 },
          },
        },
      ],
    },
  ],
};

// Empty subtitle data for preview
const defaultSubtitleData: SubtitleData = {
  words: [
    { word: '안녕하세요', startMs: 0, endMs: 800 },
    { word: '오늘은', startMs: 900, endMs: 1200 },
    { word: '복리의', startMs: 1300, endMs: 1700 },
    { word: '놀라운', startMs: 1800, endMs: 2200 },
    { word: '힘에', startMs: 2300, endMs: 2600 },
    { word: '대해', startMs: 2700, endMs: 3000 },
    { word: '알아보겠습니다', startMs: 3100, endMs: 4000 },
  ],
};

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
      <Composition
        id="MainVideo"
        component={MainVideo}
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
