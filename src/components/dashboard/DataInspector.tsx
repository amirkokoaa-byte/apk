import { Database, Table, Key } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function DataInspector() {
  const { t } = useLanguage();

  // Simulated data structures
  const sharedPrefs = [
    { key: "user_session_token", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", type: "String" },
    { key: "is_first_run", value: "false", type: "Boolean" },
    { key: "last_login_timestamp", value: "1678901234", type: "Long" },
    { key: "app_theme", value: "dark_mode", type: "String" },
  ];

  const dbTables = [
    { name: "users", columns: ["id", "username", "email", "created_at"] },
    { name: "game_state", columns: ["level_id", "score", "checkpoint", "inventory_blob"] },
    { name: "transactions", columns: ["tx_id", "amount", "currency", "status"] },
  ];

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-200 flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-500" />
          {t.data.title}
        </h2>
        <div className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
          {t.data.simulated}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shared Preferences Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-purple-400" />
            <h3 className="font-medium text-zinc-200 text-sm">{t.data.sharedPrefs}</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-500 font-medium">
                <tr>
                  <th className="px-4 py-2 border-b border-zinc-800 rtl:text-right">{t.data.key}</th>
                  <th className="px-4 py-2 border-b border-zinc-800 rtl:text-right">{t.data.value}</th>
                  <th className="px-4 py-2 border-b border-zinc-800 w-20 rtl:text-right">{t.data.type}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {sharedPrefs.map((item, i) => (
                  <tr key={i} className="hover:bg-zinc-800/30">
                    <td className="px-4 py-2 text-zinc-300 font-mono">{item.key}</td>
                    <td className="px-4 py-2 text-zinc-400 font-mono truncate max-w-[150px]" title={item.value}>{item.value}</td>
                    <td className="px-4 py-2 text-zinc-500">{item.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SQLite Database Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex items-center gap-2">
            <Table className="w-4 h-4 text-blue-400" />
            <h3 className="font-medium text-zinc-200 text-sm">{t.data.database}</h3>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {dbTables.map((table, i) => (
              <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-3 h-3 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-200">{table.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {table.columns.map((col, j) => (
                    <span key={j} className="px-2 py-1 bg-zinc-900 rounded text-xs text-zinc-400 border border-zinc-800 font-mono">
                      {col}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-lg text-center text-zinc-500 text-sm">
        {t.data.noData}
      </div>
    </div>
  );
}
