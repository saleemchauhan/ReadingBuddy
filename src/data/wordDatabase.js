// Word difficulty database with Dolch, Fry, and irregular English words
// Difficulty levels: 1 (easiest) to 5 (hardest)

const DOLCH_WORDS = {
  1: ['a', 'and', 'away', 'big', 'blue', 'can', 'come', 'down', 'find', 'for', 'funny', 'go', 'help', 'here', 'I', 'in', 'is', 'it', 'jump', 'little', 'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said', 'see', 'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you'],
  2: ['all', 'am', 'are', 'at', 'ate', 'be', 'black', 'brown', 'but', 'came', 'did', 'do', 'eat', 'four', 'get', 'good', 'have', 'he', 'into', 'like', 'must', 'new', 'no', 'now', 'on', 'our', 'out', 'please', 'pretty', 'ran', 'ride', 'saw', 'say', 'she', 'so', 'soon', 'that', 'there', 'they', 'this', 'too', 'under', 'want', 'was', 'well', 'went', 'what', 'white', 'who', 'will', 'with', 'yes'],
  3: ['about', 'better', 'bring', 'carry', 'clean', 'cut', 'done', 'draw', 'drink', 'eight', 'fall', 'far', 'full', 'got', 'grow', 'hold', 'hot', 'hurt', 'if', 'keep', 'kind', 'laugh', 'light', 'long', 'much', 'myself', 'never', 'only', 'own', 'pick', 'seven', 'shall', 'show', 'six', 'small', 'start', 'ten', 'today', 'together', 'try', 'warm'],
  4: ['Always', 'Around', 'Because', 'Been', 'Before', 'Best', 'Both', 'Buy', 'Call', 'Cold', 'Does', 'Don\'t', 'Fast', 'First', 'Five', 'Found', 'Gave', 'Goes', 'Green', 'Its', 'Made', 'May', 'Off', 'Or', 'Pull', 'Read', 'Right', 'Sing', 'Sit', 'Sleep', 'Tell', 'Their', 'These', 'Those', 'Upon', 'Us', 'Use', 'Very', 'Wash', 'Which', 'Why', 'Wish', 'Work', 'Would', 'Write', 'Your'],
  5: ['An', 'Every', 'From', 'Give', 'Had', 'Has', 'Him', 'His', 'How', 'Just', 'Know', 'Let', 'Live', 'May', 'Of', 'Old', 'Once', 'Open', 'Over', 'Put', 'Round', 'Some', 'Stop', 'Take', 'Thank', 'Then', 'When', 'Went']
};

