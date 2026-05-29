type FirestoreDate = string | Date;

export function toJsDate(value: FirestoreDate): Date {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  return new Date(value);
}

export interface Note {
  id: string;
  title: string;
  branch: string;
  semester: string;
  subject: string; // course name
  courseCode: string; // course code (e.g., "22CS31")
  description: string;
  pdfUrl: string;
  noteType: string; // "Textbook" | "Question Paper" | "Handwritten Notes" | "PPT"
  examType: string; // "ISA 1" | "ISA 2" | "ESA" | ""
  tags: string[]; // kept for backward compat with old notes
  likes: number;
  status: "pending" | "approved" | "rejected";
  createdAt: FirestoreDate;
  uploadedBy?: string;
}

export interface Comment {
  id: string;
  noteId: string;
  name: string;
  comment: string;
  createdAt: FirestoreDate;
}

export interface Like {
  noteId: string;
  likedAt: FirestoreDate;
}

export interface Admin {
  email: string;
  addedBy: string;
  createdAt: FirestoreDate;
}
