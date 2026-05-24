"use client";

import Link from "next/link";
import { useState } from "react";

// ─── Data ──────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend",
    color: "sky",
    tagline: "Build the interface",
    description: "Modern web apps are built with component-based frameworks. React is the foundation; Next.js adds routing, SSR, and deployment-ready structure.",
    skills: [
      {
        name: "React",
        level: "Foundation",
        levelColor: "emerald",
        why: "Every interactive UI element in a modern WebGIS dashboard is a React component. Learn this first.",
        resources: [
          { type: "video", label: "React Full Course – Beginner to Pro (2025)", author: "YouTube", duration: "6h", url: "https://www.youtube.com/watch?v=TtPXvEcE11E" },
          { type: "video", label: "React Full Course for Free ⚛️", author: "Bro Code", duration: "4h", url: "https://www.youtube.com/watch?v=CgkZ7MvWUAA" },
          { type: "docs",  label: "React Official Docs — Quick Start", author: "react.dev", url: "https://react.dev/learn" },
        ],
      },
      {
        name: "Next.js",
        level: "Recommended",
        levelColor: "sky",
        why: "This workshop site is built with Next.js 14. It handles routing, server components, and one-click Vercel deployment.",
        resources: [
          { type: "video", label: "Next.js 14 Full Course 2024", author: "Codevolution", duration: "8h", url: "https://www.youtube.com/watch?v=mQnWCmVErnw" },
          { type: "video", label: "Next.js Tutorial – Beginner to Advanced (Playlist)", author: "Codevolution", url: "https://www.youtube.com/playlist?list=PLC3y8-rFHvwjOKd6gdf4QtV1uYNiQnruI" },
          { type: "docs",  label: "Next.js Official Docs", author: "nextjs.org", url: "https://nextjs.org/docs" },
        ],
      },
      {
        name: "TypeScript",
        level: "Recommended",
        levelColor: "sky",
        why: "Catches bugs before they happen. All professional WebGIS projects use TypeScript for type-safe GeoJSON handling.",
        resources: [
          { type: "video", label: "TypeScript Full Course for Beginners", author: "Dave Gray", duration: "8h", url: "https://www.youtube.com/watch?v=gieEQFIfgYc" },
          { type: "docs",  label: "TypeScript Handbook", author: "typescriptlang.org", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
        ],
      },
      {
        name: "Tailwind CSS",
        level: "Useful",
        levelColor: "violet",
        why: "Utility-first CSS — used throughout this workshop for rapid UI building without leaving your JSX.",
        resources: [
          { type: "video", label: "Tailwind CSS Full Course 2024", author: "Dave Gray", duration: "4h", url: "https://www.youtube.com/watch?v=lCxcTsOHrjo" },
          { type: "docs",  label: "Tailwind CSS Docs", author: "tailwindcss.com", url: "https://tailwindcss.com/docs" },
        ],
      },
    ],
  },
  {
    id: "versioncontrol",
    label: "Version Control",
    color: "orange",
    tagline: "Track every change",
    description: "Git is non-negotiable in any real project. GitHub is where you store, share, and collaborate on code — and it's the bridge to deployment platforms.",
    skills: [
      {
        name: "Git",
        level: "Foundation",
        levelColor: "emerald",
        why: "You cannot deploy to Vercel or Zeabur without Git. Every professional workflow starts here.",
        resources: [
          { type: "video", label: "Git & GitHub – Visualized Course for Beginners", author: "Fireship", duration: "1h", url: "https://www.youtube.com/watch?v=S7XpTAnSDL4" },
          { type: "video", label: "Learn Git – Full Course for Beginners", author: "freeCodeCamp", duration: "3h", url: "https://www.youtube.com/watch?v=zTjRZNkhiEU" },
          { type: "video", label: "Git and GitHub Tutorial for Beginners", author: "Kevin Stratvert", duration: "1h", url: "https://www.youtube.com/watch?v=tRZGeaHPoaw" },
          { type: "docs",  label: "Pro Git Book (free)", author: "git-scm.com", url: "https://git-scm.com/book/en/v2" },
        ],
      },
      {
        name: "GitHub",
        level: "Foundation",
        levelColor: "emerald",
        why: "Host your repositories, manage issues, and trigger auto-deployments. Your portfolio lives here.",
        resources: [
          { type: "docs",  label: "GitHub Docs – Getting Started", author: "docs.github.com", url: "https://docs.github.com/en/get-started" },
          { type: "video", label: "GitHub Tutorial – Beginner's Guide", author: "Programming with Mosh", duration: "1h", url: "https://www.youtube.com/watch?v=iv8rSLsi1xo" },
        ],
      },
    ],
  },
  {
    id: "deployment",
    label: "Deployment",
    color: "indigo",
    tagline: "Ship it to the world",
    description: "Modern cloud platforms let you deploy a Next.js app in under 5 minutes. No server management required.",
    skills: [
      {
        name: "Vercel",
        level: "Recommended",
        levelColor: "sky",
        why: "Made by the creators of Next.js. Connect your GitHub repo and every push auto-deploys. Free tier is generous.",
        resources: [
          { type: "video", label: "Deploy a React App to Vercel (Simple)", author: "YouTube", duration: "10min", url: "https://www.youtube.com/watch?v=hAuyNf0Uk-w" },
          { type: "video", label: "Deploying HTML/CSS/JS to Vercel", author: "YouTube", duration: "8min", url: "https://www.youtube.com/watch?v=oIsf9zE-TRI" },
          { type: "docs",  label: "Vercel Docs – Deploying Next.js", author: "vercel.com", url: "https://vercel.com/docs/frameworks/nextjs" },
        ],
      },
      {
        name: "Zeabur",
        level: "Useful",
        levelColor: "violet",
        why: "Taiwan-based PaaS — great for deploying backend services (Node.js, PostgreSQL) with a simple UI. Popular in the local dev community.",
        resources: [
          { type: "docs",  label: "Zeabur Docs – Quick Start", author: "zeabur.com", url: "https://zeabur.com/docs/get-started" },
          { type: "docs",  label: "Zeabur – Deploy Next.js", author: "zeabur.com", url: "https://zeabur.com/docs/guides/nodejs/nextjs" },
        ],
      },
    ],
  },
  {
    id: "mapping",
    label: "Mapping Libraries",
    color: "emerald",
    tagline: "Render spatial data",
    description: "From simple tile maps to GPU-accelerated 3D visualization — choose the right tool for your data scale and complexity.",
    skills: [
      {
        name: "Leaflet.js",
        level: "Foundation",
        levelColor: "emerald",
        why: "What we use in this workshop. Lightweight, battle-tested, and runs in any browser with zero dependencies.",
        resources: [
          { type: "video", label: "Leaflet.js Tutorial for Beginners", author: "Traversy Media", duration: "1h", url: "https://www.youtube.com/watch?v=wVnimcQsuwk" },
          { type: "docs",  label: "Leaflet.js Official Docs", author: "leafletjs.com", url: "https://leafletjs.com/reference.html" },
          { type: "docs",  label: "Leaflet Quick Start Guide", author: "leafletjs.com", url: "https://leafletjs.com/examples/quick-start/" },
        ],
      },
      {
        name: "Mapbox GL JS",
        level: "Next Step",
        levelColor: "amber",
        why: "Vector tiles + WebGL rendering. Smooth zoom, 3D terrain, and custom styles. Requires API key.",
        resources: [
          { type: "docs",  label: "Mapbox GL JS Docs", author: "docs.mapbox.com", url: "https://docs.mapbox.com/mapbox-gl-js/guides/" },
          { type: "video", label: "Mapbox GL JS Tutorial", author: "Traversy Media", duration: "1h", url: "https://www.youtube.com/watch?v=ry3wMBBMCyI" },
        ],
      },
      {
        name: "deck.gl",
        level: "Advanced",
        levelColor: "rose",
        why: "GPU-accelerated WebGL layers. Handles millions of points in real time. Used by Uber, Airbnb, and major GIS platforms.",
        resources: [
          { type: "docs",  label: "deck.gl Official Docs", author: "deck.gl", url: "https://deck.gl/docs" },
          { type: "docs",  label: "deck.gl Examples Gallery", author: "deck.gl", url: "https://deck.gl/examples" },
        ],
      },
    ],
  },
  {
    id: "geodata",
    label: "Geo Data & Databases",
    color: "rose",
    tagline: "Store & query spatial data",
    description: "When your GeoJSON grows beyond a few hundred features, you need a real spatial database. PostgreSQL + PostGIS is the industry standard.",
    skills: [
      {
        name: "GeoJSON",
        level: "Foundation",
        levelColor: "emerald",
        why: "The universal exchange format of WebGIS. Every map library speaks GeoJSON — master it before anything else.",
        resources: [
          { type: "docs",  label: "GeoJSON Specification (RFC 7946)", author: "IETF", url: "https://datatracker.ietf.org/doc/html/rfc7946" },
          { type: "docs",  label: "geojson.io – Draw & Edit GeoJSON Online", author: "geojson.io", url: "https://geojson.io" },
          { type: "video", label: "GeoJSON Explained", author: "Simon Willison", duration: "30min", url: "https://www.youtube.com/watch?v=8RPfrhzRw2s" },
        ],
      },
      {
        name: "Shapefile & Vector Formats",
        level: "Foundation",
        levelColor: "emerald",
        why: "Shapefiles (.shp) are the legacy standard — you'll encounter them constantly from government open data portals. Also learn GeoPackage (.gpkg) as the modern replacement.",
        resources: [
          { type: "docs",  label: "Shapefile Format Specification", author: "Esri", url: "https://www.esri.com/content/dam/esrisites/sitecore-archive/Files/Pdfs/library/whitepapers/pdfs/shapefile.pdf" },
          { type: "docs",  label: "GeoPackage Standard Overview", author: "OGC", url: "https://www.geopackage.org/" },
          { type: "docs",  label: "Mapshaper – Convert & Simplify Vector Data", author: "mapshaper.org", url: "https://mapshaper.org" },
          { type: "video", label: "Shapefiles vs GeoJSON vs GeoPackage Explained", author: "Klas Karlsson", duration: "15min", url: "https://www.youtube.com/watch?v=0qlDF1GxVkQ" },
        ],
      },
      {
        name: "Raster Data & GeoTIFF",
        level: "Recommended",
        levelColor: "sky",
        why: "Satellite imagery, elevation models (DEM), and land-cover maps are all raster data. GeoTIFF is the standard format — essential for terrain analysis and remote sensing.",
        resources: [
          { type: "docs",  label: "GeoTIFF Format Overview", author: "OGC", url: "https://www.ogc.org/standard/geotiff/" },
          { type: "docs",  label: "Cloud Optimized GeoTIFF (COG) Guide", author: "cogeo.org", url: "https://cogeo.org/" },
          { type: "video", label: "Introduction to Raster Data in GIS", author: "GIS Geography", duration: "20min", url: "https://www.youtube.com/watch?v=3GBRkOQH6eI" },
          { type: "docs",  label: "Working with Rasters in QGIS", author: "qgis.org", url: "https://docs.qgis.org/latest/en/docs/user_manual/working_with_raster/index.html" },
        ],
      },
      {
        name: "Coordinate Reference Systems",
        level: "Recommended",
        levelColor: "sky",
        why: "CRS mismatches are the #1 source of 'my map is broken' bugs. Understand WGS84 (EPSG:4326), Web Mercator (EPSG:3857), and Taiwan's TWD97 (EPSG:3826).",
        resources: [
          { type: "docs",  label: "epsg.io – Look Up Any CRS", author: "epsg.io", url: "https://epsg.io" },
          { type: "video", label: "Coordinate Reference Systems Explained", author: "ESRI", duration: "10min", url: "https://www.youtube.com/watch?v=HnWNhyxyUHg" },
          { type: "docs",  label: "Proj.org – CRS Transformation Library", author: "proj.org", url: "https://proj.org/en/stable/" },
        ],
      },
      {
        name: "PostgreSQL + PostGIS",
        level: "Next Step",
        levelColor: "amber",
        why: "Add geographic functions (ST_Within, ST_Distance, ST_Intersects) to a full SQL database. The backbone of most production GIS systems.",
        resources: [
          { type: "docs",  label: "PostGIS Official Docs", author: "postgis.net", url: "https://postgis.net/documentation/" },
          { type: "video", label: "PostGIS Tutorial for Beginners", author: "Crunchy Data", duration: "1h", url: "https://www.youtube.com/watch?v=g4DgAVCmiDE" },
          { type: "docs",  label: "Introduction to PostGIS Workshop", author: "Crunchy Data", url: "https://postgis.net/workshops/postgis-intro/" },
        ],
      },
      {
        name: "QGIS",
        level: "Useful",
        levelColor: "violet",
        why: "Free desktop GIS tool. Use it to inspect, reproject, convert, and prepare spatial data before loading into your web app.",
        resources: [
          { type: "docs",  label: "QGIS Official Docs", author: "qgis.org", url: "https://docs.qgis.org/latest/en/docs/user_manual/" },
          { type: "video", label: "QGIS for Beginners – Full Course", author: "Steven Bernard", duration: "2h", url: "https://www.youtube.com/watch?v=NHolzMgaqwE" },
          { type: "docs",  label: "QGIS Training Manual", author: "qgis.org", url: "https://docs.qgis.org/latest/en/docs/training_manual/" },
        ],
      },
    ],
  },
];

