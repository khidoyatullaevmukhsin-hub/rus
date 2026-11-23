// Lightweight Web Audio API sound effects — zero external audio dependencies

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx) {
    audioCtx = new Ctx();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  startOffset = 0,
  volume = 0.11
) {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime + startOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export const quizAudio = {
  openTile(enabled: boolean) {
    if (!enabled) return;
    playTone(523.25, 0.12, 'triangle', 0, 0.1);
    playTone(659.25, 0.16, 'triangle', 0.06, 0.1);
  },

  revealAnswer(enabled: boolean) {
    if (!enabled) return;
    playTone(587.33, 0.14, 'sine', 0, 0.09);
    playTone(783.99, 0.2, 'sine', 0.07, 0.09);
  },

  correct(enabled: boolean) {
    if (!enabled) return;
    playTone(523.25, 0.14, 'triangle', 0, 0.11);
    playTone(659.25, 0.14, 'triangle', 0.08, 0.11);
    playTone(783.99, 0.26, 'triangle', 0.16, 0.12);
  },

  wrong(enabled: boolean) {
    if (!enabled) return;
    playTone(220, 0.16, 'sawtooth', 0, 0.06);
    playTone(175, 0.24, 'sawtooth', 0.12, 0.06);
  },

  bonus(enabled: boolean) {
    if (!enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => {
      playTone(n, 0.2, 'triangle', i * 0.075, 0.12);
    });
  },

  victory(enabled: boolean) {
    if (!enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5];
    const offsets = [0, 0.1, 0.2, 0.3, 0.45, 0.58];
    notes.forEach((n, i) => {
      playTone(n, 0.28, 'triangle', offsets[i], 0.12);
    });
  },
};
