const fs = require('fs');
const https = require('https');

const OUTPUT_FILE = 'src/app/movies.json';

const fetch = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

const fetchJson = (url) => fetch(url).then(JSON.parse);

const loadExisting = () => {
  try {
    return JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
  } catch {
    return [];
  }
};

const saveMovies = (movies) => {
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(movies, null, 2));
};

const extractFilms = (html) => {
  const films = [];
  const pattern = /data-item-name="([^"]+)"\s+data-item-slug="([^"]+)"[^>]+data-film-id="([^"]+)"[^>]+data-poster-url="([^"]+)"[^>]+data-details-endpoint="([^"]+)"/g;
  
  let match;
  while ((match = pattern.exec(html)) !== null) {
    const [_, name, slug, id, posterUrl, endpoint] = match;
    films.push({
      name: name.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
      slug,
      id,
      poster: `https://letterboxd.com${posterUrl.replace('/image-150/', '/image-500/')}`,
      endpoint,
      link: `https://letterboxd.com/film/${slug}/`
    });
  }
  
  const ratingPattern = /data-item-uid="film:(\d+)"[^>]*>\s*<span class="rating[^>]+rated-\d+">([^<]+)<\/span>/g;
  while ((match = ratingPattern.exec(html)) !== null) {
    const [_, filmId, stars] = match;
    const film = films.find(f => f.id === filmId);
    if (film) film.rating = stars.trim();
  }
  
  return films;
};

const getDetails = async (endpoint, slug) => {
  try {
    const [data, filmHtml] = await Promise.all([
      fetchJson(`https://letterboxd.com${endpoint}`),
      fetch(`https://letterboxd.com/film/${slug}/`)
    ]);
    
    const posterMatch = filmHtml.match(/https:\/\/a\.ltrbxd\.com\/resized\/[^"]+\.jpg/);
    const posterUrl = posterMatch ? posterMatch[0] : null;
    
    return {
      year: data.releaseYear,
      directors: (data.directors || []).map(d => d.name),
      genres: data.genres || [],
      runtime: data.runTime,
      tagline: data.tagline,
      description: data.description,
      posterImage: posterUrl
    };
  } catch {
    return {};
  }
};

(async () => {
  console.log('Loading existing movies...');
  const existing = loadExisting();
  const existingMap = new Map(existing.map(m => [m.slug, m]));
  
  console.log(`Found ${existing.length} existing movies`);
  console.log('Fetching page 1...');
  
  const html = await fetch('https://letterboxd.com/schnabil/films/');
  const pageMatch = html.match(/<li class="paginate-page"><a[^>]+>(\d+)<\/a><\/li>(?!.*<li class="paginate-page">)/);
  const totalPages = pageMatch ? parseInt(pageMatch[1]) : 1;
  console.log(`Found ${totalPages} pages`);
  
  const allFilms = [];
  for (let page = 1; page <= totalPages; page++) {
    console.log(`Scraping page ${page}/${totalPages}...`);
    const url = page === 1 
      ? 'https://letterboxd.com/schnabil/films/'
      : `https://letterboxd.com/schnabil/films/page/${page}/`;
    const pageHtml = await fetch(url);
    allFilms.push(...extractFilms(pageHtml));
  }
  
  console.log(`\nFound ${allFilms.length} films. Fetching details...\n`);
  
  const movies = [];
  let updated = 0;
  let skipped = 0;
  
  for (let i = 0; i < allFilms.length; i++) {
    const film = allFilms[i];
    const existing = existingMap.get(film.slug);
    
    const hasRealPoster = existing?.poster?.includes('a.ltrbxd.com');
    const hasDetails = existing?.year && existing?.directors?.length > 0;
    
    if (hasRealPoster && hasDetails) {
      movies.push(existing);
      skipped++;
      console.log(`  ${i + 1}/${allFilms.length}: ${film.name} [SKIP]`);
      continue;
    }
    
    console.log(`  ${i + 1}/${allFilms.length}: ${film.name} [FETCH]`);
    const details = await getDetails(film.endpoint, film.slug);
    Object.assign(film, details);
    if (details.posterImage) film.poster = details.posterImage;
    delete film.endpoint;
    delete film.posterImage;
    
    movies.push(film);
    updated++;
    
    saveMovies(movies);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\nDone!`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Total: ${movies.length}`);
  console.log(`\nSaved to ${OUTPUT_FILE}`);
})();
