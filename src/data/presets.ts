import { DocFormData, SavedDocument } from "../types";

export const PRESET_TEMPLATES: { label: string; description: string; data: Partial<DocFormData> }[] = [
  {
    label: "Modul Ajar IPAS SD Kelas 4 - Ekosistem",
    description: "Modul Ajar Pembelajaran Berdiferensiasi & PBL",
    data: {
      type: "Modul Ajar",
      jenjang: "SD",
      fase: "Fase B (Kelas 3-4)",
      semester: "Ganjil",
      mapel: "IPAS",
      materi: "Komponen Ekosistem dan Rantai Makanan",
      waktu: "2 x 35 Menit (1 Pertemuan)",
      cptp: "Peserta didik menganalisis hubungan antar makhluk hidup dan lingkungannya dalam bentuk rantai makanan.",
      model: "Problem Based Learning (PBL)",
      karakteristik: "Siswa aktif, menyukai pengamatan langsung dan media visual.",
    },
  },
  {
    label: "Soal HOTS Matematika SMP Kelas 8 - Persamaan Kuadrat",
    description: "5 Soal PG HOTS + 2 Essay AKM Berkonteks Nyata",
    data: {
      type: "Soal Pilihan Ganda",
      jenjang: "SMP",
      fase: "Fase D (Kelas 7-9)",
      semester: "Ganjil",
      mapel: "Matematika",
      materi: "Persamaan dan Fungsi Kuadrat dalam Kehidupan Sehari-hari",
      waktu: "80 Menit",
      cptp: "Peserta didik dapat menyelesaikan masalah konstektual yang berkaitan dengan fungsi kuadrat.",
      model: "Diserahkan ke AI (Otomatis)",
      karakteristik: "Tingkat pemahaman variatif, memerlukan soal bertingkat dari mudah hingga HOTS.",
    },
  },
  {
    label: "LKPD Bahasa Indonesia SMA Kelas 10 - Teks LHO",
    description: "Lembar Kerja Siswa Eksplorasi Teks Laporan Hasil Observasi",
    data: {
      type: "LKPD",
      jenjang: "SMA",
      fase: "Fase E (Kelas 10)",
      semester: "Ganjil",
      mapel: "Bahasa Indonesia",
      materi: "Menganalisis Struktur & Kaidah Teks Laporan Hasil Observasi",
      waktu: "2 x 45 Menit",
      cptp: "Peserta didik mampu mengevaluasi informasi berupa gagasan, pikiran, pandangan, atau pesan dari teks LHO.",
      model: "Project Based Learning (PjBL)",
      karakteristik: "Siswa terbiasa menggunakan laptop/gadget untuk observasi lingkungan sekolah.",
    },
  },
  {
    label: "Modul Projek P5 SMA - Gaya Hidup Berkelanjutan",
    description: "Tema Pengolahan Sampah Organik Menjadi Kompos & Eko-Enzim",
    data: {
      type: "Modul Projek P5",
      jenjang: "SMA",
      fase: "Fase E (Kelas 10)",
      semester: "Genap",
      mapel: "Projek Penguatan Profil Pelajar Pancasila (P5)",
      materi: "Pengelolaan Sampah Mandiri di Lingkungan Sekolah",
      waktu: "40 JP (Blok)",
      cptp: "Mengembangkan dimensi Gotong Royong dan Bernalar Kritis dalam aksi nyata kelestarian lingkungan.",
      model: "Project Based Learning (PjBL)",
      karakteristik: "Mendorong kolaborasi lintas kelas dan partisipasi masyarakat sekitar.",
    },
  },
];

