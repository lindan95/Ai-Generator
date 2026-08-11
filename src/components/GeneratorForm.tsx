import React, { useState, useEffect } from "react";
import { Sparkles, RotateCcw, BookOpen, Layers, Target, Users2, ArrowRight } from "lucide-react";
import { DocumentType, DocFormData, JenjangType } from "../types";
import { PRESET_TEMPLATES } from "../data/presets";

interface GeneratorFormProps {
  onSubmit: (data: DocFormData) => void;
  initialData?: Partial<DocFormData>;
  isLoading: boolean;
}

const PHASE_OPTIONS: Record<JenjangType, { val: string; label: string }[]> = {
  SD: [
    { val: "Fase A (Kelas 1-2)", label: "Fase A (Kelas 1 - 2 SD)" },
    { val: "Fase B (Kelas 3-4)", label: "Fase B (Kelas 3 - 4 SD)" },
    { val: "Fase C (Kelas 5-6)", label: "Fase C (Kelas 5 - 6 SD)" },
  ],
  SMP: [{ val: "Fase D (Kelas 7-9)", label: "Fase D (Kelas 7 - 9 SMP)" }],
  SMA: [
    { val: "Fase E (Kelas 10)", label: "Fase E (Kelas 10 SMA)" },
    { val: "Fase F (Kelas 11-12)", label: "Fase F (Kelas 11 - 12 SMA)" },
  ],
  SMK: [
    { val: "Fase E (Kelas 10)", label: "Fase E (Kelas 10 SMK)" },
    { val: "Fase F (Kelas 11-12)", label: "Fase F (Kelas 11 - 12 SMK)" },
  ],
};

const DEFAULT_FORM: DocFormData = {
  type: "Modul Ajar",
  lang: "Bahasa Indonesia formal dan baku",
  jenjang: "SD",
  fase: "Fase B (Kelas 3-4)",
  semester: "Ganjil",
  mapel: "IPAS",
  materi: "Ekosistem dan Rantai Makanan",
  waktu: "2 x 35 Menit (1 Pertemuan)",
  cptp: "Peserta didik menganalisis hubungan antar makhluk hidup dan lingkungannya dalam bentuk rantai makanan.",
  model: "Problem Based Learning (PBL)",
  karakteristik: "Siswa aktif, menyukai pengamatan gambar/video dan kerja kelompok.",
  customPrompt: "",
};

