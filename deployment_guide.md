# Portfolio Deployment Guide

Follow these steps to deploy your full-stack portfolio to production.

## 🚀 Frontend Deployment (Vercel)

1. **Push to GitHub**: Ensure your project is pushed to a GitHub repository.
2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com/) and click "Add New" > "Project".
   - Import your repository.
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Environment Variables**:
   - Add `VITE_API_BASE_URL` with your Render backend URL.
4. **Deploy**: Click "Deploy".

## 🛠️ Backend Deployment (Render)

1. **Connect to Render**:
   - Go to [Render](https://render.com/) and click "New" > "Web Service".
   - Connect your GitHub repository.
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
2. **Environment Variables**:
   - Add `MONGO_URI` with your MongoDB Atlas connection string.
   - Add `JWT_SECRET` for authentication.
   - Add `CLIENT_URL` with your Vercel frontend URL.
3. **Deploy**: Click "Create Web Service".

---

## 💡 Troubleshooting

- **CORS Errors**: Check your backend `index.js` `cors()` configuration.
- **Port**: Render automatically sets the `PORT` environment variable.
- **Database**: Make sure to allow all IPs (`0.0.0.0/0`) in MongoDB Atlas network access for initial testing.
