"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Brain, Zap, Upload, BarChart3, ChevronRight,
  Cpu, Database, ShieldAlert, AlertTriangle,
  Layers, Network, Microscope, Github, BookOpen,
  Activity, FileWarning, CheckCircle2, Timer,
  Gauge, Blocks, Focus, GraduationCap, ExternalLink,
  Scan, FlaskConical
} from "lucide-react";

import ParticleField from "@/components/ParticleField";
import StatsCounter from "@/components/StatsCounter";
import TumorClassCard, { type TumorClass } from "@/components/TumorClassCard";
import ArchitecturePipeline from "@/components/ArchitecturePipeline";

/* ─── Data ─── */

const stats = [
  { value: 4, label: "Tumor Classes" },
  { value: 24, suffix: "M", label: "Parameters" },
  { value: 384, suffix: "px", label: "Input Size" },
  { value: 98, suffix: "%", label: "Accuracy" },
  { value: 0.5, suffix: "s", label: "Inference", decimals: 1 },
  { value: 8, label: "Stages" },
];

const steps = [
  {
    num: "01",
    icon: Upload,
    title: "Upload MRI Scan",
    description: "Drag & drop or select a brain MRI scan in JPG or PNG format. Supports axial, coronal, and sagittal views.",
    color: "cyan",
  },
  {
    num: "02",
    icon: Cpu,
    title: "AI Analysis",
    description: "Our fine-tuned EfficientNet-V2-S model normalizes the tensor and runs inference through Fused-MBConv and MBConv layers.",
    color: "blue",
  },
  {
    num: "03",
    icon: BarChart3,
    title: "Get Results",
    description: "Receive instant classification results with confidence scores across all 4 categories, downloadable as a report.",
    color: "violet",
  },
];

const features = [
  {
    icon: Layers,
    title: "Transfer Learning",
    description: "Pre-trained on ImageNet-21k's millions of images, then fine-tuned on brain MRI scans for specialized 4-class tumor detection with superior feature representations.",
    accent: "from-cyan-500/20 to-blue-500/20",
  },
  {
    icon: Database,
    title: "Robust Dataset",
    description: "Trained on thousands of axial, coronal, and sagittal MRI scans spanning Glioma, Meningioma, Pituitary, and No Tumor classes for comprehensive coverage.",
    accent: "from-blue-500/20 to-violet-500/20",
  },
  {
    icon: Network,
    title: "Fused-MBConv Blocks",
    description: "Early stages use Fused-MBConv that merges depthwise and pointwise convolutions into a single 3×3 conv — enabling faster training on modern accelerators.",
    accent: "from-violet-500/20 to-cyan-500/20",
  },
  {
    icon: Microscope,
    title: "Smart Preprocessing",
    description: "Images are resized to 384×384, normalized with ImageNet mean & std deviation to match the model's training distribution for optimal inference.",
    accent: "from-cyan-500/20 to-emerald-500/20",
  },
  {
    icon: Focus,
    title: "Squeeze-and-Excitation",
    description: "MBConv blocks integrate SE attention modules that learn channel-wise feature importance, focusing the network on the most discriminative features in MRI scans.",
    accent: "from-emerald-500/20 to-blue-500/20",
  },
  {
    icon: GraduationCap,
    title: "Progressive Learning",
    description: "Training starts with smaller 128px images and weaker regularization, gradually scaling to 384px with stronger augmentation — yielding faster convergence and higher accuracy.",
    accent: "from-blue-500/20 to-violet-500/20",
  },
];

