'use client';
import { useState, useEffect } from 'react';
import movies from './movies.json';
import MoviePoster from '../components/MoviePoster';
import { getRankedMovies, getRankings } from '../lib/ranking';

export default function Home() {
  const [ranked, setRanked] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setRanked(getRankedMovies(movies));
    setTotal(Object.keys(getRankings()).length);
  }, []);

  const randomGame = () => {
    const games = ['/games/1v1', '/games/rank5', '/games/knockout', '/games/decks', '/games/rapid', '/games/top10'];
    const random = games[Math.floor(Math.random() * games.length)];
    window.location.href = random;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            schnabil's Film Collection
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            {total > 0 ? `${total} movies ranked` : `${movies.length} films watched`}
          </p>
          
          <div className="mb-8">
            <button onClick={randomGame} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-10 rounded-lg transition text-lg shadow-lg hover:shadow-xl">
              🎲 Play Random Game
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🎮 Games
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <a href="/games/1v1" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition text-center">
                  1v1 Battle
                </a>
                <a href="/games/rank5" className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition text-center">
                  Rank 5
                </a>
                <a href="/games/knockout" className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition text-center">
                  Knockout
                </a>
                <a href="/games/decks" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition text-center">
                  Deck Battle
                </a>
                <a href="/games/rapid" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition text-center">
                  ⚡ Rapid Fire
                </a>
                <a href="/games/top10" className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center">
                  🏆 Top 10
                </a>
              </div>
            </div>

            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                🛠️ Tools
              </h2>
              <div className="grid gap-3">
                <a href="/stats" className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center gap-2">
                  <span>📊</span> Statistics
                </a>
                <a href="/browse" className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center gap-2">
                  <span>🔍</span> Browse & Filter
                </a>
                <a href="/share" className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center gap-2">
                  <span>📤</span> Share Rankings
                </a>
              </div>
            </div>
          </div>
        </header>

        {total === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-8">
              No rankings yet! Play some games to build your ranking.
            </p>
            <button onClick={randomGame} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg transition text-lg">
              🎲 Start with Random Game
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {ranked.slice(0, 50).map((movie, i) => (
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
        )}
      </div>
    </div>
  );
}
