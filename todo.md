# Niminal - Todo List

## 📋 OPEN TASKS

### Future Improvements
- [ ] 1. Fix inefficient database inserts (change to batch upsert)
- [ ] 2. Improve image security (restrict Next.js image domains)
- [ ] 3. Add better error handling in API routes

---

## ✅ COMPLETED TASKS

### Session 11: Expand Sources, Per-Source Limit, Source Filter
- [x] Created Cointelegraph scraper (RSS)
- [x] Created CryptoPotato scraper (RSS)
- [x] Created Paradigm scraper (HTML)
- [x] Created a16z Crypto scraper (HTML)
- [x] Created Messari scraper (HTML)
- [x] Updated scrape route to call all 8 scrapers
- [x] Added 3-per-source limit to news route
- [x] Created SourceFilter component with toggle buttons
- [x] Integrated filter into main page with localStorage persistence
- [x] Added source badge colors for new sources

### Session 10: Rebrand, About Page, Deployment
- [x] Renamed website to "Minimal News" (layout.tsx, page.tsx, README.md)
- [x] Created About page with minimalist philosophy (app/about/page.tsx)
- [x] Added slogan "Read. Inform. Move on."
- [x] Replaced hover-only link with visible "Read Article" button on cards
- [x] Added About navigation button in header
- [x] Fixed header consistency between pages (both use max-w-7xl)
- [x] Removed live status indicator from header
- [x] Initialized git repository
- [x] Created initial commit (26 files)
- [x] Pushed to GitHub (rishisidhu/minimal-news)
- [x] Deployed to Vercel (https://minimal-news-ten.vercel.app/)
- [x] Updated README.md with live demo URL

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

---

## 📝 SESSION 10 REVIEW

### Summary of Changes

**Rebranding & UI Improvements:**
- Renamed application from "Crypto News Aggregator" to "Minimal News"
- Added tagline "Read. Inform. Move on." across all pages
- Created comprehensive About page explaining the minimalist philosophy
- Repositioned "Read Article" buttons to bottom-right corner (absolute positioning)
- Converted plain text navigation to styled button with border and hover effects
- Removed live status indicator for cleaner header
- Fixed header alignment between home and about pages

**Deployment:**
- Initialized git repository with proper .gitignore
- Created initial commit with 26 files (4,191 insertions)
- Pushed to GitHub: https://github.com/rishisidhu/minimal-news
- Deployed to Vercel: https://minimal-news-ten.vercel.app/
- Updated README.md with live demo URL

### Files Modified
1. `app/layout.tsx` - Updated metadata title and description
2. `app/page.tsx` - Updated header, added About button, removed live status
3. `app/about/page.tsx` - Created new About page with philosophy
4. `components/NewsCard.tsx` - Repositioned Read Article buttons
5. `README.md` - Rebranded to Minimal News, added live URL

### Technical Notes
- Used absolute positioning for buttons within relative parent containers
- Headers now use consistent max-w-7xl across all pages
- Navigation buttons use identical styling for seamless transitions
- Environment variables required for Vercel: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

### Result
Minimal News is now live and fully branded with a clear minimalist philosophy. The UI is clean, navigation is intuitive, and the deployment pipeline is established for future updates.

---

## 📝 SESSION 11 REVIEW

### Summary of Changes

**Task 1: Added 5 New Scrapers**
- `lib/scrapers/cointelegraph.ts` - RSS feed from cointelegraph.com/rss
- `lib/scrapers/cryptopotato.ts` - RSS feed from cryptopotato.com/feed/
- `lib/scrapers/paradigm.ts` - HTML scraper for paradigm.xyz/writing
- `lib/scrapers/a16z.ts` - HTML scraper for a16zcrypto.com/posts
- `lib/scrapers/messari.ts` - HTML scraper for messari.io/research

**Task 2: Max 3 Articles Per Source**
- Updated `app/api/news/route.ts` with per-source limiting logic
- Groups articles by source, takes max 3 from each
- Re-sorts combined results by time (newest first)
- Configurable via `maxPerSource` query parameter

**Task 3: Source Filter Toggle UI**
- Created `components/SourceFilter.tsx`
- Horizontal row of toggle buttons for each source
- Saves preferences to localStorage
- Allows users to hide sources they don't want

### Files Created (6 files)
1. `lib/scrapers/cointelegraph.ts` - Cointelegraph RSS scraper
2. `lib/scrapers/cryptopotato.ts` - CryptoPotato RSS scraper
3. `lib/scrapers/paradigm.ts` - Paradigm HTML scraper
4. `lib/scrapers/a16z.ts` - a16z Crypto HTML scraper
5. `lib/scrapers/messari.ts` - Messari HTML scraper
6. `components/SourceFilter.tsx` - Source toggle filter component

### Files Modified (4 files)
1. `app/api/scrape/route.ts` - Added imports and calls for all 8 scrapers
2. `app/api/news/route.ts` - Added 3-per-source limit logic
3. `app/page.tsx` - Added SourceFilter component and filtering logic
4. `components/NewsCard.tsx` - Added colors for 5 new sources

### Technical Notes
- RSS scrapers (Cointelegraph, CryptoPotato) follow same pattern as CoinDesk
- HTML scrapers (Paradigm, a16z, Messari) use Cheerio to parse article listings
- Source colors: Cointelegraph (yellow), CryptoPotato (green), Paradigm (purple), a16z (red), Messari (cyan)
- Filter state persists in localStorage under key `selectedSources`
- At least one source must remain selected (can't deselect all)

### Result
Minimal News now aggregates from 8 sources (up from 3), with balanced coverage (max 3 per source) and user-controlled filtering. The UI remains clean with color-coded source badges and persistent filter preferences.

---

## 📝 SESSION 12 REVIEW

### Summary of Changes

**1. Filter UI Redesign**
- Simplified All/None buttons to single "All" toggle
- Toggle behavior: All selected → CoinDesk only, Not all → All selected
- Made pills more compact with softer styling

**2. Logo & Favicon Creation**
- Created custom "M" lettermark with distinctive angular design
- SVG path-based logo differentiates from Medium.com
- Added `app/icon.svg` for favicon
- Added `components/Logo.tsx` for header

**3. AI News Page (Major Feature)**
Created complete AI news section with 9 sources:
- OpenAI Blog
- MIT Technology Review
- TechCrunch AI (RSS)
- Wired AI (RSS)
- VentureBeat AI (RSS)
- Google DeepMind Blog
- Meta AI Research Blog
- NVIDIA AI Blog
- Hugging Face Blog

**4. Navigation**
- Added "AI" button to crypto page header
- Added "Crypto" button to AI page header
- Both pages link to About page

### Files Created (14 files)

**Scrapers (9 files):**
1. `lib/scrapers/openai.ts`
2. `lib/scrapers/mit-tech-review.ts`
3. `lib/scrapers/techcrunch-ai.ts`
4. `lib/scrapers/wired-ai.ts`
5. `lib/scrapers/venturebeat-ai.ts`
6. `lib/scrapers/deepmind.ts`
7. `lib/scrapers/meta-ai.ts`
8. `lib/scrapers/nvidia-ai.ts`
9. `lib/scrapers/huggingface.ts`

**API Routes (2 files):**
10. `app/api/scrape-ai/route.ts` - Orchestrates all AI scrapers
11. `app/api/news-ai/route.ts` - Fetches AI articles from DB

**Page & Components (3 files):**
12. `app/ai/page.tsx` - AI news page with filtering
13. `app/icon.svg` - Favicon
14. `components/Logo.tsx` - Header logo component

### Files Modified (3 files)
1. `app/page.tsx` - Added Logo import, AI navigation button
2. `components/SourceFilter.tsx` - Simplified to single All toggle
3. `components/NewsCard.tsx` - Added 9 AI source colors

### Technical Notes
- AI scrapers follow same patterns as crypto scrapers (RSS or HTML)
- AI sources stored in same `news_articles` table, filtered by source name
- API routes filter using `IN` clause for AI source names
- 3-per-source limit applies to AI articles too
- Logo uses custom SVG path for distinctive angular M design

### Result
Minimal News now has two content sections - Crypto and AI - each with dedicated sources, scrapers, and filtering. Navigation between sections is seamless, and both share the same visual design and user experience patterns.

---

## 📝 SESSION 12 CONTINUED: Rebrand to Niminal

### Summary of Changes

**Rebrand to Niminal**
- Changed brand name from "Minimal News" to "Niminal"
- New tagline: "News without the noise."
- Acquired domain: niminal.xyz

**Logo Updates**
- Updated logo from M lettermark to N lettermark
- Updated Logo.tsx SVG path to N design
- Updated icon.svg favicon to N lettermark

### Files Modified (6 files)
1. `app/layout.tsx` - Updated metadata title and description to Niminal
2. `app/page.tsx` - Updated header to Niminal branding
3. `app/ai/page.tsx` - Updated header to Niminal branding
4. `app/about/page.tsx` - Updated all references to Niminal
5. `README.md` - Rebranded to Niminal with new demo URL
6. `components/Logo.tsx` - Changed M lettermark to N lettermark
7. `app/icon.svg` - Changed favicon from M to N lettermark

### Technical Notes
- N lettermark SVG path: `d="M9 24V8h2.5l6.5 11V8H21v16h-2.5L12 13v11H9z"`
- Tagline "News without the noise." reflects minimalist philosophy
- All pages now consistently branded as Niminal

### Result
The application is now fully rebranded as Niminal with a distinctive N lettermark logo. The new brand name maintains the minimalist philosophy while being more unique and memorable. The logo and favicon are consistent across the application.

---

## 📝 SESSION 13: Product News Page

### Summary of Changes

**Created Product News Section with 10 Sources:**
- Product School Blog
- Mind the Product
- Silicon Valley Product Group (SVPG)
- ProductPlan Blog
- Intercom Product Blog
- Lenny's Newsletter
- Roman Pichler Blog
- Product Coalition
- Aha! Blog
- ProductTalk

### Files Created (14 files)

**Scrapers (10 files):**
1. `lib/scrapers/product-school.ts`
2. `lib/scrapers/mind-the-product.ts`
3. `lib/scrapers/svpg.ts`
4. `lib/scrapers/productplan.ts`
5. `lib/scrapers/intercom.ts`
6. `lib/scrapers/lennys-newsletter.ts`
7. `lib/scrapers/roman-pichler.ts`
8. `lib/scrapers/product-coalition.ts`
9. `lib/scrapers/aha.ts`
10. `lib/scrapers/producttalk.ts`

**API Routes (2 files):**
11. `app/api/scrape-product/route.ts` - Orchestrates all 10 product scrapers
12. `app/api/news-product/route.ts` - Fetches product articles with 3-per-source limit

**Page (1 file):**
13. `app/product/page.tsx` - Product news page with source filtering

### Files Modified (3 files)
1. `components/NewsCard.tsx` - Added 10 product source colors
2. `app/page.tsx` - Added Product navigation button
3. `app/ai/page.tsx` - Added Product navigation button

### Technical Notes
- All scrapers use HTML scraping pattern with Cheerio
- Product sources stored in same `news_articles` table
- 3-per-source limit applies to product articles
- Source colors: Product School (blue), Mind the Product (purple), SVPG (indigo), ProductPlan (teal), Intercom (blue-500), Lenny's (orange), Roman Pichler (emerald), Product Coalition (pink), Aha! (cyan), ProductTalk (violet)
- Navigation now includes Crypto, AI, Product, and About links

### Result
Niminal now has three content sections - Crypto, AI, and Product - each with dedicated sources, scrapers, and filtering. The application provides comprehensive coverage across technology domains with consistent UX patterns.

---

## 📝 SESSION 14: Product Page Sources, Card Size & Loading UX

### Summary of Changes

**1. Product Page Source Overhaul**
Multiple iterations to find reliable, fast-loading sources with good content:
- Removed slow blog scrapers (Product School, SVPG, etc.)
- Tried Reddit product subreddits (removed - poor content quality)
- Tried Product Hunt (removed - requires API authentication)
- Tried a16z essays (removed - scraping issues)
- **Final sources: Hacker News, First Round Review, Product School**

**2. Hacker News Scraper Improvements**
- Fetches meta descriptions from article pages for better excerpts
- Falls back to "X points • Y comments" when meta fetch fails
- Uses HN Firebase API for fast story retrieval
- Increased excerpt length from 500 to 1000 characters

**3. Created New Scrapers**
- `lib/scrapers/firstround.ts` - First Round Review VC essays
- `lib/scrapers/productschool.ts` - Product School blog articles
- Both fetch OG meta tags from individual article pages for reliable titles, excerpts, and images

**4. Card Size & Text Length Increases**
- Word limit: 200 → 300 words in truncateToWords function
- Featured card line clamp: 12 → 16 lines
- Regular card line clamp: 10 → 14 lines
- Excerpt length in scrapers: 500 → 1000 characters

**5. Loading UX Overhaul**
Replaced spinning circles with skeleton loading cards on all 3 pages:
- Crypto page: 6 skeleton cards in grid layout
- AI page: 6 skeleton cards in grid layout
- Product page: 1 featured skeleton + 3 regular skeletons
- Shows "Fetching latest articles..." text
- Skeleton cards pulse/shimmer with animate-pulse
- Matches actual card layout for seamless transition

### Files Created (2 files)
1. `lib/scrapers/firstround.ts` - First Round Review scraper
2. `lib/scrapers/productschool.ts` - Product School scraper

### Files Modified (8 files)
1. `app/api/scrape-product/route.ts` - Updated to use HN, First Round, Product School
2. `app/api/news-product/route.ts` - Updated PRODUCT_SOURCES array
3. `app/product/page.tsx` - Updated sources, added skeleton loading
4. `app/page.tsx` - Added skeleton loading cards
5. `app/ai/page.tsx` - Added skeleton loading cards
6. `components/NewsCard.tsx` - Increased word limit and line clamps, added source colors
7. `lib/scrapers/hackernews.ts` - Increased excerpt length to 1000 chars
8. `lib/scrapers/reddit.ts` - Increased excerpt length to 1000 chars

### Technical Notes
- First Round and Product School scrapers fetch OG meta tags from each article page
- This provides reliable titles, descriptions (150+ words), and images
- Skeleton loading uses Tailwind's animate-pulse for shimmer effect
- Product page skeletons mirror the featured + regular card layout
- HN scraper makes parallel requests to article URLs for meta descriptions

### Source Colors Added
- First Round: teal-600
- Product School: violet-600

### Result
Product page now loads faster with reliable sources and shows substantially more text per article. The skeleton loading provides a polished, less irritating loading experience across all three pages. Users see placeholder cards that match the final layout, making the wait feel shorter.
