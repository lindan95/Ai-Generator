export type DocumentType =
  | "Modul Ajar"
  | "Alur Tujuan Pembelajaran (ATP)"
  | "KKTP"
  | "LKPD"
  | "Bahan Ajar / Ringkasan Materi"
  | "Soal Pilihan Ganda"
  | "Soal Essay Berbasis AKM"
  | "Rubrik Penilaian"
  | "Modul Projek P5";

export type JenjangType = "SD" | "SMP" | "SMA" | "SMK";

export interface DocFormData {
  type: DocumentType;
  lang: string;
  jenjang: JenjangType;
  fase: string;
  semester: "Ganjil" | "Genap";
  mapel: string;
  materi: string;
  waktu: string;
  cptp: string;
  model: string;
  karakteristik: string;
  customPrompt: string;
}

export interface SavedDocument {
  id: string;
  title: string;
  type: DocumentType;
  mapel: string;
  jenjang: JenjangType;
  fase: string;
  semester: string;
  content: string; // Markdown content
  createdAt: string;
  updatedAt: string;
  teacherName?: string;
  schoolName?: string;
}

export interface TeacherProfile {
  name: string;
  nip: string;
  schoolName: string;
  principalName: string;
  principalNip: string;
  subject: string;
}
