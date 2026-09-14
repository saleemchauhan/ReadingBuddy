import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star, TrendingUp, Calendar, Target, ArrowRight } from 'lucide-react';
import { getWordDifficulty } from '../data/wordDatabase';

export default function Dashboard({ childProfile, struggledWords, sessions }) {
  const stats = useMemo(() => {
    const totalWords = struggledWords.length;
    const masteredWords = struggledWords.filter(w => w.count <= 1).length;
    const learningWords = struggledWords.filter(w => w.count > 1 && w.count <= 3).length;
    const challengingWords = struggledWords.filter(w => w.count > 3).length;

    const totalReadingTime = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    const avgSessionLength = sessions.length > 0 ? Math.round(totalReadingTime / sessions.length) : 0;

    // Words by difficulty
    const byDifficulty = struggledWords.reduce((acc, w) => {
      const wordData = getWordDifficulty(w.word);
      const level = wordData.difficulty || 1;
      acc[level] = (acc[level] || 0) + w.count;
      return acc;
    }, {});

    return {
      totalWords,
      masteredWords,
      learningWords,
      challengingWords,
      totalReadingTime,
      avgSessionLength,
      totalSessions: sessions.length,
      byDifficulty
    };
  }, [struggledWords, sessions]);

  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{childProfile.name}'s Progress</h1>
        <p>Keep up the great reading!</p>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalSessions}</span>
            <span className="stat-label">Reading Sessions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalWords}</span>
            <span className="stat-label">Words Learned</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <Star size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.masteredWords}</span>
            <span className="stat-label">Mastered</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.learningWords}</span>
            <span className="stat-label">Learning</span>
          </div>
        </div>
      </div>

      {/* Word Mastery Progress */}
      <div className="section-card">
        <h2>Word Mastery</h2>
        <div className="mastery-bars">
          <div className="mastery-row">
            <span className="mastery-label">Mastered</span>
            <div className="mastery-bar">
              <div
                className="mastery-fill mastered"
                style={{ width: `${stats.totalWords > 0 ? (stats.masteredWords / stats.totalWords) * 100 : 0}%` }}
              />
            </div>
            <span className="mastery-count">{stats.masteredWords}</span>
          </div>
          <div className="mastery-row">
            <span className="mastery-label">Learning</span>
            <div className="mastery-bar">
              <div
                className="mastery-fill learning"
                style={{ width: `${stats.totalWords > 0 ? (stats.learningWords / stats.totalWords) * 100 : 0}%` }}
              />
            </div>
            <span className="mastery-count">{stats.learningWords}</span>
          </div>
          <div className="mastery-row">
            <span className="mastery-label">Challenging</span>
            <div className="mastery-bar">
              <div
                className="mastery-fill challenging"
                style={{ width: `${stats.totalWords > 0 ? (stats.challengingWords / stats.totalWords) * 100 : 0}%` }}
              />
            </div>
            <span className="mastery-count">{stats.challengingWords}</span>
          </div>
        </div>
      </div>

      {/* Words to Practice */}
      <div className="section-card">
        <h2>Words to Practice</h2>
        {struggledWords.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <p>Start reading to see your words here!</p>
          </div>
        ) : (
          <div className="word-list">
            {struggledWords
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
              .map((word, i) => (
                <div key={i} className="word-item">
                  <div className="word-info">
                    <span className="word-name">{word.word}</span>
                    <span className="word-count">Seen {word.count}×</span>
                  </div>
                  <div className="word-mastery-indicator">
                    {word.count <= 1 ? '⭐' : word.count <= 3 ? '📚' : '🎯'}
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      <div className="section-card">
        <h2>Recent Sessions</h2>
        {sessions.length === 0 ? (
          <div className="empty-state">
            <Calendar size={48} />
            <p>Your reading history will appear here!</p>
          </div>
        ) : (
          <div className="session-list">
            {sessions.slice(-5).reverse().map((session, i) => (
              <div key={i} className="session-item">
                <div className="session-date">
                  {new Date(session.date).toLocaleDateString()}
                </div>
                <div className="session-details">
                  <span>{session.book || 'Reading'}</span>
                  <span>{formatTime(session.duration || 0)} · {session.wordsHelped || 0} words</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Difficulty Level Breakdown */}
      <div className="section-card">
        <h2>Words by Difficulty</h2>
        <div className="difficulty-grid">
          {[1, 2, 3, 4, 5].map(level => (
            <div key={level} className="difficulty-item">
              <div className="difficulty-level">
                {Array(level).fill('⭐').join('')}
              </div>
              <span className="difficulty-count">{stats.byDifficulty[level] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section-card quick-actions">
        <Link to="/" className="action-btn">
          <BookOpen size={24} />
          <span>Start Reading</span>
          <ArrowRight size={18} />
        </Link>
        <Link to="/games" className="action-btn">
          <Target size={24} />
          <span>Play Games</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
