import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { GeneratorForm } from "./components/GeneratorForm";
import { DocumentViewer } from "./components/DocumentViewer";
import { HistoryTable } from "./components/HistoryTable";
import { LoadingScreen } from "./components/LoadingScreen";
import { RefineModal } from "./components/RefineModal";
import { ProfileModal } from "./components/ProfileModal";

import { DocumentType, DocFormData, SavedDocument, TeacherProfile } from "./types";
import { INITIAL_DEMO_DOCUMENTS } from "./data/presets";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const STORAGE_KEY_DOCS = "gurupintar_saved_documents";
const STORAGE_KEY_PROFILE = "gurupintar_teacher_profile";

const DEFAULT_PROFILE: TeacherProfile = {
  name: "Budi Santoso, S.Pd",
  nip: "19850512 201001 1 008",
  schoolName: "SD Negeri 01 Nusantara",
  principalName: "Dr. H. Ahmad Dahlan, M.Pd",
  principalNip: "19720315 199803 1 002",
  subject: "Guru Kelas / Mapel",
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<"dashboard" | "generator" | "history" | "loading" | "result">("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [currentDoc, setCurrentDoc] = useState<SavedDocument | null>(null);
  const [profile, setProfile] = useState<TeacherProfile>(DEFAULT_PROFILE);
  const [generatorInitial, setGeneratorInitial] = useState<Partial<DocFormData>>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRefineOpen, setIsRefineOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedDocs = localStorage.getItem(STORAGE_KEY_DOCS);
      if (savedDocs) {
        setDocuments(JSON.parse(savedDocs));
      } else {
        setDocuments(INITIAL_DEMO_DOCUMENTS);
      }

      const savedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (e) {
      console.error("Failed to load state from localStorage:", e);
      setDocuments(INITIAL_DEMO_DOCUMENTS);
    }
  }, []);

  // Save documents to localStorage
  const saveDocumentsToStorage = (newDocs: SavedDocument[]) => {
    setDocuments(newDocs);
    try {
      localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(newDocs));
    } catch (e) {
      console.error("Failed to save documents to localStorage:", e);
    }
  };

  // Save profile to localStorage
  const handleSaveProfile = (newProfile: TeacherProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(newProfile));
      showToast("Pengaturan Kop Sekolah & Profil Guru tersimpan!", "success");
    } catch (e) {
      console.error("Failed to save profile:", e);
    }
  };

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Generate Document API Call
  const handleGenerateDoc = async (formData: DocFormData) => {
    setIsLoading(true);
    setCurrentTab("loading");

    try {
      const response = await fetch("/api/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat dokumen dengan AI.");
      }

      const newDoc: SavedDocument = {
        id: `doc_${Date.now()}`,
        title: `${formData.type} - ${formData.materi}`,
        type: formData.type,
        mapel: formData.mapel,
        jenjang: formData.jenjang,
        fase: formData.fase,
        semester: formData.semester,
        content: data.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        teacherName: profile.name,
        schoolName: profile.schoolName,
      };

      setCurrentDoc(newDoc);
      // Auto save to history list
      const updatedList = [newDoc, ...documents.filter((d) => d.id !== newDoc.id)];
      saveDocumentsToStorage(updatedList);

      setCurrentTab("result");
      showToast("Perangkat Pembelajaran berhasil dihasilkan!", "success");
    } catch (err: any) {
      console.error("Generation error:", err);
      showToast(err.message || "Terjadi kesalahan saat memproses AI.", "error");
      setCurrentTab("generator");
    } finally {
      setIsLoading(false);
    }
  };

  // Refine Document AI
  const handleRefineDoc = async (refinementInstruction: string) => {
    if (!currentDoc) return;
    setIsLoading(true);
    setIsRefineOpen(false);

    try {
      const response = await fetch("/api/generate-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: currentDoc.type,
          mapel: currentDoc.mapel,
          jenjang: currentDoc.jenjang,
          fase: currentDoc.fase,
          materi: currentDoc.title,
          customPrompt: `REVISI DOKUMEN: Tolong perbarui dan sempurnakan dokumen berikut berdasarkan instruksi revisi berikut:\n"[${refinementInstruction}]"\n\nDOKUMEN ASLI SAAT INI:\n${currentDoc.content}`,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal merevisi dokumen.");
      }

      const updatedDoc: SavedDocument = {
        ...currentDoc,
        content: data.content,
        updatedAt: new Date().toISOString(),
      };

      setCurrentDoc(updatedDoc);

      const updatedList = documents.map((d) => (d.id === updatedDoc.id ? updatedDoc : d));
      saveDocumentsToStorage(updatedList);

      showToast("Dokumen berhasil disempurnakan dengan AI!", "success");
    } catch (err: any) {
      console.error("Refine error:", err);
      showToast(err.message || "Gagal memperbarui dokumen.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Document Content manual update
  const handleUpdateCurrentDocContent = (newContent: string) => {
    if (!currentDoc) return;
    const updated = { ...currentDoc, content: newContent, updatedAt: new Date().toISOString() };
    setCurrentDoc(updated);

    const updatedList = documents.map((d) => (d.id === updated.id ? updated : d));
    saveDocumentsToStorage(updatedList);
  };

  // Delete Document
  const handleDeleteDocument = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus dokumen ini dari riwayat?")) {
      const updatedList = documents.filter((d) => d.id !== id);
      saveDocumentsToStorage(updatedList);
      if (currentDoc?.id === id) {
        setCurrentDoc(null);
        setCurrentTab("dashboard");
      }
      showToast("Dokumen dihapus.", "info");
    }
  };

  const handleQuickGenerate = (type: DocumentType) => {
    setGeneratorInitial({ type });
    setCurrentTab("generator");
  };

  const handleApplyPreset = (data: Partial<DocFormData>) => {
    setGeneratorInitial(data);
    setCurrentTab("generator");
    showToast(`Preset "${data.mapel || "Materi"}" dimuat ke generator.`, "info");
  };

  const handleViewDocument = (doc: SavedDocument) => {
    setCurrentDoc(doc);
    setCurrentTab("result");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* Toast Banner */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-slideDown">
          {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
          {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
          {toast.type === "info" && <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />}
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentTab={currentTab === "loading" || currentTab === "result" ? "generator" : currentTab}
        setCurrentTab={(tab) => setCurrentTab(tab)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        profile={profile}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* View Router */}
      <main className="transition-all duration-300">
        {currentTab === "dashboard" && (
          <Dashboard
            documents={documents}
            onQuickGenerate={handleQuickGenerate}
            onApplyPreset={handleApplyPreset}
            onViewDocument={handleViewDocument}
            onDeleteDocument={handleDeleteDocument}
            onNavigateToGenerator={() => setCurrentTab("generator")}
            onOpenSettings={() => setIsSettingsOpen(true)}
            profile={profile}
          />
        )}

        {currentTab === "generator" && (
          <div className="py-6 px-4">
            <GeneratorForm
              onSubmit={handleGenerateDoc}
              initialData={generatorInitial}
              isLoading={isLoading}
            />
          </div>
        )}

        {currentTab === "loading" && (
          <LoadingScreen />
        )}

        {currentTab === "result" && currentDoc && (
          <div className="py-6 px-4">
            <DocumentViewer
              document={currentDoc}
              onUpdateContent={handleUpdateCurrentDocContent}
              onSaveToHistory={() => {
                showToast("Tersimpan di riwayat dokumen!", "success");
              }}
              onOpenRefineModal={() => setIsRefineOpen(true)}
              onBack={() => setCurrentTab("history")}
              profile={profile}
              showToast={showToast}
            />
          </div>
        )}

        {currentTab === "history" && (
          <HistoryTable
            documents={documents}
            onViewDocument={handleViewDocument}
            onDeleteDocument={handleDeleteDocument}
            showToast={showToast}
          />
        )}
      </main>

      {/* Modals */}
      <RefineModal
        isOpen={isRefineOpen}
        onClose={() => setIsRefineOpen(false)}
        onRefine={handleRefineDoc}
        isLoading={isLoading}
      />

      <ProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

    </div>
  );
}
