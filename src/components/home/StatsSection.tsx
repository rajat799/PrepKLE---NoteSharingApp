"use client";

import { Counter } from "@/components/common/Counter";
import { FileText, GitBranch, BookMarked } from "lucide-react";

interface StatsProps {
  totalNotes: number;
  totalBranches: number;
  totalSubjects: number;
  recentUploads: number;
}

export function StatsSection({
  totalNotes,
  totalBranches,
  totalSubjects,
  recentUploads,
}: StatsProps) {
  return (
    <section className="py-8 px-4 bg-[#111111]">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-2xl p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#333333]">
            
            <div className="flex items-center justify-center gap-4 px-4">
              <div className="w-12 h-12 rounded-xl bg-[#2A2111] border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24]">
                <FileText size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalNotes}</div>
                <div className="text-sm text-[#A0A0A0]">Notes</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 px-4">
              <div className="w-12 h-12 rounded-xl bg-[#2A2111] border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24]">
                <GitBranch size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalBranches}</div>
                <div className="text-sm text-[#A0A0A0]">Branches</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 px-4">
              <div className="w-12 h-12 rounded-xl bg-[#2A2111] border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24]">
                <BookMarked size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{totalSubjects}</div>
                <div className="text-sm text-[#A0A0A0]">Subjects</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 px-4">
              <div className="w-12 h-12 rounded-xl bg-[#2A2111] border border-[#FBBF24]/30 flex items-center justify-center text-[#FBBF24]">
                <FileText size={24} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{recentUploads}</div>
                <div className="text-sm text-[#A0A0A0]">Uploads this week</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
