import React, { useState } from 'react';

const sections = [
  {
    id: 'intro',
    label: 'Part 1 · Intro',
    color: 'bg-stone-700',
    content: [
      {
        type: 'slide', title: 'Slide 1 — Opening', tag: '🎤 Opening',
        lines: [
          { type: 'speech', text: "Alright, let's get started." },
          { type: 'question', text: "Quick question before anything else — have you ever heard of WebGIS before? Raise your hand." },
          { type: 'pause', text: '[ pause, look around, acknowledge hands ]' },
          { type: 'speech', text: "Cool — some of you have, some haven't. Either way, totally fine. That's exactly why we're here." },
          { type: 'divider' },
          { type: 'speech', text: "So today, before we jump into building anything — I want to take just a few minutes to make sure we're all on the same page about what WebGIS actually is, and why it even matters." },
          { type: 'highlight', text: "Before we build — let's understand what we're building, and why it matters." },
        ]
      },
      {
        type: 'slide', title: 'Slide 2 — What is GIS?', tag: '🟢 GIS Definition',
        lines: [
          { type: 'speech', text: "Okay so — let's start with the G-I-S part." },
          { type: 'question', text: "GIS — Geographic Information System. Anyone want to take a guess at what that means?" },
          { type: 'pause', text: '[ take 1-2 answers ]' },
          { type: 'speech', text: "So GIS is basically a system for capturing, storing, analyzing, and visualizing data — but specifically data that is tied to real-world locations." },
          { type: 'divider' },
          { type: 'step', text: "G — Geographic. The data is tied to real-world coordinates. A point on the map, a boundary, a region." },
          { type: 'step', text: "I — Information. Every location has attributes attached to it. A name, a score, a population count, a flood risk level." },
          { type: 'step', text: "S — System. It's not just a map — it's a set of tools that lets you query, analyze, and display spatial relationships." },
          { type: 'highlight', text: "GIS is not just drawing a map. It's about understanding the world through the lens of location." },
        ]
      },
      {
        type: 'slide', title: 'Slide 3 — Where is GIS Used?', tag: '🌍 GIS Use Cases',
        lines: [
          { type: 'speech', text: "So where does GIS actually show up in the real world? Honestly — everywhere." },
          { type: 'step', text: "Navigation — Google Maps, Waze. Routing, traffic analysis. That's GIS." },
          { type: 'step', text: "Disaster response — mapping flood zones, planning evacuation routes." },
          { type: 'step', text: "Public health — tracking how a disease spreads, finding gaps in hospital coverage." },
          { type: 'step', text: "Urban planning — zoning decisions, land use analysis, infrastructure planning." },
          { type: 'highlight', text: "If it has a location, GIS can help you understand it better." },
        ]
      },
      {
        type: 'slide', title: 'Slide 4 — What is the Web?', tag: '🟠 Web Definition',
        lines: [
          { type: 'speech', text: "Okay — now let's talk about the other half. The Web." },
          { type: 'question', text: "When I say 'the Web' — what comes to mind?" },
          { type: 'pause', text: '[ take a few quick answers ]' },
          { type: 'step', text: "HTML — the structure. It defines what content exists on a page." },
          { type: 'step', text: "CSS — the style. Controls layout, colors, and visual design." },
          { type: 'step', text: "JavaScript — the behaviour. Makes pages dynamic and interactive." },
          { type: 'speech', text: "Together, these three things let you build anything — from a simple blog to a real-time interactive map." },
        ]
      },
      {
        type: 'slide', title: "Slide 5 — The Web's Advantage", tag: '🟠 Web Power',
        lines: [
          { type: 'speech', text: "Traditional GIS tools are powerful — but they have a big problem. They require installation, licenses, and training." },
          { type: 'question', text: "So what happens when you put GIS on the Web instead?" },
          { type: 'step', text: "Share via URL — anyone with a link can view your map instantly. No software, no setup." },
          { type: 'step', text: "Works everywhere — phone, tablet, desktop. Same experience, any device." },
          { type: 'step', text: "Real-time data — your map can update live as new data comes in." },
          { type: 'step', text: "Free and open-source — Leaflet, OpenStreetMap — powerful tools at zero cost." },
          { type: 'highlight', text: "The Web removes the barriers that kept GIS locked inside specialist software." },
        ]
      },
      {
        type: 'slide', title: 'Slide 6 — GIS + Web = WebGIS', tag: '✦ The Equation',
        lines: [
          { type: 'speech', text: "GIS gives you powerful spatial analysis. The Web gives you accessibility and shareability." },
          { type: 'question', text: "So what happens when you combine the two?" },
          { type: 'highlight', text: "GIS + Web = WebGIS. Powerful spatial analysis — accessible to everyone, running in a browser." },
          { type: 'speech', text: "Instead of a desktop tool only specialists can use — you get an interactive map anyone can open, explore, and understand." },
        ]
      },
      {
        type: 'slide', title: 'Slide 7 — So, What is WebGIS?', tag: '🔵 Definition',
        lines: [
          { type: 'highlight', text: "WebGIS is a web-based Geographic Information System — it lets users view, interact with, and analyze spatial data through a browser, without any desktop software." },
          { type: 'speech', text: "And this is a really broad concept. Urban planning, disaster response, public health, real estate, environmental monitoring..." },
          { type: 'highlight', text: "Anywhere there's data with a location — WebGIS can play a role." },
        ]
      },
      {
        type: 'slide', title: 'Slide 8 — Real Examples', tag: '📍 Examples',
        lines: [
          { type: 'question', text: "Have you used Google Maps today? Or this week?" },
          { type: 'pause', text: '[ almost everyone raises hand ]' },
          { type: 'speech', text: "Right — Google Maps is literally one of the best examples of WebGIS. Layers of geographic data, spatial analysis, delivered through a web interface on any device. That is WebGIS." },
          { type: 'divider' },
          { type: 'speech', text: "And here's one I built myself — the 台北捷運生活圈與房價比較地圖." },
          { type: 'speech', text: "I took housing price data and TOD index scores for areas around MRT stations, combined them into a GIS map, and published it on the web. You open it in a browser, click any MRT station, and immediately see: how expensive is housing here? How transit-friendly is this area?" },
          { type: 'highlight', text: "That's exactly what WebGIS is — data with a location, made meaningful, made accessible." },
          { type: 'speech', text: "There's also JHU COVID-19 Dashboard, Global Forest Watch, Kepler.gl by Uber — all WebGIS, different domains, same core idea." },
        ]
      },
      {
        type: 'slide', title: "Slide 9 — Today's Goal", tag: "🚀 Let's Build",
        lines: [
          { type: 'speech', text: "Alright — so now you know what WebGIS is. Let's talk about what we're actually building today." },
          { type: 'speech', text: "We're going to build a flood aid map. Color-coded markers showing which households need help most — deployed live on the web, with a real URL you can share." },
          { type: 'step', text: "Interactive markers — click any one to see the details." },
          { type: 'step', text: "Priority colors — Red for critical, down to Green for safe." },
          { type: 'step', text: "Live deployment — by the end of today, you'll have your own public URL." },
          { type: 'highlight', text: "Let's go to /simple and start building." },
          { type: 'pause', text: '[ navigate to /simple ]' },
        ]
      },
    ]
  },
  {
    id: 'simple',
    label: 'Part 2 · Simple',
    color: 'bg-amber-700',
    content: [
      {
        type: 'slide', title: 'Step 1 — The Blank Canvas', tag: '🗺️ Step 1',
        lines: [
          { type: 'speech', text: "Okay — we're on the /simple page now. Take a look at what you see." },
          { type: 'question', text: "What's on the map right now?" },
          { type: 'pause', text: "[ pause — answer: nothing, it's empty ]" },
          { type: 'speech', text: "Exactly — nothing. And that's actually the point. Every WebGIS app starts with a blank canvas." },
          { type: 'divider' },
          { type: 'speech', text: "What we've done here is initialize Leaflet.js — a JavaScript library for interactive maps — and pointed the camera at Taipei City. The coordinates 24.985 and 121.565 — that's Wenshan District." },
          { type: 'step', text: "L.map('map').setView([24.985, 121.565], 14) — this sets the center and zoom level." },
          { type: 'step', text: "L.tileLayer(...) — this loads the base map tiles from CARTO. Those are the background images you see." },
          { type: 'highlight', text: "This is your blank canvas. Everything we add from here is data you control." },
        ]
      },
      {
        type: 'slide', title: 'Step 2 — Your First Marker', tag: '📍 Step 2',
        lines: [
          { type: 'speech', text: "Alright — now we're going to put something on the map. And to do that, we need to talk about GeoJSON." },
          { type: 'question', text: "Has anyone worked with JSON before? Like in an API response?" },
          { type: 'pause', text: '[ take hands ]' },
          { type: 'speech', text: "GeoJSON is basically just JSON — but with a location inside it. It bundles a geometry (the coordinates) with properties (all the data you want to attach to that location)." },
          { type: 'step', text: "Important: GeoJSON coordinates are [longitude, latitude] — longitude first. That's the opposite of what you might expect." },
          { type: 'speech', text: "Click Update Map. See that green dot? That's a real household on the map. Now try changing the coordinates slightly and click Update Map again. The dot moves." },
          { type: 'highlight', text: "GeoJSON is the language of WebGIS. Once you understand this structure, you can put anything on a map." },
        ]
      },
      {
        type: 'slide', title: 'Step 3 — Data-Driven Colors', tag: '🎨 Step 3',
        lines: [
          { type: 'speech', text: "We have a dot on the map. But right now it's just a dot — it doesn't tell us anything." },
          { type: 'question', text: "What if we could make the color reflect how urgent the situation is?" },
          { type: 'step', text: "Score 5 or above → Red. Critical. Needs immediate help." },
          { type: 'step', text: "Score 4 → Orange. High risk." },
          { type: 'step', text: "Score 3 → Yellow. Moderate." },
          { type: 'step', text: "Score 2 or below → Green. Safe for now." },
          { type: 'speech', text: "Go to the editor — change the vulnerability_score to 5, then click Update Map." },
          { type: 'pause', text: '[ wait for participants to try ]' },
          { type: 'highlight', text: "This is the moment a map becomes a decision-support tool. The color is doing the work for you." },
        ]
      },
      {
        type: 'slide', title: 'Step 4 — Popups & Interactivity', tag: '💬 Step 4',
        lines: [
          { type: 'speech', text: "A map without interaction is just a picture. Let's fix that." },
          { type: 'speech', text: "Change the 'needs' field to something like 'Evacuation Boat'. Click Update Map, then click the dot on the map." },
          { type: 'pause', text: '[ wait for popup to appear ]' },
          { type: 'speech', text: "See the popup? It shows exactly what you typed. The map is reading from your data in real time." },
          { type: 'speech', text: "Think about this in a real disaster scenario — a field coordinator opens the map on their phone, taps a red dot, and immediately knows: this household has 6 residents, 2 elderly, and needs insulin." },
          { type: 'highlight', text: "Interactivity is what separates a WebGIS from a static image. Click → see data. That's the whole idea." },
        ]
      },
      {
        type: 'slide', title: 'Step 5 — Multiple Points', tag: '📊 Step 5',
        lines: [
          { type: 'speech', text: "One dot is a test. Ten dots is a dataset. This is where WebGIS starts to feel real." },
          { type: 'speech', text: "Load the '10 households across Taipei' example." },
          { type: 'pause', text: '[ wait for participants to load it ]' },
          { type: 'speech', text: "Notice two things — the map auto-zoomed to fit all the points. And you can already start to see patterns. Where are the red dots clustering? Which districts have more critical cases?" },
          { type: 'question', text: "What patterns do you notice in the data?" },
          { type: 'pause', text: '[ brief discussion ]' },
          { type: 'speech', text: "Now try adding one more household yourself. Copy one of the existing feature objects, change the coordinates and ID, paste it in, click Update Map." },
          { type: 'highlight', text: "This is the moment it clicks — you're not just viewing data, you're authoring it." },
        ]
      },
      {
        type: 'slide', title: 'Step 6 — Map Styles', tag: '🗺️ Step 6',
        lines: [
          { type: 'speech', text: "The base map — the tile layer — is completely swappable. Different styles serve different purposes." },
          { type: 'speech', text: "Try switching to Dark mode using the style switcher in the top-right corner of the map." },
          { type: 'pause', text: '[ wait ]' },
          { type: 'step', text: "Light — clean, readable, good for reports and presentations." },
          { type: 'step', text: "Dark — high contrast, great for dashboards and night operations." },
          { type: 'step', text: "Satellite — shows actual terrain and buildings. Useful for field teams." },
          { type: 'step', text: "Street — OpenStreetMap. Maximum detail for navigation." },
          { type: 'highlight', text: "The data stays the same. The base map is just the canvas you choose to put it on." },
        ]
      },
      {
        type: 'slide', title: 'Step 7 — Drawing Zones (Polygons)', tag: '🔷 Step 7',
        lines: [
          { type: 'speech', text: "So far we've been working with Points — single locations. But in disaster response, you also need to mark areas. Flood zones, evacuation areas, restricted regions. These are all polygons." },
          { type: 'step', text: "A Polygon is just an array of coordinate rings. You define the corners, the map fills it in. The last point must match the first to close the ring." },
          { type: 'speech', text: "Load the 'Flood zone + households inside' example." },
          { type: 'pause', text: '[ wait ]' },
          { type: 'speech', text: "See that? A red semi-transparent polygon — the flood zone. And inside it, household dots with their scores. You can immediately see which households are inside the danger area." },
          { type: 'highlight', text: "Points tell you where things are. Polygons tell you where things happen. Together, they give you the full picture." },
        ]
      },
      {
        type: 'slide', title: 'Step 8 — Your Final Map', tag: '🏁 Step 8',
        lines: [
          { type: 'speech', text: "Alright — this is it. Step 8. The final map. Let's take a second to think about what you've actually learned." },
          { type: 'step', text: "Base maps — initialize Leaflet, load a tile layer." },
          { type: 'step', text: "GeoJSON — the structure of spatial data: geometry + properties." },
          { type: 'step', text: "Data-driven colors — reading a value and assigning a visual style." },
          { type: 'step', text: "Popups — binding click events to show data on demand." },
          { type: 'step', text: "Multiple features — building a real dataset, not just a single point." },
          { type: 'step', text: "Tile styles — swapping base maps for different visual contexts." },
          { type: 'step', text: "Polygons — drawing zones and overlaying them with point data." },
          { type: 'divider' },
          { type: 'speech', text: "That is the complete foundation of WebGIS. Everything else is built on top of exactly these concepts." },
          { type: 'speech', text: "Customize the data however you want, pick your favorite map style, then click Export → and download the HTML file. Open it in any browser — no server, no framework required. It just works." },
          { type: 'highlight', text: "That file is yours. You built it. And it's a real, working WebGIS application." },
          { type: 'pause', text: '[ give participants 5 min to customize and export ]' },
        ]
      },
    ]
  },
  {
    id: 'ai',
    label: 'Part 3 · AI',
    color: 'bg-sky-700',
    content: [
      {
        type: 'slide', title: 'AI & WebGIS — Opening', tag: '🤖 AI Intro',
        lines: [
          { type: 'speech', text: "Okay — you've built a working map. Now I want to talk about something that I think is genuinely important for everyone in this room." },
          { type: 'speech', text: "I want to talk about AI — not as a buzzword, but as a practical tool for doing GIS work." },
          { type: 'highlight', text: "You don't need to know how to code to build with maps. AI has fundamentally changed what's possible." },
          { type: 'speech', text: "But before we get into the how — let's talk about the mindset." },
        ]
      },
      {
        type: 'slide', title: '01 — Mindset', tag: '🧠 Mindset',
        lines: [
          { type: 'speech', text: "Most people use AI the wrong way. They type a vague question, get a vague answer, and give up." },
          { type: 'question', text: "How many of you have typed something like 'write me a map app' into ChatGPT and been disappointed with the result?" },
          { type: 'pause', text: '[ pause, some hands ]' },
          { type: 'speech', text: "Right. That's the wrong mental model. The people who get real value from AI treat it like a knowledgeable colleague sitting next to them — one who never gets tired, never judges you for asking basic questions, and can switch between being a teacher, a debugger, and a data analyst within the same conversation." },
          { type: 'divider' },
          { type: 'step', text: "Wrong: 'Write me a WebGIS app' — one prompt, expect magic, give up when it's wrong." },
          { type: 'step', text: "Right: 'Help me understand X so I can do Y' — iterate, question, push back, ask why it failed." },
          { type: 'divider' },
          { type: 'highlight', text: "Your job is to stay in the driver's seat. AI handles what's tedious or unfamiliar. You decide what to build and whether the output makes sense." },
        ]
      },
      {
        type: 'slide', title: '02 — Vibe Coding', tag: '💻 Vibe Coding',
        lines: [
          { type: 'speech', text: "There's a term that's been going around — 'vibe coding'. It means building software by describing your intent to an AI and iterating on the output — without needing to know every API or syntax rule in advance." },
          { type: 'speech', text: "Done well, it's one of the most effective ways to learn and ship at the same time. Here are five principles that actually work." },
          { type: 'divider' },
          { type: 'step', text: "01 — Describe the goal, not the implementation. Don't say 'write a useEffect'. Say 'I want to load a GeoJSON file when the page opens and show it on a Leaflet map. I'm using Next.js.' Give context. AI fills in the how." },
          { type: 'step', text: "02 — Read before you run. When AI gives you code, read it — or paste it back and ask 'explain this to me line by line'. You need to know what it does so you can change it later." },
          { type: 'step', text: "03 — Break things intentionally. Change one thing, see what happens. When something breaks, paste the error and ask what went wrong. Errors are not failures — they're information." },
          { type: 'step', text: "04 — Ask for alternatives. AI's first answer is rarely the only answer. Ask 'is there a simpler way?' or 'what are the trade-offs?'" },
          { type: 'step', text: "05 — Use AI to review your own work. Paste your code back and ask 'does this look right?' or 'what could go wrong with this approach?'" },
          { type: 'highlight', text: "The skill isn't memorizing syntax. The skill is knowing what to ask." },
        ]
      },
      {
        type: 'slide', title: '03 — No-Code GIS', tag: '🗺️ No-Code GIS',
        lines: [
          { type: 'speech', text: "Here's something I really want to emphasize — you don't need to write code to do real GIS work." },
          { type: 'speech', text: "AI unlocks geospatial workflows for researchers, planners, journalists, students — people who have domain knowledge but not programming backgrounds. Let me show you what's genuinely possible today." },
          { type: 'divider' },
          { type: 'step', text: "Data cleaning & conversion — upload a messy CSV with addresses, ask AI to clean it, standardise columns, convert to GeoJSON. No Python required." },
          { type: 'step', text: "Map design decisions — not sure which color scheme to use for a risk map? Ask AI to explain the trade-offs and recommend an approach for your specific audience." },
          { type: 'step', text: "Spatial analysis without code — describe what you want to know. AI can walk you through doing it in QGIS, or suggest the right spatial operation." },
          { type: 'step', text: "Understanding datasets — found a dataset you don't understand? Paste the field names into AI and ask it to explain what each column means and how you might use it." },
          { type: 'step', text: "Writing about maps — AI can help you write captions, reports, and interpretations of spatial data for a non-technical audience." },
          { type: 'highlight', text: "Coding is one tool among many. Domain knowledge + AI is often more powerful than coding alone." },
        ]
      },
      {
        type: 'slide', title: '04 — Learning Strategy', tag: '📚 Learning',
        lines: [
          { type: 'speech', text: "AI doesn't just answer questions — it can actively accelerate how you build mental models. Here are five strategies that actually work." },
          { type: 'divider' },
          { type: 'step', text: "The Feynman Loop — read something, ask AI to quiz you on it, explain it back in your own words, ask AI to correct you. Faster than re-reading the same material three times." },
          { type: 'step', text: "Concept Laddering — when you hit something you don't understand, ask AI to explain it at three levels: one sentence, one paragraph, technical. Start with the one sentence." },
          { type: 'step', text: "Build a minimal version first — before building the full thing, ask AI to help you build the smallest possible version that proves the concept works." },
          { type: 'step', text: "Ask for the mental model, not just the answer — 'Don't just tell me how to fix this — explain the mental model I'm missing so I can solve similar problems myself next time.'" },
          { type: 'step', text: "Find what you don't know you don't know — ask AI 'what concepts do I need to understand to do X? List them in order of importance.'" },
          { type: 'highlight', text: "AI compresses the time between 'I don't know how to do this' and 'I built the thing'." },
        ]
      },
      {
        type: 'slide', title: '05 — Tools', tag: '🛠️ Tools',
        lines: [
          { type: 'speech', text: "Let me quickly walk through the tools worth knowing — and what each one is actually good for." },
          { type: 'divider' },
          { type: 'step', text: "ChatGPT / Claude — your primary thinking partner. Best for open-ended questions, iterative refinement, and understanding concepts. Free tier available." },
          { type: 'step', text: "Cursor / GitHub Copilot — AI-native code editors. Write code where AI can see your entire project. Cursor's Composer mode lets you describe changes in plain language across multiple files." },
          { type: 'step', text: "QGIS + AI — use QGIS for the actual spatial operations, use AI to figure out which tool to use and how to interpret the output. They work better together than either alone." },
          { type: 'step', text: "Kepler.gl — drag and drop GeoJSON or CSV to create interactive maps instantly. Use AI to prepare and clean your data before importing. No code at all." },
          { type: 'step', text: "Observable / Notebook AI — write spatial analysis in a notebook format. AI generates cells, explains outputs, helps you iterate without a full dev environment." },
          { type: 'highlight', text: "Knowing which tool to reach for — and how to combine them — is itself a skill worth developing." },
        ]
      },
      {
        type: 'slide', title: '06 — Know the Limits', tag: '⚠️ Limits',
        lines: [
          { type: 'speech', text: "Okay — I've been pretty positive about AI so far. But I want to be honest about something important." },
          { type: 'highlight', text: "AI is confidently wrong with the same tone it uses when it's right." },
          { type: 'speech', text: "In geospatial work, this matters a lot. A wrong coordinate system, a misunderstood projection, or an incorrect spatial join can produce plausible-looking but completely invalid results." },
          { type: 'divider' },
          { type: 'step', text: "Hallucinated APIs — AI will sometimes invent function names that don't exist, especially for niche libraries. Always check the official documentation." },
          { type: 'step', text: "Outdated library versions — AI training data has a cutoff. React Leaflet v4 behaves very differently from v3. Always specify your version." },
          { type: 'step', text: "Plausible but wrong spatial logic — a ray-casting implementation that looks correct might fail for edge cases. Spatial algorithms need testing with real data." },
          { type: 'step', text: "Data interpretation errors — AI doesn't know your domain. It might make assumptions that are technically reasonable but contextually wrong for Taiwan." },
          { type: 'divider' },
          { type: 'highlight', text: "Use AI to understand and explore. Use primary sources — docs, papers, official data portals — to verify and ship." },
        ]
      },
      {
        type: 'slide', title: 'Closing — The Bigger Picture', tag: '✦ AI Closing',
        lines: [
          { type: 'speech', text: "Let me close this section with something I genuinely believe." },
          { type: 'highlight', text: "The skill isn't using AI. The skill is knowing what to ask." },
          { type: 'speech', text: "Every technique we just talked about — vibe coding, concept laddering, no-code analysis — they all share one foundation: you need enough understanding of the problem to ask a good question. That understanding comes from curiosity, from reading, from trying things and breaking them." },
          { type: 'divider' },
          { type: 'speech', text: "AI compresses the time between 'I don't know how to do this' and 'I built the thing'. But it doesn't replace the need to care about what you're building, why it matters, and whether the output is actually correct." },
          { type: 'speech', text: "WebGIS is a domain where that matters enormously. Maps communicate authority. People make decisions based on what they see on a map." },
          { type: 'highlight', text: "The best use of AI in this space is to help more people — not just programmers — build spatial tools that are honest, well-reasoned, and genuinely useful." },
        ]
      },
    ]
  },
  {
    id: 'wrapup',
    label: 'Part 4 · Wrap-up',
    color: 'bg-emerald-700',
    content: [
      {
        type: 'slide', title: 'Where to Go From Here', tag: '🚀 Wrap-up',
        lines: [
          { type: 'speech', text: "Alright — we're almost done. But I want to leave you with two paths forward." },
          { type: 'step', text: "/advanced — if you want to keep building. Spatial analysis, risk scoring, TopoJSON. Hands-on, step by step." },
          { type: 'step', text: "/materials — if you want to learn more systematically. Reading lists, tool recommendations, datasets you can actually use." },
          { type: 'divider' },
          { type: 'highlight', text: "The most important thing you can do after today is open your laptop tonight and keep going." },
          { type: 'speech', text: "Not because you have to. But because you now know it's possible." },
          { type: 'divider' },
          { type: 'speech', text: "Thank you all so much. Any questions — I'm right here." },
          { type: 'pause', text: '[ open Q&A ]' },
        ]
      }
    ]
  }
];

