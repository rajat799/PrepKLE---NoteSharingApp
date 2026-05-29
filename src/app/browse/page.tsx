"use client";

import { useState, useEffect } from "react";
import { getApprovedNotes } from "@/lib/firestore";
import { Note } from "@/lib/types";
import { NoteCard } from "@/components/notes/NoteCard";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { BRANCHES, getSemesters, getCourses, NOTE_TYPES, EXAM_TYPES } from "@/lib/constants";
import { NoteCardSkeleton } from "@/components/common/Skeleton";

export default function BrowsePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedNoteType, setSelectedNoteType] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Derived data
  const semesters = selectedBranch ? getSemesters(selectedBranch) : [];
  const courses = selectedBranch && selectedSemester
    ? getCourses(selectedBranch, selectedSemester)
    : [];

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getApprovedNotes();
        setNotes(data);
      } catch (error) {
        console.error("Failed to fetch notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Filter and sort
  useEffect(() => {
    let filtered = notes.filter((note) => {
      const matchesBranch = !selectedBranch || note.branch === selectedBranch;
      const matchesSemester = !selectedSemester || note.semester === selectedSemester;
      const matchesSubject = !selectedSubject || note.subject === selectedSubject;
      const matchesNoteType = !selectedNoteType || note.noteType === selectedNoteType;
      const matchesExamType = !selectedExamType || note.examType === selectedExamType;
      const matchesSearch =
        !searchTerm ||
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesBranch && matchesSemester && matchesSubject && matchesNoteType && matchesExamType && matchesSearch;
    });

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredNotes(filtered);
  }, [notes, selectedBranch, selectedSemester, selectedSubject, selectedNoteType, selectedExamType, searchTerm]);

  const hasFilters = selectedBranch || selectedSemester || selectedSubject || selectedNoteType || selectedExamType || searchTerm;

  const resetFilters = () => {
    setSelectedBranch("");
    setSelectedSemester("");
    setSelectedSubject("");
    setSelectedNoteType("");
    setSelectedExamType("");
    setSearchTerm("");
  };

  const FilterSidebar = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-[#FBBF24]" />
          <h3 className="font-bold text-[#F5F5F5]">Filters</h3>
        </div>
        {hasFilters && (
          <button onClick={resetFilters} className="text-xs text-[#F87171] hover:underline font-medium flex items-center gap-1">
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* Branch */}
      <div>
        <label className="block text-xs font-bold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">Branch</label>
        <select
          value={selectedBranch}
          onChange={(e) => {
            setSelectedBranch(e.target.value);
            setSelectedSemester("");
            setSelectedSubject("");
          }}
          className="w-full p-2.5 rounded-lg select-warm text-sm"
        >
          <option value="">All Branches</option>
          {BRANCHES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>

      {/* Semester */}
      <div>
        <label className="block text-xs font-bold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">Semester</label>
        <select
          value={selectedSemester}
          onChange={(e) => {
            setSelectedSemester(e.target.value);
            setSelectedSubject("");
          }}
          className="w-full p-2.5 rounded-lg select-warm text-sm disabled:opacity-40"
          disabled={!selectedBranch}
        >
          <option value="">{selectedBranch ? "All Semesters" : "Select branch first"}</option>
          {semesters.map((s) => <option key={s} value={s}>Semester {s}</option>)}
        </select>
      </div>

      {/* Subject/Course */}
      <div>
        <label className="block text-xs font-bold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">Subject</label>
        {courses.length > 0 ? (
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2.5 rounded-lg select-warm text-sm"
          >
            <option value="">All Subjects</option>
            {courses.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} {c.code ? `(${c.code})` : ""}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="e.g. Data Structures"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2.5 rounded-lg input-warm text-sm"
          />
        )}
      </div>

      {/* Note Type */}
      <div>
        <label className="block text-xs font-bold text-[#A0A0A0] mb-2 uppercase tracking-wider">Note Type</label>
        <div className="space-y-1.5">
          {NOTE_TYPES.map((type) => (
            <label
              key={type}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
                selectedNoteType === type
                  ? "bg-[#2A2111] border border-[#FBBF24] text-[#F5F5F5] font-medium"
                  : "hover:bg-[#111111] text-[#A0A0A0]"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedNoteType === type}
                onChange={() => setSelectedNoteType(selectedNoteType === type ? "" : type)}
                className="accent-[#FBBF24] rounded"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Exam Type */}
      <div>
        <label className="block text-xs font-bold text-[#A0A0A0] mb-2 uppercase tracking-wider">Exam</label>
        <div className="flex flex-wrap gap-1.5">
          {EXAM_TYPES.map((exam) => (
            <button
              key={exam}
              type="button"
              onClick={() => setSelectedExamType(selectedExamType === exam ? "" : exam)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedExamType === exam
                  ? "bg-[#2A2111] border-[#FBBF24] text-[#F5F5F5]"
                  : "border-[#333333] text-[#A0A0A0] hover:border-[#FBBF24]"
              }`}
            >
              {exam}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowMobileFilters(false)}
        className="w-full btn-warm py-2.5 rounded-lg text-sm md:hidden uppercase tracking-wider font-bold"
      >
        Apply Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F5F5F5] mb-6">Browse Notes</h1>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
            <input
              type="text"
              placeholder="Search by topic, course code, or chapter name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg input-warm text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden btn-paper p-2.5 rounded-lg"
            >
              <SlidersHorizontal size={18} className="text-[#A0A0A0]" />
            </button>
          </div>
        </div>

        {/* Mobile filters */}
        {showMobileFilters && (
          <div className="md:hidden paper-flat rounded-xl p-5 mb-6 animate-fade-in">
            <FilterSidebar />
          </div>
        )}

        {/* Main grid */}
        <div className="flex gap-6">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="paper-flat rounded-xl p-5 sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <NoteCardSkeleton key={i} />)}
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-16 paper-flat rounded-xl">
                <Search size={40} className="text-[#444444] mx-auto mb-4" />
                <p className="text-[#A0A0A0] font-medium mb-1">No notes found</p>
                <p className="text-sm text-[#6B7280]">Try adjusting your filters or search term</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-[#6B7280] mb-4">
                  Showing {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredNotes.map((note) => <NoteCard key={note.id} note={note} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
