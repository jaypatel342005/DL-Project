"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stages = [
  { name: "Conv3×3", type: "conv", channels: 24, layers: 1, detail: "Stem convolution, stride 2" },
  { name: "Fused-MBConv1", type: "fused", channels: 24, layers: 2, detail: "Expansion ratio 1, 3×3 filters" },
  { name: "Fused-MBConv4", type: "fused", channels: 48, layers: 4, detail: "Expansion ratio 4, stride 2" },
  { name: "Fused-MBConv4", type: "fused", channels: 64, layers: 4, detail: "Expansion ratio 4, 3×3 filters" },
  { name: "MBConv4+SE", type: "mbconv", channels: 128, layers: 6, detail: "Squeeze-and-Excitation, stride 2" },
  { name: "MBConv6+SE", type: "mbconv", channels: 160, layers: 9, detail: "Expansion ratio 6, SE attention" },
  { name: "MBConv6+SE", type: "mbconv", channels: 256, layers: 15, detail: "Expansion ratio 6, stride 2" },
  { name: "Conv1×1", type: "conv", channels: 1280, layers: 1, detail: "Head convolution" },
  { name: "Pooling→FC", type: "head", channels: 4, layers: 1, detail: "Global avg pool → 4-class output" },
];

const typeColors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
  conv:   { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-300", glow: "rgba(6,182,212,0.15)" },
  fused:  { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-300", glow: "rgba(59,130,246,0.15)" },
  mbconv: { bg: "bg-violet-500/10", border: "border-violet-500/30", text: "text-violet-300", glow: "rgba(139,92,246,0.15)" },
  head:   { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-300", glow: "rgba(16,185,129,0.15)" },
};

export default function ArchitecturePipeline() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={scrollRef} className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        {[
          { type: "fused", label: "Fused-MBConv" },
          { type: "mbconv", label: "MBConv + SE" },
          { type: "conv", label: "Convolution" },
          { type: "head", label: "Head" },
        ].map((item) => (
          <div key={item.type} className="flex items-center gap-2 text-xs text-slate-400">
            <div className={`w-3 h-3 rounded-sm ${typeColors[item.type].bg} ${typeColors[item.type].border} border`} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Pipeline scroll container */}
      <div className="overflow-x-auto no-scrollbar pb-2">
        <div className="flex items-stretch gap-1.5 min-w-max px-2">
          {stages.map((stage, i) => {
            const color = typeColors[stage.type];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex items-center"
              >
                <div
                  className={`relative group ${color.bg} ${color.border} border rounded-xl px-4 py-3.5 cursor-default hover:scale-105 transition-all duration-300`}
                  style={{ boxShadow: `0 0 20px ${color.glow}` }}
                >
                  {/* Stage name */}
                  <div className={`text-[11px] font-bold ${color.text} mb-1 whitespace-nowrap`}>
                    {stage.name}
                  </div>
                  {/* Channels */}
                  <div className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {stage.channels}ch · {stage.layers}L
                  </div>

                  {/* Tooltip */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 text-[10px] text-slate-300 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                    {stage.detail}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[5px] w-2 h-2 bg-slate-800 border-r border-b border-slate-600 rotate-45" />
                  </div>
                </div>

                {/* Connector arrow */}
                {i < stages.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={inView ? { opacity: 1, scaleX: 1 } : {}}
                    transition={{ duration: 0.3, delay: i * 0.08 + 0.2 }}
                    className="flex items-center mx-0.5 origin-left"
                  >
                    <div className="w-4 h-[2px] bg-gradient-to-r from-slate-600 to-slate-700" />
                    <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-slate-600" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