const LEVEL_COLOR: Record<string, string> = {
  emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
  sky:     "bg-sky-100 text-sky-700 border-sky-200",
  violet:  "bg-violet-100 text-violet-700 border-violet-200",
  amber:   "bg-amber-100 text-amber-700 border-amber-200",
  rose:    "bg-rose-100 text-rose-700 border-rose-200",
};

const TYPE_ICON: Record<string, string> = {
  video: "▶",
  docs:  "📄",
};

export default function MaterialsPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const displayed = activeCategory
    ? CATEGORIES.filter(c => c.id === activeCategory)
    : CATEGORIES;

  const activeLabel = activeCategory
    ? CATEGORIES.find(c => c.id === activeCategory)?.label
    : "All";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-4 md:px-16 h-12 md:h-14 border-b border-stone-200">
        <div className="flex items-center gap-2 md:gap-6 min-w-0">
          <Link href="/" className="text-sm font-black tracking-tight text-stone-900 hover:text-stone-500 transition-colors whitespace-nowrap">
            WebGIS Workshop
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-sm text-stone-400 truncate">Materials</span>
        </div>
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-900 transition-colors whitespace-nowrap ml-4">← Home</Link>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 md:px-16 py-8 md:py-16">

        {/* ── Hero ── */}
        <div className="mb-8 md:mb-14">
          {/* Title row */}
          <div className="space-y-2 md:space-y-3 mb-6 md:mb-8">
            <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Learning Path</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Materials</h1>
            <p className="text-sm md:text-base text-stone-400 max-w-lg leading-relaxed">
              Everything you need to go from a single HTML file to a production-grade WebGIS application.
              Organized by skill area — start from the top.
            </p>
          </div>

          {/* Filter — desktop: inline row / mobile: collapsible dropdown */}
          <div>
            <p className="text-xs text-stone-400 mb-2 uppercase tracking-widest">Filter by area</p>

            {/* Mobile: toggle button + dropdown */}
            <div className="md:hidden">
              <button
                onClick={() => setFilterOpen(v => !v)}
                className="flex items-center justify-between w-full px-3 py-2 border border-stone-300 text-sm font-semibold text-stone-700 bg-white"
              >
                <span>{activeLabel}</span>
                <span className={`transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}>▾</span>
              </button>
              {filterOpen && (
                <div className="border border-t-0 border-stone-200 bg-white divide-y divide-stone-100">
                  <button
                    onClick={() => { setActiveCategory(null); setFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2.5 text-sm font-semibold transition-colors
                      ${!activeCategory ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-stone-50"}`}>
                    All
                  </button>
                  {CATEGORIES.map(c => (
                    <button key={c.id}
                      onClick={() => { setActiveCategory(activeCategory === c.id ? null : c.id); setFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 text-sm font-semibold transition-colors
                        ${activeCategory === c.id ? "bg-stone-900 text-white" : "text-stone-500 hover:bg-stone-50"}`}>
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop: pill row */}
            <div className="hidden md:flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-3 py-1.5 text-xs font-semibold border transition-colors rounded-none
                  ${!activeCategory ? "bg-stone-900 text-white border-stone-900" : "border-stone-300 text-stone-500 hover:border-stone-900 hover:text-stone-900"}`}>
                All
              </button>
              {CATEGORIES.map(c => (
                <button key={c.id}
                  onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                  className={`px-3 py-1.5 text-xs font-semibold border transition-colors rounded-none
                    ${activeCategory === c.id ? "bg-stone-900 text-white border-stone-900" : "border-stone-300 text-stone-500 hover:border-stone-900 hover:text-stone-900"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Categories ── */}
        <div className="space-y-10 md:space-y-16">
          {displayed.map((cat) => (
            <section key={cat.id}>
              {/* Category header */}
              <div className="mb-5 md:mb-8 pb-3 md:pb-4 border-b border-stone-200">
                <div className="flex items-baseline gap-2 md:gap-3 flex-wrap">
                  <h2 className="text-xl md:text-2xl font-black tracking-tight">{cat.label}</h2>
                  <p className="text-xs md:text-sm text-stone-400">{cat.tagline}</p>
                </div>
                {/* Description — visible on all sizes but smaller on mobile */}
                <p className="text-xs text-stone-400 mt-2 leading-relaxed md:hidden">
                  {cat.description}
                </p>
                <p className="text-xs text-stone-300 mt-2 max-w-sm leading-relaxed hidden lg:block">
                  {cat.description}
                </p>
              </div>

              {/* Skills grid — 1 col mobile, 2 col md, 3 col xl */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                {cat.skills.map(skill => (
                  <div key={skill.name} className="border border-stone-200 bg-white flex flex-col">
                    {/* Skill header */}
                    <div className="px-4 md:px-6 py-4 md:py-5 border-b border-stone-100">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base md:text-lg font-black tracking-tight">{skill.name}</h3>
                        <span className={`text-[10px] font-bold px-2 py-1 border flex-shrink-0 ${LEVEL_COLOR[skill.levelColor]}`}>
                          {skill.level}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 leading-relaxed">{skill.why}</p>
                    </div>

                    {/* Resources */}
                    <div className="flex-1 px-4 md:px-6 py-3 md:py-4 space-y-1.5 md:space-y-2">
                      {skill.resources.map((r, i) => (
                        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-start gap-2 md:gap-3 group p-2 -mx-2 hover:bg-stone-50 transition-colors rounded">
                          <span className="text-[11px] mt-0.5 flex-shrink-0 text-stone-300 group-hover:text-stone-500 transition-colors">
                            {TYPE_ICON[r.type]}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-stone-700 group-hover:text-stone-900 transition-colors leading-snug">
                              {r.label}
                            </p>
                            <div className="flex items-center gap-1.5 md:gap-2 mt-0.5 flex-wrap">
                              <span className="text-[10px] text-stone-400">{r.author}</span>
                              {(r as { duration?: string }).duration && (
                                <>
                                  <span className="text-stone-200">·</span>
                                  <span className="text-[10px] text-stone-400">{(r as { duration?: string }).duration}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <span className="text-[10px] text-stone-300 group-hover:text-stone-500 transition-colors flex-shrink-0 mt-0.5">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="mt-12 md:mt-20 pt-6 md:pt-8 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-stone-300">
            All resources are free or have free tiers. No affiliation.
          </p>
          <Link href="/" className="text-sm font-semibold text-stone-900 hover:text-stone-500 transition-colors">
            ← Back to Workshop
          </Link>
        </div>
      </main>
    </div>
  );
}