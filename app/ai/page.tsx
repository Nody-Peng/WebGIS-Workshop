import React from "react";

// ─── Shared primitives ────────────────────────────────────────────────────────
function Divider() {
  return <hr className="border-stone-200 my-12" />;
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-stone-100 text-stone-700 text-[13px] px-1.5 py-0.5 rounded font-mono">
      {children}
    </code>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mb-4">
      {children}
    </p>
  );
}

function Tag({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <span className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${
      muted
        ? "border-stone-200 text-stone-400 bg-white"
        : "border-stone-300 text-stone-600 bg-stone-50"
    }`}>
      {children}
    </span>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-2 text-stone-400 text-xs font-mono uppercase tracking-widest mb-5">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <span>AI & WebGIS</span>
      </div>

      <h1 className="text-4xl font-black tracking-tight text-stone-900 leading-tight mb-5">
        You don't need to<br />
        <span className="text-stone-400">know how to code</span><br />
        to build with maps.
      </h1>

      <p className="text-stone-500 text-base leading-relaxed max-w-xl">
        AI has fundamentally changed what's possible for non-programmers in geospatial work.
        This page isn't about shortcuts — it's about understanding how to use AI as a genuine
        collaborator across every stage: learning, building, analysing, and communicating.
      </p>

      <div className="flex flex-wrap gap-2 mt-6">
        {["Vibe Coding","Prompt Engineering","Spatial Analysis","No-Code GIS","Learning Strategy","Data Storytelling"].map(t=>(
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
    </div>
  );
}

// ─── Mindset section ─────────────────────────────────────────────────────────
function MindsetSection() {
  return (
    <section id="mindset">
      <SectionLabel>01 — Mindset</SectionLabel>
      <h2 className="text-2xl font-bold text-stone-800 mb-4">AI is a collaborator, not a search engine.</h2>

      <p className="text-sm text-stone-500 leading-relaxed mb-6">
        Most people use AI the wrong way: they type a vague question, get a vague answer, and give up.
        The people who get real value from AI treat it like a knowledgeable colleague sitting next to them —
        one who never gets tired, never judges you for asking basic questions, and can switch between
        being a teacher, a debugger, a translator, and a data analyst within the same conversation.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          {
            label: "Wrong mental model",
            items: [
              "\"Write me a WebGIS app\"",
              "One prompt, expect magic",
              "Give up when output is wrong",
              "Copy code without reading it",
            ],
            bad: true,
          },
          {
            label: "Right mental model",
            items: [
              "\"Help me understand X so I can do Y\"",
              "Iterate — refine, question, push back",
              "Ask why something failed",
              "Use AI to understand, not just produce",
            ],
            bad: false,
          },
        ].map(col => (
          <div key={col.label} className={`rounded-xl border p-4 ${col.bad ? "border-stone-200 bg-white" : "border-stone-300 bg-stone-50"}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-widest mb-3 ${col.bad ? "text-stone-300" : "text-stone-500"}`}>
              {col.label}
            </p>
            <ul className="space-y-2">
              {col.items.map(item => (
                <li key={item} className="flex items-start gap-2 text-[13px] text-stone-500">
                  <span className={`mt-0.5 flex-shrink-0 ${col.bad ? "text-stone-300" : "text-stone-400"}`}>
                    {col.bad ? "×" : "→"}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-5">
        <p className="text-sm font-semibold text-stone-700 mb-2">The core principle</p>
        <p className="text-sm text-stone-500 leading-relaxed">
          Your job is to <strong className="text-stone-700">stay in the driver's seat</strong>.
          AI handles the parts that are tedious, unfamiliar, or time-consuming.
          You decide what to build, what questions to ask, and whether the output makes sense.
          The moment you stop thinking critically about what AI produces, you lose the advantage.
        </p>
      </div>
    </section>
  );
}

// ─── Vibe Coding section ──────────────────────────────────────────────────────
function VibeCodingSection() {
  const steps = [
    {
      n: "01",
      title: "Describe the goal, not the implementation",
      body: `Don't say "write a useEffect that fetches GeoJSON". Say "I want to load a GeoJSON file when the page opens and show it on a Leaflet map. I'm using Next.js with the App Router." Give context. AI fills in the how.`,
      prompt: `"I'm building a disaster risk map in Next.js. I have a GeoJSON file of flood zones. How do I load it and display it as a coloured layer on a Leaflet map? I don't know React well yet."`,
    },
    {
      n: "02",
      title: "Read before you run",
      body: `When AI gives you code, read it out loud — or paste it back and ask "explain this to me line by line". You don't need to memorise it. You need to know what it does so you can change it later.`,
      prompt: `"Explain this function to me. What does it do, why does it exist, and what would break if I removed it?"`,
    },
    {
      n: "03",
      title: "Break things intentionally",
      body: `The fastest way to learn is to change one thing and see what happens. AI is a perfect safety net — when something breaks, paste the error and ask what went wrong. Errors are not failures, they're information.`,
      prompt: `"I changed X and now I get this error: [paste error]. What does this mean and how do I fix it?"`,
    },
    {
      n: "04",
      title: "Ask for alternatives",
      body: `AI's first answer is rarely the only answer. If something feels too complex, ask for a simpler version. If you want to understand trade-offs, ask "what are the other ways to do this?"`,
      prompt: `"Is there a simpler way to do this that doesn't require me to understand [concept]? What am I trading off?"`,
    },
    {
      n: "05",
      title: "Use AI to review your own work",
      body: `Once you've written or modified something, paste it back and ask "does this look right?" or "what could go wrong with this approach?" AI is an excellent code reviewer.`,
      prompt: `"Here's the code I wrote. Is there anything wrong with it, or anything I should be aware of before I ship it?"`,
    },
  ];

  return (
    <section id="vibe-coding">
      <SectionLabel>02 — Vibe Coding</SectionLabel>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Building without knowing everything.</h2>
      <p className="text-sm text-stone-500 leading-relaxed mb-8 max-w-xl">
        "Vibe coding" is the practice of building software by describing intent to an AI and iterating
        on the output — without needing to know every API, syntax rule, or library in advance.
        It's not sloppy. Done well, it's one of the most effective ways to learn and ship simultaneously.
      </p>

      <div className="space-y-4">
        {steps.map(s => (
          <div key={s.n} className="rounded-xl border border-stone-200 bg-white overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              <span className="text-[11px] font-mono text-stone-300 flex-shrink-0 mt-0.5">{s.n}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-800 mb-1.5">{s.title}</p>
                <p className="text-[13px] text-stone-500 leading-relaxed">{s.body}</p>
              </div>
            </div>
            <div className="border-t border-stone-100 bg-stone-50 px-5 py-3">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono mb-1.5">Example prompt</p>
              <p className="text-[13px] text-stone-600 italic leading-relaxed">{s.prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── No-Code GIS section ──────────────────────────────────────────────────────
function NoCodeSection() {
  const usecases = [
    {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
      title: "Data cleaning & conversion",
      desc: "Upload a messy CSV with addresses or coordinates. Ask AI to clean it, standardise column names, convert to GeoJSON, or identify outliers. No Python required.",
      example: "\"I have a CSV with a column called '地址' in Chinese. How do I geocode these addresses to lat/lng coordinates using a free tool?\"",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.159.69.159 1.006 0z" />
        </svg>
      ),
      title: "Map design decisions",
      desc: "Not sure which colour scheme to use for a risk map? What projection makes sense for Taiwan? Ask AI to explain the trade-offs and recommend an approach for your specific audience.",
      example: "\"I'm making a flood risk map for a public audience. Should I use a sequential or diverging colour scale? What colours are accessible for colour-blind viewers?\"",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
      ),
      title: "Spatial analysis without code",
      desc: "Describe what you want to know about your data. AI can walk you through doing it in QGIS, suggest the right spatial operation, or write a simple script you can run without understanding every line.",
      example: "\"I have two shapefiles — one with school locations and one with flood zones. I want to know which schools are at risk. What's the easiest way to do this?\"",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      ),
      title: "Understanding what you're looking at",
      desc: "Found a dataset you don't understand? Paste the field names or a sample row into AI and ask it to explain what each column means, what the data represents, and how you might use it.",
      example: "\"Here are the first 3 rows of a GeoJSON I downloaded from the government portal. Can you explain what each property field means and what I could visualise with this?\"",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
      title: "Writing about maps",
      desc: "AI can help you write captions, reports, and interpretations of spatial data. Describe what your map shows and ask AI to help you communicate it clearly to a non-technical audience.",
      example: "\"My map shows that 3 out of 5 critical schools in Xinzhuang are inside flood inundation zones. Help me write a clear, non-alarmist paragraph explaining this finding.\"",
    },
  ];

  return (
    <section id="no-code">
      <SectionLabel>03 — No-Code GIS</SectionLabel>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">You don't need to write code to do real GIS work.</h2>
      <p className="text-sm text-stone-500 leading-relaxed mb-8 max-w-xl">
        Coding is one tool among many. AI unlocks geospatial workflows for researchers, planners,
        journalists, and students who have domain knowledge but not programming backgrounds.
        Here's what's genuinely possible today.
      </p>

      <div className="space-y-3">
        {usecases.map(u => (
          <div key={u.title} className="rounded-xl border border-stone-200 bg-white overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-500 mt-0.5">
                {u.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-stone-800 mb-1">{u.title}</p>
                <p className="text-[13px] text-stone-500 leading-relaxed">{u.desc}</p>
              </div>
            </div>
            <div className="border-t border-stone-100 bg-stone-50 px-5 py-3">
              <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono mb-1.5">Try asking</p>
              <p className="text-[13px] text-stone-600 italic leading-relaxed">{u.example}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Learning section ─────────────────────────────────────────────────────────
function LearningSection() {
  const strategies = [
    {
      title: "The Feynman loop",
      desc: "Read something. Ask AI to quiz you on it. Try to explain it back in your own words. Ask AI to correct you. Repeat. This is faster than re-reading the same material three times.",
      prompt: "\"I just read about the ray-casting algorithm for point-in-polygon tests. Quiz me on it — ask me questions and tell me when I'm wrong.\"",
    },
    {
      title: "Concept laddering",
      desc: "When you hit a concept you don't understand, ask AI to explain it at three levels: a one-sentence version, a paragraph version, and a technical version. Start with the one-sentence version.",
      prompt: "\"Explain what a spatial index is. First in one sentence, then in a paragraph, then technically. I'm a geography student, not a programmer.\"",
    },
    {
      title: "Build a minimal version first",
      desc: "Before building the full thing, ask AI to help you build the smallest possible version that proves the concept works. A map that loads one point is more valuable than a half-finished complex app.",
      prompt: "\"What's the absolute minimum code to show a single marker on a Leaflet map in a plain HTML file? No frameworks, no build tools.\"",
    },
    {
      title: "Ask for the mental model, not just the answer",
      desc: "The answer to your immediate question is less valuable than understanding the underlying pattern. Ask AI to explain the mental model so you can apply it to new problems.",
      prompt: "\"Don't just tell me how to fix this — explain the mental model I'm missing so I can solve similar problems myself next time.\"",
    },
    {
      title: "Use AI to find what you don't know you don't know",
      desc: "Ask AI what topics you should understand to do what you're trying to do. This surfaces the gaps in your knowledge before they become blockers.",
      prompt: "\"I want to build a web map that lets users draw a polygon and see which data points fall inside it. What concepts do I need to understand to do this? List them in order of importance.\"",
    },
  ];

  return (
    <section id="learning">
      <SectionLabel>04 — Learning Strategy</SectionLabel>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Learn faster by learning differently.</h2>
      <p className="text-sm text-stone-500 leading-relaxed mb-8 max-w-xl">
        AI doesn't just answer questions — it can actively accelerate how you build mental models.
        These strategies work whether you're learning GIS fundamentals, spatial algorithms, or
        how to read someone else's code.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {strategies.map((s, i) => (
          <div key={s.title} className="flex gap-5 rounded-xl border border-stone-200 bg-white p-5">
            <span className="text-[11px] font-mono text-stone-300 flex-shrink-0 mt-0.5">0{i+1}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-800 mb-1.5">{s.title}</p>
              <p className="text-[13px] text-stone-500 leading-relaxed mb-3">{s.desc}</p>
              <div className="bg-stone-50 rounded-lg px-4 py-2.5 border border-stone-100">
                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-mono mb-1">Try this</p>
                <p className="text-[13px] text-stone-600 italic leading-relaxed">{s.prompt}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Tools section ────────────────────────────────────────────────────────────
function ToolsSection() {
  const tools = [
    {
      name: "ChatGPT / Claude",
      role: "General reasoning, code explanation, writing",
      use: "Your primary thinking partner. Best for open-ended questions, iterative refinement, and understanding concepts.",
      tags: ["Free tier available", "Best for learning"],
    },
    {
      name: "Cursor / GitHub Copilot",
      role: "AI-native code editors",
      use: "Write code in an editor where AI can see your entire project. Cursor's \"Composer\" mode lets you describe changes in plain language and apply them across multiple files.",
      tags: ["For coding", "Context-aware"],
    },
    {
      name: "QGIS + AI",
      role: "Desktop GIS with AI assistance",
      use: "Use QGIS for the actual spatial operations. Use AI to figure out which tool to use, what the parameters mean, and how to interpret the output. They work better together than either alone.",
      tags: ["No-code GIS", "Free"],
    },
    {
      name: "Kepler.gl",
      role: "No-code web map builder",
      use: "Drag and drop GeoJSON or CSV files to create interactive maps instantly. Use AI to help you prepare and clean your data before importing.",
      tags: ["No-code", "Browser-based"],
    },
    {
      name: "Observable / Notebook AI",
      role: "Computational notebooks with AI",
      use: "Write spatial analysis in a notebook format. AI can generate cells, explain outputs, and help you iterate on visualisations without a full dev environment.",
      tags: ["For analysis", "Shareable"],
    },
  ];

  return (
    <section id="tools">
      <SectionLabel>05 — Tools</SectionLabel>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">The right tool for the right job.</h2>
      <p className="text-sm text-stone-500 leading-relaxed mb-8 max-w-xl">
        Different AI tools have different strengths. Knowing which one to reach for — and how to
        combine them — is itself a skill worth developing.
      </p>

      <div className="space-y-3">
        {tools.map(t => (
          <div key={t.name} className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <p className="text-sm font-semibold text-stone-800">{t.name}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{t.role}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {t.tags.map(tag => <Tag key={tag} muted>{tag}</Tag>)}
              </div>
            </div>
            <p className="text-[13px] text-stone-500 leading-relaxed">{t.use}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Limits section ───────────────────────────────────────────────────────────
function LimitsSection() {
  return (
    <section id="limits">
      <SectionLabel>06 — Know the limits</SectionLabel>
      <h2 className="text-2xl font-bold text-stone-800 mb-4">AI is wrong more often than it sounds.</h2>

      <p className="text-sm text-stone-500 leading-relaxed mb-6">
        AI is confidently wrong with the same tone it uses when it's right.
        In geospatial work, this matters — a wrong coordinate system, a misunderstood projection,
        or an incorrect spatial join can produce plausible-looking but completely invalid results.
      </p>

      <div className="space-y-3 mb-6">
        {[
          {
            risk: "Hallucinated APIs and functions",
            desc: "AI will sometimes invent function names that don't exist, especially for niche libraries. Always check the official documentation before trusting a specific API call.",
          },
          {
            risk: "Outdated library versions",
            desc: "AI training data has a cutoff. React Leaflet v4 behaves very differently from v3. Always specify your version and verify the output against current docs.",
          },
          {
            risk: "Plausible but wrong spatial logic",
            desc: "A ray-casting implementation that looks correct might have an edge case that fails for points on polygon boundaries. Spatial algorithms need testing with real data, not just trust.",
          },
          {
            risk: "Data interpretation errors",
            desc: "AI doesn't know your domain. If you ask it to interpret a dataset about Taiwan flood risk, it might make assumptions that are technically reasonable but contextually wrong.",
          },
        ].map(item => (
          <div key={item.risk} className="flex gap-4 rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-700 mb-1">{item.risk}</p>
              <p className="text-[13px] text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-stone-800 bg-stone-900 p-5">
        <p className="text-sm font-semibold text-white mb-2">The rule of thumb</p>
        <p className="text-sm text-stone-400 leading-relaxed">
          Use AI to <span className="text-stone-200">understand and explore</span>.
          Use primary sources — documentation, papers, official data portals — to <span className="text-stone-200">verify and ship</span>.
          The combination is more powerful than either alone.
        </p>
      </div>
    </section>
  );
}

// ─── Closing section ──────────────────────────────────────────────────────────
function ClosingSection() {
  return (
    <section id="closing">
      <div className="rounded-2xl border border-stone-200 bg-white p-8">
        <p className="text-[10px] text-stone-400 font-mono uppercase tracking-widest mb-4">The bigger picture</p>
        <h2 className="text-xl font-bold text-stone-800 mb-4 leading-snug">
          The skill isn't using AI.<br />
          The skill is knowing what to ask.
        </h2>
        <p className="text-sm text-stone-500 leading-relaxed mb-4">
          Every technique on this page — vibe coding, concept laddering, no-code analysis — shares
          a common foundation: you need enough understanding of the problem to ask a good question.
          That understanding comes from curiosity, from reading, from trying things and breaking them.
        </p>
        <p className="text-sm text-stone-500 leading-relaxed mb-6">
          AI compresses the time between "I don't know how to do this" and "I built the thing".
          But it doesn't replace the need to care about what you're building, why it matters,
          and whether the output is actually correct.
        </p>
        <p className="text-sm text-stone-500 leading-relaxed">
          WebGIS is a domain where that matters enormously. Maps communicate authority.
          People make decisions based on what they see on a map. The best use of AI in this space
          is to help more people — not just programmers — build spatial tools that are honest,
          well-reasoned, and genuinely useful.
        </p>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AIPage() {
  const nav = [
    { id: "mindset",    label: "Mindset" },
    { id: "vibe-coding",label: "Vibe Coding" },
    { id: "no-code",    label: "No-Code GIS" },
    { id: "learning",   label: "Learning" },
    { id: "tools",      label: "Tools" },
    { id: "limits",     label: "Limits" },
  ];

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Back nav */}
        <div className="flex items-center gap-1.5 mb-10 text-[11px] text-stone-400">
          <a href="/" className="hover:text-stone-600 transition-colors">Home</a>
          <span className="text-stone-300">/</span>
          <span className="text-stone-500">AI & WebGIS</span>
        </div>

        <Hero />

        {/* Anchor nav */}
        <nav className="flex flex-wrap gap-2 mb-14 pb-10 border-b border-stone-200">
          {nav.map(n => (
            <a key={n.id} href={`#${n.id}`}
              className="text-xs text-stone-500 border border-stone-200 rounded-full px-3 py-1 hover:border-stone-400 hover:text-stone-700 transition-colors">
              {n.label}
            </a>
          ))}
        </nav>

        <MindsetSection />
        <Divider />
        <VibeCodingSection />
        <Divider />
        <NoCodeSection />
        <Divider />
        <LearningSection />
        <Divider />
        <ToolsSection />
        <Divider />
        <LimitsSection />
        <Divider />
        <ClosingSection />

        {/* Footer */}
        <div className="mt-14 pt-8 border-t border-stone-200 flex items-center justify-between text-xs text-stone-300">
          <span>WebGIS Workshop — AI & WebGIS</span>
          <a href="/" className="hover:text-stone-500 transition-colors">← Back to home</a>
        </div>

      </div>
    </div>
  );
}