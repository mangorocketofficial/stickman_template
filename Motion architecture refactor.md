# 스틱맨 모션 아키텍처 리팩토링

## 배경
현재 16개 모션이 전부 무한 루프로 되어 있어서, "가리키기"처럼 한 번 하고 유지해야 하는 동작도 계속 반복됨. 이를 **루프 모션 / 포즈 전환**으로 분리해야 함.

---

## 1단계: 16개 모션 재분류

### 루프 모션 (during에 사용 — 유지 상태에서 미세 반복)
| 이름 | 용도 |
|------|------|
| breathing | 기본 idle |
| nodding | 동의하며 설명 |
| typing | 타이핑 중 |
| nervous | 불안한 상태 |
| laughing | 웃는 중 |
| crying | 우는 중 |
| headShake | 고개 젓기 (부정) |

→ 이것들은 **motions.ts에 그대로 유지** (루프 용도)

### 포즈 전환형 (enter에서 전환 → during에서 유지 → exit에서 복귀)
| 이름 | → 새로운 포즈로 이동 | 설명 |
|------|----------------------|------|
| waving | → `waving` 포즈 | 손 흔들고 유지 |
| pointing | → `pointing_right` 포즈 (이미 존재) | 가리키고 유지 |
| thumbsUp | → `thumbsUp` 포즈 (신규) | 엄지 척 유지 |
| beckoning | → `beckoning` 포즈 (신규) | 손짓 유지 |
| clapping | 특수: 루프 유지 | 박수는 반복이 자연스러움 → 루프로 재분류 |
| excited | → `celebrating` 포즈 (이미 존재) | 팔 들고 유지 |
| jumping | 특수: 루프 유지 | 점프는 반복이 자연스러움 → 루프로 재분류 |
| running | 특수: 루프 유지 | 달리기는 반복 → 루프로 재분류 |
| walkCycle | 루프 유지 | 걷기는 반복 → 루프로 재분류 |

### 최종 분류 결과

**루프 모션 (11개):** breathing, nodding, typing, nervous, laughing, crying, headShake, clapping, jumping, running, walkCycle

**포즈 전환형 → 새 포즈로 이동 (5개):** waving, pointing, thumbsUp, beckoning, excited
→ 이것들은 motions.ts에서 **제거**하고, poses.ts에 **새 포즈 추가**

---

## 2단계: poses.ts에 새 포즈 추가

기존 8개 포즈에 추가:

```typescript
// poses.ts에 추가할 새 포즈들

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
```

참고: `pointing`과 `excited`는 이미 `pointing_right`, `celebrating` 포즈가 존재하므로 추가 불필요.

---

## 3단계: StickmanProps 스키마 확장

### schema.ts 수정

```typescript
export interface StickmanProps {
  pose: string;                  // 시작 포즈 (default: "standing")
  targetPose?: string;           // 전환 대상 포즈 (있으면 enter/exit에서 전환)
  expression?: string;           // 표정 (default: "neutral")
  motion?: string;               // during 루프 모션 (default: "breathing")
  color?: string;
  lineWidth?: number;
}
```

### scene.json 사용 예시

```json
{
  "type": "stickman",
  "props": {
    "pose": "standing",
    "targetPose": "pointing_right",
    "expression": "happy",
    "motion": "breathing"
  },
  "animation": {
    "enter": { "type": "poseTransition", "durationMs": 400 },
    "during": { "type": "none" },
    "exit": { "type": "poseTransition", "durationMs": 300 }
  }
}
```

동작 흐름:
- **Enter (400ms)**: standing → pointing_right 보간 전환
- **During**: pointing_right 유지 + breathing 루프
- **Exit (300ms)**: pointing_right → standing 보간 복귀

targetPose가 없으면:
- **Enter**: 일반 fadeIn/slideIn
- **During**: pose 유지 + motion 루프
- **Exit**: 일반 fadeOut

---

## 4단계: StickMan.tsx 렌더링 로직 수정

### 핵심 로직 (의사코드)

