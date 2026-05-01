# Deployment Guide for Trails of Bheta

## Deployment Options

This is a full-stack app with a React frontend + Express backend. Choose the option that best fits your needs:

### **Option 1: Deploy Frontend Only to Vercel (Recommended - Easiest)**

Perfect if you don't need the Express server or want to keep it separate.

**Steps:**

1. Update `vite.config.ts` to output frontend only:
   ```bash
   # Build just the frontend
   pnpm run build
   ```

2. Push frontend build to Vercel:
   ```bash
   vercel --prod
   ```

**Pros:**
- ✅ Free tier works
- ✅ Instant deployment
- ✅ CDN + edge caching included
- ✅ Automatic HTTPS

**Cons:**
- ❌ Express server not deployed
- ❌ API routes would need backend hosting

---

### **Option 2: Deploy Full-Stack as Node.js Server (Advanced)**

Requires **Vercel Pro** for long-running processes.

**Steps:**

1. **Ensure build is ready:**
   ```bash
   pnpm build
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

4. **Set environment variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add any required variables (VITE_GOOGLE_MAPS_API_KEY, etc.)

**Pros:**
- ✅ Full-stack deployment
- ✅ Express server with static file serving
- ✅ Single deployment URL

**Cons:**
- ⚠️ Requires Vercel Pro ($20/month)
- ⚠️ Pro plan only for long-running servers

---

### **Option 3: Deploy Frontend to Vercel + Backend to Render/Railway (Hybrid)**

Best balance of features and cost.

**Frontend to Vercel:**
```bash
# Create vercel.json for frontend only
vercel --prod
```

**Backend to Render (Free):**
1. Go to [render.com](https://render.com)
2. Connect GitHub repo
3. Create New > Web Service
4. Build: `pnpm build`
5. Start: `pnpm start`

**Update `.env.local` for frontend:**
```
VITE_API_URL=https://your-render-app.onrender.com
```

**Pros:**
- ✅ Free tier available
- ✅ Scalable
- ✅ Separation of concerns

**Cons:**
- ⚠️ Two separate services to manage

---

## Recommended: Option 1 (Frontend to Vercel)

Since your app is primarily a frontend experience, here's the quickest setup:

### Quick Start - Frontend Only Deployment

**1. Configure for frontend-only build:**
```bash
# Your current build already compiles frontend to dist/public
# Just deploy that folder to Vercel
```

**2. Login to Vercel:**
```bash
vercel login
```

**3. Deploy from project root:**
```bash
vercel --prod
```

**4. Vercel will prompt you:**
- Project name: `trails-of-bheta` (or your choice)
- Framework: `Vite`
- Root directory: `.` (current)
- Build command: `pnpm build`
- Output directory: `dist/public`

**5. Done!** 🎉
Your site will be live at a Vercel URL like `https://trails-of-bheta-xxx.vercel.app`

---

## Environment Variables for Vercel

Add these in Vercel Dashboard (Project Settings → Environment Variables):

```
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_APP_ENVIRONMENT=production
NODE_ENV=production
```

---

## After Deployment

- **View logs:** `vercel logs <deployment-url>`
- **Rollback:** `vercel rollback`
- **Update:** Push to main → auto-redeploys
- **Custom domain:** Go to Vercel Dashboard → Settings → Domains

---

## Troubleshooting

**Build fails:**
```bash
pnpm check  # Check TypeScript errors
pnpm format # Format code
```

**Static files not loading:**
- Ensure `dist/public` folder has all assets
- Check output directory in vercel.json

**Environment variables not working:**
- Prefix them with `VITE_` for frontend access
- Restart deployment after adding env vars

---

## Which Option?

- **Just want to deploy quickly?** → **Option 1** (Frontend to Vercel)
- **Need a full API backend?** → **Option 3** (Vercel + Render)
- **Have Vercel Pro?** → **Option 2** (Full-stack on Vercel)

**I recommend Option 1** for now - it's the fastest and cheapest way to get your site live!
