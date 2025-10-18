'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../../movies.json';
import { recordComparison, getRandomMovies } from '../../../lib/ranking';
import MoviePoster from '../../../components/MoviePoster';
import { useKeyboard } from '../../../hooks/useKeyboard';
import { useSwipe } from '../../../hooks/useSwipe';

export default function RapidFire() {
  const [pair, setPair] = useState([]);
  const [count, setCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [finalScore, setFinalScore] = useState(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setFinalScore(count);
      setIsActive(false);
    }
  }, [isActive, timeLeft, count]);

  const start = () => {
    setPair(getRandomMovies(movies, 2));
    setCount(0);
    setTimeLeft(20);
    setIsActive(true);
    setFinalScore(null);
  };

  const choose = (winner, loser) => {
    if (!isActive) return;
    recordComparison(winner.id, loser.id);
    setPair(getRandomMovies(movies, 2));
    setCount(c => c + 1);
  };

  useKeyboard({
    'ArrowLeft': () => pair[0] && choose(pair[0], pair[1]),
    'ArrowRight': () => pair[1] && choose(pair[1], pair[0]),
    'Escape': () => window.location.href = '/'
  });

  useSwipe(
    () => pair[1] && choose(pair[1], pair[0]),
    () => pair[0] && choose(pair[0], pair[1])
  );

  if (finalScore !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-yellow-400 mb-4">Time's Up!</h1>
          <div className="text-8xl font-bold text-white mb-8">{finalScore}</div>
          <p className="text-2xl text-gray-400 mb-8">comparisons in 20 seconds</p>
          <div className="flex gap-4 justify-center">
            <button onClick={start} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-xl">
              Play Again
            </button>
            <Link href="/" className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-lg text-xl">
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">⚡ Rapid Fire</h1>
          <p className="text-xl text-gray-400 mb-8">Make as many comparisons as you can in 20 seconds!</p>
          <button onClick={start} className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-6 px-12 rounded-lg text-2xl">
            Start
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-4xl font-bold text-white">{count}</div>
          <div className={`text-6xl font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {pair.map((movie) => (
            <button
              key={movie.id}
              onClick={() => choose(movie, pair.find(m => m.id !== movie.id))}
              className="group text-left transform transition-all duration-100 active:scale-95"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-700">
                <MoviePoster movie={movie} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-xl font-bold mb-1">{movie.name}</h3>
                  <p className="text-gray-300 text-sm">{movie.year}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

