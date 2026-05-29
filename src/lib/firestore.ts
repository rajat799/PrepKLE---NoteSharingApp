import { Note, Comment, Admin } from "./types";

// ================= NOTES =================

export async function uploadNote(
  noteData: Omit<Note, "id" | "likes" | "createdAt" | "status">
): Promise<string> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(noteData),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload note: ${errText}`);
  }
  const data = await res.json();
  return data.id;
}

export async function getApprovedNotes(filters?: {
  branch?: string;
  semester?: string;
  subject?: string;
}): Promise<Note[]> {
  const params = new URLSearchParams({ status: "approved" });
  if (filters?.branch) params.append("branch", filters.branch);
  if (filters?.semester) params.append("semester", filters.semester);
  if (filters?.subject) params.append("subject", filters.subject);

  const res = await fetch(`/api/notes?${params.toString()}`);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch approved notes: ${errText}`);
  }
  return res.json();
}

export async function getPendingNotes(): Promise<Note[]> {
  const res = await fetch("/api/notes?status=pending");
  if (!res.ok) throw new Error("Failed to fetch pending notes");
  return res.json();
}

export async function getNoteById(id: string): Promise<Note | null> {
  const res = await fetch(`/api/notes/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function approveNote(noteId: string): Promise<void> {
  const res = await fetch(`/api/notes/${noteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "approve" }),
  });
  if (!res.ok) throw new Error("Failed to approve note");
}

export async function rejectNote(noteId: string): Promise<void> {
  const res = await fetch(`/api/notes/${noteId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to reject note");
}

export async function updateNoteLikes(noteId: string, delta: number): Promise<void> {
  const res = await fetch(`/api/notes/${noteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "like", delta }),
  });
  if (!res.ok) throw new Error("Failed to update likes");
}

// ================= COMMENTS =================

export async function getCommentsByNoteId(noteId: string): Promise<Comment[]> {
  const res = await fetch(`/api/comments?noteId=${noteId}`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function addComment(noteId: string, name: string, comment: string): Promise<string> {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ noteId, name, comment }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  const data = await res.json();
  return data.id;
}

// ================= STATS =================

export async function getStats() {
  const res = await fetch("/api/stats");
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to fetch stats: ${errText}`);
  }
  return res.json();
}

// ================= ADMINS =================

export async function getSubAdmins(): Promise<Admin[]> {
  const res = await fetch("/api/admins");
  if (!res.ok) throw new Error("Failed to fetch admins");
  return res.json();
}

export async function addSubAdmin(email: string, addedBy: string): Promise<void> {
  const res = await fetch("/api/admins", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, addedBy }),
  });
  if (!res.ok) throw new Error("Failed to add sub-admin");
}

export async function removeSubAdmin(email: string): Promise<void> {
  const res = await fetch(`/api/admins?email=${encodeURIComponent(email)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove sub-admin");
}