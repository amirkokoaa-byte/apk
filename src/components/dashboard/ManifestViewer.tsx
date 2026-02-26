import JSZip from "jszip";
import { Code } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ManifestViewerProps {
  zip: JSZip;
}

export function ManifestViewer({ zip }: ManifestViewerProps) {
  const { t } = useLanguage();
  // In a real app, we would parse the binary XML.
  // Here we show a simulated manifest structure for educational purposes.
  
  const simulatedManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.application"
    android:versionCode="1"
    android:versionName="1.0" >

    <uses-sdk
        android:minSdkVersion="21"
        android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme" >
        
        <activity
            android:name=".MainActivity"
            android:exported="true" >
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <service android:name=".BackgroundService" />
        
    </application>

</manifest>`;

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
          <Code className="w-5 h-5 text-emerald-500" />
          {t.manifest.title}
        </h2>
        <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          {t.manifest.readOnly}
        </div>
      </div>

      <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden font-mono text-sm relative group" dir="ltr">
        <div className="absolute top-0 left-0 w-full h-8 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 text-xs text-zinc-500 select-none">
          Line 1, Column 1
        </div>
        <pre className="p-6 pt-12 text-zinc-300 overflow-auto h-full language-xml">
          {simulatedManifest}
        </pre>
      </div>
      
      <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg text-sm text-blue-400">
        <strong>{t.manifest.note}</strong> {t.manifest.noteDesc}
      </div>
    </div>
  );
}
