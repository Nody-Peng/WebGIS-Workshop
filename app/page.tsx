"use client";

import Link from "next/link";

const MODULES = [
  { href: "/intro",     num: "01", title: "Introduction",      desc: "WebGIS concepts & real-world case studies" },
  { href: "/simple",    num: "02", title: "Hands-on Practice", desc: "Build an interactive map from scratch" },
  { href: "/advanced",  num: "03", title: "Advanced Pathway",  desc: "React, Next.js, PostGIS & Vercel deployment" },
  { href: "/materials", num: "04", title: "Learning Materials","desc": "Datasets, tools, docs & references" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">

      {/* ── Top bar ── */}
      <div className="px-16 pt-10 pb-0">
        <p className="text-sm text-stone-400 tracking-wide">May 25, 2026</p>
      </div>

      {/* ── Main ── */}
      <main className="flex flex-1 px-16 gap-24 items-center max-w-screen-xl mx-auto w-full py-16">

        {/* Left: title block */}
        <div className="w-80 flex-shrink-0 flex flex-col justify-between self-stretch py-4">
          <div className="space-y-4">
            <h1 className="text-7xl font-black tracking-tight leading-none">
              Web<br />GIS<br />Work<br />shop
            </h1>
            <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
              From a blank HTML file to a deployed spatial web application.
            </p>
          </div>

          <div className="space-y-1 pt-8 border-t border-stone-200 mt-auto">
            <p className="text-sm font-semibold text-stone-700">Peng, Tsung-Chun</p>
            <p className="text-xs text-stone-400">Workshop Instructor</p>
            <div className="flex flex-col gap-1 pt-2">
              <a href="mailto:ablecck12@gmail.com"
                className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
                ablecck12@gmail.com
              </a>
              <a href="https://github.com/Nody-Peng" target="_blank" rel="noopener noreferrer"
                className="text-xs text-stone-400 hover:text-stone-700 transition-colors">
                github.com/Nody-Peng
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px self-stretch bg-stone-200 flex-shrink-0" />

        {/* Right: module list */}
        <nav className="flex-1 flex flex-col divide-y divide-stone-200">
          {MODULES.map((m) => (
            <Link key={m.href} href={m.href}
              className="group flex items-center justify-between py-8 hover:pl-4 transition-all duration-150">
              <div className="flex items-baseline gap-8">
                <span className="text-sm text-stone-300 font-mono">{m.num}</span>
                <div>
                  <p className="text-3xl font-bold text-stone-900 group-hover:text-stone-500 transition-colors">
                    {m.title}
                  </p>
                  <p className="text-sm text-stone-400 mt-1">{m.desc}</p>
                </div>
              </div>
              <span className="text-2xl text-stone-300 group-hover:text-stone-600 group-hover:translate-x-2 transition-all">
                →
              </span>
            </Link>
          ))}
        </nav>

      </main>
    </div>
  );
}