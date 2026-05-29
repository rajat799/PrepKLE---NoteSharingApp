# PrepKLE Deployment Guide

Complete guide to deploying PrepKLE to production on Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Firebase project created
- All Firebase configuration ready

## Step 1: Prepare Your Code

### 1.1 Initialize Git Repository

```bash
cd prepkle
git init
git add .
git commit -m "Initial commit: PrepKLE notes sharing platform"
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create new repository: `prepkle`
3. Choose `Add .gitignore` → `Node`
4. Create repository

### 1.3 Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/prepkle.git
git branch -M main
git push -u origin main
```

## Step 2: Prepare Firebase

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project" → "PrepKLE"
3. Disable Google Analytics (optional)
4. Wait for project creation

### 2.2 Enable Firestore

1. **Build** → **Firestore Database**
2. **Create Database**
3. Region: `asia-south1` (for India)
4. Start Mode: **Production**
5. **Create**

### 2.3 Enable Storage

1. **Build** → **Storage**
2. **Get Started**
3. Accept default rules
4. Region: `asia-south1` (same as Firestore)
5. **Done**

### 2.4 Update Security Rules

#### Firestore Rules

Go to **Firestore** → **Rules**, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, restricted write
    match /notes/{document=**} {
      allow read: if true;
      allow create: if true;
      allow update: if false;  // Only backend can update
      allow delete: if false;
    }

    // Public read and write for comments
    match /comments/{document=**} {
      allow read: if true;
      allow create: if true;
      allow delete: if false;
    }
  }
}
```

#### Storage Rules

Go to **Storage** → **Rules**, replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /notes/{allPaths=**} {
      allow read: if true;
      allow create: if request.contentType.matches('application/pdf');
      allow delete: if false;
    }
  }
}
```

### 2.5 Get Firebase Configuration

1. **Project Settings** (⚙️ icon)
2. **General** tab
3. Scroll to "Your apps"
4. Click the web app (or create one)
5. Copy configuration:

```javascript
{
  apiKey: "xxx",
  authDomain: "xxx.firebaseapp.com",
  projectId: "xxx",
  storageBucket: "xxx.appspot.com",
  messagingSenderId: "xxx",
  appId: "xxx"
}
```

## Step 3: Deploy to Vercel

### 3.1 Connect GitHub to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click **Import Project**
3. Select **GitHub**
4. Install Vercel GitHub App if prompted
5. Find & select `prepkle` repository
6. Click **Import**

### 3.2 Configure Environment Variables

On the Vercel import page, scroll to **Environment Variables**:

Add all 6 Firebase keys:

```
NEXT_PUBLIC_FIREBASE_API_KEY = your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID = your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID = your_app_id
```

### 3.3 Deploy

Click **Deploy** and wait for completion (~3-5 minutes)

## Step 4: Post-Deployment Configuration

### 4.1 Update Firebase Authorized Domains

1. Firebase Console → **Settings** → **Authorized Domains**
2. Click **Add Domain**
3. Enter your Vercel URL (e.g., `prepkle.vercel.app`)
4. **Save**

Note: Also add `localhost:3000` for local development

### 4.2 Configure Custom Domain (Optional)

#### Add Domain to Vercel

1. Vercel Dashboard → Your Project → **Settings**
2. **Domains**
3. Enter your domain (e.g., `prepkle.kle.edu.in`)
4. Add DNS records as shown

#### Update DNS

