# 🔧 Setting Up Dockerfile Build Type in Coolify

## The Problem

When you select **"Dockerfile"** build type, Coolify doesn't show npm command fields - **this is correct!** The commands are in the Dockerfile itself.

However, the error shows Coolify is looking for Dockerfile in the wrong place.

---

## ✅ Solution: Verify Settings

### Step 1: Check Build Type is Actually "Dockerfile"

1. Go to **Configuration** → **General**
2. Verify **Build Pack** is set to **"Dockerfile"** (not "Static")
3. If it's still "Static", change it to "Dockerfile"
4. **Save**

### Step 2: Check Base Directory

When using Dockerfile build type:

1. Go to **Configuration** → **Build** section
2. Look for **"Base Directory"** field
3. **It should be empty or set to `/`** (root of repository)
4. **NOT** set to `dist` (that's for Static builds!)

### Step 3: Verify Dockerfile Location

The Dockerfile must be in the **root** of your repository:
```
widget-wizard-pro-main/
├── Dockerfile          ← Must be here!
├── package.json
├── src/
└── ...
```

**NOT** in the `dist` folder (that folder doesn't exist until build runs).

---

## 📋 Complete Configuration for Dockerfile Build Type

### General Section:
```
Build Pack: Dockerfile
```

### Build Section:
```
Base Directory: / (or empty - means root)
```

**That's it!** No npm commands needed - they're in the Dockerfile.

---

## 🔍 Why No npm Command Fields?

When using **"Dockerfile"** build type:
- ✅ Commands are in the Dockerfile (already there!)
- ✅ Coolify just runs `docker build` using your Dockerfile
- ✅ No need for separate command fields

The Dockerfile I created already has:
- `npm ci` (install dependencies)
- `npm run build` (build app)
- nginx setup (serve files)

---

## ⚠️ Common Mistake

**Problem:** Base Directory is set to `dist`

**Why it fails:**
- Coolify looks for Dockerfile in `dist` folder
- But `dist` doesn't exist yet (it's created by the build)
- Error: "Dockerfile: no such file or directory"

**Fix:**
- Set Base Directory to `/` or leave it empty
- This tells Coolify to look in the repository root

---

## ✅ Correct Settings Summary

For **Dockerfile** build type:

```
Build Pack:        Dockerfile
Base Directory:    / (or empty)
```

**No other fields needed!** The Dockerfile handles everything.

---

## 🚀 After Setting Correctly

1. Set Build Pack to **"Dockerfile"**
2. Set Base Directory to **`/`** or **empty**
3. Save
4. Deploy

The build should work because:
- ✅ Dockerfile is in repo root
- ✅ Coolify finds it
- ✅ Dockerfile runs npm commands
- ✅ App builds and deploys

---

**The key is: Base Directory should be `/` or empty, NOT `dist`!**

