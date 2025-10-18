'use client';
import { useState, useEffect } from 'react';

const cache = new Map();
const pending = new Map();

const fetchPoster = async (slug) => {
  if (cache.has(slug)) {
    return cache.get(slug);
  }

  if (pending.has(slug)) {
    return pending.get(slug);
  }

  const promise = fetch(`/api/poster?slug=${slug}`)
    .then(res => res.json())
    .then(data => {
      if (data.poster) {
        cache.set(slug, data.poster);
        try {
          localStorage.setItem(`poster-${slug}`, data.poster);
        } catch {}
        return data.poster;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      pending.delete(slug);
    });

  pending.set(slug, promise);
  return promise;
};

export default function MoviePoster({ movie, className = '' }) {
  const [poster, setPoster] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = cache.get(movie.slug);
    if (cached) {
      setPoster(cached);
      setLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(`poster-${movie.slug}`);
      if (stored) {
        setPoster(stored);
        cache.set(movie.slug, stored);
        setLoading(false);
        return;
      }
    } catch {}

    fetchPoster(movie.slug).then(url => {
      if (url) setPoster(url);
      setLoading(false);
    });
  }, [movie.slug]);

  if (loading) {
    return (
      <div className={`bg-slate-700 animate-pulse ${className}`} />
    );
  }

  if (!poster) {
    return (
      <div className={`bg-slate-700 flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-xs text-center p-2">
          {movie.name}
        </div>
      </div>
    );
  }

  return (
    <img 
      src={poster} 
      alt={movie.name} 
      className={className}
      loading="lazy"
      decoding="async"
    />
  );
}

