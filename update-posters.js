const fs = require('fs');
const https = require('https');

const fetch = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => resolve(data));
  }).on('error', reject);
});

const movies = JSON.parse(fs.readFileSync('src/app/movies.json', 'utf-8'));

(async () => {
  console.log(`Updating poster URLs for ${movies.length} movies...`);
  
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    console.log(`${i + 1}/${movies.length}: ${movie.name}`);
    
    try {
      const html = await fetch(`https://letterboxd.com/film/${movie.slug}/`);
      const match = html.match(/https:\/\/a\.ltrbxd\.com\/resized\/[^"]+\.jpg/);
      
      if (match) {
        movie.poster = match[0];
        console.log(`  ✓ Updated`);
      } else {
        console.log(`  ✗ Not found`);
      }
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  fs.writeFileSync('src/app/movies.json', JSON.stringify(movies, null, 2));
  console.log('\nDone! Updated movies.json');
})();