export const GeneratorForm: React.FC<GeneratorFormProps> = ({
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [formData, setFormData] = useState<DocFormData>({
    ...DEFAULT_FORM,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleJenjangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newJenjang = e.target.value as JenjangType;
    const defaultFase = PHASE_OPTIONS[newJenjang]?.[0]?.val || "Fase A (Kelas 1-2)";
    setFormData((prev) => ({
      ...prev,
      jenjang: newJenjang,
      fase: defaultFase,
    }));
  };

  const handlePresetSelect = (preset: (typeof PRESET_TEMPLATES)[0]) => {
    setFormData((prev) => ({
      ...prev,
      ...preset.data,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Curriculum Engine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
            Generator Perangkat Pembelajaran
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lengkapi rincian berikut untuk menghasilkan dokumen Kurikulum Merdeka yang akurat dan komprehensif.
          </p>
        </div>

        {/* Preset Selector dropdown */}
        <div className="min-w-[220px]">
          <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Isi Cepat dari Preset:
          </label>
          <select
            onChange={(e) => {
              const idx = parseInt(e.target.value);
              if (!isNaN(idx) && PRESET_TEMPLATES[idx]) {
                handlePresetSelect(PRESET_TEMPLATES[idx]);
              }
            }}
            defaultValue=""
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 outline-hidden"
          >
            <option value="" disabled>
              -- Pilih Preset Contoh --
            </option>
            {PRESET_TEMPLATES.map((p, i) => (
              <option key={i} value={i}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Jenis Dokumen */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              1. Jenis Perangkat & Bahasa Output
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Tipe Dokumen / Perangkat <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentType })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden transition-all"
              >
                <option value="Modul Ajar">Modul Ajar (Lengkap)</option>
                <option value="Alur Tujuan Pembelajaran (ATP)">ATP (Alur Tujuan Pembelajaran)</option>
                <option value="KKTP">KKTP (Kriteria Ketercapaian Tujuan Pembelajaran)</option>
                <option value="LKPD">LKPD (Lembar Kerja Peserta Didik)</option>
                <option value="Bahan Ajar / Ringkasan Materi">Bahan Ajar / Ringkasan Materi</option>
                <option value="Soal Pilihan Ganda">Soal Pilihan Ganda (HOTS / AKM)</option>
                <option value="Soal Essay Berbasis AKM">Soal Essay Berbasis AKM</option>
                <option value="Rubrik Penilaian">Rubrik Penilaian & Asesmen</option>
                <option value="Modul Projek P5">Modul Projek P5 (Projek Profil)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Bahasa Output Dokumen
              </label>
              <select
                value={formData.lang}
                onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden transition-all"
              >
                <option value="Bahasa Indonesia formal dan baku">Bahasa Indonesia (Formal & Baku)</option>
                <option value="English (formal educational tone)">English (Formal Educational Tone)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Data Kelas & Mapel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              2. Data Jenjang, Kelas & Mata Pelajaran
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Jenjang Pendidikan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.jenjang}
                onChange={handleJenjangChange}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="SD">SD / MI</option>
                <option value="SMP">SMP / MTs</option>
                <option value="SMA">SMA / MA</option>
                <option value="SMK">SMK / MAK</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Fase / Kelas <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.fase}
                onChange={(e) => setFormData({ ...formData, fase: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                {PHASE_OPTIONS[formData.jenjang].map((opt, i) => (
                  <option key={i} value={opt.val}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Semester
              </label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value as "Ganjil" | "Genap" })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="Ganjil">Semester Ganjil</option>
                <option value="Genap">Semester Genap</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Mata Pelajaran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.mapel}
              onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
              placeholder="Contoh: IPAS, Matematika, Bahasa Indonesia, Biologi..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        {/* Section 3: Substansi Materi */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              3. Substansi & Pokok Materi Pembelajaran
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Topik / Materi Utama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.materi}
                onChange={(e) => setFormData({ ...formData, materi: e.target.value })}
                placeholder="Contoh: Ekosistem dan Rantai Makanan"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Alokasi Waktu (Opsional)
              </label>
              <input
                type="text"
                value={formData.waktu}
                onChange={(e) => setFormData({ ...formData, waktu: e.target.value })}
                placeholder="Contoh: 2 x 35 Menit (1 Pertemuan)"
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Capaian / Tujuan Pembelajaran (CP / TP)
              </label>
              <span className="text-[10px] text-slate-400">
                Akan otomatis dirumuskan AI jika dikosongkan
              </span>
            </div>
            <textarea
              rows={3}
              value={formData.cptp}
              onChange={(e) => setFormData({ ...formData, cptp: e.target.value })}
              placeholder="Tempelkan Capaian atau Tujuan Pembelajaran resmi dari silabus/ATP di sini..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
            />
          </div>
        </div>

        {/* Section 4: Pendekatan & Karakteristik */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Users2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              4. Model Pembelajaran & Karakteristik Siswa
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Model Pembelajaran
              </label>
              <select
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              >
                <option value="Diserahkan ke AI (Otomatis)">Pilih Otomatis (Rekomendasi AI)</option>
                <option value="Problem Based Learning (PBL)">Problem Based Learning (PBL)</option>
                <option value="Project Based Learning (PjBL)">Project Based Learning (PjBL)</option>
                <option value="Discovery Learning">Discovery Learning</option>
                <option value="Inquiry Learning">Inquiry Learning</option>
                <option value="Cooperative Learning">Cooperative Learning</option>
                <option value="Pembelajaran Berdiferensiasi">Pembelajaran Berdiferensiasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Karakteristik Siswa / Kondisi Kelas
              </label>
              <input
                type="text"
                value={formData.karakteristik}
                onChange={(e) => setFormData({ ...formData, karakteristik: e.target.value })}
                placeholder="Cth: Gemar belajar kelompok, memerlukan gambar/visual..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Instruksi Tambahan Khusus (Opsional)
            </label>
            <input
              type="text"
              value={formData.customPrompt}
              onChange={(e) => setFormData({ ...formData, customPrompt: e.target.value })}
              placeholder="Cth: Sertakan pertunjukan game edukasi di pendahuluan, atau fokuskan pada HOTS level C5..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => setFormData(DEFAULT_FORM)}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-125 transition-transform" />
            <span>Generate Dokumen AI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};
