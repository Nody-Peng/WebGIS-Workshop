"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

const DEMO_DATA = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Wenshan Flood Zone", risk: "High", zone_type: "flood", affected_households: 12 },
      geometry: { type: "Polygon" as const, coordinates: [[[121.553,24.977],[121.580,24.977],[121.580,24.999],[121.553,24.999],[121.553,24.977]]] },
    },
    {
      type: "Feature" as const,
      properties: { name: "Evacuation Corridor B", risk: "Medium", zone_type: "evacuation", affected_households: 6 },
      geometry: { type: "Polygon" as const, coordinates: [[[121.580,24.977],[121.600,24.977],[121.600,24.999],[121.580,24.999],[121.580,24.977]]] },
    },
    { type: "Feature" as const, properties: { id: "TP-001", district: "Wenshan", vulnerability_score: 5, needs: "Evacuation Boat", residents: 8, elderly: 3 }, geometry: { type: "Point" as const, coordinates: [121.560, 24.985] } },
    { type: "Feature" as const, properties: { id: "TP-002", district: "Wenshan", vulnerability_score: 5, needs: "Medical Urgent", residents: 3, elderly: 2 }, geometry: { type: "Point" as const, coordinates: [121.567, 24.991] } },
    { type: "Feature" as const, properties: { id: "TP-003", district: "Wenshan", vulnerability_score: 4, needs: "Food & Water", residents: 5, elderly: 1 }, geometry: { type: "Point" as const, coordinates: [121.572, 24.982] } },
    { type: "Feature" as const, properties: { id: "TP-004", district: "Wenshan", vulnerability_score: 4, needs: "Shelter", residents: 7, elderly: 0 }, geometry: { type: "Point" as const, coordinates: [121.558, 24.994] } },
    { type: "Feature" as const, properties: { id: "TP-005", district: "Wenshan", vulnerability_score: 3, needs: "Sandbags", residents: 4, elderly: 1 }, geometry: { type: "Point" as const, coordinates: [121.575, 24.988] } },
    { type: "Feature" as const, properties: { id: "TP-006", district: "Wenshan", vulnerability_score: 2, needs: "Monitoring", residents: 2, elderly: 0 }, geometry: { type: "Point" as const, coordinates: [121.563, 24.979] } },
    { type: "Feature" as const, properties: { id: "TP-007", district: "Xinyi",   vulnerability_score: 3, needs: "Water Supply", residents: 6, elderly: 2 }, geometry: { type: "Point" as const, coordinates: [121.568, 25.033] } },
    { type: "Feature" as const, properties: { id: "TP-008", district: "Neihu",   vulnerability_score: 1, needs: "None", residents: 3, elderly: 0 }, geometry: { type: "Point" as const, coordinates: [121.595, 25.065] } },
    { type: "Feature" as const, properties: { id: "TP-009", district: "Shilin",  vulnerability_score: 4, needs: "Evacuation", residents: 9, elderly: 4 }, geometry: { type: "Point" as const, coordinates: [121.525, 25.093] } },
    { type: "Feature" as const, properties: { id: "TP-010", district: "Beitou",  vulnerability_score: 2, needs: "Sandbags", residents: 2, elderly: 1 }, geometry: { type: "Point" as const, coordinates: [121.500, 25.132] } },
  ],
};

const points = DEMO_DATA.features.filter(f => f.geometry.type === "Point");
const STATS = {
  total:     points.length,
  critical:  points.filter(f => (f.properties.vulnerability_score ?? 0) >= 5).length,
  high:      points.filter(f => (f.properties.vulnerability_score ?? 0) === 4).length,
  safe:      points.filter(f => (f.properties.vulnerability_score ?? 0) <= 2).length,
  residents: points.reduce((s, f) => s + (f.properties.residents ?? 0), 0),
};

function generateHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Flood Aid Response Map — Taipei</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#0a0f1e;color:#e2e8f0;height:100vh;overflow:hidden}
    #app{display:flex;flex-direction:column;height:100vh}
    header{display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:50px;flex-shrink:0;background:rgba(10,15,30,0.95);border-bottom:1px solid #1e293b;backdrop-filter:blur(12px);z-index:100;}
    .header-left{display:flex;align-items:center;gap:10px}
    .header-badge{font-size:9px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;padding:3px 8px;border-radius:4px;background:#ef444420;color:#ef4444;border:1px solid #ef444440;}
    header h1{font-size:14px;font-weight:800;color:#f8fafc;letter-spacing:-.01em}
    header p{font-size:10px;color:#475569;margin-top:1px}
    .header-right{font-size:10px;color:#334155;display:flex;align-items:center;gap:6px}
    .pulse{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
    .statsbar{display:flex;flex-shrink:0;background:#0d1424;border-bottom:1px solid #1e293b;}
    .stat{flex:1;padding:8px 0;text-align:center;border-right:1px solid #1e293b;cursor:default}
    .stat:last-child{border-right:none}
    .stat:hover{background:#ffffff08}
    .stat-val{font-size:20px;font-weight:900;line-height:1}
    .stat-lbl{font-size:9px;color:#475569;text-transform:uppercase;letter-spacing:.12em;margin-top:3px}
    .body{display:flex;flex:1;overflow:hidden}
    #map{flex:1}
    .sidebar{width:260px;flex-shrink:0;background:#0d1424;border-left:1px solid #1e293b;display:flex;flex-direction:column;overflow:hidden;z-index:10;}
    .sidebar-header{padding:12px 14px 10px;border-bottom:1px solid #1e293b;flex-shrink:0;}
    .sidebar-title{font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.12em}
    .filters{display:flex;flex-wrap:wrap;gap:5px;padding:10px 14px;border-bottom:1px solid #1e293b;flex-shrink:0}
    .chip{font-size:10px;font-weight:700;padding:3px 9px;border-radius:20px;border:1px solid transparent;cursor:pointer;transition:all .15s;letter-spacing:.04em;background:transparent;}
    .chip.active{color:#fff}
    .chip[data-filter="all"]{border-color:#334155;color:#94a3b8}
    .chip[data-filter="all"].active{background:#334155;color:#fff}
    .chip[data-filter="critical"]{border-color:#ef444460;color:#ef4444}
    .chip[data-filter="critical"].active{background:#ef4444;color:#fff}
    .chip[data-filter="high"]{border-color:#f9731660;color:#f97316}
    .chip[data-filter="high"].active{background:#f97316;color:#fff}
    .chip[data-filter="moderate"]{border-color:#eab30860;color:#eab308}
    .chip[data-filter="moderate"].active{background:#eab308;color:#000}
    .chip[data-filter="safe"]{border-color:#10b98160;color:#10b981}
    .chip[data-filter="safe"].active{background:#10b981;color:#000}
    .hh-list{flex:1;overflow-y:auto;padding:8px 0}
    .hh-list::-webkit-scrollbar{width:4px}
    .hh-list::-webkit-scrollbar-track{background:transparent}
    .hh-list::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
    .hh-item{display:flex;align-items:center;gap:10px;padding:8px 14px;cursor:pointer;transition:background .1s;border-bottom:1px solid #ffffff06;}
    .hh-item:hover{background:#ffffff08}
    .hh-item.selected{background:#1e293b}
    .hh-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;border:1.5px solid rgba(255,255,255,.2)}
    .hh-info{flex:1;min-width:0}
    .hh-id{font-size:12px;font-weight:700;color:#e2e8f0}
    .hh-sub{font-size:10px;color:#475569;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:1px}
    .hh-score{font-size:11px;font-weight:800;width:22px;height:22px;border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
    .detail{border-top:1px solid #1e293b;flex-shrink:0;padding:14px;background:#080d1a;min-height:160px;display:flex;flex-direction:column;justify-content:center;}
    .detail-empty{text-align:center;color:#334155;font-size:11px}
    .detail-empty span{font-size:24px;display:block;margin-bottom:6px}
    .detail-id{font-size:18px;font-weight:900;color:#f8fafc;margin-bottom:2px}
    .detail-district{font-size:10px;color:#475569;text-transform:uppercase;letter-spacing:.1em;margin-bottom:10px}
    .detail-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #0f172a}
    .detail-row:last-child{border-bottom:none}
    .detail-key{font-size:10px;color:#475569}
    .detail-val{font-size:11px;font-weight:700;color:#e2e8f0}
    .needs-badge{font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;background:#ef444420;color:#ef4444;border:1px solid #ef444440;}
    .legend{position:absolute;bottom:16px;left:16px;z-index:999;background:rgba(10,15,30,.92);border:1px solid #1e293b;border-radius:10px;padding:10px 14px;font-size:10px;line-height:1;backdrop-filter:blur(8px);}
    .legend-title{color:#475569;font-weight:700;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
    .legend-row{display:flex;align-items:center;gap:7px;margin-bottom:6px;color:#94a3b8}
    .legend-row:last-child{margin-bottom:0}
    .ldot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
    .lzone{width:14px;height:9px;border-radius:2px;flex-shrink:0}
  </style>
</head>
<body>
<div id="app">
  <header>
    <div class="header-left">
      <span class="header-badge">LIVE</span>
      <div>
        <h1>Flood Aid Response Map</h1>
        <p>Taipei City · Vulnerability Assessment</p>
      </div>
    </div>
    <div class="header-right">
      <span class="pulse"></span>
      <span>Leaflet.js + GeoJSON · Single HTML File</span>
    </div>
  </header>
  <div class="statsbar">
    <div class="stat"><div class="stat-val" style="color:#ef4444">${STATS.critical}</div><div class="stat-lbl">Critical</div></div>
    <div class="stat"><div class="stat-val" style="color:#f97316">${STATS.high}</div><div class="stat-lbl">High Risk</div></div>
    <div class="stat"><div class="stat-val" style="color:#10b981">${STATS.safe}</div><div class="stat-lbl">Safe</div></div>
    <div class="stat"><div class="stat-val" style="color:#94a3b8">${STATS.total}</div><div class="stat-lbl">Households</div></div>
    <div class="stat"><div class="stat-val" style="color:#94a3b8">${STATS.residents}</div><div class="stat-lbl">Residents</div></div>
  </div>
  <div class="body">
    <div style="position:relative;flex:1;display:flex">
      <div id="map"></div>
      <div class="legend">
        <div class="legend-title">Vulnerability</div>
        <div class="legend-row"><span class="ldot" style="background:#ef4444"></span>Critical (≥5)</div>
        <div class="legend-row"><span class="ldot" style="background:#f97316"></span>High Risk (4)</div>
        <div class="legend-row"><span class="ldot" style="background:#eab308"></span>Moderate (3)</div>
        <div class="legend-row"><span class="ldot" style="background:#10b981"></span>Safe (≤2)</div>
        <div class="legend-title" style="margin-top:10px">Zones</div>
        <div class="legend-row"><span class="lzone" style="background:#ef444430;border:1px solid #ef4444"></span>Flood Zone</div>
        <div class="legend-row"><span class="lzone" style="background:#f9731620;border:1px dashed #f97316"></span>Evacuation</div>
        <div class="legend-row"><span class="lzone" style="background:#10b98120;border:1px dashed #10b981"></span>Safe Zone</div>
      </div>
    </div>
    <div class="sidebar">
      <div class="sidebar-header"><div class="sidebar-title">Households</div></div>
      <div class="filters" id="filters">
        <button class="chip active" data-filter="all">All</button>
        <button class="chip" data-filter="critical">Critical</button>
        <button class="chip" data-filter="high">High</button>
        <button class="chip" data-filter="moderate">Moderate</button>
        <button class="chip" data-filter="safe">Safe</button>
      </div>
      <div class="hh-list" id="hhList"></div>
      <div class="detail" id="detail">
        <div class="detail-empty"><span>📍</span>Select a household<br/>to view details</div>
      </div>
    </div>
  </div>
</div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map', { zoomControl: false }).setView([25.02, 121.555], 12);
  L.control.zoom({ position: 'topright' }).addTo(map);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { attribution: '&copy; CARTO', maxZoom: 19 }).addTo(map);
  const geojsonData = ${JSON.stringify(DEMO_DATA, null, 2)};
  function getColor(score) {
    if (score >= 5) return '#ef4444';
    if (score === 4) return '#f97316';
    if (score === 3) return '#eab308';
    return '#10b981';
  }
  const markerMap = {};
  let activeFilter = 'all';
  let selectedId = null;
  const geoLayer = L.geoJSON(geojsonData, {
    pointToLayer: function(feature, latlng) {
      const score = feature.properties.vulnerability_score || 0;
      const color = getColor(score);
      const marker = L.circleMarker(latlng, { radius: 10, fillColor: color, color: '#0a0f1e', weight: 2.5, fillOpacity: 0.95 });
      markerMap[feature.properties.id] = { marker, feature };
      return marker;
    },
    style: function(feature) {
      if (feature.geometry.type === 'Polygon') {
        const t = feature.properties.zone_type;
        if (t === 'flood')      return { color:'#ef4444', fillColor:'#ef4444', fillOpacity:.12, weight:2 };
        if (t === 'evacuation') return { color:'#f97316', fillColor:'#f97316', fillOpacity:.10, weight:2, dashArray:'6 4' };
        if (t === 'safe')       return { color:'#10b981', fillColor:'#10b981', fillOpacity:.10, weight:2, dashArray:'4 4' };
      }
      return {};
    },
    onEachFeature: function(feature, layer) {
      const p = feature.properties;
      if (p.id) {
        layer.on('click', function() { selectHousehold(p.id); });
      } else if (p.name) {
        layer.bindTooltip('<b>' + p.name + '</b><br>Risk: ' + p.risk + '<br>Affected: ' + p.affected_households + ' households', { sticky: true });
      }
    }
  }).addTo(map);
  const households = geojsonData.features.filter(f => f.properties.id);
  function buildList(filter) {
    const list = document.getElementById('hhList');
    list.innerHTML = '';
    const filtered = filter === 'all' ? households : households.filter(f => {
      const s = f.properties.vulnerability_score;
      if (filter === 'critical') return s >= 5;
      if (filter === 'high')     return s === 4;
      if (filter === 'moderate') return s === 3;
      if (filter === 'safe')     return s <= 2;
      return true;
    });
    filtered.forEach(f => {
      const p = f.properties;
      const color = getColor(p.vulnerability_score);
      const div = document.createElement('div');
      div.className = 'hh-item' + (selectedId === p.id ? ' selected' : '');
      div.dataset.id = p.id;
      div.innerHTML =
        '<span class="hh-dot" style="background:' + color + '"></span>' +
        '<div class="hh-info"><div class="hh-id">' + p.id + '</div><div class="hh-sub">' + p.district + ' · ' + p.needs + '</div></div>' +
        '<div class="hh-score" style="background:' + color + '20;color:' + color + '">' + p.vulnerability_score + '</div>';
      div.addEventListener('click', function() { selectHousehold(p.id); });
      list.appendChild(div);
    });
  }
  function selectHousehold(id) {
    selectedId = id;
    const f = households.find(h => h.properties.id === id);
    if (!f) return;
    const p = f.properties;
    const color = getColor(p.vulnerability_score);
    document.getElementById('detail').innerHTML =
      '<div class="detail-id">' + p.id + '</div>' +
      '<div class="detail-district">' + p.district + ' District</div>' +
      '<div class="detail-row"><span class="detail-key">Vulnerability</span><span class="detail-val" style="color:' + color + '">Score ' + p.vulnerability_score + '</span></div>' +
      '<div class="detail-row"><span class="detail-key">Residents</span><span class="detail-val">' + p.residents + ' people</span></div>' +
      '<div class="detail-row"><span class="detail-key">Elderly</span><span class="detail-val">' + (p.elderly || 0) + ' people</span></div>' +
      '<div class="detail-row"><span class="detail-key">Needs</span><span class="needs-badge">' + p.needs + '</span></div>';
    const coords = f.geometry.coordinates;
    map.flyTo([coords[1], coords[0]], 15, { duration: 0.8 });
    if (markerMap[id]) {
      markerMap[id].marker.setStyle({ radius: 14, weight: 3 });
      setTimeout(() => markerMap[id].marker.setStyle({ radius: 10, weight: 2.5 }), 800);
    }
    buildList(activeFilter);
  }
  document.getElementById('filters').addEventListener('click', function(e) {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    activeFilter = chip.dataset.filter;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    buildList(activeFilter);
  });
  buildList('all');
</script>
</body>
</html>`;
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="border-r border-stone-200 last:border-r-0 px-8 py-4 text-center">
      <p className="text-4xl font-black" style={{ color }}>{value}</p>
      <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

export default function SimpleResultPage() {
  const [copyStatus, setCopyStatus] = useState("Copy Source");

  const ResultMap = useMemo(() =>
    dynamic(() => import("../simple/SandboxMap"), {
      ssr: false,
      loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-stone-100 text-stone-400 font-mono text-sm">
          Loading map...
        </div>
      ),
    }), []);

  const handleDownload = () => {
    const blob = new Blob([generateHtml()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "flood-aid-map.html"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateHtml());
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus("Copy Source"), 2000);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">

      {/* ── Top bar ── */}
      <header className="flex items-center justify-between px-16 h-14 border-b border-stone-200 flex-shrink-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-black tracking-tight text-stone-900 hover:text-stone-500 transition-colors">
            WebGIS Workshop
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-sm text-stone-400">Simple Result</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/simple" className="text-sm text-stone-400 hover:text-stone-900 transition-colors">
            ← Back to Tutorial
          </Link>
        </div>
      </header>

      <main className="flex-1 flex px-16 gap-20 max-w-screen-xl mx-auto w-full py-16">

        {/* ── Left column ── */}
        <div className="w-72 flex-shrink-0 flex flex-col justify-between self-stretch py-2">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Result</p>
              <h1 className="text-5xl font-black tracking-tight leading-none">
                Flood<br />Aid<br />Map
              </h1>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              A complete, standalone WebGIS application — built with nothing but HTML, CSS, and JavaScript.
              One file. Open in any browser.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button onClick={handleDownload}
                className="w-full py-3 rounded-none border border-stone-900 bg-stone-900 text-white text-sm font-bold
                  hover:bg-stone-700 transition-colors text-left px-5">
                ↓ Download HTML
              </button>
              <button onClick={handleCopy}
                className="w-full py-3 rounded-none border border-stone-300 text-stone-600 text-sm font-semibold
                  hover:border-stone-900 hover:text-stone-900 transition-colors text-left px-5">
                {copyStatus}
              </button>
            </div>
          </div>

          {/* What's inside */}
          <div className="space-y-3 pt-8 border-t border-stone-200 mt-auto">
            <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">What's inside</p>
            {[
              { tag: "L.tileLayer()",   label: "Dark Base Map"      },
              { tag: "L.geoJSON()",     label: "GeoJSON Data"       },
              { tag: "pointToLayer()",  label: "Data-Driven Style"  },
              { tag: "Polygon",         label: "Flood Zones"        },
              { tag: "DOM + Events",    label: "Sidebar & Filter"   },
              { tag: "flyTo()",         label: "Detail Panel"       },
            ].map(item => (
              <div key={item.tag} className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-stone-700 font-medium">{item.label}</span>
                <code className="text-xs text-stone-400 font-mono flex-shrink-0">{item.tag}</code>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="w-px self-stretch bg-stone-200 flex-shrink-0" />

        {/* ── Right column ── */}
        <div className="flex-1 flex flex-col gap-10 min-w-0">

          {/* Stats row */}
          <div className="flex border border-stone-200 divide-x divide-stone-200">
            <StatCard value={STATS.critical}  label="Critical"   color="#ef4444" />
            <StatCard value={STATS.high}      label="High Risk"  color="#f97316" />
            <StatCard value={STATS.safe}      label="Safe"       color="#10b981" />
            <StatCard value={STATS.total}     label="Households" color="#78716c" />
            <StatCard value={STATS.residents} label="Residents"  color="#78716c" />
          </div>

          {/* Map */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">Live Preview</p>
              <p className="text-xs text-stone-300">Click any marker or zone</p>
            </div>
            <div className="w-full h-[460px] overflow-hidden border border-stone-200 relative">
              <div className="absolute bottom-4 right-4 z-[500] bg-white/90 backdrop-blur-sm border border-stone-200 p-3 space-y-1.5">
                {[
                  { color: "#ef4444", label: "Critical  (≥5)" },
                  { color: "#f97316", label: "High Risk (4)"  },
                  { color: "#eab308", label: "Moderate  (3)"  },
                  { color: "#10b981", label: "Safe      (≤2)" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-none" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-stone-500 font-mono">{item.label}</span>
                  </div>
                ))}
              </div>
              <ResultMap data={DEMO_DATA} tileKey="dark" />
            </div>
          </div>

          {/* Going further */}
          <div className="border-t border-stone-200 pt-8 space-y-5">
            <div>
              <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold mb-1">Going further</p>
              <p className="text-xl font-bold text-stone-900">Real-world projects go beyond a single HTML file.</p>
            </div>
            <div className="grid grid-cols-3 gap-0 divide-x divide-stone-200 border border-stone-200">
              {[
                { layer: "Frontend",       tools: "React · Next.js · TypeScript",        desc: "Component-based UI, routing, and SSR. This workshop site is built with exactly these tools." },
                { layer: "Mapping",        tools: "Leaflet.js · Mapbox GL · deck.gl",    desc: "From simple tile maps to GPU-accelerated 3D visualization of millions of data points." },
                { layer: "Backend & Data", tools: "PostgreSQL · PostGIS · REST API",     desc: "Store and query spatial data at scale. PostGIS adds geographic functions to your database." },
              ].map(item => (
                <div key={item.layer} className="p-6 space-y-3">
                  <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">{item.layer}</p>
                  <p className="text-sm font-bold text-stone-700 font-mono">{item.tools}</p>
                  <p className="text-xs text-stone-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}