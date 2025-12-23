# Widget Wizard Pro - Video Popup Platform

A powerful video popup widget platform built with React, TypeScript, and Supabase. Create, customize, and embed beautiful video popups on any website.

## Features

- 🎥 **Video Widget Builder** - Create vertical and horizontal video popups
- 🎨 **Fully Customizable** - Colors, positioning, triggers, and CTAs
- 📊 **Analytics Dashboard** - Track views, clicks, and conversions
- 👥 **Client Management** - Manage multiple clients and widgets
- 🔐 **Role-Based Access** - Admin, agency, and user roles
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Easy Embedding** - One-line JavaScript embed code

## Project info

**Repository**: https://github.com/NahidDesigner/videopop

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

### Quick Deploy with Coolify

See **[coolify-deploy.md](./coolify-deploy.md)** for a quick start guide.

### Full Deployment Guide

For complete deployment instructions including self-hosted Supabase setup, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

### Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Required variables:
- `VITE_SUPABASE_URL` - Your Supabase API URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase Anon/Public Key
- `VITE_SUPABASE_PROJECT_ID` - Supabase Project ID

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **State Management**: TanStack Query
- **Routing**: React Router
- **Forms**: React Hook Form + Zod

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route pages
│   ├── hooks/         # Custom React hooks
│   ├── integrations/  # Supabase client
│   └── types/         # TypeScript definitions
├── supabase/
│   ├── migrations/    # Database migrations
│   └── functions/     # Edge Functions
└── public/            # Static assets
```

## License

This project is private and proprietary.
