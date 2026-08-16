// Romantic Valentine Interactive Script

// Pleading messages for the "No" button
const noMessages = [
  "No 😢",
  "Are you sure? 🥺",
  "Really sure?? 💭",
  "Think again! 💖",
  "Last chance! 💔",
  "Surely not? 😭",
  "You're breaking my heart! 💔",
  "Have a heart! 🌸",
  "Don't do this to me! 🥹",
  "Change of heart? ✨",
  "Is that your final answer? 😢",
  "What if I asked nicely? 🙏",
  "Pretty please? 🥺💖",
  "I'll give you chocolate! 🍫",
  "I'll be so sad... 😭",
  "Okay, now you're teasing! 😉",
  "Just click YES already! 🥰"
];

// Subtitle messages that evolve with each No click
const subtitleMessages = [
  "Please say yes! My heart is waiting... 🥺",
  "Wait... did you miss the big pink button? 😳",
  "Are you testing my persistence? 💖",
  "I promise to make you super happy! ✨",
  "Look how big and shiny the YES button is getting! 🌟",
  "There is only one correct option here! 🥰",
  "Resistance is futile! Choose LOVE! 💕",
  "You know you want to say YES! 🎉"
];

let noClickCount = 0;
let audioCtx = null;

// Initialize Web Audio Context for synthesized sound effects
function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Play cute popping sound using Web Audio API (No external file needed)
function playPopSound(isYes = false) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (isYes) {
      // Happy high chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      // Cute spring / boing pop sound
      osc.type = 'sine';
      const baseFreq = 200 + (noClickCount * 25);
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (e) {
    console.log("Audio play suppressed:", e);
  }
}

// Synthesize a sweet romantic melody on Yes page (Can't Help Falling in Love)
let isMusicPlaying = false;
let melodyTimeout = null;

function toggleRomanticMelody() {
  const ctx = getAudioContext();
  const musicBtnText = document.getElementById('musicBtnText');

  if (isMusicPlaying) {
    clearTimeout(melodyTimeout);
    isMusicPlaying = false;
    if (musicBtnText) musicBtnText.textContent = "🎵 Play Romantic Music";
    return;
  }

  if (!ctx) return;
  isMusicPlaying = true;
  if (musicBtnText) musicBtnText.textContent = "⏸️ Pause Music";

  // "Can't Help Falling in Love" notes and durations (ms)
  const song = [
    { freq: 261.63, dur: 600 }, // C4
    { freq: 392.00, dur: 600 }, // G4
    { freq: 261.63, dur: 300 }, // C4
    { freq: 293.66, dur: 300 }, // D4
    { freq: 329.63, dur: 300 }, // E4
    { freq: 349.23, dur: 600 }, // F4
    { freq: 329.63, dur: 300 }, // E4
    { freq: 293.66, dur: 900 }, // D4
    
    { freq: 392.00, dur: 600 }, // G4
    { freq: 440.00, dur: 600 }, // A4
    { freq: 493.88, dur: 300 }, // B4
    { freq: 523.25, dur: 300 }, // C5
    { freq: 440.00, dur: 300 }, // A4
    { freq: 392.00, dur: 600 }, // G4
    { freq: 293.66, dur: 300 }, // D4
    { freq: 349.23, dur: 300 }, // F4
    { freq: 329.63, dur: 600 }, // E4
    { freq: 293.66, dur: 300 }, // D4
    { freq: 261.63, dur: 1200 }, // C4
    { freq: 0, dur: 600 }        // Rest
  ];

  let noteIdx = 0;

  function playNextNote() {
    if (!isMusicPlaying) return;

    const currentNote = song[noteIdx];
    
    // If it's not a rest note (freq > 0)
    if (currentNote.freq > 0) {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Triangle wave gives a softer, warmer, music-box like sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(currentNote.freq, ctx.currentTime);
        
        // Add smooth volume envelope
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (currentNote.dur / 1000) * 0.95);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + (currentNote.dur / 1000));
      } catch (e) {
        console.error(e);
      }
    }

    // Move to next note
    noteIdx = (noteIdx + 1) % song.length;
    melodyTimeout = setTimeout(playNextNote, currentNote.dur);
  }

  playNextNote();
}

