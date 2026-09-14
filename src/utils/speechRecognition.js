// Speech Recognition module using Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;
let isListening = false;
let onResult = null;
let onEnd = null;
let onError = null;

export function initSpeechRecognition(callbacks = {}) {
  if (!SpeechRecognition) {
    console.warn('Speech Recognition not supported in this browser');
    return false;
  }

  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 3;

  onResult = callbacks.onResult || (() => {});
  onEnd = callbacks.onEnd || (() => {});
  onError = callbacks.onError || (() => {});

  recognition.onresult = (event) => {
    const results = [];
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const confidence = event.results[i][0].confidence;
      const isFinal = event.results[i].isFinal;
      results.push({ transcript, confidence, isFinal });
    }
    onResult(results);
  };

  recognition.onend = () => {
    isListening = false;
    onEnd();
  };

  recognition.onerror = (event) => {
    isListening = false;
    onError(event.error);
  };

  return true;
}

export function startListening() {
  if (!recognition || isListening) return false;
  try {
    recognition.start();
    isListening = true;
    return true;
  } catch (e) {
    console.error('Failed to start recognition:', e);
    return false;
  }
}

export function stopListening() {
  if (!recognition || !isListening) return;
  recognition.stop();
  isListening = false;
}

export function isSupported() {
  return !!SpeechRecognition;
}

export function getIsListening() {
  return isListening;
}
