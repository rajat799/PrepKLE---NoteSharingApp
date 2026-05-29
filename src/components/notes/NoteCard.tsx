'use client';

import Link from 'next/link';
import { Heart, FileText, Calendar, BookOpen, FileQuestion, Pen, Presentation } from 'lucide-react';
import { Note, toJsDate } from '@/lib/types';

interface NoteCardProps {
  note: Note;
}

// Deterministic color based on subject name
function getSubjectColor(subject: string) {
  const colors = [
    { bg: "#2A190B", border: "#4F2A10", accent: "#F59E0B" },
    { bg: "#0F2942", border: "#18406B", accent: "#60A5FA" },
    { bg: "#2A1136", border: "#4A1D5F", accent: "#C084FC" },
    { bg: "#0D2C1A", border: "#164A2C", accent: "#4ADE80" },
    { bg: "#362708", border: "#5E440D", accent: "#FDE047" },
    { bg: "#360C15", border: "#5E1524", accent: "#F87171" },
    { bg: "#0B2D33", border: "#134D57", accent: "#2DD4BF" },
  ];
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Icon for note type
function getNoteTypeIcon(noteType: string) {
  switch (noteType) {
    case "Textbook": return <BookOpen size={12} />;
    case "Question Paper": return <FileQuestion size={12} />;
    case "Handwritten Notes": return <Pen size={12} />;
    case "PPT": return <Presentation size={12} />;
    default: return <FileText size={12} />;
  }
}

function getNoteTypeBadge(noteType: string) {
  switch (noteType) {
    case "Textbook": return "bg-[#0F2942] text-[#60A5FA] border border-[#18406B]";
    case "Question Paper": return "bg-[#360C15] text-[#F87171] border border-[#5E1524]";
    case "Handwritten Notes": return "bg-[#2A190B] text-[#F59E0B] border border-[#4F2A10]";
    case "PPT": return "bg-[#2A1136] text-[#C084FC] border border-[#4A1D5F]";
    default: return "bg-[#1A1A1A] text-[#A0A0A0] border border-[#333333]";
  }
}

export function NoteCard({ note }: NoteCardProps) {
  const formattedDate = toJsDate(note.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const color = getSubjectColor(note.subject);

  return (
    <Link href={`/notes/${note.id}`}>
      <div className="paper-card rounded-xl overflow-hidden group cursor-pointer h-full">
        {/* Colored header with subject */}
        <div
          className="p-4 h-28 flex flex-col justify-end relative overflow-hidden"
          style={{ background: color.bg, borderBottom: `2px solid ${color.border}` }}
        >
          {/* Notebook lines */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full h-px bg-current absolute" style={{ top: `${20 + i * 15}%`, color: color.accent }} />
            ))}
          </div>

          {/* Badges row */}
          <div className="relative z-10 flex items-center gap-1.5 mb-2">
            {note.noteType && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getNoteTypeBadge(note.noteType)}`}>
                {getNoteTypeIcon(note.noteType)}
                {note.noteType}
              </span>
            )}
            {note.examType && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#362708] text-[#FDE047] border border-[#5E440D]">
                {note.examType}
              </span>
            )}
          </div>

          <div className="relative z-10 flex items-end gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
              <FileText size={20} style={{ color: color.accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate text-sm" style={{ color: color.accent }}>{note.subject}</h3>
              <p className="text-xs opacity-70" style={{ color: color.accent }}>
                {note.branch} • Sem {note.semester}
                {note.courseCode && <> • <span className="font-mono">{note.courseCode}</span></>}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h2 className="text-base font-bold text-[#F5F5F5] mb-2 line-clamp-2 group-hover:text-[#FBBF24] transition-colors">
            {note.title}
          </h2>

          <p className="text-sm text-[#A0A0A0] mb-4 line-clamp-2 leading-relaxed">
            {note.description}
          </p>

          {/* Tags — legacy support */}
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {note.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag-sketch text-xs">#{tag}</span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-[#6B7280] border-t border-[#333333] pt-3">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} />
              {formattedDate}
            </div>
            <div className="flex items-center gap-1.5">
              <Heart size={13} fill="currentColor" className="text-[#F87171]" />
              <span className="text-[#F87171] font-medium">{note.likes || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
