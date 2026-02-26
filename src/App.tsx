import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { FileUploader } from "@/components/dashboard/FileUploader";
import { Overview } from "@/components/dashboard/Overview";
import { FileExplorer } from "@/components/dashboard/FileExplorer";
import { ManifestViewer } from "@/components/dashboard/ManifestViewer";
import { SecurityReport } from "@/components/dashboard/SecurityReport";
import { DebugConsole } from "@/components/dashboard/DebugConsole";
import { HexViewer } from "@/components/dashboard/HexViewer";
import { DataInspector } from "@/components/dashboard/DataInspector";
import JSZip from "jszip";
import { motion, AnimatePresence } from "motion/react";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";

function AppContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [file, setFile] = useState<File | null>(null);
  const [zipContent, setZipContent] = useState<JSZip | null>(null);
  const { t } = useLanguage();

  const handleFileLoaded = (file: File, zip: JSZip) => {
    setFile(file);
    setZipContent(zip);
    setActiveTab("overview");
  };

  const renderContent = () => {
    if (!file || !zipContent) {
      return <FileUploader onFileLoaded={handleFileLoaded} />;
    }

    switch (activeTab) {
      case "overview":
        return <Overview file={file} zip={zipContent} />;
      case "files":
        return <FileExplorer zip={zipContent} />;
      case "manifest":
        return <ManifestViewer zip={zipContent} />;
      case "security":
        return <SecurityReport zip={zipContent} />;
      case "hex":
        return <HexViewer />;
      case "data":
        return <DataInspector />;
      case "console":
        return <DebugConsole />;
      default:
        return <Overview file={file} zip={zipContent} />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-zinc-100">
              {file ? file.name : t.app.title}
            </h1>
            {file && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-mono border border-emerald-500/20">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            )}
          </div>
          
          {file && (
            <button 
              onClick={() => { setFile(null); setZipContent(null); }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {t.app.closeSession}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-auto bg-zinc-950 p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (file ? "-loaded" : "-empty")}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
