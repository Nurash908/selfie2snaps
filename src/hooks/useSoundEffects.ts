// Sound effects system for premium interactions
const createAudioContext = () => {
  if (typeof window !== 'undefined') {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return null;
};

type SoundType = 
  | 'upload' 
  | 'generate' 
  | 'complete' 
  | 'preview' 
  | 'download' 
  | 'favorite' 
  | 'click'
  | 'hover'
  | 'success'
  | 'reset';

const soundConfigs: Record<SoundType, { frequencies: number[]; durations: number[]; type: OscillatorType; gain: number }> = {
  upload: { frequencies: [400, 600, 800], durations: [0.1, 0.1, 0.15], type: 'sine', gain: 0.15 },
  generate: { frequencies: [300, 400, 500, 600], durations: [0.1, 0.1, 0.1, 0.2], type: 'triangle', gain: 0.12 },
  complete: { frequencies: [523, 659, 784, 1047], durations: [0.15, 0.15, 0.15, 0.3], type: 'sine', gain: 0.18 },
  preview: { frequencies: [440, 550], durations: [0.08, 0.12], type: 'sine', gain: 0.1 },
  download: { frequencies: [600, 800, 1000], durations: [0.1, 0.1, 0.2], type: 'triangle', gain: 0.15 },
  favorite: { frequencies: [880, 1100, 880], durations: [0.1, 0.15, 0.1], type: 'sine', gain: 0.12 },
  click: { frequencies: [800], durations: [0.05], type: 'square', gain: 0.08 },
  hover: { frequencies: [600], durations: [0.03], type: 'sine', gain: 0.05 },
  success: { frequencies: [523, 659, 784], durations: [0.12, 0.12, 0.2], type: 'sine', gain: 0.15 },
  reset: { frequencies: [400, 300, 200], durations: [0.1, 0.1, 0.15], type: 'triangle', gain: 0.1 },
};

export const useSoundEffects = () => {
  const playSound = (type: SoundType) => {
    try {
      const ctx = createAudioContext();
      if (!ctx) return;
      
      const config = soundConfigs[type];
      let time = ctx.currentTime;
      
      config.frequencies.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(freq, time);
        
        gainNode.gain.setValueAtTime(config.gain, time);
        gainNode.gain.exponentialRampToValueAtTime(0.001, time + config.durations[i]);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(time);
        oscillator.stop(time + config.durations[i]);
        
        time += config.durations[i] * 0.8;
      });
    } catch (e) {
      // Silently fail if audio isn't supported
    }
  };

  return { playSound };
};
