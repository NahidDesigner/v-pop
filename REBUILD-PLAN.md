# 🚀 Rebuild Plan: One-Click Database Setup

## Goal
Rebuild the app with automatic database setup/configuration from the dashboard. Only environment variables needed for deployment.

---

## Current Problems
1. ❌ Manual Edge Functions deployment (confusing)
2. ❌ Manual database migrations (complex)
3. ❌ Dashboard auto-reloads when switching tabs (loses work)
4. ❌ No easy setup wizard

---

## New Architecture

### Phase 1: Fix Current Issues ✅
- [x] Fix auto-reload bug (QueryClient config)
- [ ] Complete Edge Functions deployment
- [ ] Test widget functionality

### Phase 2: Setup Wizard (New Feature)

#### 2.1 Setup Detection Page
**Route:** `/setup` (shown if database not initialized)

**Features:**
- Detects if database is set up
- Shows setup wizard if not initialized
- Auto-redirects to dashboard if already set up

#### 2.2 One-Click Setup Button
**Location:** Setup wizard page

**What it does:**
1. Runs all database migrations automatically
2. Creates default admin user (from env or first signup)
3. Seeds initial data (site_settings, etc.)
4. Deploys Edge Functions (via API or migration)
5. Shows progress with real-time updates
6. Redirects to dashboard when complete

#### 2.3 Setup API Endpoint
**New Edge Function:** `setup-database`

**Functionality:**
- Checks current database state
- Runs migrations in order
- Creates default records
- Returns setup status

---

## Implementation Steps

### Step 1: Create Setup Detection
```typescript
// src/pages/Setup.tsx
- Check if migrations have run
- Check if default data exists
- Show setup wizard if needed
```

### Step 2: Create Setup API
```typescript
// supabase/functions/setup-database/index.ts
- Run migrations via SQL
- Create default admin
- Seed initial data
- Return status
```

### Step 3: Setup Wizard UI
```typescript
// Multi-step wizard:
1. Welcome screen
2. Database setup (auto)
3. Admin account creation
4. Initial settings
5. Complete!
```

### Step 4: Auto-Deploy Edge Functions
- Option A: Include functions in migration SQL
- Option B: Setup API deploys functions
- Option C: Functions auto-deploy on first request

---

## Database Setup Flow

```
User visits app
    ↓
Check: Is database initialized?
    ↓
NO → Show /setup page
    ↓
User clicks "Setup Database"
    ↓
1. Run all migrations (via API)
2. Create default admin
3. Seed site_settings
4. Deploy Edge Functions
5. Show success
    ↓
Redirect to /dashboard
```

---

## Environment Variables (Simplified)

**Required (only these!):**
```
VITE_SUPABASE_URL=https://your-supabase.com
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

**Optional (for setup):**
```
SETUP_ADMIN_EMAIL=admin@example.com
SETUP_ADMIN_PASSWORD=secure-password
```

---

## Migration Strategy

### Current: Manual
- User runs migrations manually
- Complex, error-prone

### New: Automatic
- Setup wizard runs migrations
- Progress tracking
- Error handling
- Rollback on failure

---

## Edge Functions Deployment

### Option 1: Include in Setup API
- Setup function deploys other functions
- One API call does everything

### Option 2: Auto-Deploy on First Request
- Functions deploy lazily when first accessed
- No manual deployment needed

### Option 3: Migration-Based
- Functions stored in database
- Auto-deployed during setup

---

## Benefits

✅ **Simplified Deployment:**
- Just set 2 env variables
- Click "Setup" button
- Everything configured automatically

✅ **No Manual Steps:**
- No terminal commands
- No SQL scripts to run
- No Edge Functions to deploy manually

✅ **Better UX:**
- Clear setup wizard
- Progress indicators
- Error messages

✅ **Maintainable:**
- All setup in one place
- Easy to update
- Version controlled

---

## File Structure (New)

```
src/
  pages/
    Setup.tsx          # Setup wizard
    SetupProgress.tsx  # Progress indicator
    
supabase/
  functions/
    setup-database/    # Main setup function
    get-migrations/    # List available migrations
    run-migration/     # Run single migration
    
  migrations/
    (all existing migrations)
    
  setup/
    seed-data.sql      # Initial data
    default-admin.sql  # Default admin user
```

---

## Next Steps

1. ✅ Fix auto-reload bug (DONE)
2. Complete current Edge Functions deployment
3. Create Setup page component
4. Create setup-database Edge Function
5. Create setup wizard UI
6. Test end-to-end setup flow
7. Update deployment docs

---

## Timeline Estimate

- Setup page: 2-3 hours
- Setup API: 3-4 hours
- Edge Functions auto-deploy: 2-3 hours
- Testing: 2-3 hours
- **Total: ~10-15 hours**

---

## Questions to Decide

1. **Edge Functions Deployment:**
   - How should functions be deployed automatically?
   - Via setup API? Lazy loading? Database storage?

2. **Admin Account:**
   - Create from env vars during setup?
   - Or let first signup be admin?

3. **Migration Strategy:**
   - Run all migrations at once?
   - Or check which ones are needed?

4. **Rollback:**
   - What if setup fails halfway?
   - Auto-rollback or manual fix?

---

This rebuild will make deployment **10x easier** - just set env vars and click a button! 🎉

