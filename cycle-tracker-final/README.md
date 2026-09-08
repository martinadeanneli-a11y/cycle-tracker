# Cycle Tracker

A personal menstrual cycle tracker built with React. Track your phases, adjust your lifestyle, and share insights with your partner.

## Features

- **Phase Tracking**: Automatically calculates your 28-day cycle phases (Menstrual, Follicular, Ovulation, Luteal)
- **Personalized Guidance**: Lifestyle, nutrition, and energy tips for each phase
- **Partner Dashboard**: Share a read-only view with support suggestions for how your partner can help
- **Shared Notes**: Add observations and track patterns together
- **Google Calendar Export**: Download events and import to Google Calendar for iOS notifications

## Deploy to Vercel (Free)

### Step 1: Create a GitHub Account
If you don't have one, go to [github.com](https://github.com) and sign up (free).

### Step 2: Push Code to GitHub

1. Open terminal and navigate to this project folder
2. Run these commands:

```bash
git init
git add .
git commit -m "Initial commit: cycle tracker app"
git remote add origin https://github.com/YOUR_USERNAME/cycle-tracker.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username)

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → choose "Continue with GitHub"
3. Authorize Vercel to access your GitHub
4. Click "New Project"
5. Find and select `cycle-tracker` repository
6. Click "Import"
7. Leave settings as default, click "Deploy"
8. Wait ~1-2 minutes for deployment to complete
9. You'll get a URL like: `cycle-tracker.vercel.app`

### Step 4: Share with Your Partner

Send him the URL. He can:
- Bookmark it on his phone
- Click "Share" to see your current phase and how to support you
- Add notes about observations

## Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173` in your browser.

## Build for Production

```bash
npm run build
```

## Data Storage

Currently uses browser local storage, so each device has separate data. If you want shared data that syncs between devices, let me know and we can add a backend.

---

**Questions?** The app is designed for your specific needs—feel free to customize colors, phases, or suggestions!
