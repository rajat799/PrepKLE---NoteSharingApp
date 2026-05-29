"use client";

import { useEffect, useRef, useState } from "react";
import { ReactNode } from "react";

interface CounterProps {
  end: number;
  label: string;
  icon: ReactNode;
}

export function Counter({ end, label, icon }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const increment = end / 40;
          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 30);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="paper-flat rounded-xl p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[#2A2111] mb-4">
        <div className="text-[#FBBF24]">{icon}</div>
      </div>
      <div className="text-3xl md:text-4xl font-bold text-[#F5F5F5] hand-font">
        {count}+
      </div>
      <p className="text-[#A0A0A0] text-sm mt-1 font-medium">{label}</p>
    </div>
  );
}
