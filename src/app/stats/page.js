'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../movies.json';
import { getRankedMovies, getRankings } from '../../lib/ranking';
import { getHistory } from '../../lib/undo';

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const ranked = getRankedMovies(movies);
    const rankings = getRankings();
    const history = getHistory();
    
    const totalComparisons = Object.keys(rankings).length;
    const rankedMovies = ranked.filter(m => rankings[m.id]);
    
    const genreCounts = {};
    const directorCounts = {};
    const decadeCounts = {};
    
    rankedMovies.slice(0, 50).forEach(movie => {
      (movie.genres || []).forEach(genre => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
      
      (movie.directors || []).forEach(director => {
        directorCounts[director] = (directorCounts[director] || 0) + 1;
      });
      
      const decade = Math.floor(movie.year / 10) * 10;
      decadeCounts[decade] = (decadeCounts[decade] || 0) + 1;
    });
    
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    const topDirectors = Object.entries(directorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    const topDecades = Object.entries(decadeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    setStats({
      totalComparisons,
      rankedCount: rankedMovies.length,
      totalMovies: movies.length,
      topGenres,
      topDirectors,
      topDecades,
      topMovie: rankedMovies[0],
      recentHistory: history.slice(-10).reverse()
    });
  }, []);

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Statistics</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{stats.totalComparisons}</div>
            <div className="text-gray-400">Movies Ranked</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{stats.rankedCount}</div>
            <div className="text-gray-400">With Ratings</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              {Math.round((stats.rankedCount / stats.totalMovies) * 100)}%
            </div>
            <div className="text-gray-400">Coverage</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Top Genres</h2>
            {stats.topGenres.map(([genre, count], i) => (
              <div key={genre} className="flex items-center justify-between mb-3">
                <span className="text-gray-300">{i + 1}. {genre}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.topGenres[0][1]) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Favorite Decades</h2>
            {stats.topDecades.map(([decade, count], i) => (
              <div key={decade} className="flex items-center justify-between mb-3">
                <span className="text-gray-300">{i + 1}. {decade}s</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(count / stats.topDecades[0][1]) * 100}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Top Directors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stats.topDirectors.map(([director, count], i) => (
              <div key={director} className="flex items-center justify-between">
                <span className="text-gray-300">{i + 1}. {director}</span>
                <span className="text-gray-400 text-sm">{count} films</span>
              </div>
            ))}
          </div>
        </div>

        {stats.topMovie && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-6 mt-6 border border-yellow-700/50">
            <h2 className="text-2xl font-bold text-yellow-400 mb-2">🏆 Your #1 Movie</h2>
            <h3 className="text-white text-xl font-bold">{stats.topMovie.name}</h3>
            <p className="text-gray-400">{stats.topMovie.year} • {stats.topMovie.directors?.[0]}</p>
            <p className="text-yellow-400 mt-2">Rating: {Math.round(stats.topMovie.rating)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

