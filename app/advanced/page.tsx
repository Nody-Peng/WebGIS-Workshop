import React from "react";

interface Section {
  id: string;
  label: string;
}

const SECTIONS: Section[] = [
  { id: "overview",     label: "Overview" },
  { id: "architecture", label: "Architecture" },
  { id: "environment",  label: "Environment" },
  { id: "data",         label: "Data Sources" },
  { id: "structure",    label: "File Structure" },
  { id: "stack",        label: "Tech Stack" },
  { id: "ai-note",      label: "Using AI" },
];

function Divider() {
  return <hr className="border-stone-200 my-10" />;
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-stone-100 text-stone-700 text-[13px] px-1.5 py-0.5 rounded font-mono">
      {children}
    </code>
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <div className="mt-3 rounded-xl overflow-hidden border border-stone-200">
      <div className="flex items-center justify-between px-4 py-2 bg-stone-100 border-b border-stone-200">
        <span className="text-[11px] text-stone-400 font-mono uppercase tracking-widest">{lang}</span>
      </div>
      <pre className="bg-[#fafaf9] px-5 py-4 overflow-x-auto text-[13px] leading-relaxed text-stone-700 font-mono whitespace-pre">
        {code}
      </pre>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-5 mt-7 first:mt-0">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-stone-800 text-white text-xs font-semibold flex items-center justify-center mt-0.5">
        {n}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-stone-800 mb-1">{title}</div>
        <div className="text-sm text-stone-500 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-5 flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
      <svg className="flex-shrink-0 mt-0.5 w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
      <p className="text-[13px] text-amber-800 leading-relaxed">{children}</p>
    </div>
  );
}

function AiCallout() {
  return (
    <div className="my-8 rounded-2xl border border-stone-200 bg-stone-50 px-6 py-5 flex gap-4">
      <div className="flex-shrink-0 mt-0.5">
        <svg className="w-5 h-5 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      </div>
      <div>
        <div className="text-sm font-semibold text-stone-700 mb-1">Not sure about a piece of code?</div>
        <p className="text-[13px] text-stone-500 leading-relaxed">
          This project involves spatial algorithms, GeoJSON parsing, and React state management simultaneously.
          If any part of the code is unclear — whether it's the ray-casting logic, the TopoJSON conversion,
          or how <InlineCode>useMemo</InlineCode> interacts with the map — paste it directly into an AI assistant
          and ask it to explain. Understanding <em>why</em> each piece exists matters more than memorising syntax.
        </p>
      </div>
    </div>
  );
}

function FileTree() {
  const lines = [
    { depth: 0, name: "app/",                            type: "dir"  },
    { depth: 1, name: "advanced/",                       type: "dir"  },
    { depth: 2, name: "page.tsx",                        type: "file", note: "← this page" },
    { depth: 1, name: "advanced-result/",                type: "dir"  },
    { depth: 2, name: "page.tsx",                        type: "file", note: "client wrapper + header" },
    { depth: 2, name: "DisasterMap.tsx",                 type: "file", note: "map + sidebar + scoring engine" },
    { depth: 0, name: "public/",                         type: "dir"  },
    { depth: 1, name: "advanced-result/",                type: "dir"  },
    { depth: 2, name: "data/",                           type: "dir"  },
    { depth: 3, name: "Taiwan.json",                     type: "file", note: "TopoJSON — county boundaries" },
    { depth: 3, name: "debrisstream.geojson",            type: "file", note: "debris flow streams" },
    { depth: 3, name: "台北市淹水潛勢圖.geojson",         type: "file", note: "Taipei flood inundation" },
    { depth: 3, name: "新北市淹水潛勢圖.geojson",         type: "file", note: "New Taipei flood inundation" },
  ];
  return (
    <div className="mt-4 rounded-xl border border-stone-200 bg-[#fafaf9] px-5 py-4 font-mono text-[13px] overflow-x-auto">
      {lines.map((l, i) => (
        <div key={i} className="flex items-baseline leading-7" style={{ paddingLeft: l.depth * 20 }}>
          <span className={l.type === "dir" ? "text-stone-500" : "text-stone-700"}>{l.name}</span>
          {l.note && <span className="ml-3 text-stone-400 text-[11px] font-sans">{l.note}</span>}
        </div>
      ))}
    </div>
  );
}

