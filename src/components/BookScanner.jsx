import { useState, useRef, useEffect } from 'react';
import { Camera, X, BookOpen, Search } from 'lucide-react';

const BOOK_DATABASE = [
  { title: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", level: 4, genre: "Fantasy" },
  { title: "Charlotte's Web", author: "E.B. White", level: 3, genre: "Fiction" },
  { title: "The Cat in the Hat", author: "Dr. Seuss", level: 1, genre: "Picture Book" },
  { title: "Green Eggs and Ham", author: "Dr. Seuss", level: 1, genre: "Picture Book" },
  { title: "The Very Hungry Caterpillar", author: "Eric Carle", level: 1, genre: "Picture Book" },
  { title: "Where the Wild Things Are", author: "Maurice Sendak", level: 2, genre: "Picture Book" },
  { title: "The BFG", author: "Roald Dahl", level: 3, genre: "Fantasy" },
  { title: "Charlie and the Chocolate Factory", author: "Roald Dahl", level: 3, genre: "Fantasy" },
  { title: "Matilda", author: "Roald Dahl", level: 3, genre: "Fiction" },
  { title: "James and the Giant Peach", author: "Roald Dahl", level: 3, genre: "Fantasy" },
  { title: "The Gruffalo", author: "Julia Donaldson", level: 2, genre: "Picture Book" },
  { title: "Percy Jackson and the Lightning Thief", author: "Rick Riordan", level: 4, genre: "Fantasy" },
  { title: "Diary of a Wimpy Kid", author: "Jeff Kinney", level: 3, genre: "Fiction" },
  { title: "Dog Man", author: "Dav Pilkey", level: 2, genre: "Graphic Novel" },
  { title: "Captain Underpants", author: "Dav Pilkey", level: 2, genre: "Fiction" },
  { title: "The Hobbit", author: "J.R.R. Tolkien", level: 5, genre: "Fantasy" },
  { title: "A Wrinkle in Time", author: "Madeleine L'Engle", level: 4, genre: "Sci-Fi" },
  { title: "The Chronicles of Narnia", author: "C.S. Lewis", level: 4, genre: "Fantasy" },
  { title: "Diary of a Young Girl", author: "Anne Frank", level: 4, genre: "Historical" },
  { title: "Hatchet", author: "Gary Paulsen", level: 4, genre: "Adventure" },
  { title: "Bridge to Terabithia", author: "Katherine Paterson", level: 4, genre: "Fiction" },
  { title: "The Secret Garden", author: "Frances Hodgson Burnett", level: 3, genre: "Fiction" },
  { title: "Black Beauty", author: "Anna Sewell", level: 3, genre: "Fiction" },
  { title: "Treasure Island", author: "Robert Louis Stevenson", level: 5, genre: "Adventure" },
  { title: "Robinson Crusoe", author: "Daniel Defoe", level: 5, genre: "Adventure" },
  { title: "Alice in Wonderland", author: "Lewis Carroll", level: 4, genre: "Fantasy" },
  { title: "Peter Pan", author: "J.M. Barrie", level: 3, genre: "Fantasy" },
  { title: "Pinocchio", author: "Carlo Collodi", level: 3, genre: "Fiction" },
  { title: "The Adventures of Tom Sawyer", author: "Mark Twain", level: 5, genre: "Fiction" },
  { title: "Little Women", author: "Louisa May Alcott", level: 4, genre: "Fiction" },
];

export default function BookScanner({ onBookScanned, onClose }) {
  const [mode, setMode] = useState('choose'); // choose, camera, search
  const [searchQuery, setSearchQuery] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const filteredBooks = BOOK_DATABASE.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMode('camera');
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Camera access is needed to scan book covers. You can also search for your book manually!');
      setMode('search');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const simulateScan = async () => {
    setIsScanning(true);

    // Simulate book recognition (in production, this would use image recognition)
    await new Promise(r => setTimeout(r, 2000));

    // Pick a random book as "recognized"
    const randomBook = BOOK_DATABASE[Math.floor(Math.random() * BOOK_DATABASE.length)];
    setScanResult(randomBook);
    setIsScanning(false);
    stopCamera();
  };

  const handleSelectBook = (book) => {
    onBookScanned({
      ...book,
      scannedAt: new Date().toISOString()
    });
  };

  const handleManualAdd = () => {
    if (searchQuery.trim()) {
      onBookScanned({
        title: searchQuery.trim(),
        author: 'Unknown Author',
        level: 3,
        genre: 'Unknown',
        scannedAt: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content scanner-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <BookOpen size={24} />
            Find Your Book
          </h2>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {mode === 'choose' && (
            <div className="scanner-choices">
              <button className="choice-card" onClick={startCamera}>
                <Camera size={48} />
                <h3>Scan Book Cover</h3>
                <p>Point your camera at the book cover</p>
              </button>
              <button className="choice-card" onClick={() => setMode('search')}>
                <Search size={48} />
                <h3>Search by Title</h3>
                <p>Find your book in our database</p>
              </button>
            </div>
          )}

          {mode === 'camera' && (
            <div className="camera-view">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="camera-feed"
              />
              {isScanning ? (
                <div className="scanning-overlay">
                  <div className="scan-animation"></div>
                  <p>Scanning book cover...</p>
                </div>
              ) : scanResult ? (
                <div className="scan-result">
                  <div className="scan-success">
                    <BookOpen size={48} />
                    <h3>Book Found!</h3>
                  </div>
                  <div className="book-card">
                    <h4>{scanResult.title}</h4>
                    <p>{scanResult.author}</p>
                    <span className="book-level">Level {scanResult.level}</span>
                  </div>
                  <div className="scan-actions">
                    <button className="btn btn-primary" onClick={() => handleSelectBook(scanResult)}>
                      This is my book!
                    </button>
                    <button className="btn btn-secondary" onClick={() => { setScanResult(null); setMode('camera'); }}>
                      Try again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="camera-controls">
                  <button className="btn btn-primary btn-large scan-capture" onClick={simulateScan}>
                    <Camera size={32} />
                    Capture
                  </button>
                </div>
              )}
            </div>
          )}

          {mode === 'search' && (
            <div className="search-view">
              <div className="search-input-group">
                <Search size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a book title..."
                  className="search-input"
                  autoFocus
                />
              </div>

              <div className="book-results">
                {searchQuery && filteredBooks.length === 0 && (
                  <div className="no-results">
                    <p>Can't find your book?</p>
                    <button className="btn btn-primary" onClick={handleManualAdd}>
                      Add "{searchQuery}" manually
                    </button>
                  </div>
                )}

                {filteredBooks.map((book, idx) => (
                  <div
                    key={idx}
                    className="book-result-card"
                    onClick={() => handleSelectBook(book)}
                  >
                    <div className="book-cover-placeholder">
                      <BookOpen size={32} />
                    </div>
                    <div className="book-details">
                      <h4>{book.title}</h4>
                      <p>{book.author}</p>
                      <div className="book-meta">
                        <span className="book-level">Level {book.level}</span>
                        <span className="book-genre">{book.genre}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {!searchQuery && (
                  <div className="search-hint">
                    <BookOpen size={48} />
                    <p>Start typing to search for your book</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
