'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../../movies.json';
import { recordComparison, getRandomMovies } from '../../../lib/ranking';
import MoviePoster from '../../../components/MoviePoster';

export default function Rank5() {
  const [items, setItems] = useState([]);
  const [ranked, setRanked] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const newItems = getRandomMovies(movies, 5);
    setItems(newItems);
    
    getRandomMovies(movies, 10).forEach(movie => {
      const img = new Image();
      const cached = localStorage.getItem(`poster-${movie.slug}`);
      if (cached) img.src = cached;
    });
  }, []);

  const moveToRank = (movie) => {
    setItems(items.filter(m => m.id !== movie.id));
    setRanked([...ranked, movie]);
  };

  const finish = () => {
    for (let i = 0; i < ranked.length - 1; i++) {
      for (let j = i + 1; j < ranked.length; j++) {
        recordComparison(ranked[i].id, ranked[j].id);
      }
    }
    setCount(c => c + 1);
    const newItems = getRandomMovies(movies, 5);
    setItems(newItems);
    setRanked([]);
    
    getRandomMovies(movies, 10).forEach(movie => {
      const img = new Image();
      const cached = localStorage.getItem(`poster-${movie.slug}`);
      if (cached) img.src = cached;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Rank 5 Movies</h1>
          <div className="flex gap-4">
            <span className="text-gray-400">Rounds: {count}</span>
            <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
            <Link href="/rankings" className="text-green-400 hover:text-green-300">Rankings</Link>
          </div>
        </div>

        <p className="text-gray-400 text-center mb-8">Click movies from best to worst</p>

        <div className="grid grid-cols-5 gap-4 mb-8">
          {items.map((movie) => (
            <button
              key={movie.id}
              onClick={() => moveToRank(movie)}
              className="group"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-700 transition-transform group-hover:scale-105">
                <MoviePoster movie={movie} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white text-xs mt-2 line-clamp-2">{movie.name}</h3>
            </button>
          ))}
        </div>

        {ranked.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">Your Ranking</h2>
            <div className="flex gap-4 mb-8">
              {ranked.map((movie, i) => (
                <div key={movie.id} className="flex-1">
                  <div className="text-center mb-2">
                    <span className="text-2xl font-bold text-yellow-400">#{i + 1}</span>
                  </div>
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-700">
                  <MoviePoster movie={movie} className="w-full h-full object-cover" />
                </div>
                  <h3 className="text-white text-xs mt-2 text-center line-clamp-2">{movie.name}</h3>
                </div>
              ))}
            </div>
          </>
        )}

        {ranked.length === 5 && (
          <button
            onClick={finish}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg"
          >
            Finish & Next Round
          </button>
        )}
      </div>
    </div>
  );
}