function ArchDiagram() {
  const cols = [
    [
      { label: "Taiwan.json",          sub: "TopoJSON" },
      { label: "debrisstream.geojson", sub: "GeoJSON" },
      { label: "淹水潛勢圖 ×2",        sub: "GeoJSON" },
    ],
    [
      { label: "topojson-client",  sub: "conversion" },
      { label: "Spatial Engine",   sub: "haversine · ray-cast" },
    ],
    [
      { label: "Risk Score",  sub: "weighted sum" },
      { label: "React Leaflet", sub: "map render" },
      { label: "Sidebar UI",  sub: "filter · rank" },
    ],
  ];
  return (
    <div className="mt-4 rounded-xl border border-stone-200 bg-[#fafaf9] p-5 overflow-x-auto">
      <div className="flex gap-0 min-w-[560px]">
        {cols.map((col, ci) => (
          <React.Fragment key={ci}>
            <div className="flex flex-col gap-3 flex-1">
              {col.map((n, ni) => (
                <div key={ni} className="bg-white border border-stone-200 rounded-lg px-3 py-2.5 shadow-sm">
                  <div className="text-[12px] font-semibold text-stone-700">{n.label}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5">{n.sub}</div>
                </div>
              ))}
            </div>
            {ci < 2 && (
              <div className="flex items-center px-2 text-stone-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-[11px] text-stone-400 mt-3">
        Data files are served statically from <InlineCode>public/</InlineCode> and fetched at runtime — no server-side processing required.
      </p>
    </div>
  );
}

// ─── Hero banner linking to /advanced-result ─────────────────────────────────
function ResultBanner() {
  return (
    <a
      href="/advanced-result"
      className="group block rounded-2xl border border-stone-200 bg-[#0f1117] overflow-hidden mb-12 hover:border-stone-400 transition-colors"
    >
      {/* Dark preview strip */}
      <div className="relative h-28 flex items-center justify-center overflow-hidden">
        {/* Faint grid */}
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "linear-gradient(#94a3b820 1px,transparent 1px),linear-gradient(90deg,#94a3b820 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }} />
        {/* Fake dots */}
        {[
          { top:"30%", left:"20%", r:10, color:"#f87171" },
          { top:"55%", left:"38%", r: 8, color:"#fb923c" },
          { top:"25%", left:"55%", r: 6, color:"#fbbf24" },
          { top:"60%", left:"68%", r:10, color:"#f87171" },
          { top:"40%", left:"80%", r: 5, color:"#4ade80" },
        ].map((d,i)=>(
          <div key={i} className="absolute rounded-full opacity-70"
            style={{ top:d.top, left:d.left, width:d.r*2, height:d.r*2, background:d.color, transform:"translate(-50%,-50%)" }} />
        ))}
        {/* Faint lines */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 112" preserveAspectRatio="none">
          <path d="M0 70 Q100 40 200 60 T400 50" stroke="#fb923c" strokeWidth="1.5" fill="none"/>
          <path d="M0 50 Q80 80 180 45 T400 65" stroke="#38bdf8" strokeWidth="1" fill="none"/>
        </svg>
        {/* Centre label */}
        <div className="relative text-center">
          <div className="text-white/80 text-sm font-semibold tracking-tight">Taiwan Multi-Hazard Risk Dashboard</div>
          <div className="text-white/30 text-xs mt-1">Taipei · New Taipei · 18 assessment zones</div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-[#0f1117]">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400/70" />
            <span className="w-2 h-2 rounded-full bg-orange-400/70" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
            <span className="w-2 h-2 rounded-full bg-green-400/70" />
          </div>
          <span className="text-white/30 text-[11px]">Debris flow · Flood inundation · Risk scoring</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/40 group-hover:text-white/70 transition-colors">
          <span>Open map</span>
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </a>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdvancedPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-mono uppercase tracking-widest mb-4">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.159.69.159 1.006 0z" />
            </svg>
            <span>Advanced — WebGIS Project</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900 leading-tight tracking-tight">
            Taiwan Multi-Hazard<br />Risk Dashboard
          </h1>
          <p className="mt-4 text-stone-500 text-base leading-relaxed max-w-xl">
            A reference document covering system architecture, environment setup, and the data
            pipeline behind the interactive disaster risk map.
          </p>
        </div>

        {/* ── Live result banner ── */}
        <ResultBanner />

        {/* Anchor nav */}
        <nav className="flex flex-wrap gap-2 mb-12">
          {SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`}
              className="text-xs text-stone-500 border border-stone-200 rounded-full px-3 py-1 hover:border-stone-400 hover:text-stone-700 transition-colors">
              {s.label}
            </a>
          ))}
        </nav>

        {/* ── Overview ── */}
        <section id="overview">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">Overview</h2>
          <p className="text-sm text-stone-500 leading-relaxed">
            The <InlineCode>/advanced-result</InlineCode> page renders a full-screen WebGIS dashboard that overlays
            three real geospatial datasets — county boundaries, debris flow streams, and flood inundation zones —
            and computes a composite risk score for 18 candidate locations across Taipei and New Taipei City.
            All spatial analysis runs entirely in the browser; there is no backend.
          </p>
          <Note>
            The live result is at <InlineCode>/advanced-result</InlineCode>. This page explains how it was built.
          </Note>
        </section>

        <Divider />

        {/* ── Architecture ── */}
        <section id="architecture">
          <h2 className="text-lg font-semibold text-stone-800 mb-1">Architecture</h2>
          <p className="text-sm text-stone-500 leading-relaxed mb-2">
            Three data formats flow through two transformation steps before reaching the map renderer.
          </p>
          <ArchDiagram />
          <div className="mt-6 space-y-3 text-sm text-stone-500 leading-relaxed">
            <p>
              <strong className="text-stone-700">Static files</strong> — all GeoJSON and TopoJSON files live under
              <InlineCode>public/</InlineCode> and are fetched with a plain <InlineCode>fetch()</InlineCode> call.
              Next.js serves them as static assets; no API route is needed.
            </p>
            <p>
              <strong className="text-stone-700">TopoJSON conversion</strong> — <InlineCode>Taiwan.json</InlineCode> uses
              the TopoJSON format (smaller file size, shared arc encoding). The
              <InlineCode>topojson-client</InlineCode> library converts it to a standard GeoJSON
              <InlineCode>FeatureCollection</InlineCode> at runtime before passing it to Leaflet.
            </p>
            <p>
              <strong className="text-stone-700">Spatial engine</strong> — two algorithms run in-browser:
              the <em>Haversine formula</em> counts debris stream features within a 5 km radius of each candidate point,
              and a <em>ray-casting algorithm</em> tests whether a point falls inside any flood inundation polygon.
            </p>
            <p>
              <strong className="text-stone-700">Risk score</strong> — the three sub-scores are normalised to 0–100
              and combined with fixed weights (debris 45 %, flood 35 %, population 20 %).
            </p>
          </div>
        </section>

        <Divider />

        {/* ── Environment ── */}
        <section id="environment">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Environment Setup</h2>
          <Step n={1} title="Node.js & package manager">
            Requires Node.js 18 or later. This project uses <InlineCode>pnpm</InlineCode>;
            install it once globally if you haven't already.
            <CodeBlock code="npm install -g pnpm" />
          </Step>
          <Step n={2} title="Create a Next.js app">
            Scaffold a new project with the App Router and TypeScript enabled.
            <CodeBlock code={`pnpm create next-app@latest my-gis-app \\\n  --typescript --tailwind --app --no-src-dir`} />
          </Step>
          <Step n={3} title="Install map dependencies">
            <InlineCode>react-leaflet</InlineCode> wraps Leaflet for React.
            <InlineCode>topojson-client</InlineCode> handles the county boundary format.
            <CodeBlock code={`pnpm add react-leaflet leaflet topojson-client\npnpm add -D @types/leaflet @types/topojson-client`} />
          </Step>
          <Step n={4} title="Disable SSR for the map component">
            Leaflet accesses <InlineCode>window</InlineCode> at import time and will crash
            during server-side rendering. Wrap the component with <InlineCode>next/dynamic</InlineCode>
            and set <InlineCode>ssr: false</InlineCode>.
            <CodeBlock lang="tsx" code={`import dynamic from "next/dynamic";\n\nconst DisasterMap = dynamic(\n  () => import("./DisasterMap"),\n  { ssr: false }\n);`} />
          </Step>
          <Step n={5} title="Run the dev server">
            <CodeBlock code="pnpm dev" />
            Open <InlineCode>http://localhost:3000</InlineCode>. Hot-reload is enabled by default.
          </Step>
        </section>

        <Divider />

        {/* ── Data Sources ── */}
        <section id="data">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Data Sources</h2>
          <p className="text-sm text-stone-500 leading-relaxed mb-6">
            All datasets are publicly available from Taiwanese government open-data platforms.
            Download them, rename if necessary, and place them under
            <InlineCode>public/advanced-result/data/</InlineCode>.
          </p>
          <div className="space-y-4">
            {[
              {
                file: "Taiwan.json",
                format: "TopoJSON",
                source: "Natural Earth / GADM",
                url: "https://github.com/topojson/world-atlas",
                desc: "County-level administrative boundaries for Taiwan. Any TopoJSON source with COUNTYNAME properties will work.",
              },
              {
                file: "debrisstream.geojson",
                format: "GeoJSON — LineString / Polygon",
                source: "Soil and Water Conservation Bureau (水土保持局)",
                url: "https://www.swcb.gov.tw/",
                desc: "Debris flow potential stream network. Updated annually. Download the national dataset and export as GeoJSON.",
              },
              {
                file: "台北市淹水潛勢圖.geojson",
                format: "GeoJSON — Polygon",
                source: "National Land Surveying and Mapping Center (國土測繪中心)",
                url: "https://data.gov.tw/",
                desc: "Flood inundation potential zones for Taipei City under a 200-year return period rainfall scenario.",
              },
              {
                file: "新北市淹水潛勢圖.geojson",
                format: "GeoJSON — Polygon",
                source: "National Land Surveying and Mapping Center (國土測繪中心)",
                url: "https://data.gov.tw/",
                desc: "Same dataset series, New Taipei City coverage.",
              },
            ].map(d => (
              <div key={d.file} className="rounded-xl border border-stone-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <InlineCode>{d.file}</InlineCode>
                  <span className="text-[10px] text-stone-400 font-mono bg-stone-100 px-2 py-0.5 rounded flex-shrink-0">{d.format}</span>
                </div>
                <p className="text-[13px] text-stone-500 leading-relaxed mb-2">{d.desc}</p>
                <a href={d.url} target="_blank" rel="noopener noreferrer"
                  className="text-[12px] text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2">
                  {d.source} ↗
                </a>
              </div>
            ))}
          </div>
          <Note>
            File names must match exactly — including Chinese characters — because they are referenced
            directly in <InlineCode>fetch()</InlineCode> calls inside <InlineCode>DisasterMap.tsx</InlineCode>.
          </Note>
        </section>

        <Divider />

        {/* ── File Structure ── */}
        <section id="structure">
          <h2 className="text-lg font-semibold text-stone-800 mb-2">File Structure</h2>
          <p className="text-sm text-stone-500 leading-relaxed mb-1">
            Only the files relevant to this feature are shown.
          </p>
          <FileTree />
          <div className="mt-5 space-y-2 text-sm text-stone-500 leading-relaxed">
            <p>
              <InlineCode>page.tsx</InlineCode> in <InlineCode>advanced-result/</InlineCode> is a thin client
              component — it only renders the header bar and dynamically imports the map.
              All logic lives in <InlineCode>DisasterMap.tsx</InlineCode>.
            </p>
            <p>
              Static assets under <InlineCode>public/</InlineCode> are served at the root URL path.
              A file at <InlineCode>public/advanced-result/data/Taiwan.json</InlineCode> is accessible
              at <InlineCode>/advanced-result/data/Taiwan.json</InlineCode>.
            </p>
          </div>
        </section>

        <Divider />

        {/* ── Tech Stack ── */}
        <section id="stack">
          <h2 className="text-lg font-semibold text-stone-800 mb-4">Tech Stack</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Next.js 14+",       role: "App Router, static asset serving, SSR control" },
              { name: "React 18",           role: "Component model, useMemo for expensive spatial computation" },
              { name: "TypeScript",         role: "Type safety across GeoJSON, TopoJSON, and component props" },
              { name: "Tailwind CSS",       role: "Utility-first styling, no custom CSS files" },
              { name: "React Leaflet",      role: "Declarative map, GeoJSON layer, CircleMarker" },
              { name: "Leaflet",            role: "Underlying map engine, tile rendering" },
              { name: "topojson-client",    role: "Converts TopoJSON topology to GeoJSON FeatureCollection" },
              { name: "CARTO Dark Matter",  role: "Basemap tile layer (free, no API key required)" },
            ].map(t => (
              <div key={t.name} className="rounded-xl border border-stone-200 bg-white px-4 py-3">
                <div className="text-sm font-semibold text-stone-700">{t.name}</div>
                <div className="text-[12px] text-stone-400 mt-0.5 leading-relaxed">{t.role}</div>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── AI Note ── */}
        <section id="ai-note">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">Using AI Effectively</h2>
          <p className="text-sm text-stone-500 leading-relaxed mb-4">
            The goal of this project is to understand the system — how data flows from a static file
            through a spatial algorithm into a rendered map. Memorising every line of code is not the point.
          </p>
          <AiCallout />
          <div className="mt-6 space-y-4">
            {[
              {
                q: "I don't understand the ray-casting algorithm.",
                a: `Copy the rayCast function and ask: "Explain this algorithm line by line. What problem does it solve in a GIS context?"`,
              },
              {
                q: "Why does useMemo wrap the risk computation?",
                a: `Ask: "Why would computing spatial distances inside a React render be a performance problem? What does useMemo do here?"`,
              },
              {
                q: "The TopoJSON conversion is confusing.",
                a: `Ask: "What is the difference between TopoJSON and GeoJSON? Why does topojson.feature() need both the topology and the object name?"`,
              },
              {
                q: "I want to add a new data layer.",
                a: `Describe the dataset format and ask: "How would I add this as a new GeoJSON layer in React Leaflet alongside the existing ones?"`,
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-stone-200 bg-white p-4">
                <div className="text-[13px] font-semibold text-stone-700 mb-1.5">"{q}"</div>
                <div className="text-[13px] text-stone-500 leading-relaxed">{a}</div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-stone-400 leading-relaxed">
            AI tools are most useful when you already have a mental model of the architecture and
            use them to fill in specific gaps — not to generate code you don't understand.
            Read through the architecture section first, then ask targeted questions.
          </p>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex items-center justify-between text-xs text-stone-300">
          <span>Taiwan Multi-Hazard Risk Dashboard</span>
          <a href="/advanced-result"
            className="text-stone-400 hover:text-stone-600 transition-colors underline underline-offset-2">
            View the live map →
          </a>
        </div>

      </div>
    </div>
  );
}