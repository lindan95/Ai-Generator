import React, { useState } from "react";
import { Wand2, X, Sparkles, Send } from "lucide-react";

interface RefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefine: (refinementInstruction: string) => void;
  isLoading: boolean;
}

const REFINEMENT_PRESETS = [
  "Sertakan lebih banyak Pertanyaan Pemantik kontekstual",
  "Ubah model kegiatan inti menjadi Project Based Learning (PjBL)",
  "Tambahkan 5 Soal Pilihan Ganda HOTS beserta kunci jawaban",
  "Perjelas rubrik penilaian unjuk kerja dan skala skor",
  "Tambahkan materi pengayaan untuk siswa berkemampuan tinggi",
  "Sederhanakan instruksi agar sesuai untuk siswa inklusi / lambat belajar",
];

export const RefineModal: React.FC<RefineModalProps> = ({
  isOpen,
  onClose,
  onRefine,
  isLoading,
}) => {
  const [instruction, setInstruction] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instruction.trim()) {
      onRefine(instruction.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Sempurnakan Dokumen dengan AI
              </h2>
              <p className="text-[11px] text-slate-500">
                Berikan instruksi revisi atau penambahan bagian secara spesifik.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Instruksi Revisi AI:
            </label>
            <textarea
              rows={4}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Contoh: Tambahkan 3 butir soal HOTS baru pada bagian asesmen sumatif..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-500 mb-2">
              Saran Perbaikan Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {REFINEMENT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInstruction(preset)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-700 dark:hover:text-amber-300 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-400 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || !instruction.trim()}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Memproses AI...</span>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Proses Revisi AI</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
