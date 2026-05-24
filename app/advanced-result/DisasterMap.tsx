"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { FeatureCollection, Polygon, MultiPolygon, LineString, MultiLineString, Position } from "geojson";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import type { Map as LeafletMap } from "leaflet";

// ─── Types ───────────────────────────────────────────────────────────────────
type RiskLevel = "Critical" | "High" | "Moderate" | "Low";
type CityTag   = "Taipei" | "New Taipei";

interface CandidatePoint {
  id: number; name: string; city: CityTag;
  lat: number; lng: number; population: number;
}
interface RiskPoint extends CandidatePoint {
  risk: RiskLevel; score: number;
  debrisScore: number; floodScore: number; popScore: number;
  nearbyDebris: number; inFloodZone: boolean;
  recommendation: string;
}

// ─── Candidates ──────────────────────────────────────────────────────────────
const CANDIDATES: CandidatePoint[] = [
  { id:  1, name: "Wulai District",           city: "New Taipei", lat: 24.870, lng: 121.550, population:  5800 },
  { id:  2, name: "Xindian Upstream",          city: "New Taipei", lat: 24.910, lng: 121.520, population: 12400 },
  { id:  3, name: "Shilin Riverside",          city: "Taipei",     lat: 25.093, lng: 121.524, population: 28000 },
  { id:  4, name: "Neihu Low-lying Zone",      city: "Taipei",     lat: 25.074, lng: 121.587, population: 31000 },
  { id:  5, name: "Beitou Hillside",           city: "Taipei",     lat: 25.136, lng: 121.508, population:  9200 },
  { id:  6, name: "Wenshan Hillside",          city: "Taipei",     lat: 24.988, lng: 121.573, population:  7600 },
  { id:  7, name: "Zhongzheng Lowland",        city: "Taipei",     lat: 25.032, lng: 121.513, population: 44000 },
  { id:  8, name: "Songshan Flat",             city: "Taipei",     lat: 25.050, lng: 121.577, population: 52000 },
  { id:  9, name: "Shuangxi Valley",           city: "New Taipei", lat: 25.030, lng: 121.867, population:  4200 },
  { id: 10, name: "Sanxia Upstream",           city: "New Taipei", lat: 24.934, lng: 121.370, population:  8900 },
  { id: 11, name: "Xinzhuang Low-lying Area",  city: "New Taipei", lat: 25.035, lng: 121.440, population: 68000 },
  { id: 12, name: "Tucheng Riverside",         city: "New Taipei", lat: 24.975, lng: 121.460, population: 29000 },
  { id: 13, name: "Ruifang Mining Valley",     city: "New Taipei", lat: 25.107, lng: 121.800, population:  6500 },
  { id: 14, name: "Pingxi Gorge",              city: "New Taipei", lat: 25.023, lng: 121.740, population:  2100 },
  { id: 15, name: "Danshui Estuary Flat",      city: "New Taipei", lat: 25.170, lng: 121.435, population: 41000 },
  { id: 16, name: "Zhonghe Flood Plain",       city: "New Taipei", lat: 24.994, lng: 121.497, population: 73000 },
  { id: 17, name: "Shenkeng Hillside",         city: "New Taipei", lat: 24.993, lng: 121.620, population:  5300 },
  { id: 18, name: "Yingge Riverside",          city: "New Taipei", lat: 24.912, lng: 121.347, population: 18000 },
];

const SEARCH_RADIUS_KM = 5;

