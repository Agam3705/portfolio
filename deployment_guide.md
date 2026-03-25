# Portfolio Deployment Guide

# Official Deployment Guide: Portfolio & Cyber Maze 🚀

Follow these steps precisely to launch your portfolio across **Render** (Backend) and **Vercel** (Frontend).

---

## 🏗️ Phase 1: Deploy Backend (Render)
Render will host your Node.js API and handle contact form submissions.

### 1. Create a New Web Service
- Go to [dashboard.render.com](https://dashboard.render.com) and click **"New"** → **"Web Service"**.
- Connect your GitHub repository.

### 2. Configure Service Settings
- **Name**: `portfolio-backend` (or your choice).
- **Root Directory**: `server`
  - > [!IMPORTANT]
  - > **ROOT DIRECTORY MUST BE SET TO `server`**. This is why your build failed. Render is searching for `package.json` in the root, but it is located inside the `server/` folder.
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Add Environment Variables
Click **"Environment"** and add these keys:
- `MONGO_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: Any random long string (e.g., `agam_jindal_secret_2026_secure`).
- `EMAIL_USER`: Your Gmail address.
- `EMAIL_APP_PASS`: Your Gmail App Password.
- `EMAIL_TO`: Your Gmail address (where you want to receive messages).
- `NODE_ENV`: `production`

### 4. Deploy!
- Click **"Create Web Service"**. Once it's live, **copy the URL** (e.g., `https://portfolio-backend.onrender.com`).

---

## 🎨 Phase 2: Deploy Frontend (Vercel)
Vercel will host your React/Vite frontend and the Cyber Maze game.

### 1. Create a New Project
- Go to [vercel.com/new](https://vercel.com/new) and import your GitHub repository.

### 2. Configure Project Settings
- **Framework Preset**: Vite
- **Root Directory**: `client`
  - *CRITICAL: This ensures Vercel only builds the frontend.*
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 3. Add Environment Variables
In the **"Environment Variables"** section, add:
- **Key**: `VITE_API_BASE_URL`
- **Value**: The **Render URL** you copied in Phase 1 (e.g., `https://portfolio-backend.onrender.com`).

### 4. Deploy!
- Click **"Deploy"**. Vercel will build the project and give you a live URL.

---

## ✅ Final Linkage Check
1. Open your Vercel URL.
2. Go to the **Contact** section.
3. Send a test message.
4. If everything is linked correctly, the message will store in MongoDB and arrive in your Gmail inbox!

> [!TIP]
> **Database Access**: Ensure your MongoDB Atlas cluster has "Allow Access from Anywhere" (`0.0.0.0/0`) enabled in Network Access settings for Render to connect!
   - Add `MONGO_URI` with your MongoDB Atlas connection string.
   - Add `JWT_SECRET` for authentication.
   - Add `CLIENT_URL` with your Vercel frontend URL.
3. **Deploy**: Click "Create Web Service".

---

## 💡 Troubleshooting

- **CORS Errors**: Check your backend `index.js` `cors()` configuration.
- **Port**: Render automatically sets the `PORT` environment variable.
- **Database**: Make sure to allow all IPs (`0.0.0.0/0`) in MongoDB Atlas network access for initial testing.
