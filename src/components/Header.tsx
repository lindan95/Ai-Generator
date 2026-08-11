import React from "react";
import { GraduationCap, Sparkles, FolderOpen, LayoutDashboard, Moon, Sun, Settings, UserCheck } from "lucide-react";
import { TeacherProfile } from "../types";

interface HeaderProps {
  currentTab: "dashboard" | "generator" | "history";
  setCurrentTab: (tab: "dashboard" | "generator" | "history") => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  profile: TeacherProfile;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
  profile,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
                  GuruPintar AI
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/40 rounded-full border border-blue-200 dark:border-blue-800 uppercase">
                  Kurikulum Merdeka
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Generator Perangkat Pembelajaran & Asesmen Guru
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setCurrentTab("dashboard")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === "dashboard"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setCurrentTab("generator")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === "generator"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
              AI Generator
            </button>

            <button
              onClick={() => setCurrentTab("history")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === "history"
                  ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              Riwayat Dokumen
            </button>
          </nav>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Kop / Settings Button */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 transition-all"
              title="Pengaturan Identitas & Kop Sekolah"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline font-medium">{profile.schoolName || "Atur Kop Sekolah"}</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-xs">
                {profile.name ? profile.name.charAt(0) : "G"}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                  {profile.name}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-500" />
                  Guru
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Tab bar bottom */}
      <div className="md:hidden flex border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2 py-1 justify-around">
        <button
          onClick={() => setCurrentTab("dashboard")}
          className={`flex flex-col items-center py-1 text-[11px] ${
            currentTab === "dashboard" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>
        <button
          onClick={() => setCurrentTab("generator")}
          className={`flex flex-col items-center py-1 text-[11px] ${
            currentTab === "generator" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          Generator
        </button>
        <button
          onClick={() => setCurrentTab("history")}
          className={`flex flex-col items-center py-1 text-[11px] ${
            currentTab === "history" ? "text-blue-600 dark:text-blue-400 font-bold" : "text-slate-500"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Riwayat
        </button>
      </div>
    </header>
  );
};
