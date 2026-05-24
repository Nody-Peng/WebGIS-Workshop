"use client";

import dynamic from "next/dynamic";

const DisasterMap = dynamic(() => import("./DisasterMap"), { ssr: false });

export default function AdvancedResultPage() {
  return (
    <main className="w-screen h-screen flex flex-col bg-[#0f1117]">
      {/* Top bar */}
      <header className="flex-shrink-0 h-12 px-5 flex items-center justify-between border-b border-white/[0.06] bg-[#0f1117]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-white/90 text-sm font-semibold tracking-tight">
            Taiwan Multi-Hazard Risk Dashboard
          </span>
          <span className="text-white/20 text-xs">—</span>
          <span className="text-white/30 text-xs">Taipei · New Taipei</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/25">
          <span>Debris Flow</span>
          <span>Flood Inundation</span>
          <span>Risk Assessment</span>
        </div>
      </header>

      {/* Map fills the rest */}
      <div className="flex-1 overflow-hidden">
        <DisasterMap />
      </div>
    </main>
  );
}