import { useState } from 'react';
import { Volume2, X, BookOpen, Lightbulb, Star } from 'lucide-react';
import { speakWord, speakPhonetic } from '../utils/textToSpeech';

export default function WordHelper({ word, onClose }) {
  const [showDefinition, setShowDefinition] = useState(false);

  if (!word) return null;

  const difficultyStars = Array(5).fill(false).map((_, i) => i < word.difficulty);

  return (
    <div className="word-helper">
      <div className="word-helper-card">
        <button className="btn btn-icon close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="word-display">
          <h2 className="the-word">{word.word}</h2>
          <div className="difficulty-badge">
            {difficultyStars.map((filled, i) => (
              <Star key={i} size={16} className={filled ? 'star-filled' : 'star-empty'} />
            ))}
            <span>Tricky Word</span>
          </div>
        </div>

        {word.phonetic && (
          <div className="phonetic-section">
            <button
              className="btn btn-phonetic"
              onClick={() => speakPhonetic(word.phonetic)}
            >
              <Volume2 size={18} />
              <span className="phonetic-text">{word.phonetic}</span>
            </button>
          </div>
        )}

        <div className="helper-actions">
          <button
            className="btn btn-primary btn-large"
            onClick={() => speakWord(word.word)}
          >
            <Volume2 size={20} />
            Say it for me
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => setShowDefinition(!showDefinition)}
          >
            <Lightbulb size={18} />
            {showDefinition ? 'Hide meaning' : 'What does it mean?'}
          </button>
        </div>

        {showDefinition && word.definition && (
          <div className="definition-box">
            <BookOpen size={18} />
            <p>{word.definition}</p>
          </div>
        )}

        <div className="helper-encouragement">
          <span>Great job asking for help! That's how we learn!</span>
        </div>
      </div>
    </div>
  );
}
