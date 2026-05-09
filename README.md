# HeartGuard Frontend

React + Vite frontend for the HeartGuard/CardioSense app.

## Local Setup

```bash
npm install
npm run dev
```

## Vercel Deployment

Use these settings in Vercel:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```



```text
VITE_API_URL=https://your-render-service.onrender.com
```

Do not include a trailing slash.

## Backend Connection

The prediction page sends requests to:

```text
${VITE_API_URL}/predict
```

For local development, when `VITE_API_URL` is not set, it falls back to:

```text
http://localhost:8001
```
