# Fix: Nixpacks Detecting Deno Instead of Node.js

## 🔍 Problem

Nixpacks is incorrectly detecting your project as **Deno** instead of **Node.js**, causing:
```
Found application type: deno.
npm: command not found
```

This happens because Nixpacks scans the entire repository and finds `supabase/functions/` directory with Deno edge functions.

## ✅ Solution

We've added two changes to fix this:

### 1. `nixpacks.toml` (Root Directory)

This file explicitly tells Nixpacks to use Node.js and configure the build process:

```toml
[phases.setup]
nixPkgs = { nodejs = "20" }

[phases.install]
dependsOn = ["setup"]
cmds = ["npm install"]

[phases.build]
dependsOn = ["install"]
cmds = ["npm run build"]
```

This overrides Nixpacks auto-detection and forces Node.js.

### 2. `package.json` Engines Field

Added Node.js version specification to `package.json`:

```json
"engines": {
  "node": ">=20.0.0"
}
```

This helps Nixpacks prioritize Node.js detection.

---

## 📋 What This Fixes

- ✅ Nixpacks will ignore `supabase/functions/` directory
- ✅ Nixpacks will detect Node.js/Vite from root `package.json`
- ✅ Build will use `npm install` and `npm run build` correctly
- ✅ No impact on edge functions (deployed separately via Docker Compose)

---

## 🚀 Next Steps

1. **Commit these changes:**
   ```bash
   git add nixpacks.toml package.json
   git commit -m "Fix: Force Nixpacks to use Node.js instead of Deno"
   git push
   ```

2. **In Coolify:**
   - The deployment will automatically pick up the new `nixpacks.toml` file
   - Nixpacks will use Node.js as specified in the config
   - Build should succeed with `npm install` and `npm run build`

3. **Verify:**
   - Check build logs - should NOT see "Found application type: deno"
   - Build should show Node.js setup and run `npm install` and `npm run build` correctly

---

## ❓ Why This Works

- **`nixpacks.toml`**: Explicitly configures Node.js build phases, overriding auto-detection
- **`package.json` engines**: Specifies Node.js version requirement
- **Explicit phases**: Tells Nixpacks exactly what to do (setup Node.js, install, build) instead of relying on detection

---

## 🔄 Edge Functions Deployment (Separate)

**Important:** This fix does NOT affect edge functions deployment.

- Edge functions are deployed via Docker Compose (separate resource in Coolify)
- They use `setup/docker-compose.edge-functions.yaml`
- They run Deno correctly in their own containers
- Frontend (this fix) and edge functions are completely separate deployments

