# Admin Panel Deployment Guide

## 🚀 Quick Deployment

### 1. Environment Setup

Create `.env` file in admin folder:

```bash
VITE_API_URL=https://codeintervu-backend.onrender.com/api
```

### 2. Build for Production

```bash
cd admin
npm install
npm run build
```

### 3. Deploy to Netlify (Recommended)

#### Option A: Drag & Drop

1. Run `npm run build`
2. Drag the `dist` folder to Netlify dashboard
3. Set site name: `admincodeintervu`
4. Deploy!

#### Option B: Git Integration

1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. **Set Environment Variable in Netlify:**
   - Key: `VITE_API_URL`
   - Value: `https://codeintervu-backend.onrender.com/api`
6. Deploy!

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 5. Deploy to GitHub Pages

```bash
# Add to package.json
"homepage": "https://yourusername.github.io/admin-repo",
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"

# Install gh-pages
npm install --save-dev gh-pages

# Deploy
npm run deploy
```

## 🔧 Configuration

### API Configuration

- **Production**: `https://codeintervu-backend.onrender.com/api`
- **Development**: `http://localhost:5000/api`

### Build Optimization

- ✅ Code splitting enabled
- ✅ Vendor chunks separated
- ✅ Minification enabled
- ✅ Source maps disabled for production

## 🌐 Domain Setup

After deployment, your admin panel will be available at:

- Netlify: `https://admincodeintervu.netlify.app`
- Vercel: `https://your-project.vercel.app`
- GitHub Pages: `https://yourusername.github.io/admin-repo`

## 🔒 Security

- ✅ CORS configured for production domains
- ✅ Environment variables for API URLs
- ✅ Build optimization for performance

## 📝 Post-Deployment Checklist

- [ ] Test admin login
- [ ] Test category management
- [ ] Test quiz creation
- [ ] Test tutorial management
- [ ] Verify API connectivity
- [ ] Check mobile responsiveness

## 🚨 Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Connection Issues

1. Check environment variables
2. Verify backend is running
3. Test API endpoints manually
4. Check CORS configuration

### Deployment Issues

1. Ensure all dependencies are in package.json
2. Check build output directory
3. Verify environment variables are set
4. Check deployment platform logs
