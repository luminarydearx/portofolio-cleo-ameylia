# Portfolio Cleo Ameylia - Dynamic CMS

A modern, highly dynamic portfolio website built with Next.js 15, Tailwind CSS, Framer Motion, and a fully functional custom CMS Dashboard.

## 🚀 Features

- **Dynamic Content Management:** Edit projects, stats, timeline, and hero content directly from the `/dashboard`.
- **AI-Powered Translations:** Automatically translates your content to 5 different languages using Google Translate API.
- **Smart Highlighter:** Live-preview the element you are editing directly in the dashboard with a neon yellow highlighter.
- **GitHub API Integration (Serverless CMS):** Edits made in the production Vercel dashboard are pushed directly to this GitHub repository via the GitHub REST API, instantly triggering a Vercel redeployment to keep data permanent!
- **Cloudinary Integration:** Fully supports uploading custom images and PDF resumes directly to the cloud.

## 🛠️ Vercel Deployment Guide (Important!)

Because this portfolio uses a file-based data storage system (`portfolio-data.json`), standard Vercel deployments will reset any changes you make in the dashboard because Vercel environments are **Read-Only**.

To fix this, we integrated a GitHub Push system. You **MUST** add these Environment Variables in your Vercel Dashboard (`Settings -> Environment Variables`):

- `GITHUB_TOKEN`: Your GitHub Personal Access Token (Requires `repo` scope).
- `GITHUB_REPO`: `luminarydearx/portofolio-cleo-ameylia`
- `GITHUB_BRANCH`: `master`

**After adding these, make sure to manually click "Redeploy" in Vercel once so the app can load these tokens!** Once deployed, every save from the Dashboard will automatically commit to GitHub and trigger a fresh build.

## 💻 Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access `http://localhost:3000` for the portfolio and `http://localhost:3000/dashboard` for the CMS.

## 🎨 Technologies Used

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
