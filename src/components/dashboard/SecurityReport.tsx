import JSZip from "jszip";
import { AlertTriangle, ShieldAlert, Lock, Unlock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SecurityReportProps {
  zip: JSZip;
}

export function SecurityReport({ zip }: SecurityReportProps) {
  // Simulated analysis logic
  const hasSignature = Object.keys(zip.files).some(f => f.startsWith("META-INF/"));
  const { t } = useLanguage();

  const vulnerabilities = [
    {
      severity: "High",
      title: t.security.debuggable,
      desc: t.security.debuggableDesc,
      fixed: false
    },
    {
      severity: "Medium",
      title: t.security.cleartext,
      desc: t.security.cleartextDesc,
      fixed: false
    },
    {
      severity: "Low",
      title: t.security.exported,
      desc: t.security.exportedDesc,
      fixed: true
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-zinc-100 mb-6 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-emerald-500" />
          {t.security.title}
        </h2>

        <div className="space-y-4">
          {vulnerabilities.map((vuln, idx) => (
            <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex gap-4">
              <div className={`mt-1 p-2 rounded-lg shrink-0 ${
                vuln.severity === "High" ? "bg-red-500/10 text-red-500" :
                vuln.severity === "Medium" ? "bg-amber-500/10 text-amber-500" :
                "bg-blue-500/10 text-blue-500"
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-zinc-200">{vuln.title}</h3>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                    vuln.severity === "High" ? "bg-red-500/5 border-red-500/20 text-red-400" :
                    vuln.severity === "Medium" ? "bg-amber-500/5 border-amber-500/20 text-amber-400" :
                    "bg-blue-500/5 border-blue-500/20 text-blue-400"
                  }`}>
                    {vuln.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed mb-3">
                  {vuln.desc}
                </p>
                {vuln.fixed ? (
                  <div className="flex items-center gap-2 text-xs text-emerald-500 font-medium">
                    <Lock className="w-3 h-3" />
                    {t.security.mitigated}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-red-400 font-medium">
                    <Unlock className="w-3 h-3" />
                    {t.security.openVuln}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">{t.security.signatureStatus}</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              hasSignature ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            }`}>
              {hasSignature ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
            </div>
            <div>
              <div className="font-medium text-zinc-200">
                {hasSignature ? t.security.validSig : t.security.noSig}
              </div>
              <div className="text-sm text-zinc-500">
                {hasSignature ? t.security.validSigDesc : t.security.noSigDesc}
              </div>
            </div>
          </div>
          
          {hasSignature && (
            <div className="space-y-2">
              <div className="text-xs text-zinc-500 uppercase tracking-wider font-mono">{t.security.fingerprint}</div>
              <div className="font-mono text-xs text-zinc-400 bg-zinc-950 p-2 rounded border border-zinc-800 break-all">
                A1:B2:C3:D4:E5:F6:78:90:12:34:56:78:90:AB:CD:EF:12:34:56:78
              </div>
            </div>
          )}
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-medium text-zinc-200 mb-4">{t.security.codeProtection}</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">{t.security.obfuscation}</span>
              <span className="text-sm font-medium text-amber-500">{t.security.partial}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">{t.security.nativeLibs}</span>
              <span className="text-sm font-medium text-zinc-200">{t.security.foundArm}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-zinc-800/50">
              <span className="text-sm text-zinc-400">{t.security.antiTamper}</span>
              <span className="text-sm font-medium text-red-400">{t.security.notDetected}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-zinc-400">{t.security.rootDetection}</span>
              <span className="text-sm font-medium text-zinc-200">{t.security.present}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
