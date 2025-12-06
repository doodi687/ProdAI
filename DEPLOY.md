# Render Deployment Guide - ProdAI

## Deploying Backend and Frontend Separately

Since Render free tier allows one service at a time, follow these steps:

---

## Step 1: Deploy Backend First

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New → Web Service**
3. Connect your GitHub repo: `doodi687/ProdAI`
4. Configure:
   - **Name**: `prodai-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. Add Environment Variables:

   | Key | Value |
   |-----|-------|
   | `GROQ_API_KEY` | Your Groq API key from [console.groq.com](https://console.groq.com) |
   | `ENV` | `production` |

6. Click **Create Web Service**
7. Wait for deployment to complete
8. **Copy the backend URL** (e.g., `https://prodai-backend.onrender.com`)

---

## Step 2: Deploy Frontend

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New → Static Site**
3. Connect your GitHub repo: `doodi687/ProdAI`
4. Configure:
   - **Name**: `prodai-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. Add Environment Variable:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://prodai-backend.onrender.com` (your backend URL from Step 1) |

6. Click **Create Static Site**

---

## Step 3: Update Backend CORS (if needed)

After frontend is deployed, update the backend's `FRONTEND_URL` environment variable with your frontend URL to enable proper CORS.

---

## URLs After Deployment

- **Backend API**: `https://prodai-backend.onrender.com`
- **Frontend App**: `https://prodai-frontend.onrender.com`
- **API Health Check**: `https://prodai-backend.onrender.com/health`
- **API Docs**: `https://prodai-backend.onrender.com/docs`

---

## Important Notes

1. **Free tier**: Services may spin down after 15 mins of inactivity. First request after sleep takes ~30 seconds.
2. **GROQ_API_KEY**: Keep this secret and never commit to repo.
3. **Intro Video**: The 7-second intro video is included in the frontend build.
