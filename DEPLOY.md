# Deploy Guide — Lead Engine Frontend

## Quick Deploy to Vercel

### Option 1: GitHub + Vercel (Automatic)

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/dashboard
   ```

2. **Click "Add New..." → "Project"**

3. **Select this repo:**
   - Repository: `marcosdanielsf/lead-engine-frontend`
   - Import

4. **Configure Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://lead-engine-api.herokuapp.com
   NEXT_PUBLIC_WS_URL=wss://lead-engine-api.herokuapp.com/ws/status
   NEXT_PUBLIC_API_KEY=your-production-key
   ```

5. **Deploy** (auto-deploys on push to main)

### Option 2: Vercel CLI

```bash
cd ~/Projects/mottivme/lead-engine-frontend

# Login
vercel login

# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

## Environment Variables (Production)

Set in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Example |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | Lead Engine API URL | `https://api.leadengine.app` |
| `NEXT_PUBLIC_WS_URL` | WebSocket URL | `wss://api.leadengine.app/ws` |
| `NEXT_PUBLIC_API_KEY` | API key | Get from Lead Engine settings |

## Production Checklist

- [ ] API URL points to production backend
- [ ] WebSocket URL is correct
- [ ] API Key is set
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in production

## Building Locally

```bash
npm install
npm run build
npm start
```

## Troubleshooting

**Build fails:**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**API not accessible:**
- Check `NEXT_PUBLIC_API_URL` env var
- Verify API is running and accessible
- Check CORS headers if cross-origin

**WebSocket connection fails:**
- Check `NEXT_PUBLIC_WS_URL` env var
- Verify backend supports WebSocket
- Check firewall/proxy settings

## Production URL

After deploy:
```
https://lead-engine-frontend.vercel.app
```

(URL will vary based on project name in Vercel)

---

For issues, check:
- Vercel dashboard logs
- Browser console (F12)
- Lead Engine API logs
