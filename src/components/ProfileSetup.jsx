import { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

export default function ProfileSetup({ onSave }) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(7);
  const [step, setStep] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, age, createdAt: new Date().toISOString() });
  };

  return (
    <div className="profile-setup">
      <div className="setup-card">
        {step === 1 && (
          <>
            <div className="setup-icon">
              <BookOpen size={64} />
            </div>
            <h1>Welcome to ReadBuddy!</h1>
            <p className="setup-subtitle">Your reading adventure starts here</p>
            <div className="setup-form">
              <label className="setup-label">
                What's your name?
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="setup-input"
                  autoFocus
                />
              </label>
              <button
                className="btn btn-primary btn-large"
                onClick={() => name.trim() && setStep(2)}
                disabled={!name.trim()}
              >
                Next <Sparkles size={18} />
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="setup-icon">
              <Sparkles size={64} />
            </div>
            <h1>Hi, {name}!</h1>
            <p className="setup-subtitle">How old are you?</p>
            <div className="setup-form">
              <div className="age-selector">
                {[5, 6, 7, 8, 9, 10, 11, 12].map(a => (
                  <button
                    key={a}
                    className={`age-btn ${age === a ? 'selected' : ''}`}
                    onClick={() => setAge(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary btn-large"
                onClick={handleSubmit}
              >
                Let's Start Reading! <BookOpen size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
