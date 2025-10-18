'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../../movies.json';
import { recordComparison, getRandomMovies } from '../../../lib/ranking';
import MoviePoster from '../../../components/MoviePoster';
import { useKeyboard } from '../../../hooks/useKeyboard';
import { useSwipe } from '../../../hooks/useSwipe';
import UndoButton from '../../../components/UndoButton';

export default function OneVsOne() {
  const [pair, setPair] = useState([]);
  const [count, setCount] = useState(0);
  const [canSkip, setCanSkip] = useState(true);

  useEffect(() => {
    const newPair = getRandomMovies(movies, 2);
    setPair(newPair);
    
    const nextPairs = getRandomMovies(movies, 6);
    nextPairs.forEach(movie => {
      const img = new Image();
      const cached = localStorage.getItem(`poster-${movie.slug}`);
      if (cached) img.src = cached;
    });
  }, []);

  const choose = (winner, loser) => {
    recordComparison(winner.id, loser.id);
    const newPair = getRandomMovies(movies, 2);
    setPair(newPair);
    setCount(c => c + 1);
    setCanSkip(true);
    
    const next = getRandomMovies(movies, 4);
    next.forEach(movie => {
      const img = new Image();
      const cached = localStorage.getItem(`poster-${movie.slug}`);
      if (cached) img.src = cached;
    });
  };

  const skip = () => {
    if (!canSkip) return;
    setCanSkip(false);
    setPair(getRandomMovies(movies, 2));
  };

  useKeyboard({
    'ArrowLeft': () => pair[0] && choose(pair[0], pair[1]),
    'ArrowRight': () => pair[1] && choose(pair[1], pair[0]),
    '1': () => pair[0] && choose(pair[0], pair[1]),
    '2': () => pair[1] && choose(pair[1], pair[0]),
    's': skip,
    'Space': skip,
    'Escape': () => window.location.href = '/'
  });

  useSwipe(
    () => pair[1] && choose(pair[1], pair[0]),
    () => pair[0] && choose(pair[0], pair[1])
  );

  if (pair.length !== 2) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <UndoButton onUndo={() => setPair(getRandomMovies(movies, 2))} />
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">1v1 Battle</h1>
          <div className="flex gap-4">
            <span className="text-gray-400">Comparisons: {count}</span>
            <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
            <Link href="/rankings" className="text-green-400 hover:text-green-300">Rankings</Link>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-400 mb-3">
            Click or use <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">←</kbd> / <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">→</kbd> or <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">1</kbd> / <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">2</kbd>
          </p>
          <button
            onClick={skip}
            disabled={!canSkip}
            className="text-gray-500 hover:text-gray-300 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Don't know these? Press <kbd className="px-2 py-1 bg-slate-700 rounded text-xs mx-1">S</kbd> to skip
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {pair.map((movie) => (
            <button
              key={movie.id}
              onClick={() => choose(movie, pair.find(m => m.id !== movie.id))}
              className="group text-left transform transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-700 transition-transform group-hover:scale-105">
                <MoviePoster movie={movie} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold mb-1">{movie.name}</h3>
                  <p className="text-gray-300 text-sm">{movie.year} • {movie.directors?.[0]}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

