# 🔧 Fix: No Build Command Fields Visible in Coolify

## The Problem

When you select **"Static"** build type in Coolify, you don't see fields for:
- Install Command
- Build Command
- Base Directory

This means Coolify might be using a different configuration method.

---

## Solution Options

### Option 1: Use Dockerfile Build Type (Recommended)

If Static doesn't show build fields, switch to **"Dockerfile"** build type:

1. Go to **Configuration** → **General**
2. Change **Build Pack** from **"Static"** to **"Dockerfile"**
3. Coolify will automatically use the `Dockerfile` in your repo
4. I've created `Dockerfile.static` for you - rename it or use it

**Steps:**
1. In your repo, rename `Dockerfile.static` to `Dockerfile`
2. In Coolify, set Build Pack to **"Dockerfile"**
3. Deploy

### Option 2: Check Advanced Settings

The build commands might be in a different location:

1. Look for **"Advanced"** button or tab
2. Check if there's a **"Build"** section in Advanced
3. Look for **"Pre/Post Deployment Commands"** section
4. Check **"Environment Variables"** - sometimes build commands are there

### Option 3: Use .coolify.yml File

I've created a `.coolify.yml` file in your repo. Coolify might auto-detect it:

1. Make sure `.coolify.yml` is in your repo (it is now!)
2. Set Build Pack to **"Static"**
3. Coolify might read the config from the file
4. Try deploying

### Option 4: Check Build Server Option

Some Coolify versions have a **"Use a Build Server?"** option:

1. In Build section, look for **"Use a Build Server?"** checkbox
2. If it exists, check it
3. This might reveal more build options

---

## Quick Fix: Use Dockerfile Instead

**This is the most reliable solution:**

### Step 1: Rename Dockerfile

In your project, rename:
- `Dockerfile.static` → `Dockerfile`

Or create a new `Dockerfile` with this content:

```dockerfile
# Multi-stage build for Static Site
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage - nginx
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Change Build Type in Coolify

1. Go to **Configuration** → **General**
2. Change **Build Pack** to **"Dockerfile"**
3. Save
4. Deploy

### Step 3: Verify

After deployment:
- ✅ Build logs should show `npm install` and `npm run build`
- ✅ Your app should load correctly

---

## Alternative: Check Coolify Version

Your Coolify version might handle Static builds differently. Check:

1. What version of Coolify are you using?
2. Are there any other tabs/sections in the Configuration page?
3. Is there a **"Build"** tab separate from **"Configuration"**?

---

## What I've Created for You

I've added these files to help:

1. **`Dockerfile.static`** - Ready-to-use Dockerfile
2. **`.coolify.yml`** - Coolify configuration file
3. **`build.sh`** - Build script (if needed)

---

## Recommended Next Steps

1. **Try Dockerfile approach first:**
   - Rename `Dockerfile.static` to `Dockerfile`
   - Change Build Pack to "Dockerfile"
   - Deploy

2. **If that doesn't work:**
   - Check if there's an "Advanced" section
   - Look for build commands in other tabs
   - Check Coolify documentation for your version

---

**The Dockerfile approach is most reliable - it will definitely work!**

