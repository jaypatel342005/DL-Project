import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, FileWarning, CheckCircle2, Activity, AlertTriangle, Info, Download } from 'lucide-react';
import { PredictionResult } from '@/utils/api';

const predictionDetails: Record<string, { label: string, color: string, icon: React.ReactNode, description: string }> = {
  glioma: { 
    label: "Glioma Detected", 
    color: "text-red-400", 
    icon: <AlertCircle className="w-8 h-8 text-red-500" />,
    description: "Model identified characteristics consistent with a glial cell tumor. Urgent medical consultation required."
  },
  meningioma: { 
    label: "Meningioma Detected", 
    color: "text-red-400", 
    icon: <FileWarning className="w-8 h-8 text-red-500" />,
    description: "Model identified characteristics consistent with a tumor arising from the meninges. Neurological review advised."
  },
  notumor: { 
    label: "No Tumor Detected", 
    color: "text-green-400", 
    icon: <CheckCircle2 className="w-8 h-8 text-green-500" />,
    description: "The AI tensor extraction revealed no anomalous growths in the provided scan. Routine follow-up recommended."
  },
  pituitary: { 
    label: "Pituitary Tumor Detected", 
    color: "text-red-400", 
    icon: <Activity className="w-8 h-8 text-red-500" />,
    description: "Model identified abnormal growth patterns located in the pituitary gland region. Endocrine testing suggested."
  }
};

type ResultCardProps = {
  result: PredictionResult;
  onShowDetails: () => void;
};

export const ResultCard: React.FC<ResultCardProps> = ({ result, onShowDetails }) => {
  const activeResult = predictionDetails[result.prediction];

  if (!activeResult) return null;

  return (
    <motion.div 
      key="success"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex flex-col w-full h-full"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-6 mb-6 gap-4">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-2xl bg-slate-900 border ${activeResult.color.replace('text-', 'border-').replace('400', '500/30')} shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] relative overflow-hidden group`}>
            <div className={`absolute inset-0 bg-current opacity-10 blur-xl group-hover:opacity-20 transition-opacity ${activeResult.color}`} />
            <div className="relative z-10">{activeResult.icon}</div>
          </div>
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-1.5"
            >
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 text-blue-300 rounded-full text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.15)]">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                AI Diagnostics Active
              </span>
            </motion.div>
            <motion.h3 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight ${activeResult.color} filter drop-shadow-[0_0_10px_rgba(255,255,255,0.15)] leading-tight`}
            >
              {activeResult.label}
            </motion.h3>
          </div>
        </div>
        <button 
          onClick={() => {
            const reportContent = `BRAIN TUMOR ANALYSIS REPORT\n` +
              `===========================\n\n` +
              `Date: ${new Date().toLocaleString()}\n\n` +
              `Prediction: ${activeResult.label}\n` +
              `Confidence values:\n` +
              (result.confidences ? Object.entries(result.confidences).map(([k, v]) => `- ${k}: ${v}%`).join('\n') : "N/A\n") +
              `\n\nAssessment:\n${activeResult.description}\n\n` +
              `Disclaimer: AI predictions are for informational purposes. Always consult a qualified radiologist.`;

            const blob = new Blob([reportContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Diagnosis_Report_${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-200 rounded-xl text-sm font-semibold transition-all border border-slate-600 shadow-lg hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
        >
          <Download className="w-4 h-4" /> Download Report
        </button>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="bg-black/20 rounded-2xl p-5 mb-5 border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500" />
        <h4 className="text-[10px] sm:text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" /> Primary Assessment
        </h4>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
          {activeResult.description}
        </p>
      </motion.div>

      <button 
        onClick={onShowDetails}
        className="w-full py-3 mb-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Info className="w-4 h-4" /> View AI Confidence Breakdown
      </button>

      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        className="mt-2 flex items-center gap-2 text-xs text-yellow-500/80 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20"
      >
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <p>AI predictions are for informational purposes. Always consult a qualified radiologist.</p>
      </motion.div>
    </motion.div>
  );
};
