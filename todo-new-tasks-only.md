# Smart Article Rotation Implementation

## Tasks

### Phase 1: Add Scrape Batch Tracking
- [ ] Add `scrape_batch_id` and `scrape_batch_time` to NewsArticle interface in lib/supabase.ts
- [ ] Modify scrape/route.ts to generate and attach batch ID
- [ ] Modify scrape-ai/route.ts to generate and attach batch ID
- [ ] Modify scrape-product/route.ts to generate and attach batch ID

### Phase 2: Create Selection Algorithm
- [ ] Create lib/selection-algorithm.ts with smart selection logic
- [ ] Implement weighted selection (70% fresh, 30% old)
- [ ] Implement balanced selection (X/6 per hour bucket)
- [ ] Add time bucket distribution logic

### Phase 3: Rotation State Management
- [ ] Create lib/rotation-state.ts for rotation index tracking
- [ ] Implement rotation offset increment logic
- [ ] Add reset logic when new scrape detected

### Phase 4: Update API Routes
- [ ] Modify app/api/news/route.ts to use smart selection
- [ ] Modify app/api/news-ai/route.ts to use smart selection
- [ ] Modify app/api/news-product/route.ts to use smart selection

### Phase 5: Testing & Deployment
- [ ] Test locally with sample data
- [ ] Verify timestamps remain honest
- [ ] Verify fresh content is prioritized
- [ ] Deploy and monitor behavior

## Implementation Notes
- Keep timestamps honest (no fake freshness)
- Prioritize latest scrape batch (70/30 split)
- Balance across 6-hour window when no new content
- Simple in-memory rotation state (no database needed)

## Review Section
(To be filled after implementation)
