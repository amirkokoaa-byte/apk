import { useState } from "react";
import { Binary, Eye, Lock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function HexViewer() {
  const { t } = useLanguage();
  // Simulated binary content for a "libnative-lib.so" file
  const generateHexDump = () => {
    const rows = [];
    const header = [
      0x7F, 0x45, 0x4C, 0x46, 0x02, 0x01, 0x01, 0x00, // .ELF....
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00  // ........
    ];
    
    // Generate some random-looking simulation data
    for (let i = 0; i < 16; i++) {
      const row = [];
      for (let j = 0; j < 16; j++) {
        if (i === 0) {
          row.push(header[j]);
        } else {
          row.push(Math.floor(Math.random() * 256));
        }
      }
      rows.push(row);
    }
    return rows;
  };

  const [data] = useState(generateHexDump());

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
          <Binary className="w-5 h-5 text-emerald-500" />
          {t.hex.title}
        </h2>
        <div className="flex items-center gap-2">
           <span className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800 flex items-center gap-1">
             <Lock className="w-3 h-3" />
             {t.hex.readOnly}
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full min-h-0">
        <div className="lg:col-span-2 flex flex-col bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 text-xs font-mono text-zinc-500">
            <div className="w-20">{t.hex.offset}</div>
            <div className="flex-1 grid grid-cols-16 gap-1 text-center">
              {[...Array(16)].map((_, i) => (
                <span key={i}>{i.toString(16).toUpperCase().padStart(2, '0')}</span>
              ))}
            </div>
            <div className="w-32 pl-4 border-l border-zinc-800 ml-4">{t.hex.ascii}</div>
          </div>
          
          <div className="flex-1 overflow-auto p-4 font-mono text-sm" dir="ltr">
            {data.map((row, rowIndex) => (
              <div key={rowIndex} className="flex hover:bg-zinc-900/50 rounded px-1">
                <div className="w-20 text-emerald-500/70 select-none">
                  {(rowIndex * 16).toString(16).toUpperCase().padStart(8, '0')}
                </div>
                <div className="flex-1 grid grid-cols-16 gap-1 text-center">
                  {row.map((byte, colIndex) => (
                    <span 
                      key={colIndex} 
                      className={`${rowIndex === 0 && colIndex < 4 ? "text-blue-400 font-bold" : "text-zinc-400"}`}
                    >
                      {byte.toString(16).toUpperCase().padStart(2, '0')}
                    </span>
                  ))}
                </div>
                <div className="w-32 pl-4 border-l border-zinc-800 ml-4 text-zinc-500 truncate">
                  {row.map(b => (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.').join('')}
                </div>
              </div>
            ))}
            <div className="mt-2 text-zinc-600 text-xs text-center italic">
              ... {t.hex.noFile} ...
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 h-fit">
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">{t.hex.headerInfo}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">{t.hex.type}</span>
              <span className="text-sm font-medium text-blue-400">ELF (Executable and Linkable Format)</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">{t.hex.arch}</span>
              <span className="text-sm font-medium text-zinc-200">ARM64 (AArch64)</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">{t.hex.endian}</span>
              <span className="text-sm font-medium text-zinc-200">Little Endian (LSB)</span>
            </div>
            
            <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg">
              <div className="flex items-start gap-3">
                <Eye className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-400">Analysis Mode</h4>
                  <p className="text-xs text-amber-500/70 mt-1 leading-relaxed">
                    Binary patching is disabled in this environment. Use this view to inspect file headers and verify integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
