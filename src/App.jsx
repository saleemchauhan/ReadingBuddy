import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, Gamepad2, BarChart3, UserCircle } from 'lucide-react';
import ReadingScreen from './components/ReadingScreen';
import GameScreen from './components/GameScreen';
import Dashboard from './components/Dashboard';
import ProfileSetup from './components/ProfileSetup';
import './App.css';

function App() {
  const [childProfile, setChildProfile] = useState(() => {
    const saved = localStorage.getItem('readbuddy-profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [struggledWords, setStruggledWords] = useState(() => {
    const saved = localStorage.getItem('readbuddy-struggled');
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('readbuddy-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentBook, setCurrentBook] = useState(null);

  useEffect(() => {
    localStorage.setItem('readbuddy-profile', JSON.stringify(childProfile));
  }, [childProfile]);

  useEffect(() => {
    localStorage.setItem('readbuddy-struggled', JSON.stringify(struggledWords));
  }, [struggledWords]);

  useEffect(() => {
    localStorage.setItem('readbuddy-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleProfileSave = (profile) => {
    setChildProfile(profile);
  };

  const handleWordStruggled = (word) => {
    setStruggledWords(prev => {
      const existing = prev.find(w => w.word === word.word);
      if (existing) {
        return prev.map(w => w.word === word.word
          ? { ...w, count: w.count + 1, lastSeen: new Date().toISOString() }
          : w
        );
      }
      return [...prev, { ...word, count: 1, firstSeen: new Date().toISOString(), lastSeen: new Date().toISOString() }];
    });
  };

  const handleSessionEnd = (session) => {
    setSessions(prev => [...prev, { ...session, date: new Date().toISOString() }]);
  };

  if (!childProfile) {
    return <ProfileSetup onSave={handleProfileSave} />;
  }

  return (
    <Router>
      <div className="app">
        <AppContent
          childProfile={childProfile}
          struggledWords={struggledWords}
          sessions={sessions}
          currentBook={currentBook}
          setCurrentBook={setCurrentBook}
          onWordStruggled={handleWordStruggled}
          onSessionEnd={handleSessionEnd}
        />
      </div>
    </Router>
  );
}

function AppContent({ childProfile, struggledWords, sessions, currentBook, setCurrentBook, onWordStruggled, onSessionEnd }) {
  const location = useLocation();
  const isGameScreen = location.pathname === '/games';

  return (
    <>
      {!isGameScreen && (
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <BookOpen size={28} />
              <span>ReadBuddy</span>
            </div>
            <div className="child-name">
              <UserCircle size={20} />
              <span>{childProfile.name}</span>
            </div>
          </div>
        </header>
      )}

      <main className={`app-main ${isGameScreen ? 'game-mode' : ''}`}>
        <Routes>
          <Route path="/" element={
            <ReadingScreen
              childProfile={childProfile}
              currentBook={currentBook}
              setCurrentBook={setCurrentBook}
              onWordStruggled={onWordStruggled}
              onSessionEnd={onSessionEnd}
              struggledWords={struggledWords}
            />
          } />
          <Route path="/games" element={
            <GameScreen
              childProfile={childProfile}
              struggledWords={struggledWords}
            />
          } />
          <Route path="/dashboard" element={
            <Dashboard
              childProfile={childProfile}
              struggledWords={struggledWords}
              sessions={sessions}
            />
          } />
        </Routes>
      </main>

      {!isGameScreen && (
        <nav className="bottom-nav">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <BookOpen size={22} />
            <span>Read</span>
          </Link>
          <Link to="/games" className={`nav-item ${location.pathname === '/games' ? 'active' : ''}`}>
            <Gamepad2 size={22} />
            <span>Games</span>
          </Link>
          <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <BarChart3 size={22} />
            <span>Progress</span>
          </Link>
        </nav>
      )}
    </>
  );
}

export default App;
