/**
 * MainVideo - Top-level composition reading scene.json
 *
 * Updated for Track B-6: Added BGM support with auto-ducking
 */

import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
  Sequence,
} from 'remotion';
import { VideoProject, SubtitleData, getBackgroundColor } from './types/schema';
import SceneRenderer from './SceneRenderer';
import SubtitleOverlay from './components/SubtitleOverlay';
import BGMPlayer from './components/BGMPlayer';
import { msToFrames, getDurationInFrames } from './utils/timing';

interface MainVideoProps {
  sceneData: VideoProject;
  subtitleData?: SubtitleData;
}

export const MainVideo: React.FC<MainVideoProps> = ({
  sceneData,
  subtitleData,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height, durationInFrames } = useVideoConfig();

  const { meta, subtitles, scenes } = sceneData;

  // Calculate which scene is currently active
  const currentSceneIndex = scenes.findIndex((scene) => {
    const startFrame = msToFrames(scene.startMs, fps);
    const endFrame = msToFrames(scene.endMs, fps);
    return frame >= startFrame && frame < endFrame;
  });

  // Default background color
  const defaultBackground = '#1a1a2e';

  // Get current scene's background for full-screen fill
  const currentScene = currentSceneIndex >= 0 ? scenes[currentSceneIndex] : null;
  const backgroundColor = currentScene
    ? getBackgroundColor(currentScene.background)
    : defaultBackground;

  // Calculate total duration from scenes (for BGM fade out)
  const totalDurationFrames = scenes.length > 0
    ? msToFrames(scenes[scenes.length - 1].endMs, fps)
    : durationInFrames;

  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* TTS Audio track - spans entire video */}
      {meta.audioSrc && (
        <Audio src={staticFile(meta.audioSrc)} volume={1} />
      )}

      {/* BGM track with auto-ducking */}
      {meta.bgm && (
        <BGMPlayer
          config={meta.bgm}
          subtitleData={subtitleData}
          totalDurationFrames={totalDurationFrames}
        />
      )}

      {/* Render all scenes as sequences */}
      {scenes.map((scene, index) => {
        const startFrame = msToFrames(scene.startMs, fps);
        const durationFrames = getDurationInFrames(scene.startMs, scene.endMs, fps);

        return (
          <Sequence
            key={scene.id}
            from={startFrame}
            durationInFrames={durationFrames}
            name={scene.id}
          >
            <SceneRenderer
              scene={scene}
              globalStartFrame={startFrame}
            />
          </Sequence>
        );
      })}

      {/* Subtitle overlay - always on top (layer 99) */}
      {subtitleData && subtitles && (
        <SubtitleOverlay
          subtitleData={subtitleData}
          style={{
            fontSize: subtitles.style.fontSize || 48,
            color: subtitles.style.color || '#FFFFFF',
            position: subtitles.style.position || 'bottom',
            highlightColor: subtitles.style.highlightColor || '#FFD700',
          }}
        />
      )}
    </div>
  );
};

export default MainVideo;
