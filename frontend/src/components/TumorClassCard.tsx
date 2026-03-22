"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export type TumorClass = {
  icon: LucideIcon;
  title: string;
  description: string;
  severity: "high" | "medium" | "none";
  gradient: string;
  borderColor: string;
  iconColor: string;
  stats: { label: string; value: string }[];
};

const severityConfig = {
  high: { label: "High Severity", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-400" },
  medium: { label: "Moderate Severity", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-400" },
  none: { label: "No Concern", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-400" },
};

export default function TumorClassCard({ tumor, index }: { tumor: TumorClass; index: number }) {
  const sev = severityConfig[tumor.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative glass-card card-hover-lift rounded-2xl overflow-hidden"
    >
      {/* Top gradient accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${tumor.gradient}`} />

      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl ${tumor.borderColor} border flex items-center justify-center bg-gradient-to-br ${tumor.gradient} group-hover:scale-110 transition-transform duration-300`}>
            <tumor.icon className={`w-6 h-6 ${tumor.iconColor}`} />
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${sev.bg} ${sev.border} border ${sev.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sev.dot} animate-pulse`} />
            {sev.label}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors">
          {tumor.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed font-light mb-5">
          {tumor.description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          {tumor.stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-black/20 rounded-lg px-3 py-2 border border-white/5"
            >
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">{stat.label}</div>
              <div className="text-sm font-semibold text-slate-200">{stat.value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
