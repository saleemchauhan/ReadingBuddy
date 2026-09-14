import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trophy, Star, RotateCcw, BookOpen, Volume2, Sparkles, Check, X } from 'lucide-react';
import { speakWord } from '../utils/textToSpeech';
import { getWordDifficulty, getRecommendedWordsForAge } from '../data/wordDatabase';

const GAMES = [
  { id: 'wordmatch', name: 'Word Match', icon: '🎯', description: 'Match words to their meanings' },
  { id: 'spellit', name: 'Spell It', icon: '✏️', description: 'Type the word correctly' },
  { id: 'fillblank', name: 'Fill the Blank', icon: '📝', description: 'Choose the right word' },
  { id: 'syllable', name: 'Syllable Builder', icon: '🧩', description: 'Break words into parts' },
  { id: 'pronounce', name: 'Say It Right', icon: '🗣️', description: 'Listen and repeat words' },
];

export default function GameScreen({ childProfile, struggledWords }) {
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameScore, setGameScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  const getGameWords = useCallback(() => {
    // Use struggled words first, then add age-appropriate words
    const words = struggledWords
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(w => getWordDifficulty(w.word));

    // If not enough struggled words, add recommended words
    if (words.length < 5) {
      const recommended = getRecommendedWordsForAge(childProfile.age);
      words.push(...recommended.slice(0, 10 - words.length));
    }

    return words.length > 0 ? words : getRecommendedWordsForAge(childProfile.age).slice(0, 5);
  }, [struggledWords, childProfile.age]);

  const handleGameComplete = (score) => {
    setGameScore(score);
    setGameComplete(true);
  };

  const handlePlayAgain = () => {
    setGameScore(0);
    setGameComplete(false);
    setSelectedGame(null);
  };

  if (gameComplete) {
    return (
      <div className="game-screen">
        <div className="game-complete">
          <div className="trophy-icon">
            <Trophy size={80} />
          </div>
          <h1>Amazing Job!</h1>
          <div className="score-display">
            <Star size={32} className="star-filled" />
            <span className="score-value">{gameScore}</span>
            <span className="score-label">points</span>
          </div>
          <p className="encouragement">
            {gameScore >= 80 ? "You're a word wizard! 🌟" :
             gameScore >= 60 ? "Great work! Keep practicing! 💪" :
             "Good try! Every word makes you stronger! 🌱"}
          </p>
          <div className="game-complete-actions">
            <button className="btn btn-primary btn-large" onClick={handlePlayAgain}>
              <RotateCcw size={20} /> Play Again
            </button>
            <Link to="/" className="btn btn-secondary btn-large">
              Back to Reading
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (selectedGame) {
    const words = getGameWords();
    const GameComponent = getGameComponent(selectedGame);
    return (
      <div className="game-screen">
        <div className="game-header">
          <button className="btn btn-icon" onClick={() => setSelectedGame(null)}>
            <ArrowLeft size={24} />
          </button>
          <h2>{GAMES.find(g => g.id === selectedGame)?.name}</h2>
          <div className="game-score">
            <Star size={18} className="star-filled" />
            <span>{gameScore}</span>
          </div>
        </div>
        <GameComponent
          words={words}
          onScore={setGameScore}
          onComplete={handleGameComplete}
          childProfile={childProfile}
        />
      </div>
    );
  }

  return (
    <div className="game-screen">
      <div className="game-lobby">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Back to Reading
        </Link>

        <div className="game-lobby-header">
          <Sparkles size={40} />
          <h1>Word Games</h1>
          <p>Practice tricky words and become a reading champion!</p>
        </div>

        {struggledWords.length > 0 && (
          <div className="struggled-words-preview">
            <h3>Words to practice</h3>
            <div className="word-tags">
              {struggledWords.slice(0, 8).map((w, i) => (
                <span key={i} className="word-tag">
                  {w.word}
                  <span className="tag-count">×{w.count}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="game-grid">
          {GAMES.map(game => (
            <button
              key={game.id}
              className="game-card"
              onClick={() => setSelectedGame(game.id)}
            >
              <span className="game-icon">{game.icon}</span>
              <h3>{game.name}</h3>
              <p>{game.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function getGameComponent(gameId) {
  switch (gameId) {
    case 'wordmatch': return WordMatchGame;
    case 'spellit': return SpellItGame;
    case 'fillblank': return FillBlankGame;
    case 'syllable': return SyllableGame;
    case 'pronounce': return PronounceGame;
    default: return WordMatchGame;
  }
}

// Word Match Game
function WordMatchGame({ words, onScore, onComplete }) {
  const [matches, setMatches] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [selectedDef, setSelectedDef] = useState(null);
  const [shuffledWords, setShuffledWords] = useState([]);
  const [shuffledDefs, setShuffledDefs] = useState([]);

  useEffect(() => {
    const gameWords = words.filter(w => w.definition).slice(0, 4);
    setShuffledWords([...gameWords].sort(() => Math.random() - 0.5));
    setShuffledDefs([...gameWords].sort(() => Math.random() - 0.5));
  }, [words]);

  const handleWordClick = (word) => {
    if (matches.includes(word.word)) return;
    setSelectedWord(word);
    checkMatch(word, selectedDef);
  };

  const handleDefClick = (def) => {
    if (matches.includes(def.word)) return;
    setSelectedDef(def);
    checkMatch(selectedWord, def);
  };

  const checkMatch = (word, def) => {
    if (!word || !def) return;
    if (word.word === def.word) {
      setMatches(prev => [...prev, word.word]);
      onScore(prev => prev + 25);
      speakWord(word.word);
      setSelectedWord(null);
      setSelectedDef(null);

      if (matches.length + 1 >= shuffledWords.length) {
        setTimeout(() => onComplete(100), 1000);
      }
    } else {
      setSelectedWord(null);
      setSelectedDef(null);
    }
  };

  return (
    <div className="game-content word-match-game">
      <p className="game-instruction">Tap a word, then tap its meaning!</p>
      <div className="match-container">
        <div className="match-column">
          <h3>Words</h3>
          {shuffledWords.map((word, i) => (
            <button
              key={i}
              className={`match-item ${matches.includes(word.word) ? 'matched' : ''} ${selectedWord?.word === word.word ? 'selected' : ''}`}
              onClick={() => handleWordClick(word)}
              disabled={matches.includes(word.word)}
            >
              {word.word}
              {matches.includes(word.word) && <Check size={16} />}
            </button>
          ))}
        </div>
        <div className="match-column">
          <h3>Meanings</h3>
          {shuffledDefs.map((def, i) => (
            <button
              key={i}
              className={`match-item ${matches.includes(def.word) ? 'matched' : ''} ${selectedDef?.word === def.word ? 'selected' : ''}`}
              onClick={() => handleDefClick(def)}
              disabled={matches.includes(def.word)}
            >
              {def.definition}
              {matches.includes(def.word) && <Check size={16} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Spell It Game
function SpellItGame({ words, onScore, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [correct, setCorrect] = useState(0);

  const currentWord = words[currentIdx];

  useEffect(() => {
    if (currentWord) {
      speakWord(currentWord.word);
    }
  }, [currentIdx, currentWord]);

  const handleSubmit = () => {
    if (input.toLowerCase() === currentWord.word.toLowerCase()) {
      setFeedback('correct');
      setCorrect(prev => prev + 1);
      onScore(prev => prev + 20);
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      if (currentIdx + 1 >= words.length) {
        onComplete(Math.round((correct / words.length) * 100));
      } else {
        setCurrentIdx(prev => prev + 1);
      }
    }, 1500);
  };

  const handleHint = () => {
    const hint = currentWord.word.slice(0, 2) + '_'.repeat(currentWord.word.length - 2);
    setInput(hint);
    onScore(prev => Math.max(0, prev - 5));
  };

  if (!currentWord) return <div>Loading...</div>;

  return (
    <div className="game-content spell-game">
      <p className="game-instruction">
        Listen carefully and type the word!
      </p>

      <div className="spell-display">
        <div className="word-number">
          {currentIdx + 1} / {words.length}
        </div>
        <button className="btn btn-listen" onClick={() => speakWord(currentWord.word)}>
          <Volume2 size={32} />
        </button>
        <p className="spell-hint">Tap to hear the word again</p>
      </div>

      <div className="spell-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type the word here..."
          className={`spell-input ${feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : ''}`}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
          disabled={feedback !== null}
        />
        {feedback === 'correct' && (
          <div className="feedback correct">
            <Check size={24} /> Correct! Great job!
          </div>
        )}
        {feedback === 'incorrect' && (
          <div className="feedback incorrect">
            <X size={24} /> Not quite! It's <strong>{currentWord.word}</strong>
          </div>
        )}
      </div>

      <div className="spell-actions">
        <button className="btn btn-secondary" onClick={handleHint} disabled={feedback !== null}>
          Hint
        </button>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={!input.trim() || feedback !== null}>
          Check
        </button>
      </div>
    </div>
  );
}

// Fill the Blank Game
function FillBlankGame({ words, onScore, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const currentWord = words[currentIdx];
  const options = words.slice(0, 4).sort(() => Math.random() - 0.5);

  const handleSelect = (option) => {
    setSelected(option);
    if (option.word === currentWord.word) {
      setFeedback('correct');
      onScore(prev => prev + 15);
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      if (currentIdx + 1 >= words.length) {
        onComplete(75);
      } else {
        setCurrentIdx(prev => prev + 1);
      }
    }, 1500);
  };

  if (!currentWord || !currentWord.definition) return <div>Loading...</div>;

  return (
    <div className="game-content fill-blank-game">
      <p className="game-instruction">
        Choose the word that matches the meaning!
      </p>

      <div className="fill-display">
        <div className="definition-card">
          <BookOpen size={24} />
          <p>{currentWord.definition}</p>
        </div>
      </div>

      <div className="fill-options">
        {options.map((opt, i) => (
          <button
            key={i}
            className={`fill-option ${selected?.word === opt.word ? (feedback === 'correct' ? 'correct' : 'incorrect') : ''}`}
            onClick={() => !feedback && handleSelect(opt)}
            disabled={feedback !== null}
          >
            {opt.word}
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' ? (
            <><Check size={20} /> Yes! "{currentWord.word}" is correct!</>
          ) : (
            <><X size={20} /> The correct word is "<strong>{currentWord.word}</strong>"</>
          )}
        </div>
      )}
    </div>
  );
}

// Syllable Builder Game
function SyllableGame({ words, onScore, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);

  const currentWord = words[currentIdx];

  const getSyllables = (word) => {
    // Simple syllable splitting
    const syllables = word.match(/[^aeiou]*[aeiou]+[^aeiou]*/gi) || [word];
    return syllables;
  };

  const handleSubmit = () => {
    const userSyllables = input.split(/[-\s]+/).filter(Boolean).length;
    const actualSyllables = getSyllables(currentWord.word).length;

    if (Math.abs(userSyllables - actualSyllables) <= 1) {
      setFeedback('correct');
      onScore(prev => prev + 20);
    } else {
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setInput('');
      if (currentIdx + 1 >= words.length) {
        onComplete(80);
      } else {
        setCurrentIdx(prev => prev + 1);
      }
    }, 2000);
  };

  if (!currentWord) return <div>Loading...</div>;

  return (
    <div className="game-content syllable-game">
      <p className="game-instruction">
        Break this word into syllables! Use - to separate them.
      </p>

      <div className="syllable-display">
        <h2 className="target-word">{currentWord.word}</h2>
        <button className="btn btn-listen" onClick={() => speakWord(currentWord.word)}>
          <Volume2 size={24} /> Listen
        </button>
      </div>

      <div className="syllable-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., beau-ti-ful"
          className={`syllable-input ${feedback === 'correct' ? 'correct' : feedback === 'incorrect' ? 'incorrect' : ''}`}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={feedback !== null}
        />
      </div>

      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' ? (
            <><Check size={20} /> Great! The syllables are: {getSyllables(currentWord.word).join('-')}</>
          ) : (
            <><X size={20} /> Try again! The syllables are: <strong>{getSyllables(currentWord.word).join('-')}</strong></>
          )}
        </div>
      )}

      <div className="syllable-actions">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={!input.trim() || feedback !== null}>
          Check
        </button>
      </div>
    </div>
  );
}

// Pronounce Game
function PronounceGame({ words, onScore, onComplete }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const currentWord = words[currentIdx];

  const handlePronounce = () => {
    setIsRecording(true);
    // Simulate recording and checking pronunciation
    setTimeout(() => {
      setIsRecording(false);
      setFeedback('correct');
      onScore(prev => prev + 25);
      speakWord(currentWord.word);

      setTimeout(() => {
        setFeedback(null);
        if (currentIdx + 1 >= words.length) {
          onComplete(90);
        } else {
          setCurrentIdx(prev => prev + 1);
        }
      }, 2000);
    }, 2000);
  };

  if (!currentWord) return <div>Loading...</div>;

  return (
    <div className="game-content pronounce-game">
      <p className="game-instruction">
        Listen to the word, then say it out loud!
      </p>

      <div className="pronounce-display">
        <h2 className="target-word">{currentWord.word}</h2>
        {currentWord.phonetic && (
          <p className="phonetic">{currentWord.phonetic}</p>
        )}
      </div>

      <div className="pronounce-actions">
        <button
          className={`btn btn-listen btn-large ${isRecording ? 'recording' : ''}`}
          onClick={handlePronounce}
          disabled={isRecording}
        >
          <Volume2 size={32} />
          {isRecording ? 'Listening to you...' : 'Hear it first'}
        </button>

        <button
          className={`btn btn-record btn-large ${isRecording ? 'recording' : ''}`}
          onClick={handlePronounce}
          disabled={isRecording}
        >
          {isRecording ? 'Recording...' : 'Say it!'}
        </button>
      </div>

      {feedback && (
        <div className={`feedback ${feedback}`}>
          {feedback === 'correct' ? (
            <><Check size={20} /> Excellent pronunciation! ⭐</>
          ) : (
            <><X size={20} /> Try listening again!</>
          )}
        </div>
      )}
    </div>
  );
}
