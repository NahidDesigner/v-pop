# Important: Frontend Deployment in Coolify

## ⚠️ CRITICAL: Do NOT Use Docker Compose for Frontend!

The `docker-compose.yaml` files in this project are **ONLY for edge functions**, NOT for the frontend application.

## ✅ Correct Way to Deploy Frontend:

1. **In Coolify Dashboard**: Go to your project
2. **New Resource** → **Public Repository** (or **Git Repository**)
3. Enter: `https://github.com/NahidDesigner/v-pop.git`
4. **IMPORTANT**: Select **"Static Site"** (NOT Docker Compose!)
5. Configure:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Node Version: `20`
6. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
7. Deploy

## ❌ Wrong Way (What Causes the Error):

- Selecting **"Docker Compose"** as the resource type
- Coolify will try to use `docker-compose.yaml` as a Dockerfile
- This causes: `ERROR: unknown instruction: services:`

## 📝 Docker Compose Files:

- `setup/docker-compose.edge-functions.yaml` - **ONLY for edge functions**
- Use this ONLY when deploying edge functions separately
- Do NOT use this for frontend deployment

## 🎯 Summary:

- **Frontend** = Static Site deployment
- **Edge Functions** = Docker Compose (optional, only if needed separately)