// Create ambient floating hearts
function initFloatingHearts() {
  const container = document.getElementById('heartsContainer');
  if (!container) return;

  const heartSymbols = ['💖', '💕', '💗', '💓', '🌸', '✨', '❤️'];

  setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (5 + Math.random() * 5) + 's';
    heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
    
    container.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 10000);
  }, 600);
}

// Main Interactive logic for Index Page
document.addEventListener('DOMContentLoaded', () => {
  initFloatingHearts();

  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  const noBtnText = document.getElementById('noBtnText');
  const subtitleText = document.getElementById('subtitleText');

  if (noBtn && yesBtn) {
    noBtn.addEventListener('click', () => {
      noClickCount++;
      playPopSound(false);

      // 1. Change No button text
      const msgIndex = Math.min(noClickCount, noMessages.length - 1);
      noBtnText.textContent = noMessages[msgIndex];

      // 2. Update Subtitle
      const subIndex = Math.min(Math.floor(noClickCount / 2), subtitleMessages.length - 1);
      if (subtitleText) {
        subtitleText.style.opacity = '0';
        setTimeout(() => {
          subtitleText.textContent = subtitleMessages[subIndex];
          subtitleText.style.opacity = '1';
        }, 150);
      }

      // 3. Make Yes button progressively larger!
      // Increase font-size and padding, scale transform
      const newScale = 1 + (noClickCount * 0.18);
      const newFontSize = 1.25 + (noClickCount * 0.15);
      const newPaddingV = 0.9 + (noClickCount * 0.12);
      const newPaddingH = 2.2 + (noClickCount * 0.25);

      yesBtn.style.transform = `scale(${newScale})`;
      yesBtn.style.fontSize = `${newFontSize}rem`;
      yesBtn.style.padding = `${newPaddingV}rem ${newPaddingH}rem`;
      yesBtn.style.zIndex = `${10 + noClickCount}`;

      // 4. Shrink/Wiggle No button slightly or make it dodge
      noBtn.classList.remove('wiggle');
      void noBtn.offsetWidth; // Trigger reflow
      noBtn.classList.add('wiggle');

      if (noClickCount > 8) {
        const shrinkScale = Math.max(0.6, 1 - (noClickCount - 8) * 0.08);
        noBtn.style.transform = `scale(${shrinkScale})`;
      }
    });

    yesBtn.addEventListener('click', () => {
      playPopSound(true);
      // Small delay for sound and button click animation, then navigate
      yesBtn.style.transform = `${yesBtn.style.transform || 'scale(1)'} scale(1.15)`;
      setTimeout(() => {
        window.location.href = 'yes_page.html';
      }, 250);
    });
  }

  // Celebration Yes Page Setup
  const celebrateMoreBtn = document.getElementById('celebrateMoreBtn');
  if (celebrateMoreBtn) {
    celebrateMoreBtn.addEventListener('click', () => {
      playPopSound(true);
      triggerBigConfetti();
    });
  }

  const loveMusicBtn = document.getElementById('loveMusicBtn');
  if (loveMusicBtn) {
    loveMusicBtn.addEventListener('click', () => {
      toggleRomanticMelody();
    });
  }
});

// Trigger confetti explosion using canvas-confetti library or custom fallback
function triggerBigConfetti() {
  if (typeof confetti === 'function') {
    // Launch multi-stage confetti explosion
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti(Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio)
      }));
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ff4b72', '#ff2a55', '#ffffff']
    });
    fire(0.2, {
      spread: 60,
      colors: ['#ffd700', '#ff85a1']
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#ff1493', '#ff69b4', '#ffffff']
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } else {
    // Basic fallback if CDN unavailable
    alert("🎉 CONGRATULATIONS! HAPPY VALENTINE'S DAY! 🎉");
  }
}