```typescript
// StickMan.tsx 내부

const basePose = getPose(props.pose || 'standing');
const targetPose = props.targetPose ? getPose(props.targetPose) : null;
const motion = props.motion ? MOTIONS[props.motion] : MOTIONS['breathing'];

// 씬 내 상대 시간 계산
const relativeTimeMs = getCurrentTimeMs(frame - sceneStartFrame, fps);
const sceneDurationMs = framesToMs(sceneDurationFrames, fps);

// enter/exit duration (animation props에서 가져오거나 기본값)
const enterDurationMs = animation?.enter?.durationMs || 400;
const exitDurationMs = animation?.exit?.durationMs || 300;

let currentPose: Pose;

if (targetPose) {
  // === 포즈 전환형 ===
  if (relativeTimeMs < enterDurationMs) {
    // Enter: basePose → targetPose 전환
    const progress = relativeTimeMs / enterDurationMs;
    const eased = easeInOutCubic(progress);
    currentPose = interpolatePose(basePose, targetPose, eased);
  } else if (relativeTimeMs > sceneDurationMs - exitDurationMs) {
    // Exit: targetPose → basePose 복귀
    const exitElapsed = relativeTimeMs - (sceneDurationMs - exitDurationMs);
    const progress = exitElapsed / exitDurationMs;
    const eased = easeInOutCubic(progress);
    currentPose = interpolatePose(targetPose, basePose, eased);
  } else {
    // During: targetPose 유지 + 루프 모션
    currentPose = targetPose;
    if (motion) {
      const motionOverride = getMotionOverride(motion, relativeTimeMs);
      currentPose = applyMotionOverride(currentPose, motionOverride);
    }
  }
} else {
  // === 루프 모션만 ===
  currentPose = basePose;
  if (motion) {
    const motionOverride = getMotionOverride(motion, relativeTimeMs);
    currentPose = applyMotionOverride(currentPose, motionOverride);
  }
}
```

### easing 함수 추가 (interpolation.ts)

```typescript
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
```

---

## 5단계: motions.ts 정리

### 제거할 모션 (포즈로 이동됨)
- ~~waving~~ → poses.ts의 `waving` 포즈
- ~~pointing~~ → poses.ts의 `pointing_right` 포즈 (이미 존재)
- ~~thumbsUp~~ → poses.ts의 `thumbsUp` 포즈
- ~~beckoning~~ → poses.ts의 `beckoning` 포즈
- ~~excited~~ → poses.ts의 `celebrating` 포즈 (이미 존재)

### 유지할 루프 모션 (11개)
breathing, nodding, typing, nervous, laughing, crying, headShake, clapping, jumping, running, walkCycle

---

## 6단계: 파이프라인(scene_builder.py) 업데이트

Python 파이프라인에서 scene.json 생성 시:

```python
# scene_builder.py에서 스틱맨 오브젝트 생성 로직

def create_stickman_object(action: str) -> dict:
    """
    action에 따라 적절한 pose/targetPose/motion 조합 결정
    """
    # 포즈 전환형 매핑
    POSE_ACTIONS = {
        "waving": "waving",
        "pointing": "pointing_right",
        "thumbsUp": "thumbsUp",
        "beckoning": "beckoning",
        "excited": "celebrating",
    }

    # 루프 모션
    LOOP_MOTIONS = [
        "breathing", "nodding", "typing", "nervous",
        "laughing", "crying", "headShake",
        "clapping", "jumping", "running", "walkCycle"
    ]

    if action in POSE_ACTIONS:
        return {
            "props": {
                "pose": "standing",
                "targetPose": POSE_ACTIONS[action],
                "motion": "breathing",  # 유지 중 미세 움직임
            },
            "animation": {
                "enter": {"type": "poseTransition", "durationMs": 400},
                "exit": {"type": "poseTransition", "durationMs": 300},
            }
        }
    elif action in LOOP_MOTIONS:
        return {
            "props": {
                "pose": "standing",
                "motion": action,
            },
            "animation": {
                "enter": {"type": "fadeIn", "durationMs": 500},
                "exit": {"type": "fadeOut", "durationMs": 300},
            }
        }
```

---

## 수정 파일 목록

| 파일 | 수정 내용 |
|------|-----------|
| `schema.ts` | StickmanProps에 `targetPose`, `motion` 필드 추가 |
| `poses.ts` | waving, thumbsUp, beckoning 포즈 3개 추가 |
| `motions.ts` | waving, pointing, thumbsUp, beckoning, excited 모션 5개 제거 |
| `interpolation.ts` | easeInOutCubic 함수 추가 |
| `StickMan.tsx` | enter/during/exit 3단계 렌더링 로직 구현 |
| `scene_builder.py` | POSE_ACTIONS / LOOP_MOTIONS 매핑 추가 |

---

## 주의사항

1. **하위 호환성**: 기존 scene.json에 targetPose가 없으면 기존처럼 동작 (루프 모션만)
2. **breathing은 기본 모션**: motion이 지정되지 않으면 항상 breathing 적용
3. **포즈 전환의 easing**: 딱딱하지 않게 easeInOutCubic 필수
4. **MotionKeyframeTuner / InteractiveTuner**: 제거된 모션 참조 업데이트 필요
5. **MotionPreview composition들**: 16개 → 11개로 줄어듦, 업데이트 필요