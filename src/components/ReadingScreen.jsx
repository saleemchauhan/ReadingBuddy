import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Camera, BookOpen, X, MessageCircle } from 'lucide-react';
import { speakWord, speakHelp, stopSpeaking } from '../utils/textToSpeech';
import { initSpeechRecognition, startListening, stopListening } from '../utils/speechRecognition';
import { getWordDifficulty } from '../data/wordDatabase';
import BookScanner from './BookScanner';
import WordHelper from './WordHelper';

export default function ReadingScreen({ childProfile, currentBook, setCurrentBook, onWordStruggled, onSessionEnd, struggledWords }) {
  const [isListening, setIsListening] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [currentWord, setCurrentWord] = useState(null);
  const [assistantMessage, setAssistantMessage] = useState('');
  const [sessionWords, setSessionWords] = useState([]);
  const [sessionTime, setSessionTime] = useState(0);
  const [showQA, setShowQA] = useState(false);
  const [qaInput, setQaInput] = useState('');
  const [qaResponse, setQaResponse] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const sessionStart = useRef(null);
  const timerRef = useRef(null);

  // Struggle detection state
  const lastWordTime = useRef(Date.now());
  const lastWords = useRef([]);
  const pauseThreshold = 1500; // ms
  const onSessionEndRef = useRef(onSessionEnd);
  const onWordStruggledRef = useRef(onWordStruggled);
  onSessionEndRef.current = onSessionEnd;
  onWordStruggledRef.current = onWordStruggled;

  useEffect(() => {
    initSpeechRecognition({
      onResult: handleSpeechResult,
      onEnd: () => setIsListening(false),
      onError: (err) => {
        console.error('Speech error:', err);
        setIsListening(false);
      }
    });

    return () => {
      if (sessionStart.current) {
        const duration = Math.max(1, Math.floor((Date.now() - sessionStart.current) / 1000));
        onSessionEndRef.current({
          book: currentBook?.title || 'Reading',
          duration,
          wordsHelped: 0,
          words: []
        });
      }
      stopListening();
      stopSpeaking();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isListening && !sessionStart.current) {
      sessionStart.current = Date.now();
      timerRef.current = setInterval(() => {
        setSessionTime(Math.floor((Date.now() - sessionStart.current) / 1000));
      }, 1000);
    }
  }, [isListening]);

  const handleSpeechResult = useCallback((results) => {
    const now = Date.now();
    const timeSinceLastWord = now - lastWordTime.current;

    for (const result of results) {
      if (result.isFinal) {
        const words = result.transcript.trim().split(/\s+/);
        for (const word of words) {
          const cleanWord = word.replace(/[^a-zA-Z]/g, '').toLowerCase();
          if (!cleanWord) continue;

          // Check for struggle signals
          const isHesitation = timeSinceLastWord > pauseThreshold;
          const isRepetition = lastWords.current.includes(cleanWord);
          const isLowConfidence = result.confidence < 0.7;

          if (isHesitation || isRepetition || isLowConfidence) {
            handleStruggle(cleanWord, isHesitation ? 'hesitation' : isRepetition ? 'repetition' : 'low-confidence');
          }

          lastWords.current.push(cleanWord);
          if (lastWords.current.length > 5) lastWords.current.shift();
        }
        lastWordTime.current = now;
      }
    }
  }, []);

  const handleStruggle = async (word, reason) => {
    const wordData = getWordDifficulty(word);
    setCurrentWord(wordData);
    setShowHelper(true);

    onWordStruggledRef.current(wordData);
    setSessionWords(prev => [...prev, wordData]);

    // Provide help
    if (wordData.definition) {
      await speakHelp(word, wordData.definition);
    } else {
      await speakWord(word);
    }

    setAssistantMessage(getHelpMessage(word, reason, wordData));
  };

  const getHelpMessage = (word, reason, wordData) => {
    const reasons = {
      hesitation: "I noticed you paused. ",
      repetition: "You said that word twice. ",
      'low-confidence': "Let me help with that word. "
    };

    const base = reasons[reason] || "Let me help with that word. ";

    if (wordData.definition) {
      return `${base}"${word}" means ${wordData.definition}. It's pronounced ${wordData.phonetic || word}.`;
    }
    return `${base}Let me say "${word}" for you. Listen carefully!`;
  };

  const endSession = () => {
    if (sessionStart.current) {
      const duration = Math.max(1, Math.floor((Date.now() - sessionStart.current) / 1000));
      const wordsHelped = sessionWords.length;
      onSessionEndRef.current({
        book: currentBook?.title || 'Reading',
        duration,
        wordsHelped,
        words: sessionWords
      });
      sessionStart.current = null;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      endSession();
      stopListening();
      setIsListening(false);
      setAssistantMessage("Great reading session! Want to practice the tricky words in a game?");
    } else {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setAssistantMessage("Your browser doesn't support voice listening yet. Try Chrome or Edge on your phone or tablet!");
        return;
      }
      const started = startListening();
      setIsListening(started);
      if (started) {
        setAssistantMessage("I'm listening! Read out loud and I'll help with tricky words.");
      }
    }
  };

  const handleBookScanned = (book) => {
    setCurrentBook(book);
    setShowScanner(false);
    setAssistantMessage(`Great choice! "${book.title}" looks like a fun book. Start reading whenever you're ready!`);
  };

  const handleAskQuestion = async () => {
    if (!qaInput.trim()) return;
    setIsThinking(true);

    // Simulate AI response - in production, this would call an API
    await new Promise(r => setTimeout(r, 1500));

    const question = qaInput.toLowerCase();
    let response = '';

    if (question.includes('what does') || question.includes('what mean')) {
      response = `That's a great question! Let me think about that... The word or concept you're asking about is something we can explore together. Can you tell me the exact word or phrase you'd like me to explain?`;
    } else if (question.includes('why')) {
      response = `Good thinking! Asking "why" is how we learn. Let me help you understand this part of the story. What specifically are you curious about?`;
    } else if (question.includes('how')) {
      response = `I love that you're trying to figure things out! Let's think about this together. Can you tell me more about what you're trying to understand?`;
    } else {
      response = `That's a thoughtful question! I'm here to help you understand what you're reading. Could you point me to the specific word or sentence you'd like help with?`;
    }

    setQaResponse(response);
    setQaInput('');
    setIsThinking(false);
    await speakWord(response);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="reading-screen">
      {/* Book Header */}
      <div className="book-header">
        {currentBook ? (
          <div className="current-book">
            <BookOpen size={20} />
            <div className="book-info">
              <span className="book-title">{currentBook.title}</span>
              <span className="book-author">{currentBook.author}</span>
            </div>
            <button className="btn btn-small" onClick={() => setShowScanner(true)}>
              Change
            </button>
          </div>
        ) : (
          <button className="btn btn-primary scan-btn" onClick={() => setShowScanner(true)}>
            <Camera size={20} /> Scan a Book
          </button>
        )}
      </div>

      {/* Main Reading Area */}
      <div className="reading-area">
        {/* Assistant Message */}
        {assistantMessage && (
          <div className="assistant-bubble">
            <div className="assistant-avatar">
              <BookOpen size={24} />
            </div>
            <div className="assistant-text">
              <p>{assistantMessage}</p>
            </div>
          </div>
        )}

        {/* Current Word Help */}
        {showHelper && currentWord && (
          <WordHelper
            word={currentWord}
            onClose={() => {
              setShowHelper(false);
              setCurrentWord(null);
              setAssistantMessage('');
            }}
          />
        )}

        {/* Reading Prompt */}
        {!currentBook && !showScanner && (
          <div className="reading-prompt">
            <div className="prompt-icon">
              <BookOpen size={80} />
            </div>
            <h2>Ready to Read?</h2>
            <p>First, let's scan your book so I know what you're reading!</p>
            <button className="btn btn-primary btn-large" onClick={() => setShowScanner(true)}>
              <Camera size={24} /> Scan Your Book
            </button>
          </div>
        )}

        {currentBook && !showHelper && (
          <div className="reading-prompt">
            <div className="prompt-icon">
              <BookOpen size={80} />
            </div>
            <h2>Start Reading Aloud!</h2>
            <p>Press the microphone button and read your book out loud. I'll help with tricky words!</p>

            {/* Session Stats */}
            {isListening && (
              <div className="session-stats">
                <div className="stat">
                  <span className="stat-value">{formatTime(sessionTime)}</span>
                  <span className="stat-label">Reading time</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{sessionWords.length}</span>
                  <span className="stat-label">Words helped</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="reading-controls">
        <button
          className={`mic-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          disabled={!currentBook}
        >
          {isListening ? <MicOff size={32} /> : <Mic size={32} />}
        </button>

        {isListening && (
          <div className="listening-indicator">
            <div className="pulse"></div>
            <span>Listening...</span>
          </div>
        )}

        <div className="secondary-controls">
          <button
            className="btn btn-icon"
            onClick={() => setShowQA(true)}
            disabled={!currentBook}
            title="Ask a question"
          >
            <MessageCircle size={24} />
          </button>
        </div>
      </div>

      {/* Q&A Modal */}
      {showQA && (
        <div className="modal-overlay" onClick={() => setShowQA(false)}>
          <div className="modal-content qa-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Ask a Question</h2>
              <button className="btn btn-icon" onClick={() => setShowQA(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p className="qa-hint">
                Ask me anything about what you're reading! You can type or tap the microphone to ask.
              </p>
              <div className="qa-input-group">
                <input
                  type="text"
                  value={qaInput}
                  onChange={(e) => setQaInput(e.target.value)}
                  placeholder="What does this word mean?"
                  className="qa-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleAskQuestion}
                  disabled={isThinking || !qaInput.trim()}
                >
                  {isThinking ? 'Thinking...' : 'Ask'}
                </button>
              </div>
              {qaResponse && (
                <div className="qa-response">
                  <div className="assistant-bubble">
                    <div className="assistant-avatar">
                      <BookOpen size={20} />
                    </div>
                    <div className="assistant-text">
                      <p>{qaResponse}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Book Scanner Modal */}
      {showScanner && (
        <BookScanner
          onBookScanned={handleBookScanned}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
