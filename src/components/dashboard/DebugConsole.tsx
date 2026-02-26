import { useState, useEffect, useRef } from "react";
import { Terminal, Play, Pause, RotateCcw, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function DebugConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        const newLog = generateLog();
        setLogs(prev => [...prev.slice(-100), newLog]);
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const generateLog = () => {
    const types = ["INFO", "DEBUG", "WARN", "ERROR"];
    const type = types[Math.floor(Math.random() * types.length)];
    const time = new Date().toISOString().split("T")[1].slice(0, -1);
    const tags = ["ActivityManager", "WindowManager", "DalvikVm", "OpenGLRenderer", "NetworkSecurity"];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    
    let msg = "";
    if (type === "INFO") msg = `Starting activity: com.example.app/.MainActivity`;
    if (type === "DEBUG") msg = `GC_CONCURRENT freed 2048K, 15% free 12MB/15MB, paused 2ms+3ms`;
    if (type === "WARN") msg = `Slow operation: 78ms so far, now at android.app.ActivityThread.main`;
    if (type === "ERROR") msg = `Failed to load native library: libgame.so (dlopen failed)`;

    return `[${time}] ${type}/${tag}: ${msg}`;
  };

  return (
    <div className="h-full flex flex-col bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="h-12 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-zinc-400 text-sm font-mono">
          <Terminal className="w-4 h-4" />
          <span>{t.console.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`p-1.5 rounded-md transition-colors ${
              isRunning ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
            }`}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setLogs([])}
            className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 font-mono text-xs space-y-1"
        dir="ltr"
      >
        {logs.length === 0 && (
          <div className="text-zinc-600 italic text-center mt-12">
            {t.console.ready}
          </div>
        )}
        {logs.map((log, i) => {
          const isError = log.includes("ERROR");
          const isWarn = log.includes("WARN");
          return (
            <div key={i} className={`
              ${isError ? "text-red-400" : isWarn ? "text-amber-400" : "text-zinc-400"}
              border-l-2 pl-2 ${isError ? "border-red-500/50" : "border-transparent"}
            `}>
              {log}
            </div>
          );
        })}
      </div>
    </div>
  );
}