const FRY_WORDS = {
  1: ['the', 'of', 'and', 'a', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'I', 'at', 'be', 'this', 'have', 'from', 'or', 'one', 'had', 'by', 'words', 'but', 'not', 'what', 'all', 'were', 'we', 'when', 'your', 'can', 'said', 'there', 'use', 'an', 'each', 'which', 'she', 'do', 'how', 'their', 'if'],
  2: ['will', 'up', 'other', 'about', 'out', 'many', 'then', 'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'him', 'into', 'time', 'has', 'look', 'two', 'more', 'write', 'go', 'see', 'number', 'no', 'way', 'could', 'people', 'my', 'than', 'first', 'water', 'been', 'call', 'who', 'oil', 'sit', 'now', 'find', 'long', 'down', 'day', 'did', 'get', 'come', 'made', 'may', 'part'],
  3: ['over', 'new', 'sound', 'take', 'only', 'little', 'work', 'know', 'place', 'years', 'live', 'me', 'back', 'give', 'very', 'after', 'things', 'our', 'just', 'name', 'hand', 'high', 'keep', 'last', 'let', 'thought', 'help', 'make', 'great', 'where', 'through', 'much', 'before', 'line', 'right', 'too', 'means', 'old', 'any', 'same', 'tell', 'boy', 'follow', 'came', 'want', 'show', 'also', 'around', 'farm', 'three'],
  4: ['small', 'every', 'found', 'still', 'learn', 'should', ' America', 'world', 'large', 'spell', 'add', 'land', 'here', 'must', 'big', 'even', 'such', 'because', 'turn', 'why', 'ask', 'went', 'men', 'read', 'need', 'land', 'different', 'home', 'us', 'move', 'try', 'kind', 'hand', 'picture', 'again', 'change', 'off', 'play', 'spell', 'air', 'away', 'animal', 'point', 'family', 'plan', 'show', 'part', 'sea', 'and'],
  5: ['about', 'animal', 'house', 'point', 'page', 'letter', 'mother', 'answer', 'found', 'study', 'still', 'learn', 'should', 'America', 'world', 'high', 'every', 'near', 'add', 'food', 'between', 'own', 'below', 'country', 'plant', 'last', 'school', 'father', 'keep', 'tree', 'never', 'start', 'city', 'earth', 'eye', 'light', 'thought', 'head', 'under', 'story', 'saw', 'left', 'few', 'while', 'along', 'might', 'close', 'something', 'seem', 'next']
};

const IRREGULAR_WORDS = [
  { word: 'through', difficulty: 5, phonetic: 'throo', definition: 'From one side to the other' },
  { word: 'enough', difficulty: 4, phonetic: 'ih-nuff', definition: 'As much as needed' },
  { word: 'yacht', difficulty: 5, phonetic: 'yot', definition: 'A fancy boat for sailing' },
  { word: 'colonel', difficulty: 5, phonetic: 'ker-nul', definition: 'A military officer' },
  { word: 'knight', difficulty: 4, phonetic: 'nyt', definition: 'A medieval warrior in armor' },
  { word: 'psychology', difficulty: 5, phonetic: 'sy-kol-uh-jee', definition: 'The study of the mind' },
  { word: 'knee', difficulty: 3, phonetic: 'nee', definition: 'The joint in the middle of your leg' },
  { word: 'knife', difficulty: 3, phonetic: 'nyf', definition: 'A sharp tool for cutting' },
  { word: 'know', difficulty: 2, phonetic: 'noh', definition: 'To understand or be aware of' },
  { word: 'write', difficulty: 2, phonetic: 'ryt', definition: 'To put words on paper' },
  { word: 'wrong', difficulty: 2, phonetic: 'rong', definition: 'Not correct' },
  { word: 'would', difficulty: 2, phonetic: 'wud', definition: 'Past tense of will' },
  { word: 'could', difficulty: 2, phonetic: 'kud', definition: 'Past tense of can' },
  { word: 'should', difficulty: 2, phonetic: 'shud', definition: 'Ought to; has a duty to' },
  { word: 'people', difficulty: 2, phonetic: 'pee-pul', definition: 'Men, women, and children' },
  { word: 'beautiful', difficulty: 3, phonetic: 'byoo-tih-ful', definition: 'Very pretty' },
  { word: 'restaurant', difficulty: 4, phonetic: 'rest-uh-ront', definition: 'A place to eat meals' },
  { word: 'temperature', difficulty: 4, phonetic: 'tem-pruh-chur', definition: 'How hot or cold something is' },
  { word: 'Wednesday', difficulty: 4, phonetic: 'wenz-day', definition: 'The middle of the week' },
  { word: 'February', difficulty: 3, phonetic: 'feb-roo-ary', definition: 'The second month of the year' },
  { word: 'necessary', difficulty: 4, phonetic: 'ness-uh-sairy', definition: 'Needed; required' },
  { word: 'business', difficulty: 3, phonetic: 'biz-niss', definition: 'A job or work; buying and selling' },
  { word: 'different', difficulty: 2, phonetic: 'diff-uh-rent', definition: 'Not the same' },
  { word: 'important', difficulty: 2, phonetic: 'im-por-tunt', definition: 'Matters a lot' },
  { word: 'interesting', difficulty: 3, phonetic: 'in-tres-ting', definition: 'Makes you want to learn more' },
  { word: 'vegetable', difficulty: 3, phonetic: 'vej-tuh-bul', definition: 'A plant you can eat, like carrots' },
  { word: 'favorite', difficulty: 2, phonetic: 'fay-vuh-rit', definition: 'The one you like best' },
  { word: 'because', difficulty: 2, phonetic: 'bee-koz', definition: 'For the reason that' },
  { word: 'although', difficulty: 3, phonetic: 'awl-thoh', definition: 'Even though' },
  { word: 'thought', difficulty: 3, phonetic: 'thawt', definition: 'An idea in your mind' },
  { word: 'brought', difficulty: 3, phonetic: 'brawt', definition: 'Carried to a place' },
  { word: 'caught', difficulty: 3, phonetic: 'kawt', definition: 'Grabbed and held' },
  { word: 'daughter', difficulty: 3, phonetic: 'daw-ter', definition: 'A female child' },
  { word: 'laughter', difficulty: 3, phonetic: 'laf-ter', definition: 'The sound of laughing' },
  { word: 'environment', difficulty: 4, phonetic: 'en-vy-ruh-ment', definition: 'The world around us' },
  { word: 'experience', difficulty: 4, phonetic: 'ek-speer-ee-ence', definition: 'Something that happens to you' },
  { word: 'imagine', difficulty: 3, phonetic: 'ih-maj-in', definition: 'To picture in your mind' },
  { word: 'adventure', difficulty: 3, phonetic: 'ad-ven-chur', definition: 'An exciting journey or experience' },
  { word: 'discover', difficulty: 3, phonetic: 'dis-kuv-er', definition: 'To find something new' },
  { word: 'important', difficulty: 2, phonetic: 'im-por-tunt', definition: 'Matters a lot' },
  { word: 'mysterious', difficulty: 4, phonetic: 'mi-steer-ee-us', definition: 'Strange and hard to explain' },
  { word: 'dangerous', difficulty: 3, phonetic: 'dain-jer-us', definition: 'Could hurt you' },
  { word: 'beautiful', difficulty: 3, phonetic: 'byoo-tih-ful', definition: 'Very pretty' },
  { word: 'wonderful', difficulty: 2, phonetic: 'wun-der-ful', definition: 'Extremely good' },
  { word: 'mountain', difficulty: 2, phonetic: 'mown-tin', definition: 'A very tall hill' },
  { word: 'island', difficulty: 3, phonetic: 'eye-lund', definition: 'Land surrounded by water' },
  { word: 'treasure', difficulty: 3, phonetic: 'treh-zhur', definition: 'Valuable things, like gold or jewels' },
  { word: 'castle', difficulty: 2, phonetic: 'kas-ul', definition: 'A big building where kings lived' },
  { word: 'dragon', difficulty: 2, phonetic: 'drag-un', definition: 'A fire-breathing monster' },
  { word: 'princess', difficulty: 2, phonetic: 'prin-cess', definition: 'A king\'s daughter' },
  { word: 'kingdom', difficulty: 2, phonetic: 'king-dum', definition: 'A land ruled by a king or queen' },
  { word: 'ancient', difficulty: 3, phonetic: 'ayn-shunt', definition: 'Very, very old' },
  { word: 'mysterious', difficulty: 4, phonetic: 'mi-steer-ee-us', definition: 'Strange and hard to explain' },
  { word: 'favorite', difficulty: 2, phonetic: 'fay-vuh-rit', definition: 'The one you like best' },
  { word: 'different', difficulty: 2, phonetic: 'diff-uh-rent', definition: 'Not the same' },
  { word: 'important', difficulty: 2, phonetic: 'im-por-tunt', definition: 'Matters a lot' },
];

const GRADE_LEVEL_WORDS = {
  1: ['cat', 'dog', 'run', 'jump', 'play', 'home', 'love', 'day', 'way', 'may', 'say', 'see', 'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has', 'his', 'how', 'its', 'let', 'old', 'now', 'any', 'new', 'may', 'put', 'ran', 'big', 'did', 'get', 'him', 'hit', 'man', 'off', 'red', 'sit', 'six', 'ten', 'too', 'two', 'use'],
  2: ['after', 'again', 'been', 'before', 'being', 'came', 'could', 'does', 'don\'t', 'every', 'found', 'going', 'green', 'heard', 'help', 'home', 'house', 'just', 'keep', 'kind', 'know', 'last', 'left', 'life', 'little', 'long', 'look', 'made', 'make', 'many', 'most', 'move', 'must', 'name', 'never', 'only', 'other', 'over', 'place', 'plant', 'point', 'right', 'room', 'school', 'should', 'small', 'sound', 'spell', 'still', 'study', 'their', 'thing', 'think', 'three', 'under', 'upon', 'very', 'want', 'water', 'were', 'what', 'when', 'will', 'with', 'word', 'work', 'would', 'write', 'year'],
  3: ['about', 'better', 'bring', 'carry', 'clean', 'draw', 'drink', 'eight', 'fall', 'full', 'got', 'grow', 'hold', 'hot', 'hurt', 'if', 'keep', 'light', 'much', 'myself', 'only', 'pick', 'seven', 'shall', 'show', 'six', 'sit', 'sleep', 'stand', 'start', 'ten', 'today', 'together', 'try', 'warm', 'wash', 'wish', 'best', 'both', 'buy', 'call', 'cold', 'fast', 'first', 'five', 'found', 'gave', 'goes', 'green', 'its', 'made', 'off', 'or', 'pull', 'read', 'right', 'sing', 'their', 'these', 'those', 'upon', 'use', 'very', 'work', 'would', 'your'],
  4: ['along', 'began', 'below', 'black', 'boat', 'book', 'boy', 'carry', 'city', 'country', 'cut', 'dark', 'done', 'draw', 'eat', 'end', 'earth', 'eye', 'face', 'family', 'far', 'father', 'feet', 'fire', 'fish', 'food', 'form', 'four', 'friend', 'gave', 'girl', 'going', 'got', 'hand', 'head', 'hear', 'high', 'home', 'horse', 'house', 'idea', 'keep', 'land', 'large', 'last', 'left', 'letter', 'light', 'live', 'love', 'man', 'men', 'mile', 'money', 'mother', 'mountain', 'move', 'much', 'must', 'night', 'nothing', 'often', 'open', 'own', 'page', 'paper', 'part', 'people', 'picture', 'piece', 'place', 'plant', 'play', 'point', 'pond', 'problem', 'quick', 'ran', 'river', 'road', 'rock', 'room', 'run', 'sat', 'sea', 'set', 'ship', 'short', 'show', 'sing', 'sit', 'sleep', 'small', 'snow', 'song', 'soon', 'space', 'stand', 'star', 'start', 'stone', 'story', 'street', 'sun', 'table', 'tell', 'test', 'three', 'today', 'together', 'told', 'took', 'top', 'tree', 'turn', 'unit', 'upon', 'us', 'upon', 'use', 'very', 'walk', 'wall', 'watch', 'water', 'wave', 'went', 'white', 'window', 'wind', 'winter', 'without', 'wood', 'word', 'world', 'write', 'year'],
  5: ['about', 'animal', 'answer', 'appear', 'arrive', 'artist', 'base', 'bear', 'beat', 'behind', 'believe', 'bell', 'bit', 'block', 'bone', 'bottom', 'box', 'burn', 'burst', 'cage', 'captain', 'center', 'chance', 'charge', 'check', 'chief', 'choice', 'choose', 'circle', 'claim', 'class', 'clean', 'climb', 'clock', 'close', 'cloud', 'coat', 'color', 'complete', 'contain', 'continue', 'cool', 'copy', 'core', 'count', 'court', 'cover', 'cross', 'crowd', 'cry', 'custom', 'dance', 'deal', 'decide', 'deep', 'degree', 'depend', 'describe', 'design', 'destroy', 'detail', 'develop', 'direct', 'dirty', 'divide', 'doctor', 'dollar', 'double', 'dry', 'early', 'edge', 'elect', 'enemy', 'energy', 'engine', 'enjoy', 'enter', 'equal', 'event', 'exact', 'example', 'except', 'excite', 'exercise', 'expect', 'experience', 'expert', 'express', 'extra', 'fair', 'faith', 'familiar', 'feature', 'feel', 'field', 'fight', 'final', 'fit', 'flat', 'float', 'floor', 'flow', 'flower', 'fold', 'foot', 'force', 'forest', 'forget', 'form', 'forward', 'frame', 'free', 'fresh', 'front', 'fruit', 'fuel', 'function', 'future', 'gain', 'garden', 'gas', 'gather', 'gift', 'glad', 'gold', 'government', 'gray', 'great', 'group', 'grow', 'guard', 'guess', 'guide', 'happy', 'heart', 'heavy', 'hence', 'history', 'hole', 'honor', 'hope', 'human', 'hunt', 'hurry', 'identify', 'imagine', 'import', 'income', 'indeed', 'insect', 'inside', 'instant', 'instead', 'iron', 'island', 'job', 'join', 'judge', 'jump', 'justice', 'key', 'kill', 'king', 'kitchen', 'knee', 'knot', 'label', 'lack', 'lady', 'lake', 'language', 'laugh', 'law', 'lay', 'leader', 'least', 'leave', 'level', 'lie', 'lift', 'lip', 'list', 'locate', 'loss', 'low', 'machine', 'manner', 'mark', 'mass', 'master', 'matter', 'measure', 'medical', 'meet', 'member', 'memory', 'mention', 'metal', 'middle', 'milk', 'mind', 'mine', 'minute', 'mirror', 'miss', 'mix', 'model', 'modern', 'moment', 'moon', 'morning', 'motion', 'mountain', 'mouth', 'music', 'nation', 'nature', 'near', 'neck', 'neither', 'nerve', 'news', 'nor', 'note', 'notice', 'number', 'object', 'observe', 'ocean', 'offer', 'office', 'oil', 'operate', 'opinion', 'oppose', 'order', 'organ', 'original', 'outside', 'oven', 'pair', 'palace', 'parent', 'pass', 'past', 'path', 'pattern', 'period', 'permit', 'person', 'physical', 'pick', 'piece', 'pig', 'pin', 'pitch', 'plain', 'plane', 'plastic', 'please', 'pocket', 'poem', 'poet', 'poison', 'police', 'policy', 'political', 'politics', 'poor', 'pop', 'position', 'possible', 'pot', 'pound', 'power', 'press', 'price', 'pride', 'print', 'prison', 'private', 'prize', 'proof', 'proper', 'protect', 'prove', 'public', 'pull', 'purpose', 'push', 'put', 'quality', 'quarter', 'queen', 'quick', 'quiet', 'quite', 'quote', 'race', 'rail', 'raise', 'range', 'rapid', 'rate', 'rather', 'reach', 'react', 'ready', 'reason', 'receive', 'record', 'region', 'relate', 'remain', 'remove', 'repair', 'repeat', 'report', 'require', 'research', 'respect', 'rest', 'result', 'return', 'ride', 'ring', 'rise', 'river', 'robot', 'rock', 'roll', 'root', 'rope', 'rough', 'round', 'route', 'row', 'rule', 'safe', 'sail', 'scale', 'scene', 'score', 'sea', 'seat', 'section', 'seed', 'seek', 'seem', 'self', 'sell', 'send', 'sense', 'serve', 'service', 'set', 'shadow', 'shape', 'share', 'sharp', 'ship', 'shop', 'shot', 'shoulder', 'shout', 'sight', 'sign', 'silk', 'silver', 'simple', 'single', 'sister', 'size', 'skin', 'sky', 'sleep', 'slide', 'slip', 'slow', 'snow', 'social', 'soft', 'soil', 'soldier', 'solve', 'sort', 'soul', 'sound', 'south', 'space', 'speak', 'speed', 'spend', 'spirit', 'spread', 'spring', 'square', 'stage', 'state', 'station', 'steam', 'steel', 'step', 'stick', 'still', 'stone', 'stop', 'store', 'storm', 'story', 'strange', 'stream', 'street', 'stress', 'strike', 'strong', 'structure', 'student', 'subject', 'substance', 'success', 'sugar', 'suit', 'supply', 'support', 'suppose', 'surface', 'surprise', 'swim', 'symbol', 'system', 'tail', 'tall', 'teach', 'team', 'tell', 'ten', 'term', 'test', 'than', 'thank', 'that', 'theater', 'theme', 'then', 'theory', 'there', 'thick', 'thin', 'thing', 'think', 'third', 'those', 'though', 'thousand', 'threat', 'throat', 'through', 'ticket', 'tight', 'till', 'tiny', 'tire', 'title', 'to', 'today', 'together', 'tone', 'tongue', 'tonight', 'too', 'tool', 'top', 'total', 'touch', 'tough', 'toward', 'town', 'trade', 'train', 'travel', 'treat', 'tree', 'trial', 'trip', 'troop', 'truck', 'true', 'trust', 'truth', 'try', 'tube', 'turn', 'type', 'unit', 'until', 'upper', 'upset', 'used', 'usual', 'valley', 'value', 'variety', 'vast', 'very', 'view', 'village', 'violence', 'voice', 'vote', 'wage', 'wait', 'wake', 'walk', 'wall', 'want', 'war', 'warm', 'warn', 'wash', 'watch', 'wave', 'way', 'weak', 'wealth', 'weapon', 'wear', 'week', 'weight', 'welcome', 'west', 'western', 'wet', 'wheel', 'where', 'whether', 'while', 'white', 'who', 'whole', 'whose', 'wide', 'wife', 'wild', 'will', 'win', 'wind', 'window', 'wing', 'wire', 'wise', 'wish', 'within', 'without', 'wonder', 'wood', 'wool', 'word', 'work', 'world', 'worry', 'worse', 'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'yard', 'year', 'yellow', 'young', 'youth', 'zero']
};

export function getWordDifficulty(word) {
  const lower = word.toLowerCase().trim();
  const punct = lower.replace(/[^a-z]/g, '');
  if (!punct) return { word: punct, difficulty: 1, phonetic: '', definition: '', source: 'unknown' };

  // Check irregular words first
  const irregular = IRREGULAR_WORDS.find(w => w.word.toLowerCase() === punct);
  if (irregular) {
    return { ...irregular, source: 'irregular' };
  }

  // Check grade level words
  for (const [grade, words] of Object.entries(GRADE_LEVEL_WORDS)) {
    if (words.includes(punct)) {
      return {
        word: punct,
        difficulty: Math.min(parseInt(grade), 5),
        phonetic: '',
        definition: '',
        source: `grade-${grade}`
      };
    }
  }

  // Score based on word properties
  const difficulty = calculatePhoneticDifficulty(punct);
  return {
    word: punct,
    difficulty,
    phonetic: '',
    definition: '',
    source: 'calculated'
  };
}

function calculatePhoneticDifficulty(word) {
  let score = 1;

  // Length
  if (word.length > 10) score += 2;
  else if (word.length > 7) score += 1;

  // Multi-syllable detection (rough)
  const syllableCount = word.replace(/[^aeiou]/g, '').length;
  if (syllableCount > 4) score += 2;
  else if (syllableCount > 3) score += 1;

  // Silent letters
  const silentPatterns = [/^k/, /gn/, /mb$/, /wr/, /kn/];
  if (silentPatterns.some(p => p.test(word))) score += 1;

  // Double letters
  if (/(.)\1/.test(word)) score += 0.5;

  // Unusual letter combinations
  const unusualPatterns = [/ough/, /eigh/, /tion/, /sion/, /ight/, /eous/, /ough/];
  if (unusualPatterns.some(p => p.test(word))) score += 1;

  return Math.min(Math.round(score), 5);
}

export function getWordsByDifficulty(difficulty) {
  const allWords = [];

  // Gather from Dolch
  for (const words of Object.values(DOLCH_WORDS)) {
    allWords.push(...words);
  }

  // Gather from Fry
  for (const words of Object.values(FRY_WORDS)) {
    allWords.push(...words);
  }

  // Add irregular words
  IRREGULAR_WORDS.forEach(w => allWords.push(w.word));

  // Score each and filter
  return [...new Set(allWords)].map(w => getWordDifficulty(w)).filter(w => w.difficulty === difficulty);
}

export function getRecommendedWordsForAge(age) {
  // Map age to difficulty range
  const ageMap = {
    5: [1, 2],
    6: [1, 2, 3],
    7: [2, 3],
    8: [2, 3, 4],
    9: [3, 4],
    10: [3, 4, 5],
    11: [4, 5],
    12: [4, 5]
  };

  const levels = ageMap[age] || [2, 3, 4];
  return IRREGULAR_WORDS.filter(w => levels.includes(w.difficulty));
}

export { DOLCH_WORDS, FRY_WORDS, IRREGULAR_WORDS, GRADE_LEVEL_WORDS };
