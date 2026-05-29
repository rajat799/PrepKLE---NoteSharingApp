"use client";

import { useState, useEffect } from "react";
import { getPendingNotes, approveNote, rejectNote, getApprovedNotes, getSubAdmins, addSubAdmin, removeSubAdmin } from "@/lib/firestore";
import { signInWithGoogle, logOut } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Note, Admin, toJsDate } from "@/lib/types";
import { Trash2, Check, X, LogIn, LogOut, Shield, Eye, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/common/Toast";

export default function AdminPanel() {
  const { user, isAdmin, isMainAdmin, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<"pending" | "approved" | "admins">("pending");
  const [pendingNotes, setPendingNotes] = useState<Note[]>([]);
  const [approvedNotes, setApprovedNotes] = useState<Note[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const fetchData = async () => {
    try {
      const [pending, approved, subAdmins] = await Promise.all([
        getPendingNotes(),
        getApprovedNotes(),
        isMainAdmin ? getSubAdmins() : Promise.resolve([])
      ]);
      setPendingNotes(pending);
      setApprovedNotes(approved);
      if (isMainAdmin) setAdmins(subAdmins);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !user?.email) return;
    try {
      await addSubAdmin(newAdminEmail, user.email);
      setNewAdminEmail("");
      showToast("Sub-admin added!", "success");
      fetchData();
    } catch (error) {
      console.error("Failed to add sub-admin:", error);
      showToast("Failed to add sub-admin", "error");
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} as a sub-admin?`)) return;
    try {
      await removeSubAdmin(email);
      showToast("Sub-admin removed", "info");
      fetchData();
    } catch (error) {
      console.error("Failed to remove sub-admin:", error);
      showToast("Failed to remove sub-admin", "error");
    }
  };

  const handleApprove = async (noteId: string) => {
    try {
      await approveNote(noteId);
      setPendingNotes((prev) => prev.filter((n) => n.id !== noteId));
      showToast("Note approved!", "success");
      fetchData();
    } catch (error) {
      console.error("Failed to approve note:", error);
      showToast("Failed to approve note", "error");
    }
  };

  const handleReject = async (noteId: string) => {
    if (!confirm("Are you sure you want to reject/delete this note?")) return;
    try {
      await rejectNote(noteId);
      setPendingNotes((prev) => prev.filter((n) => n.id !== noteId));
      setApprovedNotes((prev) => prev.filter((n) => n.id !== noteId));
      showToast("Note rejected", "info");
      fetchData();
    } catch (error) {
      console.error("Failed to reject note:", error);
      showToast("Failed to reject note", "error");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FBBF24]/30 border-t-[#FBBF24] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="paper-flat rounded-xl p-10 w-full max-w-md text-center animate-fade-in">
          <Shield size={40} className="text-[#FBBF24] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2">Admin Panel</h1>
          <p className="text-[#A0A0A0] mb-8 text-sm">Sign in with your authorized Google account.</p>
          <button onClick={() => signInWithGoogle()} className="w-full btn-warm flex items-center justify-center gap-2 py-3 rounded-lg">
            <LogIn size={18} /> Sign in with Google
          </button>
          <p className="text-xs text-[#6B7280] mt-6">Only authorized admin accounts can access this panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="paper-flat rounded-xl p-10 w-full max-w-md text-center animate-fade-in">
          <X size={40} className="text-[#F87171] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#F5F5F5] mb-2">Access Denied</h1>
          <p className="text-[#A0A0A0] mb-2 text-sm">Signed in as <strong>{user.email}</strong></p>
          <p className="text-[#6B7280] mb-8 text-sm">This account does not have admin privileges.</p>
          <button onClick={() => logOut()} className="w-full py-3 rounded-lg bg-[#360C15] border border-[#5E1524] text-[#F87171] font-semibold text-sm hover:bg-[#5E1524] transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#F5F5F5] flex items-center gap-2">
              <Shield size={24} className="text-[#FBBF24]" />
              Admin Panel
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">Signed in as {user.email}</p>
          </div>
          <button onClick={() => logOut()} className="flex items-center gap-2 py-2 px-5 rounded-lg bg-[#360C15] border border-[#5E1524] text-[#F87171] text-sm font-medium hover:bg-[#5E1524] transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setTab("pending")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "pending"
              ? "bg-[#2A2111] border-2 border-[#FBBF24] text-[#F5F5F5]"
              : "paper-flat text-[#A0A0A0] hover:text-[#F5F5F5]"
              }`}
          >
            <Clock size={16} /> Pending ({pendingNotes.length})
          </button>
          <button
            onClick={() => setTab("approved")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "approved"
              ? "bg-[#0D2C1A] border-2 border-[#4ADE80] text-[#F5F5F5]"
              : "paper-flat text-[#A0A0A0] hover:text-[#F5F5F5]"
              }`}
          >
            <CheckCircle size={16} /> Approved ({approvedNotes.length})
          </button>
          {isMainAdmin && (
            <button
              onClick={() => setTab("admins")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === "admins"
                ? "bg-[#0F2942] border-2 border-[#60A5FA] text-[#F5F5F5]"
                : "paper-flat text-[#A0A0A0] hover:text-[#F5F5F5]"
                }`}
            >
              <Shield size={16} /> Admins
            </button>
          )}
        </div>

        {/* Content */}
        {tab === "admins" && isMainAdmin ? (
          <div className="space-y-6 animate-fade-in">
            <div className="paper-flat rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">Add Sub-Admin</h2>
              <form onSubmit={handleAddAdmin} className="flex gap-3">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 input-dark"
                  required
                />
                <button type="submit" className="btn-warm py-2 px-6 rounded-lg whitespace-nowrap">
                  Add Admin
                </button>
              </form>
            </div>

            <div className="paper-flat rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">Current Sub-Admins</h2>
              {admins.length === 0 ? (
                <p className="text-[#A0A0A0] text-sm py-4">No sub-admins added yet.</p>
              ) : (
                <div className="space-y-3">
                  {admins.map((admin) => (
                    <div key={admin.email} className="flex items-center justify-between p-4 rounded-lg bg-[#1A1A1A] border border-[#333333]">
                      <div>
                        <p className="font-medium text-[#F5F5F5]">{admin.email}</p>
                        <p className="text-xs text-[#6B7280]">Added by {admin.addedBy} on {toJsDate(admin.createdAt).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveAdmin(admin.email)}
                        className="p-2 text-[#F87171] hover:bg-[#360C15] rounded-lg transition-colors"
                        title="Remove Sub-Admin"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : tab === "pending" ? (
          <div className="space-y-4">
            {pendingNotes.length === 0 ? (
              <div className="text-center py-16 paper-flat rounded-xl">
                <Clock size={32} className="text-[#444444] mx-auto mb-3" />
                <p className="text-[#A0A0A0]">No pending notes to review</p>
              </div>
            ) : (
              pendingNotes.map((note) => (
                <div key={note.id} className="paper-flat rounded-xl p-6 animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="badge-type bg-[#2A2111] text-[#FDE047] border border-[#5E440D]">PENDING</span>
                        <span className="text-sm text-[#6B7280]">{note.branch} • Sem {note.semester} • {note.subject}</span>
                        {note.courseCode && <span className="text-xs font-mono text-[#FDE047] bg-[#1A1A1A] px-2 py-0.5 rounded">{note.courseCode}</span>}
                      </div>
                      <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">{note.title}</h3>
                      <p className="text-[#A0A0A0] mb-3 text-sm">{note.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {note.noteType && <span className="badge-type bg-[#0F2942] text-[#60A5FA] border border-[#18406B]">{note.noteType}</span>}
                        {note.examType && <span className="badge-type bg-[#362708] text-[#FDE047] border border-[#5E440D]">{note.examType}</span>}
                        {note.tags && note.tags.length > 0 && note.tags.map((tag) => <span key={tag} className="tag-sketch text-xs">#{tag}</span>)}
                      </div>
                      <p className="text-xs text-[#6B7280]">Uploaded: {toJsDate(note.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {note.pdfUrl && (
                        <button onClick={() => window.open(note.pdfUrl, "_blank")} className="btn-warm flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm">
                          <Eye size={16} /> View PDF
                        </button>
                      )}
                      <button onClick={() => handleApprove(note.id)} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-[#0D2C1A] border border-[#164A2C] text-[#4ADE80] hover:bg-[#164A2C] transition-colors">
                        <Check size={16} /> Approve
                      </button>
                      <button onClick={() => handleReject(note.id)} className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold bg-[#360C15] border border-[#5E1524] text-[#F87171] hover:bg-[#5E1524] transition-colors">
                        <X size={16} /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {approvedNotes.length === 0 ? (
              <div className="text-center py-16 paper-flat rounded-xl">
                <CheckCircle size={32} className="text-[#444444] mx-auto mb-3" />
                <p className="text-[#A0A0A0]">No approved notes yet</p>
              </div>
            ) : (
              approvedNotes.map((note) => (
                <div key={note.id} className="paper-flat rounded-xl p-6 animate-fade-in">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <span className="badge-type bg-[#0D2C1A] text-[#4ADE80] border border-[#164A2C]">APPROVED</span>
                        <span className="text-sm text-[#6B7280]">{note.branch} • Sem {note.semester} • {note.subject}</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#F5F5F5] mb-2">{note.title}</h3>
                      <Link href={`/notes/${note.id}`} className="text-[#FBBF24] hover:underline text-sm font-medium">
                        View on Platform →
                      </Link>
                    </div>
                    <button onClick={() => handleReject(note.id)} className="flex items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold bg-[#360C15] border border-[#5E1524] text-[#F87171] hover:bg-[#5E1524] transition-colors">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
