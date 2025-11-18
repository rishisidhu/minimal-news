# Minimal News - Todo List

## 📋 OPEN TASKS

### Current Session Tasks
- [ ] 1. Rename website to "Minimal News" (update layout.tsx, page.tsx, README.md)
- [ ] 2. Create About page (app/about/page.tsx)
- [ ] 3. Add slogan "Read. Inform. Move on."
- [ ] 4. Replace hover-only link with visible button on cards

### Future Improvements
- [ ] 5. Fix inefficient database inserts (change to batch upsert)
- [ ] 6. Improve image security (restrict Next.js image domains)
- [ ] 7. Add better error handling in API routes
- [ ] 8. Initialize git repository
- [ ] 9. Prepare deployment guide for Vercel

---

## ✅ COMPLETED TASKS

### Session 9: Remove Side Panel
- [x] Removed TimelinePanel component from layout
- [x] Simplified page.tsx to single-column layout
- [x] Full-width article display

### Session 8: Fix Text Truncation, Dark Mode, and The Block Extraction
- [x] Fix The Block articles showing only 1 line (added more CSS selectors + logging)
- [x] Implement 50-word truncation at nearest complete sentence
- [x] Fix dark mode toggle (added Tailwind v4 @variant dark config)

### Critical Tasks (For Functionality)
- [x] 1. Set up Supabase database and get credentials
- [x] 2. Update .env.local with real Supabase credentials
- [x] 3. Test the application (npm run dev)

### Improvements (Make it Better)
- [x] 4. Fix CoinDesk and The Block scrapers (use RSS feeds instead)
- [x] 5. Add timeline panel on right side with one-line summaries (later removed in Session 9)
- [x] 6. Redesign with magazine-style layout

### Database & Scraper Fixes
- [x] Enhanced CoinDesk scraper metadata and body text extraction
- [x] Enhanced The Block scraper metadata and body text extraction
- [x] Created server-side Supabase client using service role key
- [x] Updated API routes to use server client for write operations
- [x] Documented changes in todo.md

---

## 📝 WORK LOG

### Session 1: Initial Setup & Basic Functionality

**Task 1 & 2 Completed:**
- Updated `.env.local` with real Supabase credentials
- Project URL: https://bjwwluyovholpejkkjir.supabase.co
- Database schema successfully run in Supabase SQL Editor

**Task 3 Completed:**
- Dev server running successfully on http://localhost:3000
- TypeScript config automatically updated by Next.js
- Application is ready to view in browser

**Tailwind CSS v4 Migration:**
- Installed `@tailwindcss/postcss` package
- Updated `postcss.config.js` to use new plugin
- Updated `globals.css` to use `@import "tailwindcss"` syntax
- Removed `tailwind.config.ts` (not needed in v4)

### Session 2: RSS Scrapers & Timeline

**Task 4 & 5 Completed:**
- Rewrote CoinDesk scraper to use RSS feed (more reliable)
- Rewrote The Block scraper to use RSS feed (more reliable)
- Added `rss-parser` package
- Created `TimelinePanel` component showing one-line summaries
- Updated main page layout to include timeline on the right
- Timeline is sticky and scrollable

### Session 3: Magazine-Style Design

**Task 6 Completed - Magazine-Style Redesign:**
- Added Google Fonts: Inter (body) and Playfair Display (headlines)
- Completely redesigned NewsCard component:
  - Horizontal layout with image on left (40%), content on right (60%)
  - Featured article variant with large image and bigger text
  - Self-contained cards showing 3-line summaries (no external links)
  - Premium styling with better shadows and borders
- Updated main page layout:
  - Single column layout for cleaner look
  - Featured article at top
  - Limited to 12 regular articles below featured
  - More generous spacing (space-y-6 and space-y-8)
- Visual improvements:
  - Better background gradient
  - Serif font for headlines (Playfair Display)
  - Improved color scheme
  - Better source badges (uppercase, bold, better colors)

### Session 4: UI Refinements & Compact Layout

**UI Refinements:**
- Made cards more compact:
  - Reduced title size (text-3xl to text-xl for regular cards)
  - Reduced padding (p-8 to p-5/p-6)
  - Reduced image height (h-56 to h-48)
  - Shortened excerpt to 2 lines (120 chars)
- Added external link button:
  - Icon appears on hover in top-right corner
  - Opens article in new tab
  - Smooth scale animation
- Redesigned timeline panel:
  - Removed bullet points
  - Used thin font (font-light)
  - Single line titles only
  - Added left border with hover effect
  - Cleaner, more minimal look

### Session 5: Font Refinements & Image Extraction

**Latest UI and Scraper Fixes:**
- Made fonts thinner across the app:
  - Changed all `font-bold` to `font-semibold` in NewsCard titles and badges
  - Changed main page heading from `font-bold` to `font-semibold`
  - Creates cleaner, more refined look
- Fixed image extraction for CoinDesk and The Block:
  - Now fetches actual article pages and extracts Open Graph images
  - Falls back to RSS content images if available
  - Uses Cheerio to parse HTML and extract meta tags
  - Added proper User-Agent headers for scraping
- Improved Reddit scraper:
  - Added comprehensive HTTP headers (User-Agent, Accept, Referer, etc.)
  - Added detailed error logging for debugging
  - Increased timeout to 10 seconds
  - Better error handling with axios error detection
