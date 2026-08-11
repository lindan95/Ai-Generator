import React, { useState, useEffect } from "react";
import { Sparkles, Bot, CheckCircle2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

const LOADING_MESSAGES = [
  "Menganalisis elemen Kurikulum Merdeka & capaian pembelajaran...",
  "Merumuskan Profil Pelajar Pancasila (P3) yang relevan...",
  "Menyusun langkah-langkah kegiatan inti pembelajaran (Sintaks PBL/PjBL)...",
  "Merancang instrumen asesmen diagnostik, formatif, dan sumatif...",
  "Membuat rubrik penilaian & lembar kerja peserta didik (LKPD)...",
  "Melakukan pengolahan akhir dan format dokumen resmi...",
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-8 animate-fadeIn">
      
      {/* Robot Spinner Animation */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-950" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Bot className="w-8 h-8 animate-bounce" />
        </div>
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
          <span>Gemini AI Sedang Bekerja</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          Menyusun Perangkat Pembelajaran...
        </h2>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold min-h-[24px]">
          {message || LOADING_MESSAGES[currentStep]}
        </p>
      </div>

      {/* Checklist skeleton preview */}
      <div className="max-w-md mx-auto p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-left space-y-3">
        {LOADING_MESSAGES.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
              idx <= currentStep
                ? "text-slate-800 dark:text-slate-200 font-medium opacity-100"
                : "text-slate-300 dark:text-slate-700 opacity-50"
            }`}
          >
            <CheckCircle2
              className={`w-4 h-4 flex-shrink-0 ${
                idx <= currentStep ? "text-emerald-500" : "text-slate-200 dark:text-slate-800"
              }`}
            />
            <span className="line-clamp-1">{msg}</span>
          </div>
        ))}
      </div>

    </div>
  );
};
