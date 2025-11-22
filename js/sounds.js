// Sound utility module for chess game
// Uses Web Audio API to generate sound effects

let audioContext = null;

// Initialize audio context (lazy initialization to avoid autoplay issues)
function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Helper function to play a tone
function playTone(frequency, duration, volume = 0.3) {
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
        console.warn('Sound playback failed:', error);
    }
}

// Play move sound (soft, short tone)
export function playMove() {
    playTone(300, 0.1, 0.2);
}

// Play capture sound (sharper, higher tone)
export function playCapture() {
    playTone(600, 0.15, 0.25);
}

// Play check sound (alert tone)
export function playCheck() {
    playTone(800, 0.2, 0.3);
}

// Play checkmate sound (sequence of tones)
export function playCheckmate() {
    try {
        const ctx = getAudioContext();
        playTone(600, 0.2, 0.3);
        setTimeout(() => playTone(500, 0.2, 0.3), 150);
        setTimeout(() => playTone(400, 0.3, 0.3), 300);
    } catch (error) {
        console.warn('Sound playback failed:', error);
    }
}

// Play promotion sound (ascending tones)
export function playPromotion() {
    try {
        const ctx = getAudioContext();
        playTone(400, 0.1, 0.25);
        setTimeout(() => playTone(500, 0.1, 0.25), 100);
        setTimeout(() => playTone(600, 0.15, 0.25), 200);
    } catch (error) {
        console.warn('Sound playback failed:', error);
    }
}
