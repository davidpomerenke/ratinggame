'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../../movies.json';
import { recordComparison, getRandomMovies } from '../../../lib/ranking';
import MoviePoster from '../../../components/MoviePoster';
import { useKeyboard } from '../../../hooks/useKeyboard';

export default function Decks() {
  const [leftDeck, setLeftDeck] = useState([]);
  const [rightDeck, setRightDeck] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const shuffled = getRandomMovies(movies, 10);
    setLeftDeck(shuffled.slice(0, 5));
    setRightDeck(shuffled.slice(5, 10));
    
    shuffled.forEach(movie => {
      const img = new Image();
      const cached = localStorage.getItem(`poster-${movie.slug}`);
      if (cached) img.src = cached;
    });
  }, []);

  const choose = (side) => {
    const winner = side === 'left' ? leftDeck[0] : rightDeck[0];
    const loser = side === 'left' ? rightDeck[0] : leftDeck[0];
    
    recordComparison(winner.id, loser.id);
    setCount(c => c + 1);

    if (leftDeck.length === 1 || rightDeck.length === 1) {
      const shuffled = getRandomMovies(movies, 10);
      setLeftDeck(shuffled.slice(0, 5));
      setRightDeck(shuffled.slice(5, 10));
      
      shuffled.forEach(movie => {
        const img = new Image();
        const cached = localStorage.getItem(`poster-${movie.slug}`);
        if (cached) img.src = cached;
      });
    } else {
      if (side === 'left') {
        setRightDeck(rightDeck.slice(1));
      } else {
        setLeftDeck(leftDeck.slice(1));
      }
    }
  };

  useKeyboard({
    'ArrowLeft': () => leftDeck[0] && choose('left'),
    'ArrowRight': () => rightDeck[0] && choose('right'),
    '1': () => leftDeck[0] && choose('left'),
    '2': () => rightDeck[0] && choose('right'),
    'Escape': () => window.location.href = '/'
  });

  if (leftDeck.length === 0 || rightDeck.length === 0) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Deck Battle</h1>
          <div className="flex gap-4">
            <span className="text-gray-400">Comparisons: {count}</span>
            <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
            <Link href="/rankings" className="text-green-400 hover:text-green-300">Rankings</Link>
          </div>
        </div>

        <p className="text-gray-400 text-center mb-12">
          Choose left or right deck. The loser's top card is removed.
        </p>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-400">Left Deck</h2>
              <span className="text-gray-400">{leftDeck.length} cards</span>
            </div>
            <button onClick={() => choose('left')} className="group w-full mb-4">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-700 transition-transform group-hover:scale-105">
                <MoviePoster movie={leftDeck[0]} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold mb-1">{leftDeck[0].name}</h3>
                  <p className="text-gray-300 text-sm">{leftDeck[0].year} • {leftDeck[0].directors?.[0]}</p>
                </div>
              </div>
            </button>
            <div className="flex gap-2 opacity-50">
              {leftDeck.slice(1, 4).map((movie) => (
                <div key={movie.id} className="flex-1 aspect-[2/3] rounded overflow-hidden bg-slate-700">
                  <MoviePoster movie={movie} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-red-400">Right Deck</h2>
              <span className="text-gray-400">{rightDeck.length} cards</span>
            </div>
            <button onClick={() => choose('right')} className="group w-full mb-4">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-700 transition-transform group-hover:scale-105">
                <MoviePoster movie={rightDeck[0]} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold mb-1">{rightDeck[0].name}</h3>
                  <p className="text-gray-300 text-sm">{rightDeck[0].year} • {rightDeck[0].directors?.[0]}</p>
                </div>
              </div>
            </button>
            <div className="flex gap-2 opacity-50">
              {rightDeck.slice(1, 4).map((movie) => (
                <div key={movie.id} className="flex-1 aspect-[2/3] rounded overflow-hidden bg-slate-700">
                  <MoviePoster movie={movie} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