const tagColors: Record<string, string> = {
  '🎤 Opening':       'bg-stone-100 text-stone-700 border border-stone-300',
  '🟢 GIS Definition':'bg-green-50 text-green-700 border border-green-200',
  '🌍 GIS Use Cases': 'bg-green-50 text-green-700 border border-green-200',
  '🟠 Web Definition':'bg-orange-50 text-orange-700 border border-orange-200',
  '🟠 Web Power':     'bg-orange-50 text-orange-700 border border-orange-200',
  '✦ The Equation':   'bg-amber-50 text-amber-700 border border-amber-200',
  '🔵 Definition':    'bg-sky-50 text-sky-700 border border-sky-200',
  '📍 Examples':      'bg-rose-50 text-rose-700 border border-rose-200',
  "🚀 Let's Build":   'bg-emerald-50 text-emerald-700 border border-emerald-200',
  '🗺️ Step 1':        'bg-slate-100 text-slate-700 border border-slate-300',
  '📍 Step 2':        'bg-blue-50 text-blue-700 border border-blue-200',
  '🎨 Step 3':        'bg-red-50 text-red-700 border border-red-200',
  '💬 Step 4':        'bg-purple-50 text-purple-700 border border-purple-200',
  '📊 Step 5':        'bg-indigo-50 text-indigo-700 border border-indigo-200',
  '🗺️ Step 6':        'bg-slate-100 text-slate-700 border border-slate-300',
  '🔷 Step 7':        'bg-cyan-50 text-cyan-700 border border-cyan-200',
  '🏁 Step 8':        'bg-emerald-50 text-emerald-700 border border-emerald-200',
  '🤖 AI Intro':      'bg-sky-50 text-sky-700 border border-sky-200',
  '🧠 Mindset':       'bg-violet-50 text-violet-700 border border-violet-200',
  '💻 Vibe Coding':   'bg-blue-50 text-blue-700 border border-blue-200',
  '🗺️ No-Code GIS':   'bg-teal-50 text-teal-700 border border-teal-200',
  '📚 Learning':      'bg-amber-50 text-amber-700 border border-amber-200',
  '🛠️ Tools':         'bg-stone-100 text-stone-700 border border-stone-300',
  '⚠️ Limits':        'bg-red-50 text-red-700 border border-red-200',
  '✦ AI Closing':     'bg-sky-50 text-sky-700 border border-sky-200',
  '🚀 Wrap-up':       'bg-emerald-50 text-emerald-700 border border-emerald-200',
};

