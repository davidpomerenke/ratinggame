'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../movies.json';
import MoviePoster from '../../components/MoviePoster';
import { getRankedMovies } from '../../lib/ranking';

export default function Browse() {
  const [ranked, setRanked] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDecade, setSelectedDecade] = useState('all');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedDirector, setSelectedDirector] = useState('all');

  const decades = ['all', ...new Set(movies.map(m => Math.floor(m.year / 10) * 10).filter(Boolean).sort((a, b) => b - a))];
  const genres = ['all', ...new Set(movies.flatMap(m => m.genres || []).sort())];
  const directors = ['all', ...new Set(movies.flatMap(m => m.directors || []).sort())];

  useEffect(() => {
    setRanked(getRankedMovies(movies));
  }, []);

  useEffect(() => {
    let result = ranked;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(searchLower));
    }

    if (selectedDecade !== 'all') {
      const decade = parseInt(selectedDecade);
      result = result.filter(m => Math.floor(m.year / 10) * 10 === decade);
    }

    if (selectedGenre !== 'all') {
      result = result.filter(m => (m.genres || []).includes(selectedGenre));
    }

    if (selectedDirector !== 'all') {
      result = result.filter(m => (m.directors || []).includes(selectedDirector));
    }

    setFiltered(result);
  }, [ranked, search, selectedDecade, selectedGenre, selectedDirector]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Browse Movies</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={selectedDecade}
              onChange={(e) => setSelectedDecade(e.target.value)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Decades</option>
              {decades.filter(d => d !== 'all').map(d => (
                <option key={d} value={d}>{d}s</option>
              ))}
            </select>

            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Genres</option>
              {genres.filter(g => g !== 'all').map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={selectedDirector}
              onChange={(e) => setSelectedDirector(e.target.value)}
              className="bg-slate-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Directors</option>
              {directors.filter(d => d !== 'all').slice(0, 50).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 text-gray-400 text-sm">
            Showing {filtered.length} of {ranked.length} movies
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filtered.map((movie) => (
            <a
              key={movie.id}
              href={movie.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-700 transition-transform group-hover:scale-105">
                <MoviePoster
                  movie={movie}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mt-2">
                <h3 className="text-white text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                  {movie.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-500 text-xs">{movie.year}</span>
                  {movie.rating && (
                    <span className="text-yellow-400 text-xs font-bold">
                      {Math.round(movie.rating)}
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

