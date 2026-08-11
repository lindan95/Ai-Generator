import React from "react";
import {
  FileText,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight,
  FileCheck2,
  Clock,
  Zap,
  Bookmark,
  Building2,
  PlusCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { DocumentType, DocFormData, SavedDocument, TeacherProfile } from "../types";
import { PRESET_TEMPLATES } from "../data/presets";

interface DashboardProps {
  documents: SavedDocument[];
  onQuickGenerate: (type: DocumentType) => void;
  onApplyPreset: (data: Partial<DocFormData>) => void;
  onViewDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (id: string) => void;
  onNavigateToGenerator: () => void;
  onOpenSettings: () => void;
  profile: TeacherProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({
  documents,
  onQuickGenerate,
  onApplyPreset,
  onViewDocument,
  onDeleteDocument,
  onNavigateToGenerator,
  onOpenSettings,
  profile,
}) => {
  const totalDocs = documents.length;
  const modulCount = documents.filter((d) => d.type.includes("Modul")).length;
  const soalCount = documents.filter((d) => d.type.includes("Soal")).length;
  const lkpdCount = documents.filter((d) => d.type.includes("LKPD") || d.type.includes("ATP")).length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-medium text-blue-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Asisten AI Pembelajaran Guru Terdepan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {profile.name || "Bapak/Ibu Guru"}!
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed">
              Siapkan Perangkat Pembelajaran Kurikulum Merdeka (Modul Ajar, ATP, LKPD, hingga Soal HOTS) secara cepat, presisi, dan sesuai standar Kemendikbudristek.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onNavigateToGenerator}
              className="px-5 py-3 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-semibold text-sm shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 group"
            >
              <PlusCircle className="w-4 h-4 text-blue-600 group-hover:rotate-90 transition-transform" />
              <span>Buat Perangkat Baru</span>
            </button>
            <button
              onClick={onOpenSettings}
              className="px-4 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <Building2 className="w-4 h-4" />
              <span>{profile.schoolName ? "Atur Kop" : "Set Kop Sekolah"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Dokumen
            </p>
            <p className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {totalDocs}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Modul Ajar
            </p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {modulCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Soal & Asesmen
            </p>
            <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {soalCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              LKPD & ATP
            </p>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {lkpdCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Quick Generate Grid & Preset Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Generators (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Akses Cepat Generator AI
              </h2>
            </div>
            <button
              onClick={onNavigateToGenerator}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Lihat Semua Opsi <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <button
              onClick={() => onQuickGenerate("Modul Ajar")}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Modul Ajar Lengkap
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Informasi umum, langkah pembelajaran PBL/PjBL, P3, & asesmen.
              </p>
            </button>

            <button
              onClick={() => onQuickGenerate("Soal Pilihan Ganda")}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Soal HOTS & AKM
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Soal pilihan ganda, essay AKM berkonteks, pembahasan & kunci.
              </p>
            </button>

            <button
              onClick={() => onQuickGenerate("LKPD")}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Lembar Kerja (LKPD)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Petunjuk praktikum, tugas eksplorasi siswa, & rubrik unjuk kerja.
              </p>
            </button>

            <button
              onClick={() => onQuickGenerate("Alur Tujuan Pembelajaran (ATP)")}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-md transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                ATP (Alur Tujuan Pembelajaran)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pemetaan rasional elemen, urutan TP per semester, & alokasi JP.
              </p>
            </button>

          </div>

          {/* Preset Templates List */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Rekomendasi Contoh Contoh Preset Siap Pakai
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_TEMPLATES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => onApplyPreset(preset.data)}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-400 cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                      {preset.data.mapel} ({preset.data.jenjang})
                    </span>
                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 line-clamp-1">
                      {preset.label}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {preset.description}
                    </p>
                  </div>
                  <div className="mt-3 text-[11px] font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    Gunakan Preset Ini <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Recent Activity Panel (1 Col) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Aktivitas Terakhir
              </h2>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {documents.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                Belum ada dokumen yang dibuat. Klik salah satu tombol di sebelah kiri untuk memulai!
              </div>
            ) : (
              documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-3 group"
                >
                  <div
                    onClick={() => onViewDocument(doc)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      <span className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold">
                        {doc.mapel}
                      </span>
                      <span>•</span>
                      <span>{doc.fase}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onViewDocument(doc)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                      title="Buka Dokumen"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
