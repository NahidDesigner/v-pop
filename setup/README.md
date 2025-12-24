# Setup Files & Documentation Index

This directory contains all setup files and deployment documentation for VideoPopup.

## 📚 Documentation Files

### For Beginners (Start Here!)

1. **[COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)** ⭐ **START HERE**
   - Complete step-by-step deployment guide
   - Beginner-friendly with detailed explanations
   - Covers everything from server setup to verification
   - **Use this if you're new to deployment**

2. **[QUICK-START.md](./QUICK-START.md)**
   - Condensed version for experienced users
   - 5-minute quick reference
   - **Use this if you know what you're doing**

### Reference Documentation

3. **[SELF-HOSTED-SUPABASE-CONFIG.md](./SELF-HOSTED-SUPABASE-CONFIG.md)** ⚠️ **IMPORTANT**
   - Configuration guide for self-hosted Supabase
   - How to configure auth URLs via Coolify
   - Getting API keys from Coolify environment variables
   - **Read this if using self-hosted Supabase!**

4. **[DEPLOYMENT.md](./DEPLOYMENT.md)**
   - Technical deployment reference
   - Multiple deployment options
   - Troubleshooting section
   - **Use this as a technical reference**

5. **[NEXT-STEPS.md](./NEXT-STEPS.md)**
   - Post-deployment checklist
   - Verification steps
   - **Use this after deployment is complete**

## 🔧 Setup Files

### Configuration Files

1. **[.env.example](./.env.example)**
   - Environment variables template
   - Copy to `.env` and fill in values
   - **Use this to configure environment variables**

2. **[coolify-config.txt](./coolify-config.txt)**
   - Coolify-specific configuration
   - Build settings and environment variables
   - **Use this when configuring Coolify**

### Database Files

3. **[complete-migration.sql](./complete-migration.sql)**
   - Complete database schema
   - All tables, RLS policies, functions
   - **Run this in Supabase SQL Editor**

4. **[create-admin.sql](./create-admin.sql)**
   - Script to create admin user
   - Run after first user signup
   - **Use this to assign admin role**

### Deployment Files

5. **[setup.sh](./setup.sh)**
   - Interactive setup script
   - Helps configure environment
   - **Use this for automated setup (optional)**

6. **[docker-compose.edge-functions.yaml](./docker-compose.edge-functions.yaml)**
   - Docker Compose for edge functions
   - Deploy edge functions separately
   - **Use this if Supabase doesn't include edge functions**

7. **[nginx-edge-functions.conf](./nginx-edge-functions.conf)**
   - Nginx configuration for edge functions
   - Routes requests to correct functions
   - **Use this with docker-compose for edge functions**

## 🚀 Deployment Workflow

### Recommended Path for Beginners:

1. **Read**: [COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)
2. **Follow**: Step-by-step instructions
3. **Reference**: [DEPLOYMENT.md](./DEPLOYMENT.md) for details
4. **Troubleshoot**: Use troubleshooting sections

### Quick Path for Experienced Users:

1. **Read**: [QUICK-START.md](./QUICK-START.md)
2. **Reference**: [coolify-config.txt](./coolify-config.txt)
3. **Run**: [complete-migration.sql](./complete-migration.sql)
4. **Deploy**: Follow quick start steps

## 📋 File Checklist

Use this checklist to ensure you have all files:

- [x] `COMPLETE-DEPLOYMENT-GUIDE.md` - Main deployment guide
- [x] `QUICK-START.md` - Quick reference
- [x] `SELF-HOSTED-SUPABASE-CONFIG.md` - Self-hosted Supabase configuration
- [x] `NEXT-STEPS.md` - Post-deployment checklist
- [x] `DEPLOYMENT.md` - Technical reference
- [x] `coolify-config.txt` - Coolify config
- [x] `complete-migration.sql` - Database schema
- [x] `create-admin.sql` - Admin creation
- [x] `setup.sh` - Setup script (optional)
- [x] `docker-compose.edge-functions.yaml` - Edge functions (for Coolify)
- [x] `nginx-edge-functions.conf` - Nginx config for edge functions

## 🎯 Which File Should I Use?

### I'm a beginner and want to deploy:
→ **[COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)**

### I know what I'm doing, just need quick steps:
→ **[QUICK-START.md](./QUICK-START.md)**

### I'm using self-hosted Supabase:
→ **[SELF-HOSTED-SUPABASE-CONFIG.md](./SELF-HOSTED-SUPABASE-CONFIG.md)** ⚠️ **READ THIS FIRST**

### I need to configure environment variables:
→ **[.env.example](./.env.example)**

### I need to run database migrations:
→ **[complete-migration.sql](./complete-migration.sql)**

### I need to create an admin user:
→ **[create-admin.sql](./create-admin.sql)**

### I'm configuring Coolify:
→ **[coolify-config.txt](./coolify-config.txt)**

### I've deployed and need next steps:
→ **[NEXT-STEPS.md](./NEXT-STEPS.md)**

### I need to deploy edge functions:
→ **[docker-compose.edge-functions.yaml](./docker-compose.edge-functions.yaml)**

### I'm troubleshooting:
→ Check troubleshooting sections in [COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md) or [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📞 Getting Help

1. **Check the guides**: Most issues are covered in the deployment guides
2. **Check troubleshooting**: Both guides have troubleshooting sections
3. **Check logs**: Coolify and Supabase provide detailed logs
4. **Verify steps**: Make sure you completed all steps in order

## ✅ Success Checklist

After deployment, verify:

- [ ] Frontend loads at your domain
- [ ] Can create account and log in
- [ ] Admin role assigned and can access dashboard
- [ ] Can create a widget
- [ ] Widget embed code works
- [ ] Analytics tracking works
- [ ] Edge functions are accessible

## 🎉 Ready to Deploy?

Start with **[COMPLETE-DEPLOYMENT-GUIDE.md](./COMPLETE-DEPLOYMENT-GUIDE.md)** and follow the steps!

Good luck! 🚀

