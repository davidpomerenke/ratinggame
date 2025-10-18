'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../../movies.json';
import { recordComparison, getRandomMovies } from '../../../lib/ranking';
import MoviePoster from '../../../components/MoviePoster';

export default function OneVsOne() {
  const [pair, setPair] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setPair(getRandomMovies(movies, 2));
  }, []);

  const choose = (winner, loser) => {
    recordComparison(winner.id, loser.id);
    setPair(getRandomMovies(movies, 2));
    setCount(c => c + 1);
  };

  if (pair.length !== 2) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">1v1 Battle</h1>
          <div className="flex gap-4">
            <span className="text-gray-400">Comparisons: {count}</span>
            <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
            <Link href="/rankings" className="text-green-400 hover:text-green-300">Rankings</Link>
          </div>
        </div>

        <p className="text-gray-400 text-center mb-12">Click on your preferred movie</p>

        <div className="grid grid-cols-2 gap-8">
          {pair.map((movie) => (
            <button
              key={movie.id}
              onClick={() => choose(movie, pair.find(m => m.id !== movie.id))}
              className="group text-left"
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

