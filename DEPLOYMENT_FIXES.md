# Niminal Production Deployment Fixes

**Date:** 2025-11-21
**Issues Fixed:**
1. Product page showing no articles
2. Periodic scraping stopped overnight

---

## 🔴 Critical: Manual Steps Required in Vercel Dashboard

### Step 1: Add Missing Environment Variable

**Why:** The `SUPABASE_SERVICE_ROLE_KEY` is required for server-side database writes. Without it, all scraping fails silently.

**Action:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `news-collector` project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add these variables (if missing):

   ```
   Variable Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [Get from Supabase Dashboard → Settings → API → service_role key - starts with "eyJ..."]
   Environments: ✅ Production  ✅ Preview  ✅ Development
   ```

6. Click **Save**

### Step 2: Add Cron Secret (Optional but Recommended)

**Why:** Protects your cron endpoints from unauthorized access.

**Action:**
1. In same **Environment Variables** page
2. Click **Add New**
3. Add:

   ```
   Variable Name: CRON_SECRET
   Value: [Generate a random string - use https://randomkeygen.com/ or run: openssl rand -base64 32]
   Environments: ✅ Production  ✅ Preview  ✅ Development
   ```

4. Click **Save**

**Note:** If you skip this step, cron jobs will still work but won't have authentication protection.

### Step 3: Deploy Changes

**Why:** Code changes need to be deployed to production.

**Action:**
1. Commit and push your local changes:
   ```bash
   git add .
   git commit -m "Fix: Add cron-based scraping and improve error logging"
   git push
   ```

2. Vercel will automatically deploy (if auto-deploy is enabled)
3. Or manually trigger deployment in Vercel Dashboard → Deployments → Redeploy

### Step 4: Verify Environment Variables After Deployment

**Important:** Adding env vars requires a redeploy to take effect.

**Action:**
1. After deployment completes, go to latest deployment
2. Click on **Functions** tab
3. Find any API route log (like `/api/scrape-product`)
4. You should see: `✅ Supabase environment variables validated`
5. If you see: `❌ SUPABASE_SERVICE_ROLE_KEY is not set` - you need to add the env var and redeploy

---

## 🧪 Testing the Fixes

### Test 1: Verify Environment Variables

Visit in browser:
```
https://niminal.xyz/api/scrape-product
```

**Expected Success Response:**
```json
{
  "success": true,
  "message": "Scraped 30 articles in 3500ms",
  "stats": {
    "hackerNews": 15,
    "firstRound": 10,
    "productSchool": 5,
    "total": 30,
    "duration": "3500ms"
  }
}
```

**If you see error:**
```json
{
  "success": false,
  "error": "Database insert failed",
  "details": "..."
}
```
→ Check Vercel Function Logs for the detailed error

### Test 2: Verify Product Page Has Articles

Visit:
```
https://niminal.xyz/product
```

**Expected:** You should see articles from Hacker News, First Round, and Product School

**If empty:** Check the API response from Test 1 above

### Test 3: Check Vercel Function Logs

**Action:**
1. Go to Vercel Dashboard → Your Project
2. Click **Deployments** → Latest Deployment
3. Click **Functions** tab
4. Look for `/api/scrape-product` logs
5. You should see detailed logs with emojis:
   ```
   🚀 Starting product scrape...
   🗑️  Deleting articles older than...
   ✅ Deleted 5 old articles
   📰 Scraping sources in parallel...
   📊 Scrape results:
      - Hacker News: 15 articles
      - First Round: 10 articles
      - Product School: 5 articles
   💾 Upserting 30 articles to database...
   ✅ Product scrape complete in 3200ms
   ```

### Test 4: Verify Cron Jobs (After 5-10 Minutes)

**Action:**
1. Wait 5-10 minutes after deployment
2. Go to Vercel Dashboard → Your Project → **Cron Jobs** tab
3. You should see 3 cron jobs:
   - `/api/cron/scrape-crypto` - Runs every 5 minutes
   - `/api/cron/scrape-ai` - Runs every 5 minutes
   - `/api/cron/scrape-product` - Runs every 5 minutes

4. Click on each job to see execution logs
5. Look for: `⏰ Cron job triggered: scrape-[type]`

**Expected:** Jobs should show successful executions every 5 minutes

---

## 📋 What We Fixed (Code Changes)

### 1. Added Environment Variable Validation
**File:** `lib/supabase.ts`

