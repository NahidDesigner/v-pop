# Quick Coolify Deployment Guide

## Coolify Setup Steps

### 1. Create New Resource
- Go to **Coolify Dashboard** → **New Resource** → **Public Repository**
- Repository URL: `https://github.com/NahidDesigner/videopop.git`
- Build Type: **Static Site** (recommended) or **Nixpacks**

### 2. Build Configuration

**If using Static Site:**
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Node Version: `18` or `20`

**If using Nixpacks:**
- The `nixpacks.toml` file is already configured
- It will automatically detect and use the correct settings

### 3. Environment Variables

Add these in Coolify → Your App → **Environment Variables**:

```env
VITE_SUPABASE_URL=https://your-supabase-domain.com
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

**Important:** 
- These variables are embedded at **build time**
- You must **rebuild** the app after changing them
- Use your self-hosted Supabase URLs and keys

### 4. Deploy

Click **Deploy** and monitor the build logs.

---

## Environment Variables Reference

### Required (Frontend - Build Time)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase API URL | `https://supabase.yourdomain.com` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase Anon/Public Key | `eyJhbGc...` |
| `VITE_SUPABASE_PROJECT_ID` | Supabase Project ID | `abcdefghijklmnop` |

### Optional (For Edge Functions)
These are only needed if you're deploying Edge Functions separately:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`

---

## Troubleshooting

### Build Fails
1. Check Node version (should be 18 or 20)
2. Verify all `VITE_*` environment variables are set
3. Check build logs for specific errors

### App Not Loading
1. Verify Supabase is accessible from your app domain
2. Check browser console for CORS errors
3. Ensure redirect URLs are configured in Supabase

### Environment Variables Not Working
- Remember: `VITE_*` variables are embedded at **build time**
- You must **rebuild** after changing them
- Check that variables are set in Coolify before building

---

## Next Steps

After deployment:
1. ✅ Configure Supabase Auth redirect URLs
2. ✅ Create your first admin user
3. ✅ Test widget creation
4. ✅ Test embed script functionality

See `DEPLOYMENT.md` for complete setup instructions.