// ─── Spatial helpers ─────────────────────────────────────────────────────────
function haversine(la1: number, lo1: number, la2: number, lo2: number) {
  const R = 6371, dLa = ((la2-la1)*Math.PI)/180, dLo = ((lo2-lo1)*Math.PI)/180;
  const a = Math.sin(dLa/2)**2 + Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)**2;
  return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function countNearbyDebris(lat: number, lng: number, fc: FeatureCollection, r: number) {
  let n = 0;
  for (const f of fc.features) {
    if (!f.geometry) continue;
    const g = f.geometry as LineString|MultiLineString|Polygon|MultiPolygon;
    let pts: Position[] = [];
    if (g.type==="LineString") pts=g.coordinates;
    else if (g.type==="MultiLineString") pts=g.coordinates.flat();
    else if (g.type==="Polygon") pts=g.coordinates.flat();
    else if (g.type==="MultiPolygon") pts=g.coordinates.flat(2);
    if (pts.some(([lo,la])=>haversine(lat,lng,la,lo)<=r)) n++;
  }
  return n;
}
function rayCast(lat: number, lng: number, ring: Position[]) {
  let inside = false;
  for (let i=0,j=ring.length-1;i<ring.length;j=i++) {
    const [xi,yi]=[ring[i][0],ring[i][1]], [xj,yj]=[ring[j][0],ring[j][1]];
    if (yi>lat!==yj>lat && lng<((xj-xi)*(lat-yi))/(yj-yi)+xi) inside=!inside;
  }
  return inside;
}
function inAnyFlood(lat: number, lng: number, fcs: FeatureCollection[]) {
  for (const fc of fcs) for (const f of fc.features) {
    if (!f.geometry) continue;
    const g = f.geometry as Polygon|MultiPolygon;
    const rings: Position[][] = g.type==="Polygon"?g.coordinates:g.type==="MultiPolygon"?g.coordinates.flat():[];
    if (rings.some(r=>rayCast(lat,lng,r))) return true;
  }
  return false;
}
function norm(v: number, mn: number, mx: number) {
  return mx===mn ? 0 : Math.min(100,Math.max(0,((v-mn)/(mx-mn))*100));
}
function riskLevel(s: number): RiskLevel {
  return s>=75?"Critical":s>=55?"High":s>=35?"Moderate":"Low";
}
function recommend(pt: Omit<RiskPoint,"recommendation">): string {
  if (pt.risk==="Critical") return pt.inFloodZone
    ? "Dual-hazard overlap detected. Coordinated evacuation planning and real-time sensor deployment are urgently required."
    : `${pt.nearbyDebris} debris streams within ${SEARCH_RADIUS_KM} km. Install slope monitoring and establish community early-warning protocols.`;
  if (pt.risk==="High") return pt.inFloodZone
    ? "Significant flood exposure combined with debris risk. Levee reinforcement and annual evacuation drills are recommended."
    : `Elevated debris density (${pt.nearbyDebris} streams). Land-use zoning and slope vegetation restoration advised.`;
  if (pt.risk==="Moderate") return `Moderate composite risk. Routine monitoring and community preparedness programs should be maintained.`;
  return `Low hazard exposure. Standard infrastructure maintenance and periodic plan reviews are sufficient.`;
}
function computeRisk(debris: FeatureCollection, floods: FeatureCollection[]): RiskPoint[] {
  const raw = CANDIDATES.map(c=>({...c,nearbyDebris:countNearbyDebris(c.lat,c.lng,debris,SEARCH_RADIUS_KM),inFloodZone:inAnyFlood(c.lat,c.lng,floods)}));
  const [mnD,mxD]=[Math.min(...raw.map(r=>r.nearbyDebris)),Math.max(...raw.map(r=>r.nearbyDebris))];
  const [mnP,mxP]=[Math.min(...raw.map(r=>r.population)),Math.max(...raw.map(r=>r.population))];
  return raw.map(r=>{
    const dS=Math.round(norm(r.nearbyDebris,mnD,mxD)), fS=r.inFloodZone?100:0, pS=Math.round(norm(r.population,mnP,mxP));
    const score=Math.round(dS*0.45+fS*0.35+pS*0.20), risk=riskLevel(score);
    const partial={...r,risk,score,debrisScore:dS,floodScore:fS,popScore:pS};
    return {...partial,recommendation:recommend(partial)};
  });
}

// ─── Constants ───────────────────────────────────────────────────────────────
const RISK_COLOR: Record<RiskLevel,string> = { Critical:"#f87171", High:"#fb923c", Moderate:"#fbbf24", Low:"#4ade80" };

