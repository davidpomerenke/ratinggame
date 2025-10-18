const fs = require('fs');
const https = require('https');

const fetch = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

const fetchJson = (url) => fetch(url).then(JSON.parse);

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
    const data = await fetchJson(`https://letterboxd.com${endpoint}`);
    
    // Fetch actual poster image from film page
    let posterUrl = null;
    try {
      const filmHtml = await fetch(`https://letterboxd.com/film/${slug}/`);
      const posterMatch = filmHtml.match(/https:\/\/a\.ltrbxd\.com\/resized\/[^"]+\.jpg/);
      if (posterMatch) posterUrl = posterMatch[0];
    } catch {}
    
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
  console.log('Fetching page 1...');
  const html = await fetch('https://letterboxd.com/schnabil/films/');
  const pageMatch = html.match(/<li class="paginate-page"><a[^>]+>(\d+)<\/a><\/li>(?!.*<li class="paginate-page">)/);
  const totalPages = 1 ;pageMatch ? parseInt(pageMatch[1]) : 1;
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
  
  console.log(`Found ${allFilms.length} films. Fetching details...`);
  for (let i = 0; i < allFilms.length; i++) {
    const film = allFilms[i];
    console.log(`  ${i + 1}/${allFilms.length}: ${film.name}`);
    const details = await getDetails(film.endpoint, film.slug);
    Object.assign(film, details);
    if (details.posterImage) film.poster = details.posterImage;
    delete film.endpoint;
    delete film.posterImage;
  }
  
  fs.writeFileSync('src/app/movies.json', JSON.stringify(allFilms, null, 2));
  console.log(`Saved ${allFilms.length} films to src/app/movies.json`);
})();

