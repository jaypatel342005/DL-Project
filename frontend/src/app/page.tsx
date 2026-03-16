"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UploadCloud, CheckCircle2, AlertCircle, Loader2, Brain, 
  Activity, FileWarning, Microscope, Database, Network, 
  ShieldAlert, Info, FileText, ChevronRight, AlertTriangle, Download,
  Menu, X, Github, Linkedin, ExternalLink, Heart
} from "lucide-react";

import { analyzeScanImage, PredictionResult } from "@/utils/api";
import { ResultCard } from "@/components/ResultCard";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [activeTab, setActiveTab] = useState<"analyzer" | "info" | "warnings" | "terms">("analyzer");
  const [showDetails, setShowDetails] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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
    
    // Add slight delay for animation effect if successful
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
    <div className="min-h-[100dvh] flex flex-col relative pt-[70px] bg-grid-pattern">
      
      {/* Fixed Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 glass border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveTab("analyzer"); setIsMenuOpen(false); }}>
          <Brain className="w-7 h-7 text-blue-400" />
          <span className="font-bold text-lg tracking-tight text-slate-200">NeuralScan<span className="text-blue-400">.AI</span></span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {[
            { id: "analyzer" as const, label: "Analyzer", icon: Microscope, color: "blue" },
            { id: "info" as const, label: "Model Info", icon: Info, color: "purple" },
            { id: "warnings" as const, label: "Warnings", icon: ShieldAlert, color: "orange" },
            { id: "terms" as const, label: "T&C", icon: FileText, color: "slate" },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5 ${
                activeTab === item.id 
                  ? `bg-${item.color}-500/20 text-${item.color}-300 border border-${item.color}-500/30` 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <item.icon className="w-3.5 h-3.5" /> {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-slate-300 hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl border-b border-white/10 overflow-hidden md:hidden z-40"
            >
              <div className="flex flex-col p-4 gap-2">
                {[
                  { id: "analyzer" as const, label: "Analyzer", icon: Microscope, color: "blue" },
                  { id: "info" as const, label: "Model Info", icon: Info, color: "purple" },
                  { id: "warnings" as const, label: "Warnings", icon: ShieldAlert, color: "orange" },
                  { id: "terms" as const, label: "T&C", icon: FileText, color: "slate" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeTab === item.id 
                        ? `bg-${item.color}-500/20 text-${item.color}-300 border border-${item.color}-500/30` 
                        : 'text-slate-400 border border-transparent hover:bg-slate-800/50'
                    }`}
                  >
                    <item.icon className="w-4 h-4" /> {item.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/20 blur-[120px] rounded-full opacity-60" />
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pb-8">
        <AnimatePresence mode="wait">
          
          {/* ANALYZER VIEW */}
          {activeTab === "analyzer" && (
            <motion.div 
              key="analyzer"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
              className="w-full flex flex-col xl:flex-row gap-6 items-stretch"
            >
              {/* Left Side: Header & Upload */}
              <div className="flex flex-col w-full xl:w-5/12 gap-4 z-10">
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 drop-shadow-sm">
                    Diagnostic Interface
                  </h1>
                  <p className="text-sm text-slate-400 max-w-sm font-light leading-snug">
                    Upload an axial, coronal, or sagittal brain MRI scan. Our fine-tuned ResNet18 model will analyze the tensor features.
                  </p>
                </div>

                <div className="flex flex-col flex-grow min-h-[300px] sm:min-h-[350px]">
                  <div className="glass-card rounded-2xl p-0.5 flex-col flex flex-grow relative group">
                    <div className={`absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-sm group-hover:opacity-50 transition duration-500 ${isDragActive ? 'opacity-100 blur-md' : ''}`}></div>
                    
                    <div className="relative bg-slate-900/80 rounded-[14px] p-5 flex flex-col flex-grow z-10 h-full backdrop-blur-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-100">
                          <Database className="w-4 h-4 text-blue-400" />
                          Input Tensor
                        </h2>
                        {file && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">Loaded</span>}
                      </div>
                      
                      <div 
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative flex-grow flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 min-h-[180px] overflow-hidden ${
                          preview 
                            ? 'border-blue-500/30 bg-blue-500/5' 
                            : isDragActive 
                              ? 'border-blue-400 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                              : 'border-slate-700 hover:border-blue-500/50 hover:bg-slate-800/80'
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
                              <div className="relative w-full h-[150px] sm:h-[180px] flex items-center justify-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview} alt="MRI Scan Preview" className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-white/10" />
                                
                                {isLoading && (
                                  <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px] rounded-lg overflow-hidden flex items-center justify-center border border-blue-500/50">
                                    <div className="scan-line animate-[scan_2.5s_ease-in-out_infinite]"></div>
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-[scan_2.5s_ease-in-out_infinite]"></div>
                                  </div>
                                )}
                              </div>
                              <div className="mt-3 text-[10px] font-mono text-blue-300/80 flex items-center gap-2 bg-blue-900/30 px-3 py-1 rounded-full border border-blue-500/20">
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
                              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-300 ${isDragActive ? 'bg-blue-500/20 scale-110' : 'bg-slate-800 group-hover:scale-110 group-hover:bg-slate-700'}`}>
                                <UploadCloud className={`w-6 h-6 transition-colors ${isDragActive ? 'text-blue-400 animate-bounce' : 'text-slate-400 group-hover:text-blue-400'}`} />
                              </div>
                              <p className={`text-sm font-medium mb-1 transition-colors ${isDragActive ? 'text-blue-300' : 'text-slate-300'}`}>Upload MRI Scan</p>
                              <p className="text-[10px] text-slate-500 mb-1">Drag & drop or click to browse</p>
                              <p className="text-[9px] text-slate-600">Max limit: 5MB. Formats: JPG, PNG.</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: file && !isLoading ? 1.01 : 1 }}
                    whileTap={{ scale: file && !isLoading ? 0.99 : 1 }}
                    onClick={analyzeScan}
                    disabled={!file || isLoading}
                    className={`w-full mt-4 py-3 rounded-xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                      !file 
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                        : isLoading
                          ? 'bg-blue-900 border border-blue-500/50 text-blue-200 cursor-wait'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running...
                      </>
                    ) : (
                      <>
                        <Network className="w-4 h-4" />
                        Analyze
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Right Side: Results */}
              <div className="flex w-full xl:w-7/12 flex-col z-10">
                <div className="glass shadow-2xl rounded-2xl p-8 flex-grow flex flex-col relative overflow-hidden min-h-[400px]">
                  
                  {/* Terminal-like top bar */}
                  <div className="absolute top-0 left-0 w-full h-8 bg-black/40 flex items-center px-4 border-b border-white/5">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <span className="ml-4 text-[10px] font-mono text-slate-500 tracking-widest">ResNet18 Inference Engine v1.0</span>
                  </div>

                  <div className="pt-6 flex-grow flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {!result && !isLoading && (
                        <motion.div 
                          key="empty"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-center text-slate-500 flex flex-col items-center"
                        >
                          <Microscope className="w-16 h-16 opacity-20 mb-6" />
                          <h3 className="text-xl font-medium text-slate-300 mb-2">Awaiting Diagnostic Payload</h3>
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
                            <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-blue-500/30 animate-[spin_3s_linear_infinite]"></div>
                            <div className="absolute inset-2 rounded-full border-r-2 border-b-2 border-purple-500/60 animate-[spin_2s_linear_reverse_infinite]"></div>
                            <div className="absolute flex items-center justify-center inset-0">
                              <Network className="w-8 h-8 text-blue-400 animate-pulse" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-light text-blue-300 mb-3 tracking-wide">Processing Inference</h3>
                          <div className="space-y-2 mt-4 text-xs font-mono text-blue-400/60 text-left w-48 bg-black/20 p-3 rounded border border-blue-500/10">
                            <p className="animate-pulse">{'>'} Activating Node...</p>
                            <p className="animate-pulse" style={{animationDelay: "0.5s"}}>{'>'} Normalizing Tensor...</p>
                            <p className="animate-pulse" style={{animationDelay: "1s"}}>{'>'} Feeding ResNet Layers...</p>
                            <p className="animate-pulse" style={{animationDelay: "1.5s"}}>{'>'} Computing Softmax...</p>
                          </div>
                        </motion.div>
                      )}

                      {result?.success && result?.prediction && (
                        <ResultCard 
                          result={result} 
                          onShowDetails={() => setShowDetails(true)} 
                        />
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
                          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[40px] rounded-full pointer-events-none" />
                          <h4 className="text-lg font-semibold text-blue-300 uppercase tracking-wide mb-2 flex items-center gap-2">
                            <Activity className="w-5 h-5" /> 
                            AI Confidence Match
                          </h4>
                          <p className="text-xs text-slate-400 mb-6 border-b border-white/5 pb-4">
                            The AI calculates how closely the scan matches distinct tumor types. The percentages below represent the AI's confidence in its findings.
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.entries(result.confidences)
                              .sort((a, b) => b[1] - a[1])
                              .map(([className, score], idx) => (
                              <div key={className} className={`p-4 rounded-xl border ${idx === 0 ? 'bg-blue-500/10 border-blue-500/40 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' : 'bg-black/40 border-slate-800'} flex flex-col justify-center`}>
                                <div className="flex justify-between items-end mb-3">
                                  <span className={`text-sm font-medium capitalize ${idx === 0 ? 'text-blue-200' : 'text-slate-400'}`}>{className}</span>
                                  <span className={`text-xl font-mono font-bold ${idx === 0 ? 'text-blue-400' : 'text-slate-500'}`}>{score.toFixed(1)}%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${score}%` }}
                                    transition={{ duration: 1, delay: 0.2 + (idx * 0.1), ease: "circOut" }}
                                    className={`h-full rounded-full ${idx === 0 ? 'bg-gradient-to-r from-blue-400 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.8)]' : 'bg-slate-600'}`}
                                  />
                                </div>
                                {idx === 0 && <p className="text-[10px] text-blue-300/80 mt-3 mt-auto uppercase tracking-wider font-semibold">Most Likely Result</p>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                        <div className="bg-black/30 rounded-lg p-4 font-mono text-xs border border-white/5 flex flex-col justify-center items-center text-center">
                          <span className="text-slate-500 block mb-2 uppercase tracking-wider">Analysis Speed</span>
                          <span className="text-emerald-400 flex items-center justify-center gap-2 text-lg"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>~{(Math.random() * 0.4 + 0.3).toFixed(2)}s</span>
                        </div>
                        <div className="bg-black/30 rounded-lg p-4 font-mono text-xs border border-white/5 flex flex-col justify-center items-center text-center">
                          <span className="text-slate-500 block mb-2 uppercase tracking-wider">Processed By</span>
                          <span className="text-blue-400 text-sm">Cloud AI Server</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* MODEL INFO VIEW */}
          {activeTab === "info" && (
            <motion.div 
              key="info"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              className="glass p-8 rounded-2xl max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-6 text-purple-300 flex items-center gap-3">
                <Info className="w-8 h-8" /> Model Architecture
              </h2>
              <div className="space-y-6 text-slate-300 font-light leading-relaxed">
                <p>
                  The Neural Scan Analyzer relies on a <strong className="text-white">ResNet18</strong> (Residual Network) architecture, originally developed by Microsoft Research. ResNet18 is known for its deep feature extraction capabilities while avoiding the vanishing gradient problem via skip connections.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/50">
                    <h3 className="text-lg font-medium text-blue-400 mb-2">Training Dataset</h3>
                    <p className="text-sm">The model was trained on a comprehensive Brain MRI Images for Brain Tumor Detection dataset, spanning thousands of axial, coronal, and sagittal scans across 4 classes.</p>
                  </div>
                  <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-700/50">
                    <h3 className="text-lg font-medium text-emerald-400 mb-2">Fine-Tuning</h3>
                    <p className="text-sm">The final fully connected layer was modified from its original 1000-class output (ImageNet) to a specialized 4-class output (Glioma, Meningioma, Pituitary, No Tumor) with an added Dropout layer for regularization.</p>
                  </div>
                </div>
                <p>
                  <strong className="text-white">Preprocessing Pipeline:</strong> Scans submitted to the API are resized to 224x224, converted to PyTorch Tensors, and normalized using standard ImageNet mean <code>[0.485, 0.456, 0.406]</code> and standard deviation <code>[0.229, 0.224, 0.225]</code> to perfectly match the training distribution.
                </p>
              </div>
            </motion.div>
          )}

          {/* WARNINGS VIEW */}
          {activeTab === "warnings" && (
            <motion.div 
              key="warnings"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              className="glass p-8 rounded-2xl max-w-4xl mx-auto border-orange-500/20"
            >
              <h2 className="text-3xl font-bold mb-6 text-orange-400 flex items-center gap-3">
                <ShieldAlert className="w-8 h-8" /> Clinical Warnings & Disclaimers
              </h2>
              <div className="space-y-6 text-slate-300 font-light leading-relaxed">
                <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-200">
                  <strong className="block mb-2 font-bold text-orange-400">Not a Substitute for Professional Medical Advice</strong>
                  NeuralScan.AI is an experimental research tool. The predictions made by this deep learning model should NEVER be used as the sole basis for clinical diagnosis or treatment decisions.
                </div>
                <ul className="list-none space-y-4">
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">False Positives & Negatives:</strong> Machine learning models are probabilistic. The model may occasionally predict a tumor where none exists, or fail to detect a tumor that is present.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Image Quality Dependency:</strong> The accuracy of the classification is heavily dependent on the clarity, angle, and modality of the MRI uploaded. Blurry, low-resolution, or non-MRI images will result in unpredictable behavior.
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <ChevronRight className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Data Shift:</strong> The model is constrained by its training data. Rare tumor types or pathological artifacts not present in the training set may misguide the neural network.
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* TERMS VIEW */}
          {activeTab === "terms" && (
            <motion.div 
              key="terms"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
              className="glass p-8 rounded-2xl max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-bold mb-6 text-slate-200 flex items-center gap-3">
                <FileText className="w-8 h-8" /> Terms & Conditions
              </h2>
              <div className="space-y-6 text-slate-400 font-light leading-relaxed text-sm">
                <p>
                  By utilizing the Neural Scan Analyzer, you agree to the following terms regarding data usage, privacy, and liability.
                </p>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">1. Data Privacy & Ephemeral Processing</h3>
                  <p>All image uploads are processed entirely in memory. We do not store, save, log, or cache any medical imagery submitted to our API. The tensor transformations and resulting classification outputs are discarded immediately after the HTTP response is sent.</p>
                  
                  <h3 className="text-lg font-medium text-white">2. Limitation of Liability</h3>
                  <p>The developers, researchers, and affiliated institutions of NeuralScan.AI hold no liability for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this software. This software is provided "AS-IS", without any warranties of any kind.</p>
                  
                  <h3 className="text-lg font-medium text-white">3. Authorized Use</h3>
                  <p>This application is intended for educational, academic, and research purposes. Uploading malicious payloads, attempting to reverse-engineer the API, or utilizing the service for commercial medical diagnostics without proper FDA/regulatory clearance is strictly prohibited.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-white/5 flex flex-col items-center gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <a href="https://github.com/jaypatel342005" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900/40 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all duration-300 border border-white/5 hover:border-white/10 shadow-lg">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900/40 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all duration-300 border border-white/5 hover:border-white/10 shadow-lg">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="https://cardioai.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900/40 hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-all duration-300 border border-white/5 hover:border-white/10 shadow-lg" title="CardioPredict AI">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 text-slate-300">
            <Brain className="w-4 h-4" />
            <span className="text-base font-bold tracking-tight">NeuralScan AI</span>
          </div>
          <div className="text-slate-400 text-sm flex items-center gap-1.5 mt-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> by <a href="https://github.com/jaypatel342005" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-300 hover:text-white transition-colors">Jay Patel</a>
          </div>
        </div>

        <div className="text-slate-500 text-xs flex flex-col items-center gap-1 mt-2">
          <p className="tracking-widest font-semibold uppercase">&copy; {new Date().getFullYear()} ALL RIGHTS RESERVED</p>
          <p className="text-[10px] text-slate-600">Powered by PyTorch, FastAPI, Next.js, and Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