// ─── FlyTo controller ────────────────────────────────────────────────────────
function MapController({ target }: { target: RiskPoint | null }) {
  const map = useMap();
  const prevId = useRef<number | null>(null);
  useEffect(() => {
    if (!target) return;
    if (target.id === prevId.current) return;
    prevId.current = target.id;
    map.flyTo([target.lat, target.lng], 14, { duration: 1.2, easeLinearity: 0.25 });
  }, [target, map]);
  return null;
}

// ─── Small UI components ──────────────────────────────────────────────────────
function Tag({ level }: { level: RiskLevel }) {
  const cls: Record<RiskLevel,string> = {
    Critical: "text-red-400 bg-red-400/10 ring-red-400/20",
    High:     "text-orange-400 bg-orange-400/10 ring-orange-400/20",
    Moderate: "text-yellow-400 bg-yellow-400/10 ring-yellow-400/20",
    Low:      "text-green-400 bg-green-400/10 ring-green-400/20",
  };
  return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ring-1 ${cls[level]}`}>{level}</span>;
}

function Bar({ val, color }: { val: number; color?: string }) {
  const c = color ?? (val>=75?"#f87171":val>=55?"#fb923c":val>=35?"#fbbf24":"#4ade80");
  return (
    <div className="w-full h-1 rounded-full bg-white/10">
      <div className="h-1 rounded-full transition-all duration-500" style={{ width:`${val}%`, background:c }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DisasterMap() {
  const [debrisData,     setDebrisData]     = useState<FeatureCollection|null>(null);
  const [taipeiFlood,    setTaipeiFlood]    = useState<FeatureCollection|null>(null);
  const [newTaipeiFlood, setNewTaipeiFlood] = useState<FeatureCollection|null>(null);
  const [taiwanData,     setTaiwanData]     = useState<FeatureCollection|null>(null);
  const [layers, setLayers] = useState({ debris:true, tFlood:true, ntFlood:true, points:true });
  const [cityFilter, setCityFilter] = useState<CityTag|"All">("All");
  const [selected,   setSelected]   = useState<RiskPoint|null>(null);
  const [tab,        setTab]        = useState<"layers"|"ranking">("layers");
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string|null>(null);
  // flyTo target — separate from selected so clicking the same point again re-triggers
  const [flyTarget,  setFlyTarget]  = useState<RiskPoint|null>(null);

  useEffect(()=>{
    Promise.all([
      fetch("/advanced-result/data/debrisstream.geojson").then(r=>r.json()),
      fetch("/advanced-result/data/台北市淹水潛勢圖.geojson").then(r=>r.json()),
      fetch("/advanced-result/data/新北市淹水潛勢圖.geojson").then(r=>r.json()),
      fetch("/advanced-result/data/Taiwan.json").then(r=>r.json()),
    ]).then(([debris,tF,ntF,taiwan])=>{
      const topo=taiwan as Topology, key=Object.keys(topo.objects)[0];
      setTaiwanData(topojson.feature(topo,topo.objects[key]) as FeatureCollection);
      setDebrisData(debris); setTaipeiFlood(tF); setNewTaipeiFlood(ntF);
      setLoading(false);
    }).catch(e=>{ setError(e.message); setLoading(false); });
  },[]);

  const riskPoints = useMemo<RiskPoint[]>(()=>{
    if(!debrisData||!taipeiFlood||!newTaipeiFlood) return [];
    return computeRisk(debrisData,[taipeiFlood,newTaipeiFlood]);
  },[debrisData,taipeiFlood,newTaipeiFlood]);

  const displayed = useMemo(()=>
    cityFilter==="All" ? riskPoints : riskPoints.filter(p=>p.city===cityFilter),
    [riskPoints,cityFilter]
  );
  const ranked = useMemo(()=>[...displayed].sort((a,b)=>b.score-a.score),[displayed]);

  const stats = useMemo(()=>({
    critical: riskPoints.filter(p=>p.risk==="Critical").length,
    high:     riskPoints.filter(p=>p.risk==="High").length,
    flood:    riskPoints.filter(p=>p.inFloodZone).length,
    pop:      riskPoints.reduce((s,p)=>s+p.population,0),
  }),[riskPoints]);

  const toggle = (k: keyof typeof layers) => setLayers(p=>({...p,[k]:!p[k]}));

  // Select a point, fly to it, open detail card
  function selectPoint(pt: RiskPoint) {
    setSelected(pt);
    setFlyTarget({ ...pt, id: pt.id }); // always new object reference → triggers flyTo
  }

  return (
    <div className="w-full h-full flex bg-[#0f1117] text-white overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-white/[0.06] bg-[#0f1117] overflow-y-auto">

        {/* Nav links */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-white/[0.06]">
          <a href="/"
            className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/70 transition-colors group">
            {/* home icon */}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Home</span>
          </a>
          <span className="text-white/10 mx-1">/</span>
          <a href="/advanced"
            className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/70 transition-colors">
            {/* document icon */}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Docs</span>
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-px border-b border-white/[0.06]">
          {[
            { label:"Critical zones", val: stats.critical,  color:"text-red-400" },
            { label:"High risk",      val: stats.high,      color:"text-orange-400" },
            { label:"In flood zone",  val: stats.flood,     color:"text-sky-400" },
            { label:"Pop. exposed",   val: `${(stats.pop/1000).toFixed(0)}k`, color:"text-violet-400" },
          ].map(({label,val,color})=>(
            <div key={label} className="px-4 py-3 bg-white/[0.02]">
              <div className={`text-lg font-semibold tabular-nums ${color}`}>{val}</div>
              <div className="text-[10px] text-white/30 mt-0.5 leading-tight">{label}</div>
            </div>
          ))}
        </div>

        {/* City filter */}
        <div className="flex border-b border-white/[0.06]">
          {(["All","Taipei","New Taipei"] as const).map(c=>(
            <button key={c} onClick={()=>setCityFilter(c)}
              className={`flex-1 py-2 text-[11px] font-medium transition-colors ${
                cityFilter===c ? "text-white border-b-2 border-white/60" : "text-white/30 hover:text-white/60"
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.06]">
          {(["layers","ranking"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`flex-1 py-2 text-[11px] font-medium capitalize transition-colors ${
                tab===t ? "text-white border-b-2 border-white/60" : "text-white/30 hover:text-white/60"
              }`}>
              {t==="layers" ? "Layers" : "Ranking"}
            </button>
          ))}
        </div>

        {/* Tab: Layers */}
        {tab==="layers" && (
          <div className="p-4 space-y-4">
            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Layers</p>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-sm border border-white/20" style={{background:"#1e293b"}} />
                  <span className="text-xs text-white/40">County boundaries</span>
                </div>
                {([
                  { key:"debris",  label:"Debris flow streams",        color:"#fb923c" },
                  { key:"tFlood",  label:"Taipei flood inundation",    color:"#818cf8" },
                  { key:"ntFlood", label:"New Taipei flood inundation", color:"#38bdf8" },
                  { key:"points",  label:"Risk assessment points",     color:"#f87171" },
                ] as const).map(l=>(
                  <label key={l.key} className="flex items-center gap-2.5 cursor-pointer group">
                    <input type="checkbox" checked={layers[l.key]} onChange={()=>toggle(l.key)}
                      className="w-3.5 h-3.5 accent-white/60 cursor-pointer" />
                    <div className="w-3 h-3 rounded-sm border" style={{background:l.color+"33",borderColor:l.color}} />
                    <span className="text-xs text-white/50 group-hover:text-white/80 transition-colors">{l.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-3">Risk levels</p>
              <div className="space-y-2">
                {(["Critical","High","Moderate","Low"] as RiskLevel[]).map(lv=>(
                  <div key={lv} className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{background:RISK_COLOR[lv]}} />
                    <span className="text-xs text-white/50">{lv}</span>
                    <span className="ml-auto text-[10px] text-white/20">
                      {riskPoints.filter(p=>p.risk===lv).length} zones
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] pt-4">
              <p className="text-[10px] text-white/25 uppercase tracking-widest mb-2">Score formula</p>
              <div className="space-y-1 text-[11px] text-white/35">
                <div className="flex justify-between"><span>Debris density</span><span>45%</span></div>
                <div className="flex justify-between"><span>Flood zone overlap</span><span>35%</span></div>
                <div className="flex justify-between"><span>Population exposure</span><span>20%</span></div>
                <div className="text-[10px] text-white/20 mt-1">Search radius: {SEARCH_RADIUS_KM} km</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Ranking */}
        {tab==="ranking" && (
          <div className="p-3 space-y-1">
            <p className="text-[10px] text-white/25 uppercase tracking-widest px-1 py-2">
              {cityFilter==="All" ? `All zones (${ranked.length})` : `${cityFilter} (${ranked.length})`}
            </p>
            {ranked.map((pt,i)=>(
              <button key={pt.id} onClick={()=>selectPoint(pt)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  selected?.id===pt.id ? "bg-white/10" : "hover:bg-white/[0.04]"
                }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] text-white/20 w-4 tabular-nums">{i+1}</span>
                  <span className="text-xs text-white/80 flex-1 truncate font-medium">{pt.name}</span>
                  <Tag level={pt.risk} />
                </div>
                <div className="pl-6">
                  <Bar val={pt.score} />
                  <div className="flex gap-3 mt-1.5 text-[10px] text-white/25">
                    <span>{pt.nearbyDebris} streams</span>
                    <span>{pt.inFloodZone ? "flood ✓" : "no flood"}</span>
                    <span>{(pt.population/1000).toFixed(1)}k pop</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </aside>

      {/* ── Map ── */}
      <div className="flex-1 relative">
        <MapContainer center={[25.02,121.52]} zoom={10} className="w-full h-full" style={{background:"#0f1117"}}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution="&copy; CARTO" />

          {/* FlyTo controller */}
          <MapController target={flyTarget} />

          {taiwanData && (
            <GeoJSON data={taiwanData}
              style={{color:"#ffffff",weight:0.8,opacity:0.15,fillColor:"#1e293b",fillOpacity:0.2}}
              onEachFeature={(f,l)=>{
                const name=f.properties?.COUNTYNAME||f.properties?.name||"—";
                l.bindTooltip(name,{permanent:false,direction:"center"});
              }} />
          )}

          {debrisData && layers.debris && (
            <GeoJSON key="debris" data={debrisData}
              style={{color:"#fb923c",weight:1.2,opacity:0.7,fillColor:"#fb923c",fillOpacity:0.2}}
              onEachFeature={(f,l)=>{
                if(f.properties){
                  const c=Object.entries(f.properties).slice(0,5).map(([k,v])=>`<b>${k}</b>: ${v}`).join("<br/>");
                  l.bindPopup(`<div style="font-size:12px">${c}</div>`);
                }
              }} />
          )}

          {taipeiFlood && layers.tFlood && (
            <GeoJSON key="tFlood" data={taipeiFlood}
              style={{color:"#818cf8",weight:0.8,opacity:0.7,fillColor:"#818cf8",fillOpacity:0.3}}
              onEachFeature={(f,l)=>{
                if(f.properties){
                  const c=Object.entries(f.properties).slice(0,5).map(([k,v])=>`<b>${k}</b>: ${v}`).join("<br/>");
                  l.bindPopup(`<div style="font-size:12px"><b>Taipei Flood</b><br/>${c}</div>`);
                }
              }} />
          )}

          {newTaipeiFlood && layers.ntFlood && (
            <GeoJSON key="ntFlood" data={newTaipeiFlood}
              style={{color:"#38bdf8",weight:0.8,opacity:0.7,fillColor:"#38bdf8",fillOpacity:0.3}}
              onEachFeature={(f,l)=>{
                if(f.properties){
                  const c=Object.entries(f.properties).slice(0,5).map(([k,v])=>`<b>${k}</b>: ${v}`).join("<br/>");
                  l.bindPopup(`<div style="font-size:12px"><b>New Taipei Flood</b><br/>${c}</div>`);
                }
              }} />
          )}

          {layers.points && displayed.map(pt=>(
            <CircleMarker key={pt.id} center={[pt.lat,pt.lng]}
              radius={pt.risk==="Critical"?10:pt.risk==="High"?8:pt.risk==="Moderate"?6:5}
              pathOptions={{
                color: RISK_COLOR[pt.risk],
                fillColor: RISK_COLOR[pt.risk],
                fillOpacity: selected?.id===pt.id ? 1 : 0.5,
                weight: selected?.id===pt.id ? 2.5 : 1,
              }}
              eventHandlers={{ click: () => selectPoint(pt) }}>
              <Popup>
                <div style={{minWidth:220,fontFamily:"system-ui,sans-serif",fontSize:13,lineHeight:1.5}}>
                  <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{pt.name}</div>
                  <div style={{fontSize:11,color:"#888",marginBottom:8}}>{pt.city} · {pt.risk} Risk · Score {pt.score}/100</div>
                  <div style={{background:"#f9f9f9",borderRadius:6,padding:"8px 10px",marginBottom:8}}>
                    {[
                      {label:`Debris ×0.45`, sub:`${pt.nearbyDebris} streams`,          val:pt.debrisScore},
                      {label:`Flood ×0.35`,  sub:pt.inFloodZone?"inside zone":"outside", val:pt.floodScore},
                      {label:`Pop ×0.20`,    sub:pt.population.toLocaleString(),          val:pt.popScore},
                    ].map(({label,sub,val})=>(
                      <div key={label} style={{marginBottom:6}}>
                        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                          <span style={{color:"#555"}}>{label} <span style={{color:"#aaa"}}>({sub})</span></span>
                          <b style={{color:"#333"}}>{val}</b>
                        </div>
                        <div style={{background:"#e5e5e5",borderRadius:3,height:4}}>
                          <div style={{width:`${val}%`,height:4,borderRadius:3,
                            background:val>=75?"#f87171":val>=55?"#fb923c":val>=35?"#fbbf24":"#4ade80"}} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:"#666",lineHeight:1.6}}>{pt.recommendation}</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* ── Detail card ── */}
        {selected && (
          <div className="absolute bottom-5 right-5 w-72 bg-[#0f1117] border border-white/[0.08] rounded-xl p-4 z-[1000] shadow-2xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-white/90">{selected.name}</div>
                <div className="text-[11px] text-white/30 mt-0.5">{selected.city} City</div>
              </div>
              <div className="flex items-center gap-2">
                <Tag level={selected.risk} />
                <button onClick={()=>setSelected(null)}
                  className="text-white/20 hover:text-white/60 text-lg leading-none transition-colors ml-1">×</button>
              </div>
            </div>

            <div className="flex items-end gap-3 mb-4">
              <div className="text-4xl font-bold tabular-nums" style={{color:RISK_COLOR[selected.risk]}}>
                {selected.score}
              </div>
              <div className="flex-1 pb-1">
                <Bar val={selected.score} />
                <div className="text-[10px] text-white/20 mt-1">composite risk score / 100</div>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              {[
                {label:"Debris density",  sub:`${selected.nearbyDebris} streams · ×0.45`, val:selected.debrisScore,  color:"#fb923c"},
                {label:"Flood zone",       sub:`${selected.inFloodZone?"inside":"outside"} · ×0.35`,  val:selected.floodScore,  color:"#818cf8"},
                {label:"Population",       sub:`${selected.population.toLocaleString()} · ×0.20`,     val:selected.popScore,    color:"#a78bfa"},
              ].map(({label,sub,val,color})=>(
                <div key={label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/50">{label} <span className="text-white/20">{sub}</span></span>
                    <span className="text-white/60 tabular-nums">{val}</span>
                  </div>
                  <Bar val={val} color={color} />
                </div>
              ))}
            </div>

            <p className="text-[11px] text-white/40 leading-relaxed border-t border-white/[0.06] pt-3">
              {selected.recommendation}
            </p>

            {/* Re-center button */}
            <button
              onClick={()=>setFlyTarget({...selected, id: -selected.id})}
              className="mt-3 w-full flex items-center justify-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors py-1.5 rounded-lg border border-white/[0.06] hover:border-white/20"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Re-center map
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f1117]/90 z-[2000]">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin mx-auto mb-3" />
            <div className="text-sm text-white/50">Loading datasets</div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-2 rounded-lg z-[2000]">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}