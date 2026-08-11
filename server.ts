import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to get Gemini Client lazily
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing. Please set it in Settings > Secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/generate-doc", async (req, res) => {
  try {
    const {
      type = "Modul Ajar",
      lang = "Bahasa Indonesia formal dan baku",
      jenjang = "SD",
      fase = "Fase A (Kelas 1-2)",
      semester = "Ganjil",
      mapel = "Umum",
      materi = "Materi Utama",
      waktu = "",
      cptp = "",
      model = "Diserahkan ke AI (Otomatis)",
      karakteristik = "",
      customPrompt = ""
    } = req.body;

    const ai = getGeminiClient();

    const systemPrompt = `Anda adalah seorang Pakar Kurikulum Pendidikan Indonesia dan Guru Penggerak Senior. Tugas Anda adalah membuat Perangkat Pembelajaran yang sangat profesional, terstruktur rapi, mendalam, dan secara ketat mengikuti panduan 'Kurikulum Merdeka' teraktual.

Aturan Wajib:
1. Format output HARUS menggunakan Markdown yang rapi (Gunakan Header H1, H2, H3, tabel markdown, list tebal/bullet points, serta penekanan tebal/miring).
2. Bahasa yang digunakan: ${lang}. Gunakan istilah pedagogik Kurikulum Merdeka yang akurat dan tepat.
3. Masukkan elemen P3 (Profil Pelajar Pancasila) seperti Beriman dan Bertakwa, Berkebinekaan Global, Gotong Royong, Mandiri, Bernalar Kritis, Kreatif.
4. RUMUS & PERSAMAAN MATEMATIKA / FISIKA / KIMIA / IPA:
   - Apabila materi, soal, atau LKPD memuat rumus matematika, fisika, kimia, atau statistik, WAJIB gunakan sintaks LaTeX standar KaTeX!
   - Gunakan inline math dengan tunggal dollar, contoh: $f(x) = ax^2 + bx + c$ atau $E = mc^2$ atau $v = \\frac{s}{t}$.
   - Gunakan block math dengan ganda dollar untuk rumus utama/persamaan kompleks, contoh:
     $$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$
5. ILUSTRASI, DIAGRAM, & GAMBAR PEMBELAJARAN:
   - Apabila topik atau materi memerlukan visualisasi (seperti skema organ tubuh, jaring-jaring makanan, ekosistem, bentuk geometri, grafik fungsi, instrumen laboratorium, atau peta konsep), WAJIB sertakan gambar Markdown dengan URL Unsplash educational yang relevan dan deskripsi caption yang jelas, contoh:
     ![Diagram Rantai Makanan & Ekosistem](https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80)
     atau
     ![Ilustrasi Pembelajaran Matematika & Geometri](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80)
6. Jangan membuat outline singkat! Buatlah dokumen LENGKAP dengan rincian langkah pembelajaran (sintaks), alokasi waktu, pertanyaan pemantik, asesmen diagnostik/formatif/sumatif, serta rubrik penilaian yang jelas.
7. Jangan menuliskan kata pembuka atau penutup basa-basi (seperti "Tentu, ini modulnya"). LANGSUNG hasilkan dokumen Markdown resmi.`;

    let userPrompt = `Buatkan dokumen perangkat pembelajaran Kurikulum Merdeka dengan rincian berikut:
- Jenis Perangkat: ${type}
- Jenjang Pendidikan: ${jenjang}
- Fase / Kelas: ${fase}
- Semester: ${semester}
- Mata Pelajaran: ${mapel}
- Topik / Materi Utama: ${materi}
`;

    if (waktu) userPrompt += `- Alokasi Waktu: ${waktu}\n`;
    if (cptp) {
      userPrompt += `- Capaian & Tujuan Pembelajaran (CP/TP): ${cptp}\n`;
    } else {
      userPrompt += `- Capaian & Tujuan Pembelajaran: (Rumuskan CP dan TP secara spesifik dan terukur sesuai standar Kurikulum Merdeka untuk fase dan materi ini)\n`;
    }

    if (model && model !== "Diserahkan ke AI (Otomatis)") {
      userPrompt += `- Model/Metode Pembelajaran: ${model}\n`;
    }
    if (karakteristik) {
      userPrompt += `- Karakteristik Peserta Didik / Kondisi Kelas: ${karakteristik}\n`;
    }
    if (customPrompt) {
      userPrompt += `- Instruksi Khusus Tambahan: ${customPrompt}\n`;
    }

    if (type === "Modul Ajar" || type === "Modul Ajar (Lengkap)") {
      userPrompt += `\nSpesifikasi Struktur Modul Ajar (Wajib Memuat):
1. INFORMASI UMUM: Identitas Penyusun/Sekolah, Jenjang/Fase, Alokasi Waktu, Kompetensi Awal, Profil Pelajar Pancasila (P3), Sarana & Prasarana, Target Peserta Didik, Model Pembelajaran.
2. KOMPONEN INTI: Tujuan Pembelajaran, Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pembelajaran Rinci (Pendahuluan, Kegiatan Inti berasaskan Sintaks Model Pembelajaran, Penutup), Asesmen (Diagnostik, Formatif, Sumatif), Pengayaan & Remedial.
3. LAMPIRAN: Lembar Kerja Peserta Didik (LKPD singkat), Bahan Bacaan Guru & Peserta Didik, Glosarium, Daftar Pustaka.`;
    } else if (type.includes("Soal")) {
      userPrompt += `\nSpesifikasi Soal/Asesmen (Wajib Memuat):
- Kisi-kisi singkat (Indikator Soal & Level Kognitif Bloom C1-C6).
- Butir Soal berstandar HOTS/AKM lengkap dengan stimulus/konteks dunia nyata.
- Kunci Jawaban Lengkap dan Pembahasan Detail.
- Pedoman Penskoran & Rubrik Penilaian.`;
    } else if (type.includes("LKPD")) {
      userPrompt += `\nSpesifikasi LKPD (Wajib Memuat):
- Judul Aktivitas, Mata Pelajaran, Kelas/Fase, Alokasi Waktu.
- Petunjuk Belajar untuk Siswa.
- Tujuan Pembelajaran & Alat/Bahan yang Dibutuhkan.
- Langkah Kerja / Tugas Eksplorasi (Interaktif & Mendorong Berpikir Kritis).
- Pertanyaan Diskusi & Kesimpulan.
- Rubrik Unjuk Kerja / Penilaian.`;
    } else if (type.includes("ATP")) {
      userPrompt += `\nSpesifikasi ATP (Wajib Memuat):
- Rasional & Elemen Capaian Pembelajaran.
- Alur Tujuan Pembelajaran per Tahap/Materi.
- Alokasi Waktu, Kata Kunci, Profil Pelajar Pancasila.
- Glosarium Singkat & Indikator Ketercapaian.`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const content = response.text || "Gagal menghasilkan dokumen.";

    res.json({
      success: true,
      content,
      meta: {
        type,
        jenjang,
        fase,
        semester,
        mapel,
        materi,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("Error generating document:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Terjadi kesalahan pada server saat membuat dokumen.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GuruPintar AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
