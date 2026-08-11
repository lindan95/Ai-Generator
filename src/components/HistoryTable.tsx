import React, { useState } from "react";
import {
  Search,
  FolderOpen,
  Eye,
  Trash2,
  Copy,
  Printer,
  Download,
  FileText,
  BookOpen,
  Calendar,
  Filter,
} from "lucide-react";
import { SavedDocument } from "../types";

interface HistoryTableProps {
  documents: SavedDocument[];
  onViewDocument: (doc: SavedDocument) => void;
  onDeleteDocument: (id: string) => void;
  showToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({
  documents,
  onViewDocument,
  onDeleteDocument,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("Semua");

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fase.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "Semua" || doc.type.toLowerCase().includes(filterType.toLowerCase());

    return matchesSearch && matchesType;
  });

  const handleCopyQuick = (content: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    showToast("Teks dokumen disalin ke clipboard!");
  };

  const handleDownloadDocQuick = (doc: SavedDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    const fullWordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>${doc.title}</title>
        <style>
          body { font-family: 'Calibri', 'Times New Roman', serif; font-size: 11pt; line-height: 1.5; color: #000; }
          h1, h2, h3 { color: #000; }
          h1 { font-size: 16pt; font-weight: bold; text-align: center; }
          h2 { font-size: 13pt; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 3pt; margin-top: 14pt; }
          table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
          th, td { border: 1px solid #000; padding: 6pt; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${doc.title}</h1>
        <p><b>Mata Pelajaran:</b> ${doc.mapel} | <b>Fase:</b> ${doc.fase} | <b>Semester:</b> ${doc.semester}</p>
        <hr/>
        <div>${doc.content.replace(/\n/g, '<br/>')}</div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + fullWordHtml], { type: 'application/msword;charset=utf-8' });
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fadeIn px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              Riwayat Perangkat Pembelajaran
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kumpulan dokumen Modul Ajar, ATP, LKPD, dan Asesmen yang telah Anda buat.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari judul, mapel, atau fase..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:block" />
          {["Semua", "Modul", "Soal", "LKPD", "ATP"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === type
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

      </div>

      {/* Document Cards / Table Grid */}
      {filteredDocs.length === 0 ? (
        <div className="text-center py-20 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
            Tidak ada dokumen yang ditemukan
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau buat dokumen baru dengan AI Generator.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onViewDocument(doc)}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                    {doc.type}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-snug">
                  {doc.title}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">{doc.mapel}</span>
                  <span>•</span>
                  <span>{doc.fase}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-medium">
                  {doc.content.length > 500 ? `${Math.round(doc.content.length / 5)} kata` : "Dokumen Ringkas"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleCopyQuick(doc.content, e)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                    title="Salin Teks"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => handleDownloadDocQuick(doc, e)}
                    className="p-1.5 rounded-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                    title="Unduh .DOC (Word)"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDocument(doc);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                    title="Buka Dokumen"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
