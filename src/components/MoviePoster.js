'use client';
import { useState, useEffect } from 'react';

export default function MoviePoster({ movie, className = '' }) {
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cached = sessionStorage.getItem(`poster-${movie.slug}`);
    if (cached) {
      setPoster(cached);
      setLoading(false);
      return;
    }

    fetch(`/api/poster?slug=${movie.slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.poster) {
          setPoster(data.poster);
          sessionStorage.setItem(`poster-${movie.slug}`, data.poster);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [movie.slug]);

  if (loading) {
    return (
      <div className={`bg-slate-700 animate-pulse ${className}`}>
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  if (error || !poster) {
    return (
      <div className={`bg-slate-700 ${className}`}>
        <div className="w-full h-full flex items-center justify-center text-gray-500 text-center p-4">
          {movie.name}
        </div>
      </div>
    );
  }

  return <img src={poster} alt={movie.name} className={className} />;
}

