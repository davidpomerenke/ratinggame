'use client';
import { useState, useEffect } from 'react';
import { undoLastComparison, getHistory } from '../lib/undo';
import { undoComparison } from '../lib/ranking';

export default function UndoButton({ onUndo }) {
  const [canUndo, setCanUndo] = useState(false);

  useEffect(() => {
    const checkHistory = () => {
      setCanUndo(getHistory().length > 0);
    };
    
    checkHistory();
    const interval = setInterval(checkHistory, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUndo = () => {
    const last = undoLastComparison();
    if (last) {
      undoComparison(last.winnerId, last.loserId);
      setCanUndo(getHistory().length > 0);
      if (onUndo) onUndo();
    }
  };

  if (!canUndo) return null;

  return (
    <button
      onClick={handleUndo}
      className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all hover:scale-110 z-50"
      title="Undo last comparison (Ctrl+Z)"
    >
      ↶ Undo
    </button>
  );
}

