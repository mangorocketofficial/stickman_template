/**
 * MainVideo - Top-level composition reading scene.json
 *
 * Updated for Track B-2: Theme integration
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
import { ThemeProvider } from './contexts/ThemeContext';
import { getTheme } from './styles/themes';
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
  const { fps, width, height } = useVideoConfig();

  const { meta, subtitles, scenes } = sceneData;

  // Get theme from meta or use default
  const theme = getTheme(meta.theme);

  // Calculate which scene is currently active
  const currentSceneIndex = scenes.findIndex((scene) => {
    const startFrame = msToFrames(scene.startMs, fps);
    const endFrame = msToFrames(scene.endMs, fps);
    return frame >= startFrame && frame < endFrame;
  });

  // Get current scene's background for full-screen fill
  const currentScene = currentSceneIndex >= 0 ? scenes[currentSceneIndex] : null;
  const backgroundColor = currentScene
    ? getBackgroundColor(currentScene.background)
    : theme.background.primary;

  return (
    <ThemeProvider themeName={meta.theme}>
      <div
        style={{
          width,
          height,
          backgroundColor,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Audio track - spans entire video */}
        {meta.audioSrc && (
          <Audio src={staticFile(meta.audioSrc)} volume={1} />
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
              color: subtitles.style.color || theme.text.primary,
              position: subtitles.style.position || 'bottom',
              highlightColor: subtitles.style.highlightColor || theme.highlight,
            }}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default MainVideo;
