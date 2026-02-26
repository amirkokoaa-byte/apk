import { Upload, FileUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import JSZip from "jszip";
import { useLanguage } from "@/contexts/LanguageContext";

interface FileUploaderProps {
  onFileLoaded: (file: File, zipContent: JSZip) => void;
}

export function FileUploader({ onFileLoaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.name.endsWith(".apk") && !file.name.endsWith(".zip") && !file.name.endsWith(".xapk")) {
      setError(t.upload.xapkError);
      return;
    }

    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      onFileLoaded(file, content);
    } catch (err) {
      console.error(err);
      setError(t.upload.corrupt);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div
        className={cn(
          "w-full max-w-xl border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer",
          isDragging 
            ? "border-emerald-500 bg-emerald-500/5" 
            : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800/50",
          error ? "border-red-500/50 bg-red-500/5" : ""
        )}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".apk,.zip,.xapk"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-xl">
          <FileUp className="w-8 h-8 text-emerald-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-zinc-200 mb-2">
          {t.upload.xapkTitle}
        </h3>
        <p className="text-zinc-500 text-center max-w-sm mb-6">
          {t.upload.xapkDesc}
        </p>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
      
      <div className="mt-8 grid grid-cols-3 gap-6 w-full max-w-xl">
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-zinc-300">{t.upload.fast}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{t.upload.parsing}</div>
        </div>
        <div className="text-center border-x border-zinc-800">
          <div className="text-2xl font-mono font-bold text-zinc-300">{t.upload.secure}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{t.upload.local}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-zinc-300">{t.upload.deep}</div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{t.upload.inspection}</div>
        </div>
      </div>
    </div>
  );
}
