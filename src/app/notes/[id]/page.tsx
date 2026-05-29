"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getNoteById,
  updateNoteLikes,
} from "@/lib/firestore";
import { Note, toJsDate } from "@/lib/types";
import {
  Heart,
  Share2,
  Download,
  ChevronLeft,
  FileText,
  Eye,
  BookmarkPlus,
  Pen,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/common/Toast";
import { NoteDetailSkeleton } from "@/components/common/Skeleton";

export default function NotePage() {
  const params = useParams();
  const noteId = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const noteData = await getNoteById(noteId);
        setNote(noteData);
        const likedNotes = JSON.parse(localStorage.getItem("likedNotes") || "[]");
        setLiked(likedNotes.includes(noteId));
      } catch (error) {
        console.error("Failed to fetch note:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [noteId]);

  const handleLike = async () => {
    if (!note) return;
    try {
      const likedNotes = JSON.parse(localStorage.getItem("likedNotes") || "[]");
      if (liked) {
        await updateNoteLikes(noteId, -1);
        setLiked(false);
        localStorage.setItem("likedNotes", JSON.stringify(likedNotes.filter((id: string) => id !== noteId)));
        setNote({ ...note, likes: note.likes - 1 });
      } else {
        await updateNoteLikes(noteId, 1);
        setLiked(true);
        likedNotes.push(noteId);
        localStorage.setItem("likedNotes", JSON.stringify(likedNotes));
        setNote({ ...note, likes: note.likes + 1 });
      }
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  if (loading) return <NoteDetailSkeleton />;

  if (!note) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <FileText size={48} className="text-[#444444] mb-4" />
        <p className="text-[#A0A0A0] mb-4 text-lg">Note not found</p>
        <Link href="/browse" className="text-[#FBBF24] hover:underline font-medium">
          ← Back to Browse
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-6 flex-wrap">
          <Link href="/browse" className="hover:text-[#FBBF24] transition-colors flex items-center gap-1">
            <ChevronLeft size={16} />
            Browse
          </Link>
          <span>›</span>
          <span className="text-[#A0A0A0]">{note.branch}</span>
          <span>›</span>
          <span className="text-[#A0A0A0]">{note.subject}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left — PDF Preview */}
          <div className="lg:col-span-3">
            <div className="notebook-frame rounded-xl p-4 md:p-6">
              <div className="bg-[#1A1A1A] rounded-lg p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center text-center">
                <FileText size={64} className="text-[#444444] mb-6" />
                <p className="text-lg font-semibold text-[#F5F5F5] mb-2">
                  {note.title}
                </p>
                <p className="text-sm text-[#6B7280] mb-8">PDF Document</p>

                {note.pdfUrl && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => window.open(note.pdfUrl, "_blank")}
                      className="btn-warm inline-flex items-center gap-2 py-2.5 px-5 rounded-lg text-sm"
                    >
                      <Eye size={16} />
                      View PDF
                    </button>
                    <button
                      onClick={() => window.open(note.pdfUrl, "_blank")}
                      className="btn-paper inline-flex items-center gap-2 py-2.5 px-5 rounded-lg text-sm"
                    >
                      <Download size={16} />
                      Download PDF
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right — Info + Actions + Comments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Note info card */}
            <div className="paper-flat rounded-xl p-6">
              <h1 className="hand-font text-3xl font-bold text-[#F5F5F5] mb-4 leading-tight">
                {note.title}
              </h1>

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="badge-branch">
                  📍 {note.branch}
                </span>
                <span className="badge-sem">
                  Semester {note.semester}
                </span>
                {note.courseCode && (
                  <span className="badge-type bg-[#2A2111] text-[#FBBF24] border border-[#5E440D] font-mono">
                    {note.courseCode}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="flex items-center gap-1 text-xs text-[#A0A0A0]">
                  <Pen size={12} />
                  {note.subject}
                </span>
                {note.noteType && (
                  <span className="badge-type bg-[#0F2942] text-[#60A5FA] border border-[#18406B]">
                    {note.noteType}
                  </span>
                )}
                {note.examType && (
                  <span className="badge-type bg-[#362708] text-[#FDE047] border border-[#5E440D]">
                    {note.examType}
                  </span>
                )}
              </div>

              <p className="text-[#A0A0A0] text-sm leading-relaxed mb-4">
                {note.description}
              </p>

              {/* Tags — legacy */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {note.tags.map((tag) => (
                    <span key={tag} className="tag-sketch">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-[#333333] flex-wrap">
                <button
                  onClick={handleLike}
                  className={`inline-flex items-center gap-1.5 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    liked
                      ? "bg-[#360C15] text-[#F87171] border border-[#5E1524]"
                      : "btn-paper"
                  }`}
                >
                  <Heart size={16} fill={liked ? "currentColor" : "none"} />
                  Like ({note.likes})
                </button>

                <button
                  onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator.share({ title: note.title, url });
                    } else {
                      navigator.clipboard.writeText(url);
                      showToast("Link copied!", "success");
                    }
                  }}
                  className="btn-paper inline-flex items-center gap-1.5 py-2 px-4 rounded-lg text-sm"
                >
                  <Share2 size={16} />
                  Share
                </button>

                {note.pdfUrl && (
                  <button
                    onClick={() => window.open(note.pdfUrl, "_blank")}
                    className="btn-paper inline-flex items-center gap-1.5 py-2 px-4 rounded-lg text-sm"
                  >
                    <Download size={16} />
                    Download
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
