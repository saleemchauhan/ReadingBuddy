// Text-to-Speech module using Web Speech API

let synth = window.speechSynthesis;
let currentUtterance = null;

export function speak(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!synth) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    synth.cancel();

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.rate = options.rate || 0.8; // Slower for children
    currentUtterance.pitch = options.pitch || 1.1; // Slightly higher pitch
    currentUtterance.volume = options.volume || 1;
    currentUtterance.lang = options.lang || 'en-US';

    // Try to find a child-friendly voice
    const voices = synth.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.name.includes('Google UK English Female') ||
      v.lang === 'en-US'
    );
    if (preferredVoice) {
      currentUtterance.voice = preferredVoice;
    }

    currentUtterance.onend = () => resolve();
    currentUtterance.onerror = (e) => reject(e);

    synth.speak(currentUtterance);
  });
}

export function speakWord(word) {
  return speak(word, { rate: 0.6 }); // Even slower for individual words
}

export function speakPhonetic(phonetic) {
  // Break phonetic into parts and speak slowly
  const parts = phonetic.split('-');
  return speak(parts.join(' '), { rate: 0.5 });
}

export function speakEncouragement() {
  const encouragements = [
    "Great job!",
    "You're doing amazing!",
    "Keep going, you're doing well!",
    "Wonderful reading!",
    "I'm so proud of you!",
    "That was excellent!",
    "You're a great reader!",
    "Nice work!",
    "You got it!",
    "Super!"
  ];
  const text = encouragements[Math.floor(Math.random() * encouragements.length)];
  return speak(text, { rate: 0.9 });
}

export function speakHelp(word, definition) {
  const text = `That word is ${word}. ${definition ? `It means ${definition}.` : ''} Let me say it for you: ${word}`;
  return speak(text, { rate: 0.75 });
}

export function stopSpeaking() {
  if (synth) synth.cancel();
}

export function isSpeaking() {
  return synth ? synth.speaking : false;
}
