'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../movies.json';
import { getRankedMovies, getRankings } from '../../lib/ranking';
import MoviePoster from '../../components/MoviePoster';

export default function Rankings() {
  const [ranked, setRanked] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setRanked(getRankedMovies(movies));
    setTotal(Object.keys(getRankings()).length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Overall Rankings</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
        </div>

        <p className="text-gray-400 mb-8">
          Based on {total} movies compared using ELO rating system
        </p>

        <div className="grid gap-4">
          {ranked.map((movie, i) => (
            <div
              key={movie.id}
              className="bg-slate-800/50 rounded-lg p-4 flex items-center gap-4 hover:bg-slate-700/50 transition"
            >
              <div className="text-3xl font-bold text-yellow-400 w-16 text-center">
                #{i + 1}
              </div>
              
              <div className="w-16 h-24 rounded overflow-hidden bg-slate-700 flex-shrink-0">
                <MoviePoster movie={movie} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg">{movie.name}</h3>
                <p className="text-gray-400 text-sm">
                  {movie.year} • {movie.directors?.[0]}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {Math.round(movie.rating)}
                </div>
                <div className="text-xs text-gray-500">ELO Rating</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

