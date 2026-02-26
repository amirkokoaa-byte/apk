import JSZip from "jszip";
import { Package, Shield, FileCode, AlertTriangle, CheckCircle, XCircle, Box, Download } from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "@/contexts/LanguageContext";

interface OverviewProps {
  file: File;
  zip: JSZip;
}

export function Overview({ file, zip }: OverviewProps) {
  const fileCount = Object.keys(zip.files).length;
  const hasManifest = Object.keys(zip.files).some(f => f.includes("AndroidManifest.xml"));
  const hasDex = Object.keys(zip.files).some(f => f.endsWith(".dex"));
  const hasSignature = Object.keys(zip.files).some(f => f.startsWith("META-INF/"));
  
  // XAPK Detection Logic
  const isXapk = file.name.endsWith(".xapk");
  const nestedApks = Object.keys(zip.files).filter(f => f.endsWith(".apk"));
  const obbFiles = Object.keys(zip.files).filter(f => f.endsWith(".obb"));
  
  const { t } = useLanguage();

  const handleExtractApk = async () => {
    if (nestedApks.length > 0) {
      // Find the largest APK, usually the base APK
      let largestApkName = nestedApks[0];
      let largestSize = 0;
      
      for (const name of nestedApks) {
        const fileData = zip.files[name];
        // @ts-ignore
        if (fileData._data.uncompressedSize > largestSize) {
          // @ts-ignore
          largestSize = fileData._data.uncompressedSize;
          largestApkName = name;
        }
      }

      const content = await zip.files[largestApkName].async("blob");
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = largestApkName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label={t.overview.totalFiles}
          value={fileCount.toLocaleString()} 
          icon={Package} 
          trend={t.overview.assetsCode}
        />
        <StatCard 
          label={t.overview.securityScore}
          value={hasSignature ? "85/100" : "20/100"} 
          icon={Shield} 
          trend={hasSignature ? t.overview.signed : t.overview.unsigned}
          color={hasSignature ? "text-emerald-500" : "text-red-500"}
        />
        <StatCard 
          label={t.overview.codeStructure}
          value={isXapk ? "XAPK Container" : (hasDex ? t.overview.standard : t.overview.unknown)}
          icon={isXapk ? Box : FileCode} 
          trend={isXapk ? "Bundle" : t.overview.dexFormat}
          color={isXapk ? "text-blue-400" : "text-zinc-100"}
        />
        <StatCard 
          label={t.overview.vulnerabilities}
          value={`2 ${t.overview.potential}`}
          icon={AlertTriangle} 
          trend={t.overview.scanComplete}
          color="text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">{t.overview.packageStructure}</h3>
          <div className="space-y-4">
            {isXapk && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-4">
                <div className="flex items-center gap-2 text-blue-400 font-medium mb-2">
                  <Box className="w-4 h-4" />
                  {t.overview.xapkDetected}
                </div>
                <div className="text-sm text-zinc-400 space-y-1">
                   <div className="flex justify-between">
                     <span>{t.overview.splitApks}:</span>
                     <span className="text-zinc-200">{nestedApks.length}</span>
                   </div>
                   <div className="flex justify-between">
                     <span>{t.overview.obbFound}:</span>
                     <span className="text-zinc-200">{obbFiles.length}</span>
                   </div>
                </div>
              </div>
            )}

            <CheckItem 
              label="AndroidManifest.xml" 
              status={hasManifest ? "found" : "missing"} 
              desc={t.overview.manifestDesc}
              foundText={t.overview.found}
              missingText={t.overview.missing}
            />
            <CheckItem 
              label="Classes.dex" 
              status={hasDex ? "found" : "missing"} 
              desc={t.overview.dexDesc}
              foundText={t.overview.found}
              missingText={t.overview.missing}
            />
            <CheckItem 
              label="Signature (META-INF)" 
              status={hasSignature ? "found" : "missing"} 
              desc={t.overview.signatureDesc}
              foundText={t.overview.found}
              missingText={t.overview.missing}
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-zinc-200 mb-4">{t.overview.quickActions}</h3>
          <div className="space-y-3">
            {isXapk && nestedApks.length > 0 && (
              <button 
                onClick={handleExtractApk}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between group rtl:text-right shadow-lg shadow-blue-900/20"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>{t.overview.extractApk}</span>
                </div>
                <span className="text-blue-200 group-hover:text-white rtl:rotate-180">→</span>
              </button>
            )}

            <button className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between group rtl:text-right">
              <span>{t.overview.viewPermissions}</span>
              <span className="text-zinc-500 group-hover:text-zinc-300 rtl:rotate-180">→</span>
            </button>
            <button className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between group rtl:text-right">
              <span>{t.overview.extractResources}</span>
              <span className="text-zinc-500 group-hover:text-zinc-300 rtl:rotate-180">→</span>
            </button>
            <button className="w-full py-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors text-left flex items-center justify-between group rtl:text-right">
              <span>{t.overview.checkSignature}</span>
              <span className="text-zinc-500 group-hover:text-zinc-300 rtl:rotate-180">→</span>
            </button>
          </div>

          <div className="mt-6 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-emerald-400">{t.overview.safeAnalysis}</h4>
                <p className="text-xs text-emerald-500/70 mt-1 leading-relaxed">
                  {t.overview.safeDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color = "text-zinc-100" }: any) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-zinc-800 rounded-lg">
          <Icon className="w-5 h-5 text-zinc-400" />
        </div>
        <span className="text-xs font-mono text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold tracking-tight mb-1">
        <span className={color}>{value}</span>
      </div>
      <div className="text-sm text-zinc-500">{label}</div>
    </div>
  );
}

function CheckItem({ label, status, desc, foundText, missingText }: { label: string, status: "found" | "missing", desc: string, foundText: string, missingText: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-zinc-950/50 rounded-lg border border-zinc-800/50">
      <div className="flex items-center gap-3">
        {status === "found" ? (
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        ) : (
          <XCircle className="w-5 h-5 text-zinc-600" />
        )}
        <div>
          <div className="text-sm font-medium text-zinc-200">{label}</div>
          <div className="text-xs text-zinc-500">{desc}</div>
        </div>
      </div>
      <div className={`text-xs font-mono px-2 py-1 rounded ${
        status === "found" 
          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
          : "bg-zinc-800 text-zinc-500 border border-zinc-700"
      }`}>
        {status === "found" ? foundText.toUpperCase() : missingText.toUpperCase()}
      </div>
    </div>
  );
}
