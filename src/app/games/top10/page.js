'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../../movies.json';
import { getRankedMovies, recordComparison } from '../../../lib/ranking';
import MoviePoster from '../../../components/MoviePoster';

export default function Top10() {
  const [ranked, setRanked] = useState([]);
  const [top10, setTop10] = useState([]);

  useEffect(() => {
    const rankedMovies = getRankedMovies(movies);
    setRanked(rankedMovies.slice(0, 50));
    setTop10(rankedMovies.slice(0, 10));
  }, []);

  const save = () => {
    for (let i = 0; i < top10.length - 1; i++) {
      for (let j = i + 1; j < top10.length; j++) {
        recordComparison(top10[i].id, top10[j].id);
      }
    }
    alert('Top 10 saved!');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Build Your Top 10</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Your Top 10</h2>
            <div className="space-y-3">
              {top10.map((movie, i) => (
                <div key={movie.id} className="flex items-center gap-4 p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400 w-8">#{i + 1}</div>
                  <div className="w-12 h-18 rounded overflow-hidden bg-slate-700 flex-shrink-0">
                    <MoviePoster movie={movie} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold">{movie.name}</div>
                    <div className="text-gray-400 text-sm">{movie.year}</div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={save}
              className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Save Top 10
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Browse & Reorder</h2>
            <p className="text-gray-400 mb-4">
              Your current top 10 is shown on the left based on your rankings.
              Play more games to refine your list!
            </p>
            <div className="grid grid-cols-3 gap-3">
              {ranked.slice(10, 40).map((movie) => (
                <div key={movie.id} className="group">
                  <div className="relative aspect-[2/3] rounded overflow-hidden bg-slate-700">
                    <MoviePoster movie={movie} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-white text-xs mt-1 line-clamp-2">{movie.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