- Removed article display limit:
  - Changed from showing only 13 articles to displaying all fetched articles
  - Page now scrolls through all 50 articles
  - Provides better user experience

### Session 6: Card Size Reduction & Content Improvements

**Card Size Reduction & Content Improvements:**
- Drastically reduced card heights to show 6-8 cards instead of 4:
  - Featured article image: Reduced from `h-80` (320px) to `h-64` (256px)
  - Regular card images: Reduced from `h-48` (192px) to `h-32` (128px)
  - Featured article padding: Reduced from `p-6` to `p-4`
  - Regular card padding: Reduced from `p-5 sm:p-6` to `p-3 sm:p-4`
  - Featured article title: Reduced from `text-3xl` to `text-2xl`
  - Regular card title: Reduced from `text-xl` to `text-lg`
  - Badge spacing: Reduced from `gap-3 mb-3` to `gap-2 mb-2`
  - Excerpt font: Reduced from `text-sm` to `text-xs` for regular cards
  - Card spacing: Reduced from `space-y-6` to `space-y-4`
  - External link icon: Made smaller (`w-3.5 h-3.5` and `p-1.5`)
- Enhanced content extraction for better relevance:
  - CoinDesk & The Block now extract actual article descriptions from og:description meta tags
  - Falls back to standard description meta tag if needed
  - Fetches both images AND content in single request for efficiency
  - Increased timeout to 10 seconds for better reliability
  - Added detailed console logging to track metadata extraction
  - Scrapers now prefer actual article content over RSS contentSnippet
- Result: Much more compact, information-dense layout showing more articles per screen

### Session 7: Visual Design Overhaul - Typography & Color

**Visual Design Overhaul - Typography & Color:**
- Increased content display in cards:
  - Excerpt truncation increased from 120 to 200 characters
  - Line clamp changed from 2 to 3 lines for all excerpts
  - Regular card excerpt font increased from `text-xs` to `text-sm` for better readability
  - Shows 50% more text per card while maintaining clean layout
- Complete font replacement for better readability:
  - Body font: Changed from Inter to **Source Sans Pro** (highly readable, professional)
  - Headline font: Changed from Playfair Display to **Merriweather** (designed for screens, warm)
  - Updated all font variables in layout.tsx and globals.css
  - Added multiple weights for Merriweather (300, 400, 700)
  - Result: More readable, professional journalism feel like NYT/WSJ
- Vibrant gradient backgrounds for lively design:
  - Page background: Changed from gray gradient to `from-blue-50 via-purple-50 to-indigo-50`
  - Header: Bold gradient `from-blue-600 via-purple-600 to-indigo-600` with white text
  - Header text: Changed to white with `text-blue-100` for subtitle
  - Live indicator: Adjusted colors for better contrast on gradient (`bg-green-400`, `bg-yellow-300`)
  - Result: Much more vibrant and engaging while staying professional
- Enhanced card visual design:
  - Increased shadow depth: `shadow-md` to `shadow-lg` for regular cards
  - Featured cards: `shadow-lg` to `shadow-xl`
  - Border colors: Warmer `border-gray-300` instead of `border-gray-200`
  - Added hover border color change for interactive feedback
  - Better visual hierarchy and depth throughout

---

## 📊 PROJECT SUMMARY

### Overview
Minimal News is a focused crypto news reader that pulls cryptocurrency news from three major sources: CoinDesk, The Block, and Reddit's r/CryptoCurrency. The application features a minimalist layout with elegant typography, automatic refresh capabilities, and a clean, modern interface.

### Philosophy
- **No endless scroll**: Fixed number of articles
- **Fresh news only**: Articles from the last 6 hours
- **50 words per article**: Quick, digestible summaries
- **Read and go**: Designed for focused consumption, not engagement farming

### Key Features Implemented
1. **Magazine-Style Layout**: Featured article at top with large image, followed by horizontal cards
2. **Auto-Refresh**: Updates every 10 seconds with visual indicators
3. **Premium Typography**: Source Sans Pro for body text, Merriweather for headlines
4. **Reliable Scraping**: RSS-based scrapers with fallback to page scraping for images
5. **Dark Mode Support**: Full dark mode theming throughout
6. **Responsive Design**: Mobile-friendly layout with Tailwind CSS
7. **50-Word Truncation**: Smart truncation at sentence boundaries

### Technical Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)
- RSS Parser for feeds
- Axios + Cheerio for web scraping
- SWR for data fetching
- date-fns for time formatting
- next-themes for dark mode

---

## 🔧 SESSION 10: Rebrand to "Minimal News" + About Page + UI Improvements

### Tasks to Complete
1. **Rename to "Minimal News"**
   - Update metadata in layout.tsx
   - Update header in page.tsx
   - Update README.md

2. **Create About Page**
   - New file: `app/about/page.tsx`
   - Content: Minimalist philosophy
   - Slogan: "Read. Inform. Move on."

3. **Visible Link Buttons**
   - Update NewsCard.tsx
   - Replace hover-only button with always-visible minimal button
   - Elegant, simple design

### Files to Modify (Session 10)
1. `app/layout.tsx` - Metadata update
2. `app/page.tsx` - Header update
3. `README.md` - Project title
4. `app/about/page.tsx` - NEW FILE
5. `components/NewsCard.tsx` - Visible button

### Expected Results
- Website branded as "Minimal News"
- Clear philosophy communicated via About page
- Better UX with visible "Read Article" buttons on all cards
