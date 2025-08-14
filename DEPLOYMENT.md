# 🚀 Netlify Deployment Guide

## Frontend (React) Deployment to Netlify

### Option 1: Deploy via GitHub (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com) and sign up/login
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository: `music-api`
   - Configure build settings:
     - Base directory: `client`
     - Build command: `npm run build`
     - Publish directory: `client/build`

3. **Set Environment Variables in Netlify:**
   - Go to Site Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `https://your-backend-url.com`

### Option 2: Manual Deploy

1. **Build the project:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `client/build` folder to the deploy area

## Backend Deployment Options

### Option 1: Railway (Recommended - Free tier available)

1. **Go to [railway.app](https://railway.app)**
2. **Connect GitHub and select your repo**
3. **Configure:**
   - Root directory: `/` (root of your project)
   - Start command: `npm start`
4. **Set environment variables:**
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `FRONTEND_URL`: Your Netlify app URL
   - `PORT`: Railway will set this automatically

### Option 2: Render (Free tier available)

1. **Go to [render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repo**
4. **Configure:**
   - Environment: `Node`
   - Build command: `npm install`
   - Start command: `npm start`
   - Root directory: `/`

### Option 3: Heroku

1. **Install Heroku CLI**
2. **Deploy:**
   ```bash
   heroku create your-music-api
   git push heroku main
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   ```

## Final Steps

1. **Update your Netlify environment variable:**
   - Set `REACT_APP_API_URL` to your deployed backend URL

2. **Update backend CORS:**
   - Add your Netlify app URL to the CORS origins in `index.js`

3. **Test your deployed app:**
   - Make sure authentication works
   - Test all CRUD operations
   - Verify API calls are working

## MongoDB Setup

If you don't have MongoDB Atlas set up:

1. **Go to [mongodb.com/atlas](https://mongodb.com/atlas)**
2. **Create a free cluster**
3. **Get your connection string**
4. **Add it to your backend environment variables**

## Troubleshooting

- **CORS errors:** Make sure your backend CORS configuration includes your Netlify URL
- **API not found:** Check that `REACT_APP_API_URL` is set correctly in Netlify
- **Build fails:** Check that all dependencies are in `package.json`

Your app will be live at:
- Frontend: `https://your-app-name.netlify.app`
- Backend: `https://your-backend-url.railway.app` (or your chosen platform)
