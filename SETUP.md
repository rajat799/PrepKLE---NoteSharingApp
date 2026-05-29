# PrepKLE Setup & Configuration Guide

Complete step-by-step guide to set up PrepKLE for development and production.

## 📋 Prerequisites

- Node.js 18+ installed
- npm package manager
- Firebase account (free tier available)
- Text editor or IDE (VS Code recommended)
- Git (for version control)

## 🚀 Development Setup

### Step 1: Install Dependencies

```bash
cd prepkle
npm install
```

### Step 2: Configure Firebase Locally

#### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project"
3. Name: `PrepKLE`
4. Enable Google Analytics: No (optional)
5. Click "Create Project"

#### 2.2 Enable Firestore

1. In Firebase Console, click your project
2. Navigate to **Build** → **Firestore Database**
3. Click "Create Database"
4. Select region: `asia-south1` (India)
5. Select mode: **Production mode** (we'll update security rules)
6. Click "Create"

#### 2.3 Enable Cloud Storage

1. Navigate to **Build** → **Storage**
2. Click "Get Started"
3. Review security rules (we'll customize later)
4. Select region: `asia-south1`
5. Click "Done"

#### 2.4 Get Firebase Credentials

1. Click **Project Settings** (⚙️ gear icon)
2. Go to **General** tab
3. Scroll to "Your apps" section
4. If no web app exists, click "Add app" → **Web**
5. App nickname: `PrepKLE Web`
6. Check "Also set up Firebase Hosting"
7. Click "Register app"
8. Copy the Firebase config:

```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
}
```

### Step 3: Create .env.local

```bash
# Copy example to actual env file
cp .env.local.example .env.local
```

Edit `.env.local` and add your Firebase credentials:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

⚠️ **Important**: Never commit `.env.local` to Git!

### Step 4: Update Security Rules

#### 4.1 Firestore Rules

1. Firebase Console → **Firestore Database** → **Rules**
2. Replace all content with contents from `firestore.rules` file
3. Click **Publish**

#### 4.2 Storage Rules

1. Firebase Console → **Storage** → **Rules**
2. Replace all content with contents from `storage.rules` file
3. Click **Publish**

### Step 5: Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser

### Step 6: Test the Application

- [ ] Home page loads with hero section
- [ ] Dark mode toggle works
- [ ] Browse page shows filters
- [ ] Upload form renders correctly
- [ ] Admin panel requires password
- [ ] Console has no errors

## 📝 Project Structure Overview

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx           # Root layout (Header, dark mode)
│   ├── page.tsx             # Home redirect
│   ├── browse/
│   │   └── page.tsx         # Notes browse with filters
│   ├── notes/
│   │   └── [id]/page.tsx    # Note detail view
│   ├── upload/
│   │   └── page.tsx         # Upload form
│   ├── admin/
│   │   └── page.tsx         # Admin panel
│   └── globals.css          # Global styles
│
├── components/       # Reusable React components
│   ├── common/               # Shared components
│   │   ├── Header.tsx        # Navigation
│   │   ├── ThemeToggle.tsx   # Dark mode toggle
│   │   └── Counter.tsx       # Animated counters
│   ├── home/                 # Home page components
│   │   ├── HeroSection.tsx   # Hero section
│   │   └── StatsSection.tsx  # Statistics
│   └── notes/
│       └── NoteCard.tsx      # Note display card
│
└── lib/             # Utilities and configurations
    ├── firebase.ts          # Firebase setup
    ├── firestore.ts         # Firestore functions
    └── types.ts             # TypeScript interfaces
```

## 🔧 Key Configuration Files

### tailwind.config.ts

Tailwind CSS configuration with dark mode support (uses `dark:` prefix).

### tsconfig.json

TypeScript configuration with path aliases (`@/*` = `src/*`).

### next.config.ts

Next.js configuration optimized for static export and API routes.

## 🌐 Environment Variables

### Development (.env.local)

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### Production (Vercel)

Same as above, configured in Vercel Dashboard under Environment Variables.

## 🎯 Admin Features

### Admin Panel Access

- URL: `http://localhost:3000/admin`
- Password: `PrepKLE@Admin2025` (change in `src/app/admin/page.tsx`)

### Admin Capabilities

1. **Pending Queue**: View submitted but unapproved notes
2. **Approve**: Make notes public
3. **Reject**: Delete rejected submissions
4. **Delete**: Remove published notes
5. **Preview**: Download and view PDFs

## 🗄️ Firestore Collections

### notes

```typescript
{
  title: string;              // Note title
  branch: string;             // Engineering branch
  semester: string;           // 1-8
  subject: string;            // Subject name
  description: string;        // Detailed description
  pdfUrl: string;            // Firebase Storage URL
  tags: string[];            // Search tags
  likes: number;             // Like count
  status: 'pending'           // 'pending' | 'approved' | 'rejected'
         | 'approved'
         | 'rejected';
  createdAt: Timestamp;      // Upload timestamp
  uploadedBy?: string;       // Uploader name (optional)
}
```

### comments

```typescript
{
  noteId: string; // Reference to note
  name: string; // Commenter name
  comment: string; // Comment text
  createdAt: Timestamp; // Comment timestamp
}
```

## 💾 Local Storage Schema

### `likedNotes`

Array of note IDs that user has liked:

```json
["note_id_1", "note_id_2", ...]
```

### `theme`

Current theme preference:

```
"dark" | "light"
```

## 🔐 Security Considerations

### Current Setup (Development)

- Open read/write for public
- No authentication required
- Simple password for admin

### For Production

1. **Admin Authentication**: Implement proper Firebase Auth
2. **Input Validation**: Add server-side validation
3. **Rate Limiting**: Prevent spam uploads
4. **Content Moderation**: Filter inappropriate submissions
5. **CORS**: Configure properly
6. **Data Sanitization**: Prevent XSS attacks

## 📱 Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

All components use Tailwind's responsive prefixes (`md:`, `lg:`, etc.)

## 🎨 Dark Mode Implementation

### How It Works

1. **Initialization**: Checks `localStorage` for saved preference (default: "dark")
2. **Toggle**: `ThemeToggle` component switches theme
3. **Application**: Tailwind's dark mode class on `<html>` element
4. **Persistence**: Saved in `localStorage`

### Styling

```tsx
// Light mode (default text color)
<div className="text-slate-900">

// Dark mode (using dark: prefix)
<div className="text-slate-900 dark:text-white">
```

## 🚀 Building for Production

```bash
npm run build
npm run start
```

## 📊 Performance Tips

1. **Code Splitting**: Next.js handles automatic code splitting
2. **Images**: Use Next.js Image component (coming soon)
3. **Lazy Loading**: Components lazy load on scroll
4. **Database**: Use Firestore indexes for common queries
5. **Caching**: Leverage browser caching for static assets

## 🔄 Update Dependencies

```bash
npm update
npm audit fix
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## ✅ Checklist for First-Time Setup

- [ ] Node.js 18+ installed
- [ ] Repository cloned/created
- [ ] Firebase project created
- [ ] Firestore enabled and configured
- [ ] Cloud Storage enabled
- [ ] `.env.local` created with credentials
- [ ] Firestore security rules deployed
- [ ] Storage security rules deployed
- [ ] Development server running
- [ ] Can access http://localhost:3000
- [ ] Home page displays correctly
- [ ] Dark mode toggle works
- [ ] Admin panel accessible

---

**Ready to start developing PrepKLE! 🎉**
