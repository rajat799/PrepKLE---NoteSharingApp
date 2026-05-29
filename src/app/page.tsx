"use client";
import "@/lib/firebase";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { getStats } from "@/lib/firestore";
import { useEffect, useState } from "react";
import { BookOpen, Search, CheckCircle, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalBranches: 0,
    totalSubjects: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: BookOpen,
      title: "Curated Notes",
      description: "Only quality notes approved by admins reach your study desk.",
      color: "#FBBF24",
    },
    {
      icon: Search,
      title: "Easy Search",
      description: "Find notes by branch, semester, and subject in seconds.",
      color: "#60A5FA",
    },
    {
      icon: Heart,
      title: "Student Powered",
      description: "Built by KLE students, for KLE students. Share and grow together.",
      color: "#F87171",
    },
  ];

  const steps = [
    { num: "01", title: "Upload Notes", desc: "Share your best study materials" },
    { num: "02", title: "Admin Review", desc: "Quality ensured by approval" },
    { num: "03", title: "Discover & Learn", desc: "Find what you need, fast" },
  ];

  return (
    <div>
      <HeroSection />

      {!loading && <StatsSection {...stats} />}

      {/* Features Section */}
      <section className="py-16 px-4 bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              Why PrepKLE?
            </h2>
            <p className="text-[#A0A0A0]">
              Everything you need to ace your engineering journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="paper-card rounded-xl p-7 text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5"
                  style={{ background: `${feature.color}15` }}
                >
                  <feature.icon size={26} style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#F5F5F5] mb-2">
              How It Works
            </h2>
            <p className="text-[#A0A0A0]">Three simple steps to shared knowledge</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center relative">
                {/* Connecting dashes on desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] right-[-40%] border-t-2 border-dashed border-[#333333]" />
                )}

                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#2A2111] border-2 border-[#FBBF24]/30 mb-4 relative z-10">
                  <span className="hand-font text-2xl font-bold text-[#FBBF24]">{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5] mb-1">{step.title}</h3>
                <p className="text-sm text-[#A0A0A0]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="sticky-note rounded-xl p-10 text-center">
            <h2 className="hand-font text-3xl font-bold text-[#111111] mb-3">
              Ready to get started?
            </h2>
            <p className="text-[#111111]/80 mb-6">
              Join your fellow engineers and start sharing knowledge today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/browse"
                className="btn-warm inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm"
              >
                Start Browsing <ArrowRight size={16} />
              </Link>
              <Link
                href="/upload"
                className="border-2 border-[#111111] text-[#111111] font-bold hover:bg-[#111111] hover:text-[#FBBF24] inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm transition-colors"
              >
                Upload Notes <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#333333] py-8 px-4 bg-[#111111]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="hand-font text-2xl font-bold tracking-tight text-[#F5F5F5]">
              Prep<span className="text-[#FBBF24]">KLE</span>
            </span>
          </Link>
          <p className="text-[#6B7280] text-sm text-center">
            © 2026 PrepKLE. Hand-crafted for learners.
          </p>
          <div className="flex items-center gap-6 text-sm text-[#A0A0A0]">
            <span className="hover:text-[#FBBF24] cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-[#FBBF24] cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-[#FBBF24] cursor-pointer transition-colors">Feedback</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
