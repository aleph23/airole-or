# Deployment Guide

This guide covers different deployment options for AIRole.net.

## 🚀 Vercel (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/easychen/airole)

### Manual Vercel Deployment

1. **Fork the repository** to your GitHub account
2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository
3. **Configure Environment Variables** (optional):
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add variables from `env-example.md` as needed
4. **Deploy**: Vercel will automatically build and deploy your app

### Environment Variables in Vercel

To enable Google Drive integration:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add these variables:
   ```
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your-random-secret-string
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

## ☁️ Other Platforms

### Netlify

1. Fork the repository
2. Connect to Netlify
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Railway

1. Fork the repository
2. Connect to Railway
3. Railway will auto-detect Next.js and deploy
4. Add environment variables in Railway dashboard

### DigitalOcean App Platform

1. Fork the repository
2. Create new app in DigitalOcean
3. Connect your repository
4. Configure environment variables
5. Deploy automatically

## 🛠️ Manual Server Deployment

### Prerequisites

- Node.js 22+
- PM2 (for process management)

### Steps

```bash
# Clone and setup
git clone https://github.com/aleph23/airole-or.git
cd airole-or
npm install

# Build the application
npm run build

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start npm --name "airole-or" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

### Nginx Configuration (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Configuration Tips

### Security

- Always use a strong `NEXTAUTH_SECRET`
- Use HTTPS in production
- Restrict Google OAuth to your domain

### Performance

- Enable Next.js compression
- Use a CDN for static assets
- Enable caching headers

### Monitoring

- Monitor application logs
- Set up error tracking (Sentry, etc.)
- Monitor performance metrics

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure Node.js version is 18+
   - Clear `node_modules` and reinstall dependencies

2. **Google OAuth Issues**
   - Check callback URLs in Google Console
   - Verify environment variables are set correctly

3. **NextAuth Errors**
   - Ensure `NEXTAUTH_URL` matches your domain
   - Check `NEXTAUTH_SECRET` is set

### Getting Help

- Check [GitHub Issues](https://github.com/aleph23/airole-or/issues)
- Join our community discussions
- Review the [troubleshooting guide](USER_GUIDE.md)

## 📊 Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Error monitoring set up
- [ ] Backup strategy in place
- [ ] Performance monitoring enabled
- [ ] Security headers configured
- [ ] Domain and DNS configured
- [ ] SSL certificate installed
