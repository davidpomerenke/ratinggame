# 🎬 Movie Rating Game

A personalized movie ranking system built with Next.js that uses game-based comparisons to generate ELO ratings for your film collection. Scrapes data from Letterboxd and lets you build rankings through fun, interactive games.

## ✨ Features

### 🎮 Game Modes

- **1v1 Battle** - Head-to-head movie comparisons with skip functionality
- **Rank 5** - Order 5 random movies from best to worst
- **Knockout Tournament** - 8-movie bracket with 3 elimination rounds
- **Deck Battle** - Strategic deck-based comparison game
- **⚡ Rapid Fire** - 60-second speed challenge
- **🏆 Top 10 Builder** - Curate your personal top 10 list

### 🛠️ Tools

- **📊 Statistics Dashboard** - View your ranking insights, top genres, favorite directors, and decade preferences
- **🔍 Browse & Filter** - Search and filter movies by decade, genre, or director
- **📤 Share Rankings** - Export your top 10 as text or downloadable image

### 🎯 Key Features

- **ELO Rating System** - Chess-inspired algorithm for accurate rankings
- **Keyboard Shortcuts** - Arrow keys, number keys, and hotkeys for fast gameplay
- **Mobile Gestures** - Swipe left/right to choose movies
- **Undo Functionality** - Reverse your last 5 comparisons
- **Smart Caching** - Progressive image loading with localStorage persistence
- **Service Worker** - Offline image caching for better performance
- **Visual Feedback** - Confetti animations, transitions, and hover effects

## 🚀 Getting Started

### Prerequisites

- Node.js (or just use system curl for scraping)
- A Letterboxd account to scrape from

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ratinggame

# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to start playing!

## 📥 Scraping Your Movie Data

The scraper fetches movies from Letterboxd with full metadata (directors, genres, posters, ratings).

### Basic Usage

```bash
node scrape.js
```

### Features

- **Resumable** - Interruption-safe, saves after each movie
- **Smart Skip** - Only fetches missing/incomplete data
- **Rate Limited** - 100ms delay between requests
- **Progress Tracking** - Shows [FETCH] or [SKIP] for each movie

### Configuration

Edit `scrape.js` to:
- Change username: Update the URL in line 86
- Scrape all pages: Change `const totalPages = 1` to use `pageMatch` logic
- Adjust rate limiting: Modify the timeout in line 130

## 🎨 Technology Stack

- **Next.js 15** - React framework with App Router
- **Tailwind CSS 4** - Utility-first styling
- **localStorage** - Persistent rankings and cache
- **Service Workers** - Offline image caching
- **Canvas API** - Image generation for sharing

## 📊 How It Works

### ELO Rating System

Each movie starts at 1000 rating points. When you compare two movies:

```
Expected Win Probability = 1 / (1 + 10^((OpponentRating - YourRating) / 400))
New Rating = Old Rating + K-Factor * (Actual - Expected)
```

- K-Factor: 32 (controls rating volatility)
- Higher ratings = harder to gain points from wins
- Upsets (lower-rated beating higher-rated) yield bigger swings

### Data Storage

- **Rankings**: `localStorage['movie-rankings']` - ELO ratings for each movie
- **History**: `localStorage['comparison-history']` - Last 5 comparisons for undo
- **Posters**: `localStorage['poster-{slug}']` - Cached image URLs

## ⌨️ Keyboard Shortcuts

### All Games
- `ESC` - Return to home
- `Ctrl+Z` - Undo last comparison (when button visible)

### 1v1 Battle
- `← / →` or `1 / 2` - Choose left/right movie
- `S` or `Space` - Skip pair

### Rank 5
- `1-5` - Select movie to rank
- `Enter` - Submit ranking

### Knockout & Deck Battle
- `← / →` or `1 / 2` - Choose left/right

### Rapid Fire
- `← / →` - Choose movie (no number keys for speed)

## 📱 Mobile Support

- **Swipe Gestures** - Swipe left/right to choose movies
- **Touch Optimized** - Large tap targets
- **Responsive Design** - Adapts from mobile to desktop

## 🔧 Project Structure

```
src/
├── app/
│   ├── page.js              # Home with rankings
│   ├── games/
│   │   ├── 1v1/page.js      # 1v1 Battle
│   │   ├── rank5/page.js    # Rank 5
│   │   ├── knockout/page.js # Tournament
│   │   ├── decks/page.js    # Deck Battle
│   │   ├── rapid/page.js    # Rapid Fire
│   │   └── top10/page.js    # Top 10 Builder
│   ├── stats/page.js        # Statistics
│   ├── browse/page.js       # Browse & Filter
│   └── share/page.js        # Share Rankings
├── components/
│   ├── MoviePoster.js       # Lazy-loading poster component
│   └── UndoButton.js        # Floating undo button
├── hooks/
│   ├── useKeyboard.js       # Keyboard shortcut handler
│   └── useSwipe.js          # Touch gesture handler
└── lib/
    ├── ranking.js           # ELO calculations
    ├── undo.js              # Comparison history
    ├── confetti.js          # Celebration animation
    └── preload-posters.js   # Image preloading
```

## 🎯 Tips for Best Experience

1. **Start with 1v1 Battle** - Easiest way to build initial rankings
2. **Use Keyboard Shortcuts** - Much faster than clicking
3. **Play Rapid Fire** - Great for quickly ranking many movies
4. **Skip Unknown Movies** - Don't guess, skip and compare what you know
5. **Check Statistics** - See your preferences and biases

## 🐛 Troubleshooting

### Images Not Loading
- Restart dev server after changing `next.config.mjs`
- Check browser console for CORS errors
- Run scraper to fetch real CDN URLs

### Rankings Seem Off
- Play more games - ELO needs data to stabilize
- Use Undo if you made mistakes
- Try different game modes for varied comparisons

### Performance Issues
- Clear localStorage if it gets too large
- Check service worker cache size
- Disable animations on slower devices

## 🤝 Contributing

Feel free to open issues or submit PRs for:
- New game modes
- UI improvements
- Bug fixes
- Additional statistics/insights

## 📄 License

MIT

## 🙏 Credits

- Movie data from [Letterboxd](https://letterboxd.com)
- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)

---

Made with ❤️ for movie lovers who can't decide their favorite films
