import React, { useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

import {
  Copy,
  Printer,
  Download,
  FileText,
  Save,
  Wand2,
  Edit3,
  Check,
  ArrowLeft,
  Building2,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  Calculator,
  Maximize2,
  X,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { SavedDocument, TeacherProfile } from "../types";

interface DocumentViewerProps {
  document: SavedDocument;
  onUpdateContent: (newContent: string) => void;
  onSaveToHistory: () => void;
  onOpenRefineModal: () => void;
  onBack: () => void;
  profile: TeacherProfile;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

const MATH_SNIPPETS = [
  { label: "Pecahan (\\frac)", snippet: "$\\frac{a}{b}$" },
  { label: "Akar (\\sqrt)", snippet: "$\\sqrt{x}$" },
  { label: "Pangkat / Indeks", snippet: "$x^2 + y^2 = r^2$" },
  { label: "Rumus Kuadratik", snippet: "$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$" },
  { label: "Integral Tentu", snippet: "$$\\int_{a}^{b} f(x) dx$$" },
  { label: "Sumasi (Sigma)", snippet: "$$\\sum_{i=1}^{n} x_i$$" },
  { label: "Limit Fungsi", snippet: "$$\\lim_{x \\to \\infty} \\frac{1}{x} = 0$$" },
];

const IMAGE_TEMPLATES = [
  {
    title: "Rantai Makanan / Ekosistem",
    url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
    snippet: "![Bagan Rantai Makanan & Ekosistem](https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80)",
  },
  {
    title: "Matematika & Geometri",
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    snippet: "![Diagram Matematika & Rumus Geometry](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80)",
  },
  {
    title: "Sains & Praktikum Laboratorium",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    snippet: "![Peralatan Eksperimen Laboratorium IPA](https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80)",
  },
  {
    title: "Peta & Geografi",
    url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
    snippet: "![Peta Topografi & Kebumian](https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80)",
  },
];

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document: doc,
  onUpdateContent,
  onSaveToHistory,
  onOpenRefineModal,
  onBack,
  profile,
  showToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(doc.content);
  const [copied, setCopied] = useState(false);
  const [includeKop, setIncludeKop] = useState(true);
  const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null);
  const [showHelperModal, setShowHelperModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editContent : doc.content);
    setCopied(true);
    showToast("Teks dokumen disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsertSnippet = (snippet: string) => {
    setEditContent((prev) => prev + "\n\n" + snippet);
    setIsEditing(true);
    showToast("Teks/Rumus disisipkan ke editor!");
  };

  const handleDownload = () => {
    const blob = new Blob([isEditing ? editContent : doc.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${doc.type.replace(/[^a-zA-Z0-9]/g, "_")}_${doc.mapel.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("File Markdown terunduh!");
  };

  const handleDownloadDocx = () => {
    const documentBodyHtml = document.getElementById("printable-doc-content")?.innerHTML || "";

    const kopHtml = includeKop && profile.schoolName ? `
      <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px;">
        <h2 style="font-size: 14pt; margin: 0; font-weight: bold; text-transform: uppercase;">PEMERINTAH KABUPATEN / KOTA DINAS PENDIDIKAN</h2>
        <h1 style="font-size: 16pt; margin: 4px 0; font-weight: bold; text-transform: uppercase;">${profile.schoolName}</h1>
        <p style="font-size: 10pt; margin: 0; font-style: italic;">Mata Pelajaran: ${doc.mapel} | Fase/Kelas: ${doc.fase} | Semester: ${doc.semester}</p>
      </div>
    ` : "";

    const ttdaHtml = profile.principalName || profile.name ? `
      <table style="width: 100%; margin-top: 40px; border: none;">
        <tr style="border: none;">
          <td style="width: 50%; text-align: center; border: none; vertical-align: top;">
            <p>Mengetahui,<br/><b>Kepala Sekolah ${profile.schoolName || ''}</b></p>
            <br/><br/><br/>
            <p style="font-weight: bold; text-decoration: underline; margin: 0;">${profile.principalName || '( ................................................ )'}</p>
            <p style="margin: 0; font-size: 10pt;">NIP. ${profile.principalNip || '........................................'}</p>
          </td>
          <td style="width: 50%; text-align: center; border: none; vertical-align: top;">
            <p>Guru Mata Pelajaran,<br/><br/></p>
            <br/><br/><br/>
            <p style="font-weight: bold; text-decoration: underline; margin: 0;">${profile.name || '( ................................................ )'}</p>
            <p style="margin: 0; font-size: 10pt;">NIP. ${profile.nip || '........................................'}</p>
          </td>
        </tr>
      </table>
    ` : "";

    const fullWordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${doc.title}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Calibri', 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; color: #000; }
          h1, h2, h3, h4 { color: #000; font-family: 'Calibri', 'Times New Roman', serif; }
          h1 { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 12pt; }
          h2 { font-size: 13pt; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 3pt; margin-top: 14pt; }
          h3 { font-size: 12pt; font-weight: bold; margin-top: 10pt; }
          table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
          th, td { border: 1px solid #000; padding: 6pt; text-align: left; font-size: 10.5pt; }
          th { background-color: #f2f2f2; font-weight: bold; }
          ul, ol { padding-left: 20pt; }
          li { margin-bottom: 3pt; }
        </style>
      </head>
      <body>
        ${kopHtml}
        ${documentBodyHtml}
        ${ttdaHtml}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + fullWordHtml], {
      type: 'application/msword;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `${doc.type.replace(/[^a-zA-Z0-9]/g, "_")}_${doc.mapel.replace(/[^a-zA-Z0-9]/g, "_")}.doc`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Dokumen Microsoft Word (${fileName}) terunduh!`, "success");
  };

  const handlePrint = () => {
    showToast("Menyiapkan dokumen A4 untuk dicetak...", "info");
    const contentToPrint = isEditing ? editContent : doc.content;

    const kopHtml = includeKop && profile.schoolName ? `
      <div style="text-align: center; border-bottom: 3px double #000; padding-bottom: 12px; margin-bottom: 24px;">
        <h2 style="font-size: 16pt; margin: 0; font-weight: bold; text-transform: uppercase;">PEMERINTAH KABUPATEN / KOTA DINAS PENDIDIKAN</h2>
        <h1 style="font-size: 18pt; margin: 4px 0; font-weight: bold; text-transform: uppercase;">${profile.schoolName}</h1>
        <p style="font-size: 10pt; margin: 0; font-style: italic;">Mata Pelajaran: ${doc.mapel} | Fase/Kelas: ${doc.fase} | Semester: ${doc.semester}</p>
      </div>
    ` : "";

    const ttdaHtml = profile.principalName || profile.name ? `
      <div style="margin-top: 40px; display: flex; justify-content: space-between; page-break-inside: avoid;">
        <div style="width: 45%; text-align: center;">
          <p style="margin-bottom: 60px;">Mengetahui,<br/><b>Kepala Sekolah ${profile.schoolName || ''}</b></p>
          <p style="font-weight: bold; text-decoration: underline; margin: 0;">${profile.principalName || '( ................................................ )'}</p>
          <p style="margin: 0; font-size: 10pt;">NIP. ${profile.principalNip || '........................................'}</p>
        </div>
        <div style="width: 45%; text-align: center;">
          <p style="margin-bottom: 60px;">Guru Mata Pelajaran,<br/><br/></p>
          <p style="font-weight: bold; text-decoration: underline; margin: 0;">${profile.name || '( ................................................ )'}</p>
          <p style="margin: 0; font-size: 10pt;">NIP. ${profile.nip || '........................................'}</p>
        </div>
      </div>
    ` : "";

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Gagal membuka jendela cetak. Periksa popup blocker.", "error");
      return;
    }

    // Convert markdown headings/lists roughly or render html container
    const documentBodyHtml = document.getElementById("printable-doc-content")?.innerHTML || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Cetak Perangkat - ${doc.title}</title>
        <style>
          @page { size: A4 portrait; margin: 2cm; }
          body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; color: #000; padding: 0; margin: 0; }
          h1, h2, h3, h4 { font-family: 'Times New Roman', Times, serif; color: #000; }
          h1 { font-size: 16pt; text-align: center; margin-top: 0; }
          h2 { font-size: 14pt; border-bottom: 1px solid #333; padding-bottom: 4px; margin-top: 1.5em; }
          h3 { font-size: 12pt; margin-top: 1em; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 11pt; }
          th { background-color: #f2f2f2; font-weight: bold; }
          ul, ol { padding-left: 24px; }
          li { margin-bottom: 4px; }
          .no-print { display: none; }
        </style>
      </head>
      <body>
        ${kopHtml}
        <div>${documentBodyHtml}</div>
        ${ttdaHtml}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          };
        <\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSaveEdit = () => {
    onUpdateContent(editContent);
    setIsEditing(false);
    showToast("Perubahan teks disimpan!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-16">
      
      {/* Navigation & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs sticky top-20 z-20 backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {doc.type}
            </span>
            <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
              {doc.title}
            </h1>
          </div>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => {
              if (isEditing) handleSaveEdit();
              else setIsEditing(true);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isEditing
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
            }`}
          >
            {isEditing ? (
              <>
                <Check className="w-4 h-4" /> Simpan Edit
              </>
            ) : (
              <>
                <Edit3 className="w-4 h-4" /> Edit Teks
              </>
            )}
          </button>

          <button
            onClick={() => setShowHelperModal(true)}
            className="px-3 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold flex items-center gap-1.5 transition-all"
            title="Sisipkan Rumus Matematika atau Gambar Edukasi"
          >
            <Calculator className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Sisip Rumus / Gambar</span>
          </button>

          <button
            onClick={onOpenRefineModal}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300/50 dark:border-amber-700/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Wand2 className="w-4 h-4 text-amber-500" />
            <span>Refine AI</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>Salin</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            className="px-3.5 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            title="Unduh format Microsoft Word / Google Docs"
          >
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Unduh .DOC (Word)</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Unduh .MD</span>
          </button>

          <button
            onClick={onSaveToHistory}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan</span>
          </button>

        </div>
      </div>

      {/* Metadata Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            Mapel: <strong className="text-slate-800 dark:text-slate-200">{doc.mapel}</strong>
          </span>
          <span>•</span>
          <span>
            Fase/Kelas: <strong className="text-slate-800 dark:text-slate-200">{doc.fase}</strong>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            {new Date(doc.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs select-none">
            <input
              type="checkbox"
              checked={includeKop}
              onChange={(e) => setIncludeKop(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Sertakan Kop Sekolah saat Cetak</span>
          </label>
        </div>
      </div>

      {/* Document Output Canvas */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-slate-200/50 dark:shadow-none min-h-[600px] transition-all">
        
        {/* Optional Header Kop Preview inside Document view */}
        {includeKop && profile.schoolName && (
          <div className="border-b-2 border-double border-slate-800 dark:border-slate-200 pb-4 mb-8 text-center space-y-1">
            <h3 className="text-xs font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              PEMERINTAH KABUPATEN / KOTA DINAS PENDIDIKAN
            </h3>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase">
              {profile.schoolName}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">
              {doc.type} • Mata Pelajaran: {doc.mapel} • {doc.fase} ({doc.semester})
            </p>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
              <span>Mode Editor Teks Markdown Langsung</span>
              <span>Tekan 'Simpan Edit' di atas jika selesai</span>
            </div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={24}
              className="w-full p-4 rounded-xl font-mono text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-800 focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
            />
          </div>
        ) : (
          <div id="printable-doc-content" className="prose prose-slate dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-relaxed">
            <Markdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                img: ({ node, ...props }) => {
                  const altText = props.alt || "Gambar Ilustrasi Pembelajaran";
                  return (
                    <figure className="my-8 text-center group">
                      <div className="relative inline-block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shadow-md transition-all group-hover:shadow-xl">
                        <img
                          {...props}
                          alt={altText}
                          className="max-h-[420px] w-auto mx-auto object-contain rounded-xl cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
                          loading="lazy"
                          onClick={() => props.src && setPreviewImage({ url: props.src, alt: altText })}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80";
                          }}
                        />
                        <button
                          onClick={() => props.src && setPreviewImage({ url: props.src, alt: altText })}
                          className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/80 text-white hover:bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center gap-1 text-xs"
                          title="Perbesar Gambar"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Perbesar</span>
                        </button>
                      </div>
                      {props.alt && (
                        <figcaption className="mt-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 italic flex items-center justify-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                          <span>📌 {props.alt}</span>
                        </figcaption>
                      )}
                    </figure>
                  );
                },
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <table className="w-full text-left text-sm border-collapse" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => (
                  <th className="bg-slate-100 dark:bg-slate-800/80 p-3.5 font-bold border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100" {...props} />
                ),
                td: ({ node, ...props }) => (
                  <td className="p-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300" {...props} />
                ),
              }}
            >
              {doc.content}
            </Markdown>
          </div>
        )}

        {/* Signature Area Preview */}
        {profile.principalName || profile.name ? (
          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-8 text-center text-xs text-slate-700 dark:text-slate-300">
            <div>
              <p className="mb-16">
                Mengetahui,<br />
                <strong>Kepala Sekolah {profile.schoolName}</strong>
              </p>
              <p className="font-bold underline text-slate-900 dark:text-slate-100">
                {profile.principalName || "................................................"}
              </p>
              <p className="text-[11px] text-slate-500">
                NIP. {profile.principalNip || "........................................"}
              </p>
            </div>

            <div>
              <p className="mb-16">
                Guru Mata Pelajaran,<br />
                <br />
              </p>
              <p className="font-bold underline text-slate-900 dark:text-slate-100">
                {profile.name || "................................................"}
              </p>
              <p className="text-[11px] text-slate-500">
                NIP. {profile.nip || "........................................"}
              </p>
            </div>
          </div>
        ) : null}

      </div>

      {/* Image Zoom Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-4xl w-full bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-500" />
                <span>{previewImage.alt || "Prinjauan Gambar / Diagram Pembelajaran"}</span>
              </h3>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center bg-slate-900 rounded-2xl p-2 min-h-[300px] max-h-[70vh] overflow-hidden">
              <img
                src={previewImage.url}
                alt={previewImage.alt}
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 italic">
              {previewImage.alt}
            </p>
          </div>
        </div>
      )}

      {/* Helper Modal for Inserting Math Formula & Images */}
      {showHelperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Bantuan Rumus LaTeX & Gambar Edukasi
                  </h3>
                  <p className="text-xs text-slate-500">Klik komponen di bawah untuk menyisipkan ke dokumen</p>
                </div>
              </div>
              <button
                onClick={() => setShowHelperModal(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formula Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Format Rumus Matematika (KaTeX)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {MATH_SNIPPETS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleInsertSnippet(item.snippet);
                      setShowHelperModal(false);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                      <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                    </div>
                    <code className="mt-1 block text-[11px] text-indigo-600 dark:text-indigo-400 font-mono truncate">
                      {item.snippet}
                    </code>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Section */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                <span>Preset Gambar & Diagram Pembelajaran</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {IMAGE_TEMPLATES.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleInsertSnippet(img.snippet);
                      setShowHelperModal(false);
                    }}
                    className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-left transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-slate-200 dark:border-slate-800"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{img.title}</p>
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-1 group-hover:underline">
                        <PlusCircle className="w-3 h-3" /> Sisipkan Gambar
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
