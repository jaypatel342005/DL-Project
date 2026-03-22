"use client";

import CountUp from "react-countup";
import { useRef, useState, useEffect } from "react";

type StatItem = {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
};

export default function StatsCounter({ stats }: { stats: StatItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5 w-full"
    >
      {stats.map((stat, i) => (
        <div
          key={i}
          className="relative group text-center py-6 px-4 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/20 transition-all duration-500 hover:bg-slate-900/60 stat-card-shine"
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="text-3xl sm:text-4xl font-bold text-cyan-400 mb-1 tabular-nums">
              {inView ? (
                <CountUp
                  end={stat.value}
                  duration={2}
                  suffix={stat.suffix || ""}
                  decimals={stat.decimals || 0}
                  delay={i * 0.15}
                />
              ) : (
                <span>0{stat.suffix || ""}</span>
              )}
            </div>
            <div className="text-xs sm:text-sm text-slate-500 font-medium uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

