'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import movies from '../../movies.json';
import { recordComparison, getRandomMovies } from '../../../lib/ranking';
import MoviePoster from '../../../components/MoviePoster';
import { useKeyboard } from '../../../hooks/useKeyboard';
import { createConfetti } from '../../../lib/confetti';

export default function Knockout() {
  const [round, setRound] = useState(1);
  const [contestants, setContestants] = useState([]);
  const [currentPair, setCurrentPair] = useState(0);
  const [winners, setWinners] = useState([]);
  const [champion, setChampion] = useState(null);

  useEffect(() => {
    const newContestants = getRandomMovies(movies, 8);
    setContestants(newContestants);
    
    newContestants.forEach(movie => {
      const img = new Image();
      const cached = localStorage.getItem(`poster-${movie.slug}`);
      if (cached) img.src = cached;
    });
  }, []);

  const choose = (winner) => {
    const pair = [contestants[currentPair * 2], contestants[currentPair * 2 + 1]];
    const loser = pair.find(m => m.id !== winner.id);
    
    recordComparison(winner.id, loser.id);
    const newWinners = [...winners, winner];
    setWinners(newWinners);

    if (currentPair < Math.floor(contestants.length / 2) - 1) {
      setCurrentPair(currentPair + 1);
    } else {
      if (newWinners.length === 1) {
        setChampion(newWinners[0]);
        setTimeout(() => createConfetti(), 100);
      } else {
        setContestants(newWinners);
        setWinners([]);
        setCurrentPair(0);
        setRound(round + 1);
      }
    }
  };

  useKeyboard({
    'ArrowLeft': () => !champion && pair[0] && choose(pair[0]),
    'ArrowRight': () => !champion && pair[1] && choose(pair[1]),
    '1': () => !champion && pair[0] && choose(pair[0]),
    '2': () => !champion && pair[1] && choose(pair[1]),
    'Escape': () => window.location.href = '/'
  });

  if (contestants.length === 0) return null;

  const pair = [contestants[currentPair * 2], contestants[currentPair * 2 + 1]];

  if (champion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-yellow-400 mb-8">🏆 Champion!</h1>
          <div className="max-w-md mx-auto">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-700 mb-4">
              <MoviePoster movie={champion} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{champion.name}</h2>
            <p className="text-gray-400 mb-8">{champion.year} • {champion.directors?.[0]}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setChampion(null);
                setContestants(getRandomMovies(movies, 8));
                setWinners([]);
                setCurrentPair(0);
                setRound(1);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              New Tournament
            </button>
            <Link href="/rankings" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg inline-block">
              View Rankings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Knockout Tournament - Round {round}
          </h1>
          <div className="flex gap-4">
            <span className="text-gray-400">
              Match {currentPair + 1}/{Math.floor(contestants.length / 2)}
            </span>
            <Link href="/" className="text-blue-400 hover:text-blue-300">Home</Link>
          </div>
        </div>

        <p className="text-gray-400 text-center mb-12">Click on the winner</p>

        <div className="grid grid-cols-2 gap-8">
          {pair.map((movie) => (
            <button
              key={movie.id}
              onClick={() => choose(movie)}
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

