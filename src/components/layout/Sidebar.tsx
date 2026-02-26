import { motion } from "motion/react";
import { 
  ShieldCheck, 
  FileCode, 
  Search, 
  Settings, 
  Activity, 
  AlertTriangle,
  Download,
  Play,
  Terminal,
  FileSearch,
  Languages
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { t, language, setLanguage } = useLanguage();

  const menuItems = [
    { id: "overview", label: t.sidebar.overview, icon: Activity },
    { id: "files", label: t.sidebar.files, icon: FileSearch },
    { id: "manifest", label: t.sidebar.manifest, icon: FileCode },
    { id: "security", label: t.sidebar.security, icon: ShieldCheck },
    { id: "console", label: t.sidebar.console, icon: Terminal },
  ];

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-screen text-zinc-400 rtl:border-l rtl:border-r-0">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-emerald-500">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-bold text-lg text-zinc-100 tracking-tight">{t.app.title}</span>
        </div>
        <div className="text-xs mt-1 text-zinc-500 font-mono">{t.app.version}</div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id 
                ? "bg-zinc-800 text-emerald-400" 
                : "hover:bg-zinc-800/50 hover:text-zinc-200"
            )}
          >
            <item.icon className="w-4 h-4 rtl:rotate-180" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800 space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
            <Languages className="w-4 h-4" />
            <span>Language</span>
          </div>
          <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
            <button 
              onClick={() => setLanguage('en')}
              className={cn(
                "px-2 py-0.5 text-xs rounded-md transition-colors",
                language === 'en' ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              EN
            </button>
            <button 
              onClick={() => setLanguage('ar')}
              className={cn(
                "px-2 py-0.5 text-xs rounded-md transition-colors",
                language === 'ar' ? "bg-zinc-800 text-zinc-200" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              AR
            </button>
          </div>
        </div>

        <div className="bg-zinc-950 rounded-lg p-3 border border-zinc-800">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-2">
            <Activity className="w-3 h-3 text-emerald-500" />
            {t.app.status}
          </div>
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>{t.app.engine}</span>
            <span className="text-emerald-500">{t.app.ready}</span>
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>{t.app.decompiler}</span>
            <span className="text-emerald-500">{t.app.idle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
