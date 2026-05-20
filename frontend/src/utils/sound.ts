// Apple-style subtle sounds using Web Audio API
// Handles autoplay policies (Edge, Chrome, Firefox)

interface WindowWithAudioContext extends Window {
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
}

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const win = window as WindowWithAudioContext;
    const AC = win.AudioContext || win.webkitAudioContext;
    if (!AC) {
      throw new Error('Web Audio API not supported');
    }
    audioCtx = new AC();
  }

  // Non-null assertion - we know audioCtx is not null here
  const ctx = audioCtx!;

  // Resume if suspended (handles autoplay policy in Edge/Chrome)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

export function playClickSound() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  } catch {
    console.log('Audio not supported');
  }
}

// Whoosh sound for popup open - Apple style
export function playWhooshSound() {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch {
    console.log('Audio not supported');
  }
}
