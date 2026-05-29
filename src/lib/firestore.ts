import { Note, Comment, Admin, toJsDate } from "./types";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

// ================= NOTES =================

// Upload note
export async function uploadNote(
  noteData: Omit<Note, "id" | "likes" | "createdAt" | "status">
): Promise<string> {
  const docRef = await addDoc(collection(db, "notes"), {
    ...noteData,
    likes: 0,
    status: "pending",
    createdAt: serverTimestamp(), // Server-side timestamp (consistent, not client clock)
  });

  return docRef.id;
}

// Get approved notes (sorted by newest first)
export async function getApprovedNotes(filters?: {
  branch?: string;
  semester?: string;
  subject?: string;
}): Promise<Note[]> {
  const q = query(collection(db, "notes"), where("status", "==", "approved"));

  const snapshot = await getDocs(q);

  let notes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Note[];

  // Client-side filtering
  if (filters?.branch) {
    notes = notes.filter((n) => n.branch === filters.branch);
  }
  if (filters?.semester) {
    notes = notes.filter((n) => n.semester === filters.semester);
  }
  if (filters?.subject) {
    notes = notes.filter((n) => n.subject === filters.subject);
  }

  // Sort newest first (client-side to avoid composite index requirement)
  return notes.sort((a, b) => {
    const dateA = toJsDate(a.createdAt);
    const dateB = toJsDate(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}

// Get pending notes
export async function getPendingNotes(): Promise<Note[]> {
  const q = query(collection(db, "notes"), where("status", "==", "pending"));
  const snapshot = await getDocs(q);

  const notes = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Note[];

  // Sort newest first
  return notes.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}

// Get note by ID
export async function getNoteById(id: string): Promise<Note | null> {
  const docRef = doc(db, "notes", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...snapshot.data(),
  } as Note;
}

// Approve note
export async function approveNote(noteId: string): Promise<void> {
  const noteRef = doc(db, "notes", noteId);
  await updateDoc(noteRef, { status: "approved" });
}

// Reject note (delete)
export async function rejectNote(noteId: string): Promise<void> {
  await deleteDoc(doc(db, "notes", noteId));
}

// Update likes — atomic increment, no race conditions
export async function updateNoteLikes(
  noteId: string,
  delta: number
): Promise<void> {
  const noteRef = doc(db, "notes", noteId);
  await updateDoc(noteRef, {
    likes: increment(delta),
  });
}

// ================= COMMENTS =================

// Get comments (newest first)
export async function getCommentsByNoteId(
  noteId: string
): Promise<Comment[]> {
  const q = query(collection(db, "comments"), where("noteId", "==", noteId));
  const snapshot = await getDocs(q);

  const comments = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Comment[];

  // Sort newest first
  return comments.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}

// Add comment
export async function addComment(
  noteId: string,
  name: string,
  comment: string
): Promise<string> {
  const docRef = await addDoc(collection(db, "comments"), {
    noteId,
    name,
    comment,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// ================= STATS =================

export async function getStats() {
  const notes = await getApprovedNotes();

  const branches = new Set(notes.map((n) => n.branch));
  const subjects = new Set(notes.map((n) => n.subject));

  return {
    totalNotes: notes.length,
    totalBranches: branches.size,
    totalSubjects: subjects.size,
  };
}

// ================= ADMINS =================

export async function getSubAdmins(): Promise<Admin[]> {
  const snapshot = await getDocs(collection(db, "admins"));
  
  const admins = snapshot.docs.map((doc) => ({
    email: doc.id,
    ...doc.data(),
  })) as Admin[];
  
  return admins.sort((a, b) => {
    const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
    const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });
}

// Add a sub-admin. The document ID is the email.
export async function addSubAdmin(email: string, addedBy: string): Promise<void> {
  const emailLower = email.trim().toLowerCase();
  const docRef = doc(db, "admins", emailLower);
  
  // We use setDoc instead of addDoc so the email is the doc ID
  await setDoc(docRef, {
    addedBy,
    createdAt: serverTimestamp(),
  });
}

export async function removeSubAdmin(email: string): Promise<void> {
  const emailLower = email.trim().toLowerCase();
  await deleteDoc(doc(db, "admins", emailLower));
}