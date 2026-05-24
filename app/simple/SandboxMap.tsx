"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Layer, LatLngExpression } from "leaflet";
import type { Feature, Point, Polygon, MultiPolygon, FeatureCollection } from "geojson";
import { TILE_LAYERS, TileKey } from "./page";

// ─── Props ─────────────────────────────────────────────────────
interface SandboxMapProps {
  data: FeatureCollection;
  tileKey: TileKey;
}

// ─── Auto-fit bounds when data changes ────────────────────────
function MapUpdater({ geojsonData }: { geojsonData: FeatureCollection }) {
  const map = useMap();

  useEffect(() => {
    if (!geojsonData?.features?.length) return;
    try {
      const bounds = L.geoJSON(geojsonData).getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
      }
    } catch {
      // invalid geometry — silently ignore
    }
  }, [geojsonData, map]);

  return null;
}

// ─── Sync tile layer when tileKey changes ─────────────────────
// MapContainer doesn't re-render TileLayer on prop change,
// so we imperatively swap it via useMap + useRef.
function TileUpdater({ tileKey }: { tileKey: TileKey }) {
  const map = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    // Remove old tile layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
    }
    // Add new tile layer
    const { url, attribution } = TILE_LAYERS[tileKey];
    const newLayer = L.tileLayer(url, { attribution });
    newLayer.addTo(map);
    layerRef.current = newLayer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
      }
    };
  }, [tileKey, map]);

  return null;
}

// ─── Color by vulnerability score ─────────────────────────────
function getScoreStyle(score: number): { hex: string; text: string } {
  if (score >= 5) return { hex: "#ef4444", text: "Critical" };
  if (score === 4) return { hex: "#f97316", text: "High Risk" };
  if (score === 3) return { hex: "#eab308", text: "Moderate" };
  return { hex: "#10b981", text: "Safe" };
}

// ─── Zone style for Polygons ───────────────────────────────────
function getZoneStyle(props: Record<string, any>): L.PathOptions {
  if (props?.zone_type === "evacuation") {
    return { color: "#f97316", fillColor: "#f97316", fillOpacity: 0.12, weight: 2, dashArray: "6 4" };
  }
  // default: flood zone
  return { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.15, weight: 2 };
}

// ─── Main Component ────────────────────────────────────────────
export default function SandboxMap({ data, tileKey }: SandboxMapProps) {

  // Called for every feature — attaches popup
  const onEachFeature = (feature: Feature, layer: Layer) => {
    const props = (feature.properties || {}) as Record<string, any>;

    // Point popup
    if (feature.geometry.type === "Point") {
      const score = props.vulnerability_score ?? 0;
      const style = getScoreStyle(score);

      const popupContent = `
        <div style="font-family:system-ui,sans-serif;min-width:160px;">
          <div style="
            background:${style.hex};color:#fff;
            padding:3px 8px;border-radius:4px;
            font-weight:700;font-size:11px;
            display:inline-block;margin-bottom:8px;
          ">
            Score ${score} — ${style.text}
          </div>
          <div style="font-size:15px;font-weight:700;margin-bottom:4px;">
            ${props.id ?? props.name ?? "Unknown"}
          </div>
          ${props.district ? `<div style="font-size:12px;color:#666;">District: ${props.district}</div>` : ""}
          ${props.needs    ? `<div style="font-size:12px;color:#444;margin-top:4px;">Needs: <strong>${props.needs}</strong></div>` : ""}
          ${props.residents ? `<div style="font-size:12px;color:#666;">Residents: ${props.residents}</div>` : ""}
        </div>
      `;
      layer.bindPopup(popupContent);
    }

    // Polygon popup
    if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
      const popupContent = `
        <div style="font-family:system-ui,sans-serif;">
          <div style="font-size:14px;font-weight:700;margin-bottom:4px;">
            ${props.name ?? "Unnamed Zone"}
          </div>
          ${props.risk      ? `<div style="font-size:12px;color:#666;">Risk: <strong>${props.risk}</strong></div>` : ""}
          ${props.zone_type ? `<div style="font-size:12px;color:#888;text-transform:capitalize;">Type: ${props.zone_type}</div>` : ""}
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  // Render circle markers for Point features
  const pointToLayer = (feature: Feature<Point>, latlng: LatLngExpression) => {
    const score = (feature.properties as any)?.vulnerability_score ?? 0;
    const { hex } = getScoreStyle(score);

    return L.circleMarker(latlng as L.LatLng, {
      radius: 12,
      fillColor: hex,
      color: "#ffffff",
      weight: 3,
      fillOpacity: 1,
    });
  };

  // Style function for Polygon / MultiPolygon features
  const styleFeature = (feature?: Feature): L.PathOptions => {
    if (!feature) return {};
    if (
      feature.geometry.type === "Polygon" ||
      feature.geometry.type === "MultiPolygon"
    ) {
      return getZoneStyle((feature.properties ?? {}) as Record<string, any>);
    }
    return {};
  };

  // Force GeoJSON layer to fully re-render when data changes
  const geoJsonKey = JSON.stringify(data);

  return (
    <MapContainer
      center={[24.985, 121.565]}
      zoom={13}
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      // We manage the tile layer imperatively via TileUpdater,
      // so we don't put a TileLayer here as a child.
    >
      {/* Tile layer — swapped imperatively on tileKey change */}
      <TileUpdater tileKey={tileKey} />

      {/* Auto-fit viewport to data */}
      <MapUpdater geojsonData={data} />

      {/* GeoJSON layer — key forces full remount on data change */}
      <GeoJSON
        key={geoJsonKey}
        data={data}
        pointToLayer={pointToLayer as any}
        style={styleFeature as any}
        onEachFeature={onEachFeature as any}
      />
    </MapContainer>
  );
}