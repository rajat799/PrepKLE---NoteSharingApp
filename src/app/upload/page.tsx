"use client";

import { useState } from "react";
import { uploadNote } from "@/lib/firestore";
import { uploadPdfToStorage } from "@/lib/storage";
import { Upload, FileText, Check, CloudUpload } from "lucide-react";
import { BRANCHES, getSemesters, getCourses, NOTE_TYPES, EXAM_TYPES } from "@/lib/constants";

export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    branch: "",
    semester: "",
    courseCode: "",
    courseName: "",
    description: "",
    noteType: "",
    examType: "",
  });

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Derived data
  const semesters = formData.branch ? getSemesters(formData.branch) : [];
  const courses = formData.branch && formData.semester
    ? getCourses(formData.branch, formData.semester)
    : [];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      // Reset dependent fields
      if (name === "branch") {
        next.semester = "";
        next.courseCode = "";
        next.courseName = "";
      }
      if (name === "semester") {
        next.courseCode = "";
        next.courseName = "";
      }
      return next;
    });
  };

  const handleCourseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    const course = courses.find((c) => c.name === name);
    setFormData((prev) => ({
      ...prev,
      courseCode: course?.code || "",
      courseName: name,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      if (file.size > 50 * 1024 * 1024) {
        setPdfFile(null);
        setError("PDF file is too large (max 50MB).");
        return;
      }
      setPdfFile(file);
      setError(null);
    } else {
      setPdfFile(null);
      setError("Please upload a valid PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.branch || !formData.semester || !formData.courseName || !formData.noteType || !pdfFile) {
      setError("Please fill in all required fields and upload a PDF");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const pdfUrl = await uploadPdfToStorage(pdfFile, (percent) => {
        setUploadProgress(percent);
      });

      await uploadNote({
        title: formData.title,
        branch: formData.branch,
        semester: formData.semester,
        subject: formData.courseName,
        courseCode: formData.courseCode,
        description: formData.description,
        noteType: formData.noteType,
        examType: formData.examType,
        pdfUrl,
        tags: [], // legacy field
      });

      setSuccess(true);
      setFormData({
        title: "", branch: "", semester: "", courseCode: "", courseName: "",
        description: "", noteType: "", examType: "",
      });
      setPdfFile(null);
      setUploadProgress(0);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload notes: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F5F5F5] mb-2">Upload Notes</h1>
        <p className="text-[#A0A0A0] text-sm mb-8">
          Share your best study materials. Your submission will be reviewed before publishing.
        </p>

        {success && (
          <div className="mb-6 rounded-xl p-5 flex items-center gap-4 bg-[#0D2C1A] border border-[#164A2C]">
            <Check className="text-[#4ADE80]" size={22} />
            <div>
              <h3 className="font-bold text-[#4ADE80]">Upload Successful!</h3>
              <p className="text-[#4ADE80] text-sm">
                Your notes will be published after admin approval.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl p-4 text-[#F87171] bg-[#360C15] border border-[#5E1524] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="paper-flat rounded-xl p-6 md:p-8 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
              Chapter name *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Ch1 Linked Lists"
              className="w-full p-3 rounded-lg input-warm text-sm"
              required
            />
          </div>

          {/* Branch & Semester side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
                Select Branch *
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg select-warm text-sm"
                required
              >
                <option value="">Select Branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
                Select Semester *
              </label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                className="w-full p-3 rounded-lg select-warm text-sm disabled:opacity-40"
                required
                disabled={!formData.branch}
              >
                <option value="">{formData.branch ? "Select Semester" : "Select branch first"}</option>
                {semesters.map((s) => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Course — single dropdown that shows code + name */}
          <div>
            <label className="block text-xs font-bold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
              Select Course *
            </label>
            <select
              value={formData.courseName}
              onChange={handleCourseSelect}
              className="w-full p-3 rounded-lg select-warm text-sm disabled:opacity-40"
              required
              disabled={!formData.semester}
            >
              <option value="">
                {!formData.branch
                  ? "Select branch first"
                  : !formData.semester
                  ? "Select semester first"
                  : courses.length === 0
                  ? "No courses available"
                  : "Select Course"}
              </option>
              {courses.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} {c.code ? `(${c.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Note Type */}
          <div>
            <label className="block text-xs font-bold text-[#A0A0A0] mb-2 uppercase tracking-wider">
              Note Type *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {NOTE_TYPES.map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                    formData.noteType === type
                      ? "bg-[#2A2111] border-[#FBBF24] text-[#F5F5F5] font-semibold"
                      : "bg-[#1A1A1A] border-[#333333] text-[#A0A0A0] hover:border-[#FBBF24] hover:bg-[#111111]"
                  }`}
                >
                  <input
                    type="radio"
                    name="noteType"
                    value={type}
                    checked={formData.noteType === type}
                    onChange={handleInputChange}
                    className="accent-[#FBBF24]"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Exam Type */}
          <div>
            <label className="block text-xs font-bold text-[#A0A0A0] mb-2 uppercase tracking-wider">
              Exam Type
            </label>
            <div className="flex flex-wrap gap-2">
              {EXAM_TYPES.map((exam) => (
                <button
                  key={exam}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      examType: prev.examType === exam ? "" : exam,
                    }))
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                    formData.examType === exam
                      ? "bg-[#2A2111] border-[#FBBF24] text-[#F5F5F5]"
                      : "bg-[#1A1A1A] border-[#333333] text-[#A0A0A0] hover:border-[#FBBF24]"
                  }`}
                >
                  {exam}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Briefly describe what these notes cover..."
              rows={3}
              className="w-full p-3 rounded-lg input-warm text-sm resize-none"
            />
          </div>

          {/* Drag & Drop upload */}
          <div>
            <label className="block text-xs font-bold text-[#A0A0A0] mb-1.5 uppercase tracking-wider">
              Upload PDF *
            </label>
            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              pdfFile
                ? "border-[#4ADE80] bg-[#0D2C1A]"
                : "border-[#444444] hover:border-[#FBBF24] hover:bg-[#2A2111]"
            }`}>
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" required />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  {pdfFile ? (
                    <>
                      <FileText size={32} className="text-[#4ADE80]" />
                      <p className="font-bold text-[#F5F5F5]">{pdfFile.name}</p>
                      <p className="text-sm text-[#A0A0A0]">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <CloudUpload size={36} className="text-[#6B7280]" />
                      <p className="hand-font text-xl font-bold text-[#F5F5F5]">Drag & Drop</p>
                      <p className="text-sm text-[#6B7280]">or click to browse files</p>
                      <p className="text-xs text-[#444444]">PDF (Max 50MB)</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Progress */}
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#A0A0A0]">
                <span>Uploading PDF...</span>
                <span className="font-medium text-[#FBBF24]">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#333333] rounded-full h-2">
                <div
                  className="bg-[#FBBF24] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-warm py-3 rounded-lg text-sm flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-wider font-bold"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload Notes
              </>
            )}
          </button>

          <p className="text-center text-xs text-[#6B7280]">
            By uploading, you agree that your notes will be publicly shared under PrepKLE.
          </p>
        </form>
      </div>
    </div>
  );
}
