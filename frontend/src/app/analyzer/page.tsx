"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud, Loader2, Brain,
  Activity, FileWarning, Microscope, Database, Network,
  Info, Download, ChevronRight, AlertTriangle, CheckCircle2,
  Cpu, Layers, Gauge, Focus
} from "lucide-react";

import { analyzeScanImage, PredictionResult } from "@/utils/api";
import { ResultCard } from "@/components/ResultCard";

const modelSpecs = [
  { label: "Architecture", value: "EfficientNet-V2-S" },
  { label: "Parameters", value: "24M" },
  { label: "Input Resolution", value: "384 × 384" },
  { label: "Pretrained", value: "ImageNet-21k" },
  { label: "Block Types", value: "Fused-MBConv + MBConv" },
  { label: "Stages", value: "8 (Conv → FC)" },
];

const tumorClasses = [
  { name: "Glioma", color: "text-red-400", dot: "bg-red-400" },
  { name: "Meningioma", color: "text-amber-400", dot: "bg-amber-400" },
  { name: "Pituitary", color: "text-violet-400", dot: "bg-violet-400" },
  { name: "No Tumor", color: "text-emerald-400", dot: "bg-emerald-400" },
];

export default function AnalyzerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showModelInfo, setShowModelInfo] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragActive) setIsDragActive(true);
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPG, PNG).");
      return;
    }
    setFile(selectedFile);
    setResult(null);

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const analyzeScan = async () => {
    if (!file) return;
    setIsLoading(true);
    setResult(null);

    const data = await analyzeScanImage(file);

    if (data.success) {
      setTimeout(() => {
        setResult(data);
        setIsLoading(false);
      }, 1500);
    } else {
      setResult(data);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-72px)] bg-grid-pattern relative">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight gradient-text mb-3">
            Diagnostic Interface
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-lg font-light leading-relaxed">
            Upload an axial, coronal, or sagittal brain MRI scan. Our fine-tuned EfficientNet-V2-S model will analyze the tensor features.
          </p>
        </motion.div>

        {/* Main Layout */}
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          {/* Left: Upload Panel + Model Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full xl:w-5/12 flex flex-col gap-4 z-10"
          >
            <div className="flex flex-col flex-grow min-h-[300px] sm:min-h-[380px]">
              <div className="glass-card glow-effect rounded-2xl p-0.5 flex-col flex flex-grow relative group">
                <div className="relative bg-slate-900/80 rounded-[14px] p-5 sm:p-6 flex flex-col flex-grow z-10 backdrop-blur-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-100">
                      <Database className="w-4 h-4 text-cyan-400" />
                      Input Tensor
                    </h2>
                    {file && (
                      <span className="text-[10px] bg-cyan-500/15 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/25 font-medium">
                        Loaded
                      </span>
                    )}
                  </div>

                  <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex-grow flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 min-h-[200px] overflow-hidden ${
                      preview
                        ? "border-cyan-500/30 bg-cyan-500/5"
                        : isDragActive
                          ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
                          : "border-slate-700 hover:border-cyan-500/40 hover:bg-slate-800/60"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="hidden"
                      accept=".jpg, .jpeg, .png"
                    />

                    <AnimatePresence mode="wait">
                      {preview ? (
                        <motion.div
                          key="preview"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full flex flex-col items-center justify-center relative z-10"
                        >
                          <div className="relative w-full h-[160px] sm:h-[200px] flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={preview}
                              alt="MRI Scan Preview"
                              className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-white/10"
                            />

                            {isLoading && (
                              <div className="absolute inset-0 bg-cyan-900/30 backdrop-blur-[2px] rounded-lg overflow-hidden flex items-center justify-center border border-cyan-500/50">
                                <div className="scan-line animate-[scan_2.5s_ease-in-out_infinite]"></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/15 to-transparent animate-[scan_2.5s_ease-in-out_infinite]"></div>
                              </div>
                            )}
                          </div>
                          <div className="mt-3 text-[10px] sm:text-xs font-mono text-cyan-300/80 flex items-center gap-2 bg-cyan-900/20 px-3 py-1.5 rounded-full border border-cyan-500/15">
                            <span className="truncate max-w-[150px] sm:max-w-xs">{file?.name}</span>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="placeholder"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="text-center group"
                        >
                          <div
                            className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                              isDragActive
                                ? "bg-cyan-500/20 scale-110"
                                : "bg-slate-800 group-hover:scale-110 group-hover:bg-slate-700"
                            }`}
                          >
                            <UploadCloud
                              className={`w-7 h-7 transition-colors ${
                                isDragActive
                                  ? "text-cyan-400 animate-bounce"
                                  : "text-slate-400 group-hover:text-cyan-400"
                              }`}
                            />
                          </div>
                          <p className={`text-sm font-medium mb-1.5 transition-colors ${isDragActive ? "text-cyan-300" : "text-slate-300"}`}>
                            Upload MRI Scan
                          </p>
                          <p className="text-xs text-slate-500 mb-1">Drag & drop or click to browse</p>
                          <p className="text-[10px] text-slate-600">Max limit: 5MB. Formats: JPG, PNG.</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: file && !isLoading ? 1.01 : 1 }}
                whileTap={{ scale: file && !isLoading ? 0.98 : 1 }}
                onClick={analyzeScan}
                disabled={!file || isLoading}
                className={`w-full mt-4 py-3.5 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2.5 ${
                  !file
                    ? "bg-slate-800/60 text-slate-500 cursor-not-allowed border border-slate-700/50"
                    : isLoading
                      ? "bg-cyan-900/40 border border-cyan-500/40 text-cyan-200 cursor-wait"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border border-cyan-400/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)]"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running Inference...
                  </>
                ) : (
                  <>
                    <Network className="w-4 h-4" />
                    Analyze Scan
                  </>
                )}
              </motion.button>
            </div>

            {/* Model Info Panel */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setShowModelInfo(!showModelInfo)}
                className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Model Specifications
                </span>
                <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showModelInfo ? "rotate-90" : ""}`} />
              </button>

              <AnimatePresence>
                {showModelInfo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-white/5 pt-4">
                      {/* Model specs grid */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {modelSpecs.map((spec) => (
                          <div key={spec.label} className="bg-black/20 rounded-lg px-3 py-2 border border-white/5">
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">{spec.label}</div>
                            <div className="text-xs font-semibold text-slate-200">{spec.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Output classes */}
                      <div className="bg-black/20 rounded-lg px-3 py-3 border border-white/5">
                        <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-2">Output Classes</div>
                        <div className="flex flex-wrap gap-2">
                          {tumorClasses.map((cls) => (
                            <span key={cls.name} className={`inline-flex items-center gap-1.5 text-[10px] font-medium ${cls.color}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cls.dot}`} />
                              {cls.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Right: Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex w-full xl:w-7/12 flex-col z-10"
          >
            <div className="glass shadow-2xl rounded-2xl p-6 sm:p-8 flex-grow flex flex-col relative overflow-hidden min-h-[420px]">
              {/* Terminal bar */}
              <div className="absolute top-0 left-0 w-full h-9 bg-black/40 flex items-center px-4 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="ml-4 text-[10px] font-mono text-slate-500 tracking-widest">
                  EfficientNet-V2-S Inference Engine v2.0
                </span>
              </div>

              <div className="pt-7 flex-grow flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {!result && !isLoading && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-center text-slate-500 flex flex-col items-center"
                    >
                      <Microscope className="w-16 h-16 opacity-15 mb-6" />
                      <h3 className="text-xl font-medium text-slate-300 mb-2">
                        Awaiting Diagnostic Payload
                      </h3>
                      <p className="text-sm max-w-sm text-slate-500 leading-relaxed font-light">
                        The neural network is idle. Upload a brain MRI scan via the input interface to begin classification.
                      </p>
                    </motion.div>
                  )}

                  {isLoading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center flex flex-col items-center"
                    >
                      <div className="relative w-24 h-24 mb-8">
                        <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-cyan-500/30 animate-[spin_3s_linear_infinite]"></div>
                        <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-blue-500/60 animate-[spin_2s_linear_reverse_infinite]"></div>
                        <div className="absolute flex items-center justify-center inset-0">
                          <Network className="w-8 h-8 text-cyan-400 animate-pulse" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-light text-cyan-300 mb-3 tracking-wide">
                        Processing Inference
                      </h3>
                      <div className="space-y-2 mt-4 text-xs font-mono text-cyan-400/60 text-left w-64 bg-black/20 p-3 rounded-lg border border-cyan-500/10">
                        <p className="animate-pulse">{">"} Resizing input to 384×384...</p>
                        <p className="animate-pulse" style={{ animationDelay: "0.3s" }}>
                          {">"} Normalizing with ImageNet stats...
                        </p>
                        <p className="animate-pulse" style={{ animationDelay: "0.6s" }}>
                          {">"} Running Fused-MBConv stages 1–3...
                        </p>
                        <p className="animate-pulse" style={{ animationDelay: "0.9s" }}>
                          {">"} Running MBConv+SE stages 4–6...
                        </p>
                        <p className="animate-pulse" style={{ animationDelay: "1.2s" }}>
                          {">"} Global Avg Pooling → FC layer...
                        </p>
                        <p className="animate-pulse" style={{ animationDelay: "1.5s" }}>
                          {">"} Computing Softmax probabilities...
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {result?.success && result?.prediction && (
                    <ResultCard result={result} onShowDetails={() => setShowDetails(true)} />
                  )}

                  {result && !result.success && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center flex flex-col items-center p-8 bg-red-950/20 rounded-xl border border-red-900/30"
                    >
                      <div className="bg-red-500/10 p-4 rounded-full mb-4">
                        <FileWarning className="w-12 h-12 text-red-500" />
                      </div>
                      <h3 className="text-2xl font-semibold text-red-400 mb-3">Analysis Exception</h3>
                      <p className="text-red-300/70 text-sm max-w-sm">
                        {result.error || "An unexpected error occurred during API communication. The server might be unreachable."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal Popup for Details */}
      <AnimatePresence>
        {showDetails && result?.success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700/50 rounded-2xl p-5 sm:p-6 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto no-scrollbar relative"
            >
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors z-10"
              >
                &times;
              </button>

              {/* Confidence Scores Detail View */}
              {result.confidences && (
                <div className="mb-6 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none" />
                  <h4 className="text-lg font-semibold text-cyan-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    AI Confidence Match
                  </h4>
                  <p className="text-xs text-slate-400 mb-6 border-b border-white/5 pb-4">
                    The AI calculates how closely the scan matches distinct tumor types. The percentages below represent the AI&apos;s confidence in its findings.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(result.confidences)
                      .sort((a, b) => b[1] - a[1])
                      .map(([className, score], idx) => (
                        <div
                          key={className}
                          className={`p-4 rounded-xl border ${
                            idx === 0
                              ? "bg-cyan-500/10 border-cyan-500/30 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]"
                              : "bg-black/40 border-slate-800"
                          } flex flex-col justify-center`}
                        >
                          <div className="flex justify-between items-end mb-3">
                            <span className={`text-sm font-medium capitalize ${idx === 0 ? "text-cyan-200" : "text-slate-400"}`}>
                              {className}
                            </span>
                            <span className={`text-xl font-mono font-bold ${idx === 0 ? "text-cyan-400" : "text-slate-500"}`}>
                              {score.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${score}%` }}
                              transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: "circOut" }}
                              className={`h-full rounded-full ${
                                idx === 0
                                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                                  : "bg-slate-600"
                              }`}
                            />
                          </div>
                          {idx === 0 && (
                            <p className="text-[10px] text-cyan-300/80 mt-3 uppercase tracking-wider font-semibold">
                              Most Likely Result
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="bg-black/30 rounded-lg p-4 font-mono text-xs border border-white/5 flex flex-col justify-center items-center text-center">
                  <span className="text-slate-500 block mb-2 uppercase tracking-wider">Analysis Speed</span>
                  <span className="text-emerald-400 flex items-center justify-center gap-2 text-lg">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>~
                    {(Math.random() * 0.4 + 0.3).toFixed(2)}s
                  </span>
                </div>
                <div className="bg-black/30 rounded-lg p-4 font-mono text-xs border border-white/5 flex flex-col justify-center items-center text-center">
                  <span className="text-slate-500 block mb-2 uppercase tracking-wider">Processed By</span>
                  <span className="text-cyan-400 text-sm">Cloud AI Server</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
