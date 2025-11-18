# Minimal News

**Read. Inform. Move on.**

**Live Demo: [https://minimal-news-ten.vercel.app/](https://minimal-news-ten.vercel.app/)**

A focused crypto news reader designed for intentional news consumption. No endless scrolling, no engagement tricks—just the latest cryptocurrency news from trusted sources, condensed to 50 words per article.

## Philosophy

In a world of endless feeds and infinite scrolling, we believe news consumption should be intentional, focused, and finite. Minimal News is built around four core principles:

- **No Endless Scroll**: A curated selection of articles, not an infinite feed
- **Fresh Only**: Articles older than 6 hours are automatically removed
- **50 Words, No More**: Every article condensed to the essence
- **Read and Go**: Designed for you to stay informed and move on with your day

## Features

- **Real-time Updates**: Automatically refreshes news every 10 seconds
- **Multiple Sources**: Aggregates news from:
  - [CoinDesk](https://www.coindesk.com/)
  - [The Block](https://www.theblock.co/)
  - [Reddit r/CryptoCurrency](https://www.reddit.com/r/CryptoCurrency/)
- **Beautiful UI**: Modern, minimalist design with Tailwind CSS
- **Responsive**: Works seamlessly on mobile, tablet, and desktop
- **Dark Mode Support**: Toggle between light and dark themes
- **About Page**: Explains the minimalist philosophy

## Tech Stack

- **Frontend**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Data Fetching**: SWR for auto-refresh and caching
- **Web Scraping**: Cheerio + Axios
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- A Supabase account
- npm or yarn

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd news-collector
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL commands from `supabase-schema.sql` to create the database schema
4. Get your project URL and keys from Settings → API

### 4. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The app uses a single table `news_articles` with the following structure:

```sql
- id (UUID, Primary Key)
- title (TEXT)
- excerpt (TEXT)
- image_url (TEXT, nullable)
- source (TEXT)
- article_url (TEXT, unique)
- published_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## How It Works

1. **Initial Load**: When the page loads, it triggers an initial scrape of all sources
2. **Auto-refresh**: The UI refreshes every 10 seconds using SWR
3. **Periodic Scraping**: New articles are scraped every 5 minutes
4. **Deduplication**: Articles are deduplicated by URL to prevent duplicates
5. **Auto-cleanup**: Articles older than 6 hours are automatically removed

## API Routes

### GET/POST `/api/scrape`
Triggers scraping of all news sources and stores results in Supabase.

**Response:**
```json
{
  "success": true,
  "message": "Scraped X articles. Inserted: Y, Skipped (duplicates): Z",
  "stats": {
    "coindesk": 10,
    "theblock": 10,
    "reddit": 10
  }
}
```

### GET `/api/news`
Fetches news articles from Supabase.

**Query Parameters:**
- `limit` (default: 50) - Number of articles to fetch
- `offset` (default: 0) - Offset for pagination

**Response:**
```json
{
  "success": true,
  "data": [...articles],
  "count": 50
}
```

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Import Project" and select your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Click "Deploy"

Vercel will automatically detect Next.js and configure the build settings.

## Customization

### Changing Refresh Interval

Edit the `refreshInterval` in `app/page.tsx`:

```typescript
const { data, error, isLoading, mutate } = useSWR(
  '/api/news?limit=50',
  fetcher,
  {
    refreshInterval: 10000, // Change this value (in milliseconds)
  }
)
```

### Adding More News Sources

1. Create a new scraper in `lib/scrapers/`
2. Add it to the scrape API route in `app/api/scrape/route.ts`
3. Update the source badge color in `components/NewsCard.tsx`

## Troubleshooting

### "Failed to load news"
- Check your Supabase credentials in `.env.local`
- Ensure the database schema is created correctly
- Check the browser console for errors

### No articles showing up
- Wait a few moments for the initial scrape to complete
- Check the Network tab to see if scraping succeeded
- Verify that the scraping endpoints are accessible

### Images not loading
- Some news sources may block external image requests
- The app uses `unoptimized` images to avoid Next.js domain restrictions

## License

MIT

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
