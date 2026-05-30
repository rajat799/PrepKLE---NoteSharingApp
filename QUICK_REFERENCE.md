# ⚡ PrepKLE Quick Reference Guide

Fast lookup for common tasks and commands.

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy Firebase config template
cp .env.local.example .env.local

# 3. Edit .env.local with your Firebase credentials
# (Get from Firebase Console → Project Settings)

# 4. Start dev server
npm run dev

# 5. Open http://localhost:3000
```

## 📍 URLs Reference

| Page   | URL            | Purpose              |
| ------ | -------------- | -------------------- |
| Home   | `/` or `/home` | Hero section & stats |
| Browse | `/browse`      | View & filter notes  |
| Note   | `/notes/[id]`  | Read single note     |
| Upload | `/upload`      | Submit new notes     |
| Admin  | `/admin`       | Review & approve     |

## 🔐 Admin Credentials

- **URL**: http://localhost:3000/admin
- **Authentication**: Google Sign-In (emails configured in `NEXT_PUBLIC_ADMIN_EMAILS`)

## 📦 Available NPM Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Run production server
npm run lint        # Run ESLint
```

## 🔗 Important File Locations

| File                      | Purpose             | Edit For              |
| ------------------------- | ------------------- | --------------------- |
| `src/app/page.tsx`        | Home page           | Hero content          |
| `src/app/browse/page.tsx` | Browse filters      | Add branches/subjects |
| `src/app/upload/page.tsx` | Upload form         | Form fields           |
| `src/app/admin/page.tsx`  | Admin panel         | Admin UI actions      |
| `src/lib/firebase.ts`     | Firebase setup      | Config                |
| `src/lib/firestore.ts`    | DB functions        | Queries               |
| `.env.local.example`      | Credential template | Reference             |

## 🎨 Styling Quick Tips

### Dark Mode Classes

```tsx
// Light mode default
<div className="bg-white text-slate-900">

// Add dark mode
<div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
```

### Common Tailwind Classes

```tsx
// Layout
<div className="max-w-7xl mx-auto px-4">

// Grids
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Buttons
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">

// Cards
<div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
```

## 🔄 Firestore Cheat Sheet

### Create Document

```typescript
const docRef = await addDoc(collection(db, "notes"), {
  title: "My Note",
  status: "pending",
  createdAt: new Date(),
});
```

### Read Documents

```typescript
const q = query(
  collection(db, "notes"),
  where("status", "==", "approved"),
  orderBy("createdAt", "desc")
);
const snapshot = await getDocs(q);
```

### Update Document

```typescript
const noteRef = doc(db, "notes", noteId);
await updateDoc(noteRef, { likes: newLikes });
```

### Delete Document

```typescript
const noteRef = doc(db, "notes", noteId);
await deleteDoc(noteRef);
```

## 📤 Firebase Storage Upload

```typescript
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const fileRef = ref(storage, `notes/${fileName}`);
await uploadBytes(fileRef, file);
const url = await getDownloadURL(fileRef);
```

## 🗂️ Component Structure

### Creating New Component

```typescript
"use client"; // For interactive components

import { motion } from "framer-motion";

export function MyComponent() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      Content here
    </motion.div>
  );
}
```

### Adding to Page

```typescript
import { MyComponent } from "@/components/path/MyComponent";

export default function Page() {
  return (
    <main>
      <MyComponent />
    </main>
  );
}
```

## 🎬 Framer Motion Common Patterns

### Fade In

```typescript
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
>
```

### Slide In From Left

```typescript
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.1 }}
>
```

### Hover Scale

```typescript
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

### Scroll Animation

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
>
```

## 🐛 Common Issues & Fixes

### Issue: "Firebase config not found"

```bash
# Check .env.local exists and has all values
cat .env.local

# Verify var names start with NEXT_PUBLIC_
```

### Issue: "Dark mode not applying"

```bash
# Clear browser cache and localStorage
# Open DevTools → Application → Clear Storage
# Reload page
```

### Issue: "PDF upload fails"

```
1. Check file is actual PDF
2. Verify file size < 50 MB
3. Check Firebase Storage rules
4. Check internet connection
```

### Issue: "Admin panel shows access denied"

```
Verify your Google account email is listed in the NEXT_PUBLIC_ADMIN_EMAILS environment variable.
```

## 📊 Database Queries

### Get All Approved Notes

```typescript
import { getApprovedNotes } from "@/lib/firestore";

const notes = await getApprovedNotes();
```

### Get Notes by Branch & Semester

```typescript
const notes = await getApprovedNotes({
  branch: "CSE",
  semester: "2",
});
```

### Get Note by ID

```typescript
import { getNoteById } from "@/lib/firestore";

const note = await getNoteById(noteId);
```

### Get Comments for Note

```typescript
import { getCommentsByNoteId } from "@/lib/firestore";

const comments = await getCommentsByNoteId(noteId);
```

## 🔧 Environment Variables

### Development (.env.local)

```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
```

### Getting Values

1. Firebase Console
2. ⚙️ Settings
3. Project Settings
4. Your Apps section
5. Copy config values

## 📱 Responsive Design

### Tailwind Breakpoints

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Usage

```typescript
// Stack on mobile, row on tablet+
<div className="flex flex-col md:flex-row">

// Hide on mobile, show on tablet+
<div className="hidden md:block">

// Full width on mobile, max width on desktop
<div className="w-full max-w-7xl">
```

## 🚀 Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Add 6 Firebase env variables
- [ ] Deploy to Vercel
- [ ] Test live deployment
- [ ] Add custom domain (optional)
- [ ] Update Firebase authorized domains

## 📞 Helpful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase Console](https://console.firebase.google.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Framer Motion](https://www.framer.com/motion)
- [Lucide Icons](https://lucide.dev)

## ✨ Quick Customizations

### Change Hero Heading

File: `src/components/home/HeroSection.tsx`

```typescript
<h1 className="text-5xl md:text-6xl font-bold ...">
  PrepKLE — Your Custom Text Here
</h1>
```

### Add New Branch

File: `src/app/browse/page.tsx`

```typescript
const BRANCHES = ['CSE', 'ECE', 'YourBranch', ...];
```

### Change Admin Emails

File: `.env.local`

```
NEXT_PUBLIC_ADMIN_EMAILS=email1@gmail.com,email2@gmail.com
```

### Modify Colors

File: `tailwind.config.ts` or use `dark:text-blue-400` syntax

```typescript
// Add to globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg;
  }
}
```

## 🎯 Development Workflow

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes
# 3. Test locally
npm run dev

# 4. Commit changes
git add .
git commit -m "Add my feature"

# 5. Push to GitHub
git push origin feature/my-feature

# 6. Create Pull Request

# 7. Merge to main when approved
# 8. Vercel auto-deploys!
```

---

**Save this file for quick reference while developing! 📝**
