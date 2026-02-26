import JSZip from "jszip";
import { File, Folder, FileCode, Image, FileText } from "lucide-react";
import { useState, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FileExplorerProps {
  zip: JSZip;
}

export function FileExplorer({ zip }: FileExplorerProps) {
  const [search, setSearch] = useState("");
  const { t } = useLanguage();

  const files = useMemo(() => {
    return Object.keys(zip.files)
      .filter(name => !zip.files[name].dir)
      .filter(name => name.toLowerCase().includes(search.toLowerCase()))
      .sort();
  }, [zip, search]);

  const getIcon = (name: string) => {
    if (name.endsWith(".xml")) return <FileCode className="w-4 h-4 text-orange-400" />;
    if (name.endsWith(".png") || name.endsWith(".jpg")) return <Image className="w-4 h-4 text-purple-400" />;
    if (name.endsWith(".dex")) return <FileCode className="w-4 h-4 text-emerald-400" />;
    if (name.endsWith(".so")) return <File className="w-4 h-4 text-blue-400" />;
    return <FileText className="w-4 h-4 text-zinc-500" />;
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-200">{t.explorer.title}</h2>
        <input
          type="text"
          placeholder={t.explorer.filter}
          className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500/50 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-500 font-medium sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 border-b border-zinc-800 rtl:text-right">{t.explorer.fileName}</th>
              <th className="px-4 py-3 border-b border-zinc-800 w-32 text-right rtl:text-left">{t.explorer.size}</th>
              <th className="px-4 py-3 border-b border-zinc-800 w-48 text-right rtl:text-left">{t.explorer.date}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {files.map((fileName) => {
              const file = zip.files[fileName];
              // @ts-ignore - _data is internal but often accessible, or use date
              const date = file.date.toLocaleDateString();
              // @ts-ignore
              const size = (file._data?.uncompressedSize || 0) / 1024;

              return (
                <tr key={fileName} className="hover:bg-zinc-800/30 transition-colors group cursor-default">
                  <td className="px-4 py-2 text-zinc-300 font-mono text-xs flex items-center gap-3">
                    {getIcon(fileName)}
                    <span className="truncate max-w-md ltr:text-left rtl:text-right" dir="ltr">{fileName}</span>
                  </td>
                  <td className="px-4 py-2 text-zinc-500 font-mono text-xs text-right rtl:text-left">
                    {size > 0 ? `${size.toFixed(1)} KB` : "-"}
                  </td>
                  <td className="px-4 py-2 text-zinc-500 font-mono text-xs text-right rtl:text-left">
                    {date}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {files.length === 0 && (
          <div className="p-12 text-center text-zinc-500">
            {t.explorer.noFiles}
          </div>
        )}
      </div>
    </div>
  );
}
