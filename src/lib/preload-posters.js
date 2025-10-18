export const preloadPosters = (movies, count = 20) => {
  if (typeof window === 'undefined') return;
  
  const toPreload = movies.slice(0, count);
  
  toPreload.forEach(movie => {
    const cached = localStorage.getItem(`poster-${movie.slug}`);
    if (cached) return;
    
    fetch(`/api/poster?slug=${movie.slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.poster) {
          try {
            localStorage.setItem(`poster-${movie.slug}`, data.poster);
            const img = new Image();
            img.src = data.poster;
          } catch {}
        }
      })
      .catch(() => {});
  });
};

export const preloadRandomPosters = (movies, count = 10) => {
  if (typeof window === 'undefined') return;
  
  const shuffled = [...movies].sort(() => Math.random() - 0.5);
  preloadPosters(shuffled, count);
};