Now throws clear error messages if env vars are missing:
```
❌ SUPABASE_SERVICE_ROLE_KEY is not set in environment variables
```

### 2. Improved Error Logging
**File:** `app/api/scrape-product/route.ts`

Added detailed console logs:
- 🚀 Start scraping
- 📊 Scrape results per source
- 💾 Database operations
- ✅ Success with timing
- ❌ Detailed error messages

### 3. Optimized Database Inserts
**Changed:** Sequential upserts → Batch upsert

**Before:**
```typescript
for (const article of allArticles) {
  await supabaseAdmin.from('news_articles').upsert(article)
}
```

**After:**
```typescript
await supabaseAdmin
  .from('news_articles')
  .upsert(allArticles, { onConflict: 'article_url' })
```

**Benefits:**
- 10-30x faster (single query vs. N queries)
- Avoids Vercel 10-second function timeout
- More reliable

### 4. Server-Side Cron Jobs
**Files:**
- `vercel.json` - Cron schedule configuration
- `app/api/cron/scrape-crypto/route.ts`
- `app/api/cron/scrape-ai/route.ts`
- `app/api/cron/scrape-product/route.ts`

**Why:** Client-side `setInterval` only runs when users have pages open. Cron jobs run 24/7 on Vercel's servers.

**Schedule:** Every 5 minutes (`*/5 * * * *`)

### 5. Removed Client-Side Scraping
**Files:**
- `app/crypto/page.tsx`
- `app/ai/page.tsx`
- `app/product/page.tsx`

Deleted the `useEffect` with `setInterval` that was causing overnight failures.

---

## 🔍 Troubleshooting Guide

### Issue: Product page still empty after fixes

**Check:**
1. ✅ Is `SUPABASE_SERVICE_ROLE_KEY` set in Vercel?
2. ✅ Did you redeploy after adding env var?
3. ✅ Does `/api/scrape-product` return success?
4. ✅ Check Vercel Function Logs for errors

**Solution:**
```bash
# Manually trigger scrape
curl -X POST https://niminal.xyz/api/scrape-product

# Check response for errors
```

### Issue: Cron jobs not appearing in Vercel dashboard

**Check:**
1. ✅ Is `vercel.json` committed and pushed?
2. ✅ Did deployment succeed?
3. ✅ Go to Vercel Dashboard → Cron Jobs tab

**Solution:**
Wait 5 minutes after deployment for Vercel to register cron jobs.

### Issue: Cron jobs failing with 401 Unauthorized

**Check:**
1. ✅ Is `CRON_SECRET` set in environment variables?
2. ✅ Did you redeploy after adding it?

**Solution:**
Either remove the auth check from cron routes OR add the `CRON_SECRET` env var.

### Issue: Function timeout (10 seconds exceeded)

**Check:**
1. ✅ Look for "FUNCTION_INVOCATION_TIMEOUT" in logs
2. ✅ Check scraper response times

**Solution:**
- Reduce number of articles scraped per source
- Optimize individual scrapers (reduce timeout, skip slow sources)
- Consider upgrading Vercel plan (Pro has 60s timeout)

---

## 📊 Expected Behavior After Fixes

### Crypto Page
- ✅ Updates every 5 minutes via cron
- ✅ Shows articles from 8 sources
- ✅ No overnight gaps

### AI Page
- ✅ Updates every 5 minutes via cron
- ✅ Shows articles from 4 sources (TechCrunch, Wired, VentureBeat, Hugging Face)
- ✅ No overnight gaps

### Product Page
- ✅ Updates every 5 minutes via cron
- ✅ Shows articles from 3 sources (Hacker News, First Round, Product School)
- ✅ NOW WORKING (was empty before)

---

## 🎯 Summary

**Root Causes:**
1. **Missing `SUPABASE_SERVICE_ROLE_KEY`** → Product page scraping failed silently
2. **Client-side scraping** → Stopped when no users were active (overnight)

**Fixes Applied:**
1. ✅ Added env var validation with clear error messages
2. ✅ Improved error logging for debugging
3. ✅ Optimized database inserts (batch upsert)
4. ✅ Implemented server-side cron jobs (runs 24/7)
5. ✅ Removed client-side scraping intervals

**Next Steps:**
1. Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel (CRITICAL)
2. Add `CRON_SECRET` to Vercel (optional)
3. Deploy changes
4. Test using steps above
5. Monitor cron job logs

---

**Questions?** Check Vercel logs or Supabase dashboard for more details.
