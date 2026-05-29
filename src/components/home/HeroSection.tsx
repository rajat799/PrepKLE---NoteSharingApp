"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Pen } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 px-4 overflow-hidden bg-[#111111]">
      <div className="relative max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Left Content */}
        <div className="flex-1 text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-[#F5F5F5] mb-6 leading-[1.1]">
            Ace your exams with <br />
            <span className="text-[#FBBF24]">shared notes</span>
          </h1>

          <p className="text-lg text-[#A0A0A0] mb-8 max-w-md leading-relaxed">
            PrepKLE is a student-powered notes hub.
            Share, discover, and succeed together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="/browse"
              className="btn-warm inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg text-base"
            >
              <BookOpen size={20} />
              Browse Notes
            </Link>
            <Link
              href="/upload"
              className="btn-outline-warm inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-lg text-base"
            >
              <Pen size={18} />
              Upload Notes
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full border-2 border-[#111111] bg-[#1A1A1A]"></div>
              <div className="w-8 h-8 rounded-full border-2 border-[#111111] bg-[#333333]"></div>
              <div className="w-8 h-8 rounded-full border-2 border-[#111111] bg-[#444444]"></div>
              <div className="w-8 h-8 rounded-full border-2 border-[#111111] bg-[#555555]"></div>
            </div>
            <p className="text-sm text-[#A0A0A0]">
              Trusted by 500+ students across KLE <span className="text-[#FBBF24]">♥</span>
            </p>
          </div>
        </div>

        {/* Right Content - Sketch Notebook Illustration */}
        <div className="flex-1 relative hidden md:block">
          <div className="notebook-frame max-w-md mx-auto aspect-[4/3] flex flex-col justify-center items-center text-center relative rotate-2">
            <div className="absolute -top-6 -right-6 sticky-note px-4 py-2 rotate-6 shadow-xl z-10">
              <span className="hand-font text-2xl font-bold text-[#111111]">PrepKLE</span>
            </div>
            <h3 className="hand-font text-4xl text-[#F5F5F5] mb-2 -rotate-2">
              Share Knowledge.
            </h3>
            <h3 className="hand-font text-4xl text-[#F5F5F5] -rotate-2">
              Inspire <span className="text-[#FBBF24] sketch-underline">Success.</span>
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
}
