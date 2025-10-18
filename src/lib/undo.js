const STORAGE_KEY = 'comparison-history';
const MAX_HISTORY = 5;

export const saveComparison = (winnerId, loserId) => {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  history.push({ winnerId, loserId, timestamp: Date.now() });
  
  if (history.length > MAX_HISTORY) {
    history.shift();
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
};

export const getHistory = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

export const undoLastComparison = () => {
  if (typeof window === 'undefined') return null;
  
  const history = getHistory();
  const last = history.pop();
  
  if (last) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }
  
  return last;
};

export const clearHistory = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
};

