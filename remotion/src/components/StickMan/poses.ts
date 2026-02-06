// Pose presets for StickMan
// Each pose defines rotation angles in degrees for all joints
// Positive angles = clockwise rotation
// 0 degrees = neutral/vertical position

import { Pose } from '../../types/schema';

// 8 Required pose presets for MVP
export const POSES: Record<string, Pose> = {
  // Neutral idle pose - arms slightly out, legs straight
  standing: {
    torso: 0,
    head: 0,
    upperArmL: 20,      // arms slightly away from body
    lowerArmL: 0,
    upperArmR: -20,
    lowerArmR: 0,
    upperLegL: 5,       // legs slightly apart
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Right arm extended horizontally pointing right
  pointing_right: {
    torso: -5,          // slight lean toward pointing direction
    head: -10,          // looking right
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -90,     // arm horizontal to the right
    lowerArmR: 0,       // forearm straight
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Left arm extended horizontally pointing left
  pointing_left: {
    torso: 5,           // slight lean toward pointing direction
    head: 10,           // looking left
    upperArmL: 90,      // arm horizontal to the left
    lowerArmL: 0,       // forearm straight
    upperArmR: -20,
    lowerArmR: 0,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Thinking pose - hand on chin
  thinking: {
    torso: 5,
    head: 10,           // tilted slightly
    upperArmL: 30,
    lowerArmL: 0,
    upperArmR: -60,     // raised toward face
    lowerArmR: -120,    // bent sharply, hand at chin
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Celebrating - both arms raised high
  celebrating: {
    torso: 0,
    head: -5,           // looking slightly up
    upperArmL: 160,     // arm up to the left
    lowerArmL: 20,      // slight bend
    upperArmR: -160,    // arm up to the right
    lowerArmR: -20,     // slight bend
    upperLegL: 15,      // legs apart
    lowerLegL: 0,
    upperLegR: -15,
    lowerLegR: 0,
  },

  // Explaining - one hand raised, presenting gesture
  explaining: {
    torso: -3,
    head: -5,
    upperArmL: 45,      // left arm raised
    lowerArmL: -90,     // forearm bent up
    upperArmR: -30,
    lowerArmR: -20,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Shrugging - both arms out, palms up gesture
  shrugging: {
    torso: 0,
    head: 0,
    upperArmL: 70,      // arms out to sides
    lowerArmL: -90,     // forearms up
    upperArmR: -70,
    lowerArmR: 90,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Sitting pose - legs bent at 90 degrees
  sitting: {
    torso: 0,
    head: 0,
    upperArmL: 30,
    lowerArmL: -90,     // arms resting on legs
    upperArmR: -30,
    lowerArmR: 90,
    upperLegL: 90,      // thighs horizontal
    lowerLegL: -90,     // shins vertical
    upperLegR: -90,
    lowerLegR: 90,
  },

  // ============================================
  // POSE TRANSITION TARGETS (리팩토링 추가)
  // ============================================

  // Waving pose - right arm raised for wave
  waving: {
    torso: 0,
    head: -5,
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -130,    // 팔 올림
    lowerArmR: -40,     // 손 흔드는 위치
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Thumbs up pose - right arm raised with thumb up gesture
  thumbsUp: {
    torso: 0,
    head: 0,
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -100,    // 팔 올림
    lowerArmR: -30,     // 엄지 척 위치
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Beckoning pose - hand gesture calling someone
  beckoning: {
    torso: 0,
    head: 0,
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -70,     // 팔 들어올림
    lowerArmR: -90,     // 손짓 위치
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // ============================================
  // L1 V3 추가 포즈 (29개)
  // ============================================

  // === 기본 포즈 (3개) ===

  // Leaning - 벽에 기대기
  leaning: {
    torso: -15,         // 기울어짐
    head: -10,
    upperArmL: 30,
    lowerArmL: -30,
    upperArmR: -90,     // 벽에 팔 기대기
    lowerArmR: 0,
    upperLegL: 10,
    lowerLegL: 0,
    upperLegR: -20,     // 다리 꼬기
    lowerLegR: 0,
  },

  // Crouching - 웅크리기
  crouching: {
    torso: 30,          // 앞으로 숙임
    head: 20,
    upperArmL: 60,
    lowerArmL: -100,    // 무릎 위에 팔
    upperArmR: -60,
    lowerArmR: 100,
    upperLegL: 110,     // 다리 굽힘
    lowerLegL: -130,
    upperLegR: -110,
    lowerLegR: 130,
  },

  // Lying - 누워있기
  lying: {
    torso: 90,          // 옆으로 눕기
    head: 90,
    upperArmL: 0,
    lowerArmL: 0,
    upperArmR: 0,
    lowerArmR: 0,
    upperLegL: 10,
    lowerLegL: 0,
    upperLegR: -10,
    lowerLegR: 0,
  },

  // === 제스처 포즈 (6개) ===

  // Pointing up - 위를 가리킴
  pointing_up: {
    torso: 0,
    head: -15,          // 위를 봄
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -170,    // 팔 위로
    lowerArmR: 0,       // 쭉 펴기
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Stop - 정지 손짓
  stop: {
    torso: 0,
    head: 0,
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -90,     // 옆으로 뻗기
    lowerArmR: -90,     // 손바닥 앞으로
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Facepalm - 얼굴 가리기
  facepalm: {
    torso: 10,
    head: 20,           // 숙임
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -45,
    lowerArmR: -150,    // 얼굴에 손
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Arms crossed - 팔짱
  arms_crossed: {
    torso: 0,
    head: 0,
    upperArmL: 50,
    lowerArmL: -130,    // 오른쪽으로 접기
    upperArmR: -50,
    lowerArmR: 130,     // 왼쪽으로 접기
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Hand on hip - 허리에 손
  hand_on_hip: {
    torso: 0,
    head: -5,
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -45,     // 아래로 굽힘
    lowerArmR: 90,      // 허리에 손
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Raising hand - 손 들기
  raising_hand: {
    torso: 0,
    head: 0,
    upperArmL: 20,
    lowerArmL: 0,
    upperArmR: -160,    // 손 높이 들기
    lowerArmR: -20,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // === 감정 포즈 (6개) ===

  // Depressed - 우울
  depressed: {
    torso: 20,          // 어깨 늘어짐
    head: 30,           // 고개 숙임
    upperArmL: 10,
    lowerArmL: 20,      // 축 처짐
    upperArmR: -10,
    lowerArmR: -20,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Surprised pose - 놀람
  surprised_pose: {
    torso: -10,         // 뒤로 젖힘
    head: -15,
    upperArmL: 80,      // 양손 올림
    lowerArmL: -40,
    upperArmR: -80,
    lowerArmR: 40,
    upperLegL: 10,
    lowerLegL: 0,
    upperLegR: -10,
    lowerLegR: 0,
  },

  // Confident - 자신감
  confident: {
    torso: -5,          // 가슴 펴기
    head: -10,          // 턱 들기
    upperArmL: 45,
    lowerArmL: -100,    // 팔짱 변형
    upperArmR: -45,
    lowerArmR: 100,
    upperLegL: 10,
    lowerLegL: 0,
    upperLegR: -10,
    lowerLegR: 0,
  },

  // Scared - 겁먹음
  scared: {
    torso: 15,          // 움츠림
    head: 10,
    upperArmL: 50,
    lowerArmL: -120,    // 방어 자세
    upperArmR: -50,
    lowerArmR: 120,
    upperLegL: 15,
    lowerLegL: -20,
    upperLegR: -15,
    lowerLegR: 20,
  },

  // Exhausted - 지침
  exhausted: {
    torso: 25,          // 앞으로 숙임
    head: 35,
    upperArmL: 15,
    lowerArmL: 30,      // 축 늘어짐
    upperArmR: -15,
    lowerArmR: -30,
    upperLegL: 10,
    lowerLegL: -10,
    upperLegR: -10,
    lowerLegR: 10,
  },

  // Praying - 기도
  praying: {
    torso: 10,
    head: 25,           // 고개 숙임
    upperArmL: 30,
    lowerArmL: -120,    // 손 모음
    upperArmR: -30,
    lowerArmR: 120,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // === 활동 포즈 (8개) ===

  // Writing - 글쓰기
  writing: {
    torso: 15,          // 약간 숙임
    head: 20,
    upperArmL: 40,
    lowerArmL: -90,     // 종이 잡기
    upperArmR: -40,
    lowerArmR: -110,    // 펜 잡기
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Reading - 읽기
  reading: {
    torso: 10,
    head: 25,           // 아래 보기
    upperArmL: 50,
    lowerArmL: -100,    // 책 잡기
    upperArmR: -50,
    lowerArmR: 100,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Lifting - 들어올리기
  lifting: {
    torso: -5,
    head: -10,
    upperArmL: 130,     // 양팔 위로
    lowerArmL: -30,
    upperArmR: -130,
    lowerArmR: 30,
    upperLegL: 15,
    lowerLegL: -10,
    upperLegR: -15,
    lowerLegR: 10,
  },

  // Pushing - 밀기
  pushing: {
    torso: 15,          // 앞으로 기울임
    head: 5,
    upperArmL: 80,      // 앞으로 뻗기
    lowerArmL: 0,
    upperArmR: -80,
    lowerArmR: 0,
    upperLegL: 25,
    lowerLegL: -20,
    upperLegR: -35,
    lowerLegR: 0,
  },

  // Pulling - 당기기
  pulling: {
    torso: -20,         // 뒤로 젖힘
    head: -10,
    upperArmL: 60,
    lowerArmL: -90,     // 잡아당기기
    upperArmR: -60,
    lowerArmR: 90,
    upperLegL: 35,
    lowerLegL: 0,
    upperLegR: -25,
    lowerLegR: -20,
  },

  // Presenting - 발표
  presenting: {
    torso: -5,
    head: -5,
    upperArmL: 100,     // 양팔 벌림
    lowerArmL: -30,
    upperArmR: -100,
    lowerArmR: 30,
    upperLegL: 10,
    lowerLegL: 0,
    upperLegR: -10,
    lowerLegR: 0,
  },

  // Running - 달리기
  running: {
    torso: 20,          // 앞으로 기울임
    head: 10,
    upperArmL: 60,
    lowerArmL: -90,
    upperArmR: -120,
    lowerArmR: -60,
    upperLegL: 70,
    lowerLegL: -80,
    upperLegR: -40,
    lowerLegR: -40,
  },

  // Jumping - 점프
  jumping: {
    torso: -10,
    head: -15,
    upperArmL: 150,     // 양팔 높이
    lowerArmL: 0,
    upperArmR: -150,
    lowerArmR: 0,
    upperLegL: 30,
    lowerLegL: -50,
    upperLegR: -30,
    lowerLegR: 50,
  },

  // Dancing - 춤추기
  dancing: {
    torso: -10,
    head: -15,
    upperArmL: 130,
    lowerArmL: -50,
    upperArmR: -70,
    lowerArmR: -90,
    upperLegL: 20,
    lowerLegL: -30,
    upperLegR: -40,
    lowerLegR: 0,
  },

  // Kicking - 발차기
  kicking: {
    torso: -15,
    head: -10,
    upperArmL: 50,
    lowerArmL: -30,
    upperArmR: -50,
    lowerArmR: 30,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -100,    // 다리 들기
    lowerLegR: 0,
  },

  // Bowing - 인사 (숙이기)
  bowing: {
    torso: 45,          // 깊이 숙임
    head: 50,
    upperArmL: 15,
    lowerArmL: 10,
    upperArmR: -15,
    lowerArmR: -10,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Stretching - 스트레칭
  stretching: {
    torso: -10,
    head: -20,
    upperArmL: 170,     // 양팔 위로 쭉
    lowerArmL: 0,
    upperArmR: -170,
    lowerArmR: 0,
    upperLegL: 5,
    lowerLegL: 0,
    upperLegR: -5,
    lowerLegR: 0,
  },

  // Sleeping - 잠자기
  sleeping: {
    torso: 85,
    head: 95,           // 옆으로 눕기
    upperArmL: 30,
    lowerArmL: -60,     // 베개 위 손
    upperArmR: -30,
    lowerArmR: 60,
    upperLegL: 30,
    lowerLegL: -30,
    upperLegR: -15,
    lowerLegR: 15,
  },
};

// Default pose when none specified
export const DEFAULT_POSE = POSES.standing;

// Get a pose by name, falling back to standing if not found
export function getPose(name: string): Pose {
  return POSES[name] ?? DEFAULT_POSE;
}

// List of all available pose names
export const POSE_NAMES = Object.keys(POSES);
