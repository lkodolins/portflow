# 🚀 Deploying Portflow with Supabase

Complete deployment guide for Portflow with Supabase backend integration.

## 🏗️ **Pre-Deployment Setup**

### 1. Supabase Configuration
Ensure your Supabase project is properly configured:

```bash
# Check these are set in your .env.local
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Verify Setup:**
- ✅ Tables created (`portfolios`, `portfolio_items`)
- ✅ Storage bucket `portfolios` exists and is public
- ✅ RLS policies configured
- ✅ Connection tested locally

### 2. Environment Variables
Your complete `.env.local` should include:

```bash
# Supabase (Required)
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI (Optional)
VITE_OPENAI_API_KEY=sk-proj-abc123def456...

# App Config
VITE_APP_ENV=production
VITE_APP_DEBUG=false
```

## 🌐 **Vercel Deployment**

### Option 1: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Supabase integration"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy!

### Option 2: Vercel CLI

1. **Install and Login**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   vercel env add VITE_SUPABASE_URL
   vercel env add VITE_SUPABASE_ANON_KEY
   vercel env add VITE_OPENAI_API_KEY
   ```

### Environment Variables in Vercel

In your Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add these variables for **Production**:

```
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
VITE_OPENAI_API_KEY = your-openai-key-here (optional)
```

## 🔧 **Other Deployment Options**

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   VITE_OPENAI_API_KEY = your-openai-key-here
   ```

### AWS Amplify

1. **Connect Repository**
2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```

3. **Environment Variables**
   Add in Amplify console under App Settings

## 🛡️ **Security Configuration**

### Supabase Production Settings

1. **URL Verification**
   - Go to Supabase Dashboard → Settings → API
   - Add your production domain to allowed origins
   - Example: `https://your-app.vercel.app`

2. **Storage Security**
   ```sql
   -- Verify storage policies are correct
   SELECT * FROM storage.objects WHERE bucket_id = 'portfolios';
   ```

3. **Database Security**
   - RLS policies are enforced
   - Anon key has limited permissions
   - Public portfolios only accessible

### Environment Security

- ✅ **VITE_SUPABASE_ANON_KEY**: Safe for frontend (designed for public use)
- ✅ **VITE_OPENAI_API_KEY**: Use environment variables only
- ❌ **Never expose**: Service role keys or database passwords

## 📊 **Performance Optimization**

### Build Optimization

The production build includes:
- **Code Splitting**: Separate chunks for better caching
- **Asset Optimization**: Compressed images and files
- **Tree Shaking**: Unused code elimination
- **Minification**: Optimized bundle size

### Supabase Optimization

1. **CDN**: Supabase storage includes global CDN
2. **Caching**: Browser caching enabled for assets
3. **Compression**: Automatic image optimization
4. **Edge Functions**: Faster global response times

## 🔍 **Post-Deployment Testing**

### 1. Basic Functionality
- [ ] App loads correctly
- [ ] Portfolio creation works
- [ ] File uploads to Supabase storage
- [ ] Portfolio sharing URLs work
- [ ] Database queries execute

### 2. Integration Testing
```javascript
// Test in browser console on production site
import { supabase } from './src/services/supabase'

// Test database connection
await supabase.from('portfolios').select('count(*)')

// Test storage
await supabase.storage.from('portfolios').list()
```

### 3. Performance Testing
- Lighthouse score check
- Core Web Vitals verification
- Mobile responsiveness test
- Cross-browser compatibility

## 🚨 **Troubleshooting**

### Common Deployment Issues

**Build Fails**
```bash
# Check locally first
npm run build
npm run preview
```

**Supabase Connection Fails**
- Verify environment variables are set
- Check Supabase project status
- Confirm URL and key are correct

**File Uploads Fail**
- Check storage bucket permissions
- Verify CORS settings in Supabase
- Check file size limits

**Portfolio URLs Don't Work**
- Verify table structure matches schema
- Check RLS policies are active
- Confirm data is being inserted

### Debug Commands

```javascript
// Check configuration in production
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Has OpenAI key:', !!import.meta.env.VITE_OPENAI_API_KEY)

// Test portfolio service
import portfolioService from './src/services/portfolioService'
console.log('Service configured:', portfolioService.isConfigured())
```

## 📈 **Monitoring & Analytics**

### Supabase Dashboard
- Monitor database usage
- Track storage usage
- View API request logs
- Check performance metrics

### Vercel Analytics
- Real-time performance data
- User engagement metrics
- Error tracking
- Core Web Vitals

### Custom Monitoring
```javascript
// Add to your analytics
// Track portfolio creations
// Monitor file upload success rates
// Track sharing URL clicks
```

## 🔄 **Updates & Maintenance**

### Automatic Deployments
- GitHub pushes → Auto-deploy to production
- Environment variables persist
- Zero-downtime deployments

### Database Migrations
- Use Supabase migrations for schema changes
- Test in staging environment first
- Backup data before major changes

### Scaling Considerations
- Supabase auto-scales with usage
- Vercel handles traffic spikes
- CDN ensures global performance

---

**🎉 Your Portflow app is now deployed with full Supabase integration - portfolios persist forever and scale automatically!**