# PrepKLE - Notes Sharing Platform

A modern, responsive notes-sharing web application for KLE Dr. M.S. Sheshgiri College of Engineering, Belagavi (Karnataka).

##  Overview

PrepKLE is an open-access (no login required) campus-focused platform where students upload PDF notes that are reviewed by admins before being published. The platform is organized by Branch  Semester  Subject  Notes.

##  Tech Stack

- **Frontend**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Firebase (Firestore + Storage)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready
- **Dark Mode**: Fully supported

##  Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Firebase

1. Create project at https://console.firebase.google.com
2. Enable Firestore & Cloud Storage
3. Copy `.env.local.example` to `.env.local`
4. Add your Firebase credentials

### 3. Setup Firestore Rules

In Firebase Console  Firestore  Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{document=**} {
      allow read: if true;
      allow create: if true;
      allow update: if request.auth != null;
      allow delete: if request.auth != null;
    }
    match /comments/{document=**} {
      allow read: if true;
      allow create: if true;
      allow delete: if request.auth != null;
    }
  }
}
```

### 4. Setup Storage Rules

In Firebase Console  Storage  Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /notes/{allPaths=**} {
      allow read: if true;
      allow create: if true;
      allow delete: if request.auth != null;
    }
  }
}
```

### 5. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000

##  Database Schema

### Notes Collection
- title: string
- branch: string (CSE, ECE, etc.)
- semester: string (1-8)
- subject: string
- description: string
- pdfUrl: string
- tags: string[]
- likes: number
- status: 'pending' | 'approved'
- createdAt: timestamp

### Comments Collection
- noteId: string
- name: string
- comment: string
- createdAt: timestamp

##  Pages

- **Home** (`/`) - Hero section with stats
- **Browse** (`/browse`) - Filter and search notes
- **Note Detail** (`/notes/[id]`) - View with comments
- **Upload** (`/upload`) - Submit new notes
- **Admin** (`/admin`) - Approve/Reject uploads

##  Admin Access

Admin access is controlled via Firebase Google Authentication. Only emails configured in the `NEXT_PUBLIC_ADMIN_EMAILS` environment variable are authorized to access the admin panel.

Visit: http://localhost:3000/admin

##  Deployment

Deploy to Vercel:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add Firebase environment variables
4. Deploy!

##  Features

 Open-access (no login required)
 PDF upload & storage
 Admin approval workflow
 Like system (localStorage-based)
 Comments section
 Advanced filtering
 Dark mode support
 Fully responsive
 Firestore integration
 Cloud Storage support

---

**Built for KLE Dr. M.S. Sheshgiri College of Engineering, Belagavi**
