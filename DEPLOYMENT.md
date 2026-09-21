# AgriCore Management System - Deployment Guide for Render

This application is ready for immediate deployment on [Render](https://render.com) as a full-stack Node.js Web Service.

## Deployment Options

### Option 1: Render Web Service (Recommended)

1. **Push your repository** to GitHub or GitLab.
2. Sign in to your [Render Dashboard](https://dashboard.render.com).
3. Click **New +** > **Web Service**.
4. Connect your GitHub/GitLab repository.
5. Configure the service settings:
   - **Name**: `agricore-system` (or your preferred name)
   - **Region**: Select the region closest to your users (e.g., Frankfurt, Oregon, Singapore)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free` or higher

6. **Environment Variables**:
   - `PORT`: `3000` (Render sets `PORT` automatically, and the server binds to `process.env.PORT || 3000`)
   - `NODE_VERSION`: `22.0.0`

7. Click **Create Web Service**. Render will build the Vite frontend and launch the Express backend with atomic persistence.

---

### Option 2: Render Blueprint (`render.yaml`)

1. Connect your repository to Render.
2. Go to **Blueprints** in Render Dashboard and click **New Blueprint Instance**.
3. Select this repository. Render will automatically detect `render.yaml` and configure build and start commands.

---

## Architecture Summary

- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons, Lucide charts, responsive green agricultural theme.
- **Backend**: Express.js REST API with `/api` routing for farmers, loans, infrastructure, audit logging, and reporting.
- **Database**: Atomic disk-based file store (`data/agricore_db.json`) initialized with realistic agricultural seed data, supporting CRUD, repayments, maintenance scheduling, and JSON backups.
- **Port**: Configured to dynamically bind to `process.env.PORT` on Render (defaulting to 3000).