export const INITIAL_DEMO_DOCUMENTS: SavedDocument[] = [
  {
    id: "demo-1",
    title: "Modul Ajar - Ekosistem dan Rantai Makanan",
    type: "Modul Ajar",
    mapel: "IPAS",
    jenjang: "SD",
    fase: "Fase B (Kelas 3-4)",
    semester: "Ganjil",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    content: `# MODUL AJAR KURIKULUM MERDEKA
## IPAS - FASE B (KELAS 4)

---

### I. INFORMASI UMUM
* **Penyusun:** Budi Santoso, S.Pd
* **Instansi:** SD Negeri 01 Nusantara
* **Tahun Penyusunan:** 2026
* **Jenjang / Fase:** SD / Fase B (Kelas 4)
* **Mata Pelajaran:** Ilmu Pengetahuan Alam dan Sosial (IPAS)
* **Materi Utama:** Ekosistem dan Rantai Makanan
* **Alokasi Waktu:** 2 x 35 Menit (1 Pertemuan)

#### A. Profil Pelajar Pancasila (P3)
1. **Bernalar Kritis:** Mengidentifikasi dan menganalisis peran Produsen, Konsumen, dan Pengurai dalam ekosistem.
2. **Gotong Royong:** Bekerja sama dalam kelompok untuk menyusun bagan rantai makanan.
3. **Kreatif:** Membuat poster atau jaring-jaring makanan secara mandiri.

#### B. Sarana dan Prasarana
* Proyektor, Kartu Gambar Hewan & Tumbuhan, Lembar Kerja Siswa, Laptop, Lingkungan Taman Sekolah.

#### C. Target Peserta Didik & Model Pembelajaran
* **Target:** 28 Peserta didik reguler (heterogen).
* **Model Pembelajaran:** *Problem Based Learning* (PBL) berorientasi *Differentiated Learning*.

---

### II. KOMPONEN INTI

#### A. Tujuan Pembelajaran (TP)
1. Peserta didik dapat **mengidentifikasi** komponen biotik dan abiotik dalam suatu ekosistem dengan benar.
2. Peserta didik mampu **menganalisis** alur energi dalam bentuk rantai makanan minimal 4 tingkat trofik.
3. Peserta didik dapat **memprediksi** dampak jika salah satu komponen rantai makanan mengalami kepunahan.

#### B. Pemahaman Bermakna
Semua makhluk hidup saling bergantung satu sama lain. Terganggunya satu spesies dalam rantai makanan akan berdampak pada seluruh keseimbangan lingkungan hidup.

#### C. Pertanyaan Pemantik
1. *Apa yang akan terjadi pada rumput di kebun jika seluruh katak tiba-tiba menghilang?*
2. *Dari mana harimau mendapatkan energi jika tidak ada tumbuhan di hutan?*

![Bagan Rantai Makanan & Ekosistem Hutan](https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80)

---

### III. KEGIATAN PEMBELAJARAN (2 x 35 MENIT)

#### 1. Kegiatan Pendahuluan (10 Menit)
* Guru membuka pelajaran dengan salam, doa, dan mengecek kehadiran.
* **Apersepsi:** Guru menampilkan video pendek 2 menit tentang taman sekolah dan mengajukan pertanyaan pemantik.
* Guru menyampaikan tujuan pembelajaran dan penilaian hari ini.

#### 2. Kegiatan Inti (50 Menit) - Sintaks PBL
* **Orientasi Masalah (10 Menit):** Guru menyajikan kasus: *"Mengapa populasi tikus di sawah Desa Makmur melonjak drastis setelah ular sawah diburu?"*
* **Mengorganisasi Siswa (10 Menit):** Siswa dibagi menjadi 5 kelompok heterogen. Masing-masing kelompok menerima *Set Kartu Ekosistem*.
* **Bimbingan Penyelidikan (15 Menit):** Siswa mendiskusikan urutan rantai makanan dan mengelompokkan Produsen, Konsumen I, II, III, dan Pengurai.
* **Mengembangkan & Menyajikan Hasil (15 Menit):** Masing-masing kelompok mempresentasikan diagram rantai makanan buatannya di depan kelas.

#### 3. Kegiatan Penutup (10 Menit)
* Guru dan siswa menyimpulkan poin utama materi.
* Refleksi belajar singkat menggunakan *Sticker Perasaan*.
* Guru memberikan umpan balik dan menginformasikan rencana pertemuan berikutnya.

---

### IV. ASESMEN & EVALUASI
| Jenis Asesmen | Bentuk Penilaian | Instrumen |
| :--- | :--- | :--- |
| **Diagnostik** | Tanya Jawab Lisan | Pertanyaan Pemantik |
| **Formatif** | Unjuk Kerja Kelompok | Rubrik Diskusi & Presentasi |
| **Sumatif** | Tes Tertulis (5 Soal) | Lembar Evaluasi Mandiri |

---

### V. LAMPIRAN
1. **Lembar Kerja Peserta Didik (LKPD)**
2. **Glosarium:** Biotik, Abiotik, Trofik, Konsumen Apex, Dekomposer.
3. **Daftar Pustaka:** Buku Siswa IPAS Kelas IV Kemendikbudristek 2023.
`,
  },
  {
    id: "demo-2",
    title: "Soal HOTS & AKM Matematika - Fungsi Kuadrat",
    type: "Soal Pilihan Ganda",
    mapel: "Matematika",
    jenjang: "SMP",
    fase: "Fase D (Kelas 7-9)",
    semester: "Ganjil",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    content: `# BANK SOAL HOTS & ASESMEN AKM
## MATEMATIKA FASE D (KELAS VIII) - FUNGSI KUADRAT

---

### STIMULUS AKM: LINTASAN AIR MANCUR TAMAN KOTA
Sebut saja Taman Kota Merdeka memiliki atraksi air mancur menari. Lintasan semprotan air dari salah satu nozel membentuk kurva parabola dengan persamaan ketinggian $h(t) = -2t^2 + 8t$, di mana $h$ adalah tinggi air dalam meter dan $t$ adalah waktu dalam detik setelah air disemprotkan.

![Ilustrasi Grafik Parabola Air Mancur Taman](https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80)

Persamaan umum fungsi kuadrat dirumuskan sebagai:
$$f(x) = ax^2 + bx + c$$

Di mana titik puncak parabola atau nilai ekstrem dirumuskan dengan rumus kuadratik:
$$t_p = - \frac{b}{2a} \quad \text{dan} \quad h_{max} = \frac{D}{-4a} = \frac{b^2 - 4ac}{-4a}$$

---

#### SOAL 1 (Pilihan Ganda HOTS - C4)
Berdasarkan stimulus di atas, berapa tinggi maksimum yang dapat dicapai oleh semprotan air mancur tersebut?
* **A.** 4 meter
* **B.** 8 meter
* **C.** 12 meter
* **D.** 16 meter

* **Kunci Jawaban:** **B. 8 meter**
* **Pembahasan:**
  Fungsi $h(t) = -2t^2 + 8t$ memotong sumbu simetri pada $t = -b / (2a) = -8 / (2 \cdot -2) = 2$ detik.
  Tinggi maksimum $h(2) = -2(2)^2 + 8(2) = -8 + 16 = 8$ meter.

---

#### SOAL 2 (Pilihan Ganda Kompleks - C5)
Tentukan kebenaran dari pernyataan berikut berdasarkan persamaan $h(t) = -2t^2 + 8t$:
1. Air mancur mencapai tanah kembali pada detik ke-4. *(Benar / Salah)*
2. Pada detik ke-1 dan detik ke-3, tinggi air mancur adalah sama yaitu 6 meter. *(Benar / Salah)*
3. Air mancur terus membumbung tinggi tanpa batas waktu. *(Benar / Salah)*

* **Kunci Jawaban:**
  1. **Benar** (karena $-2t^2 + 8t = 0 \implies t( -2t + 8 ) = 0 \implies t = 4$).
  2. **Benar** ($h(1) = -2(1) + 8 = 6$ m, $h(3) = -2(9) + 24 = 6$ m).
  3. **Salah** (fungsi kuadrat bernilai negatif terbuka ke bawah).

---

### PEDOMAN PENSKORAN
* Soal Pilihan Ganda: Skor 1 jika benar, 0 jika salah.
* Soal Kompleks: Skor 2 jika semua opsi tepat, Skor 1 jika 2 opsi tepat.
`,
  },
];