1. Go to your domain registrar
2. Add CNAME record:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`
3. Wait for propagation (5-15 minutes)

#### Update Firebase Domain

Add your custom domain to Firebase authorized domains

## Step 5: Testing

### 5.1 Test Core Features

- [ ] Visit home page
- [ ] Browse notes (empty initially)
- [ ] Upload a test PDF
- [ ] Check admin panel with password
- [ ] Approve the test note
- [ ] View on browse page
- [ ] Like the note
- [ ] Add a comment
- [ ] Check dark mode toggle

### 5.2 Check Performance

1. Vercel Dashboard → **Analytics**
2. Monitor response times
3. Check error rates

### 5.3 Check Logs

1. Vercel Dashboard → **Deployments**
2. Click latest → **View Build Logs**
3. Check for warnings/errors

## Step 6: Add Sample Data (Optional)

Create sample notes in Firestore for testing:

1. Firebase Console → **Firestore** → **Create Document**
2. Collection: `notes`
3. Add sample documents:

```json
{
  "title": "Data Structures - Arrays & Lists",
  "branch": "CSE",
  "semester": "2",
  "subject": "Data Structures",
  "description": "Complete notes on arrays, linked lists, and basic operations",
  "pdfUrl": "https://example.com/sample.pdf",
  "tags": ["arrays", "linkedlists", "datastructures"],
  "likes": 5,
  "status": "approved",
  "createdAt": "2025-01-08T10:00:00Z"
}
```

## Step 7: Setup CI/CD

### Auto-Deploy on Push

Vercel automatically deploys when you push to main:

```bash
git add .
git commit -m "Feature: Add new component"
git push origin main
```

Vercel will automatically build and deploy!

### Preview Deployments

For pull requests, Vercel creates preview URLs:

1. Create a branch and make changes
2. Push to GitHub
3. Create Pull Request
4. Vercel creates preview deployment
5. Review changes before merging

## Step 8: Monitor & Maintain

### Regular Tasks

- [ ] Review admin panel for pending uploads
- [ ] Check Firebase usage/quota
- [ ] Monitor Vercel analytics
- [ ] Update security rules if needed
- [ ] Backup Firebase data

### Scaling Considerations

- **Firestore**: Upgrade plan if needed
- **Storage**: Monitor storage usage
- **Bandwidth**: Check Vercel usage
- **Database indexes**: Add if queries slow

## Troubleshooting

### Issue: "Firebase config not found"

**Solution**: Verify all environment variables are set in Vercel:

```bash
# Check locally
cat .env.local

# On Vercel, go to Settings → Environment Variables
# Ensure all NEXT_PUBLIC_FIREBASE_* are present
```

### Issue: "PDF upload fails"

**Solution**: Check Storage rules and quota:

1. Firebase Console → **Storage** → **Rules**
2. Check for errors
3. Monitor usage in **Storage** → **Usage**

### Issue: "Cannot connect to Firestore"

**Solution**: Update authorized domains:

1. Firebase Console → **Settings** → **Authorized Domains**
2. Add `yourvercelurl.vercel.app`
3. Wait 5 minutes for propagation

### Issue: "Dark mode not working"

**Solution**: Check browser localStorage:

1. Open DevTools → **Application** → **Local Storage**
2. Look for `theme` key
3. Clear cache and reload

## Performance Optimization

### Images & Assets

- Use Next.js Image component
- Optimize PDF thumbnails
- Lazy load components

### Database

- Add Firestore indexes for complex queries
- Use pagination for note lists
- Cache frequent queries

### Build Size

- Check bundle analysis: `npm run build`
- Remove unused dependencies
- Tree-shake code

## Security Hardening

### Production Checklist

- [ ] Change admin password
- [ ] Implement proper admin auth (don't use hardcoded password)
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Sanitize user inputs
- [ ] Add CSRF protection
- [ ] Monitor for suspicious activity
- [ ] Regular security audits

### Code Review

1. Use GitHub branch protection
2. Require reviews before merge
3. Run security scans in CI/CD

## Backup & Recovery

### Firestore Backup

1. Firebase Console → **Firestore** → **Backups**
2. Create scheduled backups
3. Test restore procedures

### Storage Backup

1. Download important PDFs regularly
2. Store in cloud backup (Google Drive, AWS S3)

## Rollback Procedure

If deployment has issues:

1. Vercel Dashboard → **Deployments**
2. Find last working deployment
3. Click **Promote to Production**

Or use Git:

```bash
git revert <commit-hash>
git push origin main
```

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Configure Firebase
3. ✅ Test all features
4. ✅ Setup custom domain (optional)
5. ✅ Monitor analytics
6. ✅ Gather user feedback
7. ✅ Plan improvements

**Your PrepKLE is now live! 🚀**
