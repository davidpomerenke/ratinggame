'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import movies from '../movies.json';
import { getRankedMovies } from '../../lib/ranking';
import MoviePoster from '../../components/MoviePoster';

export default function Share() {
  const [ranked, setRanked] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    setRanked(getRankedMovies(movies).slice(0, 10));
  }, []);

  const generateImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('My Top 10 Movies', 50, 80);

    // Movies
    ctx.font = '24px sans-serif';
    ranked.slice(0, 10).forEach((movie, i) => {
      const y = 150 + i * 45;
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`${i + 1}.`, 50, y);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(movie.name, 100, y);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px sans-serif';
      ctx.fillText(`${movie.year} • ${Math.round(movie.rating)}`, 100, y + 20);
      ctx.font = '24px sans-serif';
    });

    // Download
    const link = document.createElement('a');
    link.download = 'my-top-10-movies.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const copyRanking = () => {
    const text = ranked.map((m, i) => `${i + 1}. ${m.name} (${m.year})`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Ranking copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Share Your Rankings</h1>
          <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
        </div>

        <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-4">Top 10</h2>
          {ranked.map((movie, i) => (
            <div key={movie.id} className="flex items-center gap-4 mb-3 p-3 bg-slate-700/50 rounded">
              <div className="text-2xl font-bold text-yellow-400 w-8">#{i + 1}</div>
              <div className="w-12 h-18 rounded overflow-hidden bg-slate-700 flex-shrink-0">
                <MoviePoster movie={movie} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold">{movie.name}</div>
                <div className="text-gray-400 text-sm">{movie.year} • Rating: {Math.round(movie.rating)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={copyRanking}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition"
          >
            📋 Copy as Text
          </button>
          
          <button
            onClick={generateImage}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition"
          >
            🖼️ Download as Image
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