const tumorClasses: TumorClass[] = [
  {
    icon: AlertTriangle,
    title: "Glioma",
    description: "Arises from glial cells — the supportive tissue of the brain. Most common primary brain tumors, ranging from low-grade to highly malignant glioblastoma (GBM).",
    severity: "high",
    gradient: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/20",
    iconColor: "text-red-400",
    stats: [
      { label: "Origin", value: "Glial Cells" },
      { label: "Growth", value: "Infiltrative" },
      { label: "Prevalence", value: "~30%  of brain tumors" },
      { label: "Subtypes", value: "Astrocytoma, GBM" },
    ],
  },
  {
    icon: FileWarning,
    title: "Meningioma",
    description: "Develops from the meninges — protective membranes surrounding the brain and spinal cord. Typically slow-growing and often benign, but may compress adjacent structures.",
    severity: "medium",
    gradient: "from-amber-500/20 to-yellow-500/20",
    borderColor: "border-amber-500/20",
    iconColor: "text-amber-400",
    stats: [
      { label: "Origin", value: "Meninges" },
      { label: "Growth", value: "Slow-growing" },
      { label: "Prevalence", value: "~37%  of brain tumors" },
      { label: "Prognosis", value: "Generally good" },
    ],
  },
  {
    icon: Activity,
    title: "Pituitary Tumor",
    description: "Grows in the pituitary gland at the base of the brain. Often affects hormone production, potentially causing vision problems and endocrine system disruption.",
    severity: "medium",
    gradient: "from-violet-500/20 to-purple-500/20",
    borderColor: "border-violet-500/20",
    iconColor: "text-violet-400",
    stats: [
      { label: "Origin", value: "Pituitary Gland" },
      { label: "Growth", value: "Variable" },
      { label: "Prevalence", value: "~15%  of brain tumors" },
      { label: "Effects", value: "Hormonal changes" },
    ],
  },
  {
    icon: CheckCircle2,
    title: "No Tumor",
    description: "Healthy brain scan with no anomalous growths detected. The neural network identifies normal brain tissue patterns and confirms the absence of pathological formations.",
    severity: "none",
    gradient: "from-emerald-500/20 to-green-500/20",
    borderColor: "border-emerald-500/20",
    iconColor: "text-emerald-400",
    stats: [
      { label: "Status", value: "Healthy" },
      { label: "Action", value: "Routine follow-up" },
      { label: "Confidence", value: "Softmax output" },
      { label: "Verification", value: "Always advised" },
    ],
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* ─── Component ─── */

export default function Home() {
  return (
    <div className="bg-grid-pattern">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden">
        <ParticleField />
        <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="hero-glow top-0 right-0 opacity-40" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs sm:text-sm font-medium"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
              Powered by EfficientNet-V2-S · 24M Parameters
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
              <span className="text-slate-100">Detecting</span>{" "}
              <span className="gradient-text text-glow">Brain Tumors</span>
              <br />
              <span className="text-slate-100">with Neural Precision</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              An end-to-end AI pipeline engineered to classify brain MRI scans across 4 categories 
              using a fine-tuned <strong className="text-slate-300">EfficientNet-V2-S</strong> architecture with{" "}
              <strong className="text-slate-300">Fused-MBConv</strong> blocks and{" "}
              <strong className="text-slate-300">progressive learning</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/analyzer"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-base font-semibold transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] border border-cyan-400/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Zap className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Start AI Assessment</span>
                <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://github.com/jaypatel342005/DL-Project"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white rounded-xl text-base font-semibold transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://www.kaggle.com/code/jaypatel345/master-cardiovascular-disease-prediction"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 hover:text-white rounded-xl text-base font-semibold transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                <BookOpen className="w-5 h-5" />
                Kaggle
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-slate-500 uppercase tracking-widest">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            />
          </div>
        </motion.div>
      </section>

      {/* ─── Stats ─── */}
      <section className="relative py-12 sm:py-16 border-y border-white/5 bg-slate-950/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsCounter stats={stats} />
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="hero-glow -top-40 -left-40 opacity-30" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.span variants={itemVariants} className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
              Process
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg font-light">
              Three simple steps from image upload to AI-powered diagnosis.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8"
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="relative group"
              >
                {/* Connector line (desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-[calc(50%+60px)] w-[calc(100%-120px)] h-[1px] bg-gradient-to-r from-slate-700 to-slate-800 z-0" />
                )}
                <div className="glass-card card-hover-lift rounded-2xl p-6 sm:p-8 text-center relative z-10">
                  <div className="text-[10px] text-slate-600 font-mono tracking-widest mb-4">{step.num}</div>
                  <div className={`w-14 h-14 mx-auto mb-5 rounded-2xl bg-${step.color}-500/10 border border-${step.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`w-7 h-7 text-${step.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Tumor Classes ─── */}
      <section className="relative py-20 sm:py-28 bg-slate-950/40 border-y border-white/5">
        <div className="hero-glow top-1/4 right-0 opacity-20" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.span variants={itemVariants} className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
              Classification
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              What We Detect
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-light">
              Our model classifies brain MRI scans into 4 distinct categories. Learn about each tumor type, its origin, and clinical significance.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {tumorClasses.map((tumor, i) => (
              <TumorClassCard key={tumor.title} tumor={tumor} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Model Architecture Features ─── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="hero-glow bottom-0 right-0 opacity-20" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.span variants={itemVariants} className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
              Architecture
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              Under the Hood
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-400 max-w-xl mx-auto text-base sm:text-lg font-light">
              A deep dive into the EfficientNet-V2-S model powering NeuralScan.AI — built with training-aware NAS and progressive learning.
            </motion.p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card card-hover-lift rounded-2xl p-6 sm:p-8 relative overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <feature.icon className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Preprocessing pipeline callout */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-8 glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-blue-500" />
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Brain className="w-8 h-8 text-cyan-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-base font-semibold text-slate-100 mb-2">Preprocessing Pipeline</h4>
                <p className="text-sm text-slate-400 font-light leading-relaxed">
                  All uploaded scans are resized to <code className="text-cyan-400/80 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">384×384</code>, 
                  converted to PyTorch Tensors, and normalized using ImageNet mean 
                  <code className="text-cyan-400/80 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">[0.485, 0.456, 0.406]</code> and std 
                  <code className="text-cyan-400/80 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">[0.229, 0.224, 0.225]</code> to match the training distribution.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Architecture Pipeline ─── */}
      <section className="relative py-20 sm:py-28 bg-slate-950/40 border-y border-white/5 overflow-hidden">
        <div className="hero-glow top-0 left-1/3 opacity-20" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-12"
          >
            <motion.span variants={itemVariants} className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-3 block">
              Pipeline
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              Stage-by-Stage Architecture
            </motion.h2>
            <motion.p variants={itemVariants} className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg font-light">
              Visualize the EfficientNet-V2-S inference pipeline — from input convolution through Fused-MBConv and MBConv stages to final classification.
            </motion.p>
          </motion.div>

          <ArchitecturePipeline />

          {/* Key architecture facts */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10"
          >
            {[
              { icon: Blocks, label: "Only 3×3 Filters", detail: "No 5×5 convolutions — faster on modern accelerators" },
              { icon: Gauge, label: "Training-Aware NAS", detail: "Architecture discovered via neural architecture search optimizing both accuracy and training speed" },
              { icon: Timer, label: "5× Faster Training", detail: "Up to 5× faster training than EfficientNet-V1 while achieving better accuracy on ImageNet" },
            ].map((fact, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="glass-card rounded-xl p-5 flex items-start gap-3"
              >
                <fact.icon className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 mb-1">{fact.label}</h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">{fact.detail}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Research Paper Reference ─── */}
      <section className="relative py-16 sm:py-20 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="gradient-border rounded-2xl overflow-hidden"
          >
            <div className="p-6 sm:p-8 relative z-10">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="w-7 h-7 text-violet-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 font-semibold uppercase tracking-wider">
                      Research Paper
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-100 mb-2">
                    EfficientNetV2: Smaller Models and Faster Training
                  </h3>
                  <p className="text-sm text-slate-400 mb-1">
                    <strong className="text-slate-300">Mingxing Tan & Quoc V. Le</strong> — Google Research, Brain Team
                  </p>
                  <p className="text-xs text-slate-500 mb-4 font-light leading-relaxed">
                    Published at ICML 2021. Introduces training-aware NAS, progressive learning, and the Fused-MBConv block — achieving 
                    state-of-the-art accuracy on ImageNet while training up to 11× faster than previous models.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="https://arxiv.org/abs/2104.00298"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/20 text-violet-300 rounded-lg text-xs font-medium transition-all duration-300 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Read on arXiv
                    </a>
                    <a
                      href="https://github.com/google/automl/tree/master/efficientnetv2"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 border border-white/10 text-slate-300 rounded-lg text-xs font-medium transition-all duration-300"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Official Code
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Warnings & Disclaimer ─── */}
      <section className="relative py-20 sm:py-28 bg-slate-950/40 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <span className="text-orange-400 text-sm font-semibold uppercase tracking-widest mb-3 block">Important</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">Clinical Disclaimers</h2>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 sm:p-8 border-orange-500/20 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              
              <div className="flex items-start gap-4 p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl mb-6">
                <ShieldAlert className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-orange-300 font-semibold mb-1">Not a Substitute for Medical Advice</strong>
                  <p className="text-sm text-orange-200/70 leading-relaxed">
                    NeuralScan.AI is an experimental research tool. Predictions should NEVER be the sole basis for clinical diagnosis.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: "False Positives & Negatives", text: "ML models are probabilistic. The model may predict a tumor where none exists, or fail to detect one." },
                  { title: "Image Quality Dependency", text: "Accuracy depends on clarity, angle, and modality. Blurry or non-MRI images produce unpredictable results." },
                  { title: "Data Shift", text: "The model is constrained by its training data. Rare tumor types or artifacts not in the dataset may misguide it." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-orange-500/60 flex-shrink-0 mt-1" />
                    <div>
                      <strong className="text-slate-200 text-sm">{item.title}:</strong>{" "}
                      <span className="text-slate-400 text-sm font-light">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Brain className="w-12 h-12 text-cyan-400 mx-auto mb-6 animate-[float_6s_ease-in-out_infinite]" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              Ready to Analyze?
            </h2>
            <p className="text-slate-400 text-base sm:text-lg mb-8 font-light max-w-lg mx-auto">
              Upload your brain MRI scan and let our EfficientNet-V2-S model provide instant classification results with confidence scores.
            </p>
            <Link
              href="/analyzer"
              className="group relative inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-lg font-semibold transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] border border-cyan-400/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Zap className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Launch Analyzer</span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
