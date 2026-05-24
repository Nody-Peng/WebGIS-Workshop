'use client'
import { useState, useEffect, useCallback } from 'react'

const slides = [
  {
    id: 'title',
    label: null,
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full gap-6">
        <p className="text-xs tracking-[0.3em] text-slate-500 uppercase">
          NCCU · Design for Social Innovation · 2026
        </p>
        <h1 className="text-6xl font-bold text-white leading-tight">
          What is<br />
          <span className="text-sky-400">WebGIS?</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-md leading-relaxed">
          Before we build, let's understand what we're building — and why it matters.
        </p>
      </div>
    ),
  },
  {
    id: 'gis-def',
    label: 'Part 1 — GIS',
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full gap-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-green-500 uppercase mb-4">Geographic Information System</p>
          <h2 className="text-5xl font-bold text-white">What is GIS?</h2>
        </div>
        <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
          A system for <span className="text-white font-medium">capturing, storing, analyzing</span> and{' '}
          <span className="text-white font-medium">visualizing</span> data that is tied to real-world locations.
        </p>
        <div className="grid grid-cols-3 gap-px bg-slate-800 rounded-2xl overflow-hidden w-full max-w-2xl border border-slate-800">
          {[
            { letter: 'G', word: 'Geographic', desc: 'Data tied to real-world coordinates and boundaries' },
            { letter: 'I', word: 'Information', desc: 'Attributes attached to each location — names, scores, stats' },
            { letter: 'S', word: 'System', desc: 'Tools to query, analyze, and display spatial relationships' },
          ].map(item => (
            <div key={item.letter} className="bg-slate-950 p-6 text-left">
              <p className="text-3xl font-black text-green-500 mb-2">{item.letter}</p>
              <p className="text-sm font-semibold text-white mb-2">{item.word}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'gis-examples',
    label: 'Part 1 — GIS',
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full gap-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-green-500 uppercase mb-4">GIS in the real world</p>
          <h2 className="text-5xl font-bold text-white">Where is GIS used?</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            { title: 'Navigation', desc: 'Google Maps, Waze — routing and traffic analysis' },
            { title: 'Disaster Response', desc: 'Flood zone mapping, evacuation route planning' },
            { title: 'Public Health', desc: 'Disease spread tracking, hospital coverage gaps' },
            { title: 'Urban Planning', desc: 'Zoning, land use, infrastructure analysis' },
          ].map(item => (
            <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left hover:border-slate-600 transition-colors">
              <p className="text-white font-semibold mb-1">{item.title}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'web-def',
    label: 'Part 2 — Web',
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full gap-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-orange-400 uppercase mb-4">HyperText, Browsers & the Internet</p>
          <h2 className="text-5xl font-bold text-white">What is the Web?</h2>
        </div>
        <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
          A system of <span className="text-white font-medium">interconnected pages and apps</span> delivered through a browser —
          accessible to <span className="text-white font-medium">anyone, anywhere, on any device</span>.
        </p>
        <div className="flex gap-px bg-slate-800 rounded-2xl overflow-hidden border border-slate-800 w-full max-w-2xl">
          {[
            { tag: 'HTML', label: 'Structure', desc: 'Defines what content exists on a page' },
            { tag: 'CSS',  label: 'Style',     desc: 'Controls layout, colors, and visual design' },
            { tag: 'JS',   label: 'Behaviour', desc: 'Makes pages dynamic and interactive' },
          ].map(item => (
            <div key={item.tag} className="flex-1 bg-slate-950 p-6 text-left">
              <p className="text-xs font-black tracking-widest text-orange-400 mb-2">{item.tag}</p>
              <p className="text-sm font-semibold text-white mb-2">{item.label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'web-power',
    label: 'Part 2 — Web',
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full gap-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-orange-400 uppercase mb-4">Why it changes everything</p>
          <h2 className="text-5xl font-bold text-white">The Web's advantage</h2>
        </div>
        <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
          Traditional GIS tools require installation, licenses, and training.
          The Web removes all of that.
        </p>
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            { title: 'Share via URL',      desc: 'Anyone with a link can view your map instantly — no software needed' },
            { title: 'Works everywhere',   desc: 'Phone, tablet, desktop — same experience across all devices' },
            { title: 'Real-time data',     desc: 'Maps can update live as new data comes in' },
            { title: 'Free & open-source', desc: 'Leaflet, OpenStreetMap — powerful tools at zero cost' },
          ].map(item => (
            <div key={item.title} className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-left hover:border-slate-600 transition-colors">
              <p className="text-white font-semibold mb-1">{item.title}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'webgis-equation',
    label: 'Part 3 — WebGIS',
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full gap-10">
        <div>
          <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-4">Putting it together</p>
          <h2 className="text-5xl font-bold text-white">When Web meets GIS</h2>
        </div>
        <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
          You get maps that are <span className="text-white font-medium">interactive, shareable, and data-driven</span> —
          running directly in a browser, no desktop software required.
        </p>
        <div className="flex items-center gap-6">
          <div className="border border-slate-700 rounded-2xl px-10 py-6 bg-slate-900">
            <p className="text-2xl font-bold text-green-400">GIS</p>
            <p className="text-xs text-slate-500 mt-1">Spatial analysis</p>
          </div>
          <p className="text-3xl text-slate-600 font-thin">+</p>
          <div className="border border-slate-700 rounded-2xl px-10 py-6 bg-slate-900">
            <p className="text-2xl font-bold text-orange-400">Web</p>
            <p className="text-xs text-slate-500 mt-1">Accessibility</p>
          </div>
          <p className="text-3xl text-slate-600 font-thin">=</p>
          <div className="border border-sky-500/50 rounded-2xl px-10 py-6 bg-sky-950/40">
            <p className="text-2xl font-bold text-sky-400">WebGIS</p>
            <p className="text-xs text-sky-600 mt-1">Maps for everyone</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'definition',
    label: 'Part 3 — WebGIS',
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full gap-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-4">Definition</p>
          <h2 className="text-5xl font-bold text-white">So, what is WebGIS?</h2>
        </div>
        <div className="border border-slate-700 rounded-2xl p-8 max-w-2xl bg-slate-900/60 text-left">
          <p className="text-xs tracking-widest text-sky-400 uppercase font-bold mb-4">WebGIS</p>
          <p className="text-slate-300 text-lg leading-relaxed">
            A <span className="text-white font-semibold">web-based Geographic Information System</span> that allows users to{' '}
            <span className="text-white font-semibold">view, interact with, and analyze</span> spatial data through a browser —
            without any desktop software.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
          {[
            { term: 'GIS',    color: 'text-green-400',  desc: 'Spatial data + analysis' },
            { term: 'Web',    color: 'text-orange-400', desc: 'Browser-based, shareable' },
            { term: 'WebGIS', color: 'text-sky-400',    desc: 'GIS accessible to everyone' },
          ].map(item => (
            <div key={item.term} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-left">
              <p className={`text-sm font-black tracking-widest uppercase mb-2 ${item.color}`}>{item.term}</p>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'examples',
    label: 'Part 3 — WebGIS',
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full gap-6">
        <div>
          <p className="text-xs tracking-[0.3em] text-sky-400 uppercase mb-3">WebGIS in the wild</p>
          <h2 className="text-5xl font-bold text-white">Real examples</h2>
          <p className="text-slate-500 text-sm mt-2">Click any card to explore →</p>
        </div>

        {/* Bento grid — 3 col × 2 row */}
        <div className="w-full max-w-3xl grid grid-cols-3 gap-3" style={{ gridTemplateRows: 'auto auto' }}>

          {/* ── FEATURED: Your project — spans 2 cols, row 1 ── */}
          <a
            href="https://taipei-tod-map.zeabur.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 bg-slate-900 border border-sky-500/40 rounded-2xl p-6 text-left hover:border-sky-400 hover:bg-slate-800/60 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 text-xs tracking-widest text-sky-400 uppercase font-bold bg-sky-950/60 border border-sky-500/30 rounded-full px-3 py-1">
              Built with WebGIS
            </div>
            <p className="text-xs tracking-widest text-sky-400 uppercase font-semibold mb-2">Urban Research · NCCU</p>
            <p className="text-white font-bold text-base mb-2">台北捷運生活圈與房價比較地圖</p>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              An interactive WebGIS built at NCCU's Real Estate Research Center — overlaying MRT transit zones with housing price data across Taipei.
            </p>
            <p className="text-slate-600 text-xs group-hover:text-sky-400 transition-colors mt-4">taipei-tod-map.zeabur.app ↗</p>
          </a>

          {/* ── Google Maps — col 3, row 1 ── */}
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left hover:border-slate-600 hover:bg-slate-800/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <p className="text-xs tracking-widest text-slate-400 uppercase font-semibold mb-2">Everyday WebGIS</p>
              <p className="text-white font-semibold mb-2">Google Maps</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                The world's most-used WebGIS — routing, Street View, and real-time traffic for billions of users.
              </p>
            </div>
            <p className="text-slate-700 text-xs group-hover:text-sky-400 transition-colors mt-3">maps.google.com ↗</p>
          </a>

          {/* ── Johns Hopkins — col 1, row 2 ── */}
          <a
            href="https://coronavirus.jhu.edu/map.html"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left hover:border-slate-600 hover:bg-slate-800/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <p className="text-xs tracking-widest text-slate-400 uppercase font-semibold mb-2">Public Health</p>
              <p className="text-white font-semibold mb-2">JHU COVID-19 Dashboard</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Real-time global case tracking that shaped policy decisions in 2020.
              </p>
            </div>
            <p className="text-slate-700 text-xs group-hover:text-sky-400 transition-colors mt-3">coronavirus.jhu.edu ↗</p>
          </a>

          {/* ── Global Forest Watch — col 2, row 2 ── */}
          <a
            href="https://www.globalforestwatch.org/map/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left hover:border-slate-600 hover:bg-slate-800/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <p className="text-xs tracking-widest text-slate-400 uppercase font-semibold mb-2">Environment</p>
              <p className="text-white font-semibold mb-2">Global Forest Watch</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Near real-time deforestation tracking via satellite imagery.
              </p>
            </div>
            <p className="text-slate-700 text-xs group-hover:text-sky-400 transition-colors mt-3">globalforestwatch.org ↗</p>
          </a>

          {/* ── Kepler.gl — col 3, row 2 ── */}
          <a
            href="https://kepler.gl/demo"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left hover:border-slate-600 hover:bg-slate-800/60 transition-all group flex flex-col justify-between"
          >
            <div>
              <p className="text-xs tracking-widest text-slate-400 uppercase font-semibold mb-2">Data Viz</p>
              <p className="text-white font-semibold mb-2">Kepler.gl by Uber</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                Large-scale geospatial visualization tool, open-sourced by Uber.
              </p>
            </div>
            <p className="text-slate-700 text-xs group-hover:text-sky-400 transition-colors mt-3">kepler.gl ↗</p>
          </a>

        </div>
      </div>
    ),
  },
  {
    id: 'goal',
    label: "Today's Goal",
    content: (
      <div className="flex flex-col items-center justify-center text-center h-full gap-8">
        <div>
          <p className="text-xs tracking-[0.3em] text-slate-500 uppercase mb-4">What we're building today</p>
          <h2 className="text-5xl font-bold text-white leading-tight">
            A flood aid map<br />
            <span className="text-sky-400">built by you</span>
          </h2>
        </div>
        <p className="text-slate-400 text-lg max-w-lg leading-relaxed">
          Color-coded markers showing which households need help most —
          deployed live on the web with a real URL.
        </p>
        <div className="flex gap-4">
          {[
            { label: 'Interactive markers', sub: 'Click to see details' },
            { label: 'Priority colors',     sub: 'Red → Yellow → Green' },
            { label: 'Live deployment',     sub: 'Your own public URL' },
          ].map(item => (
            <div key={item.label} className="border border-slate-700 rounded-xl px-6 py-4 bg-slate-900 text-left min-w-[160px]">
              <p className="text-white text-sm font-semibold mb-1">{item.label}</p>
              <p className="text-slate-500 text-xs">{item.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-slate-600 text-sm mt-4">Let's start building →</p>
      </div>
    ),
  },
]

export default function IntroPage() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [animating, setAnimating] = useState(false)
  const [visible, setVisible] = useState(true)

  const goTo = useCallback((n: number) => {
    if (animating || n < 0 || n >= slides.length) return
    setAnimating(true)
    setDirection(n > current ? 'forward' : 'back')
    setVisible(false)
    setTimeout(() => {
      setCurrent(n)
      setVisible(true)
      setTimeout(() => setAnimating(false), 350)
    }, 250)
  }, [animating, current])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') goTo(current + 1)
      if (e.key === 'ArrowLeft') goTo(current - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [current, goTo])

  const progress = ((current + 1) / slides.length) * 100

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col">
      <div
        className="absolute top-0 left-0 h-[2px] bg-sky-500 transition-all duration-500 ease-out z-50"
        style={{ width: `${progress}%` }}
      />
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 h-14 z-40">
        <span className="text-xs text-slate-600 tracking-widest uppercase font-medium">WebGIS Workshop</span>
        {slides[current].label && (
          <span className="text-xs text-slate-600 tracking-widest uppercase">{slides[current].label}</span>
        )}
        <span className="text-xs text-slate-700 font-mono">
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center px-16 py-20">
        <div
          className="w-full max-w-4xl h-full flex items-center justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? 'translateY(0px)'
              : direction === 'forward' ? 'translateY(16px)' : 'translateY(-16px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          {slides[current].content}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 h-14 z-40">
        <div className="flex gap-1.5 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="transition-all duration-300 rounded-full hover:bg-slate-500"
              style={{
                width: i === current ? '20px' : '6px',
                height: '6px',
                backgroundColor: i === current ? '#38bdf8' : '#334155',
              }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-20 transition-all text-sm"
          >←</button>
          <button
            onClick={() => goTo(current + 1)}
            disabled={current === slides.length - 1}
            className="w-9 h-9 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-20 transition-all text-sm"
          >→</button>
        </div>
      </div>
    </div>
  )
}