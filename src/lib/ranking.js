const STORAGE_KEY = 'movie-rankings';
const INITIAL_RATING = 1000;
const K_FACTOR = 32;

export const getRankings = () => {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const saveRankings = (rankings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rankings));
};

export const recordComparison = (winnerId, loserId) => {
  const rankings = getRankings();
  
  const winnerRating = rankings[winnerId] || INITIAL_RATING;
  const loserRating = rankings[loserId] || INITIAL_RATING;
  
  const expectedWin = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedLose = 1 - expectedWin;
  
  rankings[winnerId] = winnerRating + K_FACTOR * (1 - expectedWin);
  rankings[loserId] = loserRating + K_FACTOR * (0 - expectedLose);
  
  saveRankings(rankings);
  
  if (typeof window !== 'undefined') {
    const { saveComparison } = require('./undo');
    saveComparison(winnerId, loserId);
  }
  
  return rankings;
};

export const undoComparison = (winnerId, loserId) => {
  const rankings = getRankings();
  
  const winnerRating = rankings[winnerId] || INITIAL_RATING;
  const loserRating = rankings[loserId] || INITIAL_RATING;
  
  const expectedWin = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedLose = 1 - expectedWin;
  
  rankings[winnerId] = winnerRating - K_FACTOR * (1 - expectedWin);
  rankings[loserId] = loserRating - K_FACTOR * (0 - expectedLose);
  
  saveRankings(rankings);
  return rankings;
};

export const getRankedMovies = (movies) => {
  const rankings = getRankings();
  return movies
    .map(movie => ({
      ...movie,
      rating: rankings[movie.id] || INITIAL_RATING,
      comparisons: Object.keys(rankings).includes(movie.id)
    }))
    .sort((a, b) => b.rating - a.rating);
};

export const getRandomMovies = (movies, count) => {
  const shuffled = [...movies].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

