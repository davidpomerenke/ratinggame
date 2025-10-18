'use client';
import movies from './movies.json';
import MoviePoster from '../components/MoviePoster';

const getRatingColor = (rating) => {
  if (!rating) return 'text-gray-400';
  const count = (rating.match(/★/g) || []).length + (rating.includes('½') ? 0.5 : 0);
  if (count >= 4.5) return 'text-yellow-400';
  if (count >= 3.5) return 'text-green-400';
  if (count >= 2.5) return 'text-blue-400';
  return 'text-gray-400';
};

const Stars = ({ rating }) => {
  if (!rating) return <span className="text-gray-400">—</span>;
  
  const fullStars = (rating.match(/★/g) || []).length;
  const hasHalf = rating.includes('½');
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const color = getRatingColor(rating);
  
  return (
    <span className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className={`w-3.5 h-3.5 ${color}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      {hasHalf && (
        <svg key="half" className={`w-3.5 h-3.5 ${color}`} viewBox="0 0 20 20">
          <defs>
            <clipPath id="half-clip">
              <rect x="0" y="0" width="10" height="20" />
            </clipPath>
          </defs>
          <path fill="currentColor" clipPath="url(#half-clip)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          <path fill="currentColor" opacity="0.3" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            schnabil's Film Collection
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            {movies.length} films watched
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <a href="/games/1v1" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition">
              1v1 Battle
            </a>
            <a href="/games/rank5" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition">
              Rank 5 Movies
            </a>
            <a href="/games/knockout" className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg transition">
              Knockout Tournament
            </a>
            <a href="/games/decks" className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition">
              Deck Battle
            </a>
            <a href="/rankings" className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition">
              View Rankings
            </a>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map((movie) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <div className="mt-2">
                <h3 className="text-white text-sm font-medium line-clamp-2 min-h-[2.5rem]">
                  {movie.name}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-500 text-xs">{movie.year}</span>
                  <Stars rating={movie.rating} />
                </div>
                {movie.directors?.length > 0 && (
                  <p className="text-gray-600 text-xs mt-1 line-clamp-1">
                    {movie.directors[0]}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