export default function NotesPage() {
  const [activeSection, setActiveSection] = useState('intro');
  const [activeSlide, setActiveSlide] = useState<string | null>(null);
  const currentSection = sections.find(s => s.id === activeSection);

  return (
    <div className="min-h-screen bg-stone-50 font-sans flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-stone-50 border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center gap-2 sm:gap-3">
        <span className="text-stone-400 text-xs sm:text-sm font-mono hidden xs:inline">WebGIS Workshop</span>
        <span className="text-stone-400 text-xs sm:text-sm font-mono xs:hidden">WS</span>
        <span className="text-stone-300">/</span>
        <span className="text-stone-700 text-xs sm:text-sm font-semibold">Speaker Notes</span>
        <span className="ml-auto text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full hidden md:inline">
          Click any line to highlight
        </span>
      </header>

      {/* ── Mobile Tab Bar (visible on small screens) ── */}
      <div className="lg:hidden flex-none border-b border-stone-200 bg-white overflow-x-auto">
        <div className="flex gap-1 px-3 py-2 min-w-max">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveSection(s.id); setActiveSlide(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeSection === s.id
                  ? `${s.color} text-white shadow-sm`
                  : 'text-stone-500 hover:bg-stone-100 bg-stone-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 53px)' }}>

        {/* ── Desktop Sidebar (hidden on mobile) ── */}
        <aside className="hidden lg:flex w-44 shrink-0 border-r border-stone-200 bg-white flex-col py-4 gap-1 px-2 overflow-y-auto">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveSection(s.id); setActiveSlide(null); }}
              className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeSection === s.id
                  ? `${s.color} text-white shadow-sm`
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              {s.label}
            </button>
          ))}
          <div className="mt-auto pt-4 border-t border-stone-100 px-1">
            <p className="text-[10px] text-stone-400 text-center">Est. 60 min total</p>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4">

          {/* Slide count */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-stone-400 font-mono">
              {currentSection?.content.length} slides in this section
            </span>
            {/* Mobile: hint */}
            <span className="text-[10px] text-stone-400 md:hidden">tap line to highlight</span>
          </div>

          {currentSection?.content.map((slide, si) => {
            const slideKey = `${activeSection}-${si}`;
            const isActive = activeSlide === slideKey;
            return (
              <div
                key={si}
                className={`rounded-xl sm:rounded-2xl border transition-all ${
                  isActive ? 'border-amber-300 shadow-md shadow-amber-50' : 'border-stone-200'
                } bg-white overflow-hidden`}
              >
                {/* Card header */}
                <div
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 border-b border-stone-100 cursor-pointer hover:bg-stone-50 active:bg-stone-100"
                  onClick={() => setActiveSlide(isActive ? null : slideKey)}
                >
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${tagColors[slide.tag] ?? 'bg-stone-100 text-stone-600'}`}>
                    {slide.tag}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-stone-700 truncate">{slide.title}</span>
                  <span className="ml-auto text-stone-300 text-xs shrink-0">{isActive ? '▲' : '▼'}</span>
                </div>

                {/* Card body */}
                <div className="px-3 sm:px-5 py-3 sm:py-4 space-y-1 sm:space-y-1.5">
                  {slide.lines.map((line, li) => {
                    if (line.type === 'divider') return <hr key={li} className="border-stone-100 my-2 sm:my-3" />;
                    return <LineItem key={li} line={line} />;
                  })}
                </div>
              </div>
            );
          })}

          {/* Bottom padding for mobile (avoids content hiding behind browser chrome) */}
          <div className="h-6 lg:hidden" />
        </main>
      </div>
    </div>
  );
}

function LineItem({ line }: { line: any }) {
  const [highlighted, setHighlighted] = useState(false);
  const base = "rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm leading-relaxed cursor-pointer select-none transition-all active:scale-[0.99] ";

  if (line.type === 'speech') return (
    <p
      onClick={() => setHighlighted(h => !h)}
      className={base + (highlighted
        ? 'bg-yellow-100 text-stone-800 font-medium ring-1 ring-yellow-300'
        : 'text-stone-700 hover:bg-stone-50')}
    >
      {line.text}
    </p>
  );

  if (line.type === 'question') return (
    <p
      onClick={() => setHighlighted(h => !h)}
      className={base + (highlighted
        ? 'bg-yellow-100 text-sky-800 font-semibold ring-1 ring-yellow-300'
        : 'text-sky-700 font-medium hover:bg-sky-50 border-l-4 border-sky-300 pl-3')}
    >
      ❓ {line.text}
    </p>
  );

  if (line.type === 'highlight') return (
    <p
      onClick={() => setHighlighted(h => !h)}
      className={base + (highlighted
        ? 'bg-yellow-200 text-stone-900 font-bold ring-2 ring-yellow-400'
        : 'bg-amber-50 text-amber-800 font-semibold border-l-4 border-amber-400 pl-3')}
    >
      ✦ {line.text}
    </p>
  );

  if (line.type === 'pause') return (
    <p className="text-[10px] sm:text-xs text-stone-400 italic px-3 sm:px-4 py-1 font-mono">
      {line.text}
    </p>
  );

  if (line.type === 'step') return (
    <p
      onClick={() => setHighlighted(h => !h)}
      className={base + (highlighted
        ? 'bg-yellow-100 text-emerald-800 font-semibold ring-1 ring-yellow-300'
        : 'text-emerald-700 hover:bg-emerald-50 border-l-4 border-emerald-300 pl-3')}
    >
      → {line.text}
    </p>
  );

  return null;
}