"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { Layer, LatLngExpression } from "leaflet";
import type { Feature, Point, Polygon, FeatureCollection } from "geojson";

// 定義屬性型別
export interface HouseholdProps {
  id: string;
  district: string;
  vulnerability_score: number;
  members: number;
  needs: string;
  notes: string;
}

export interface FloodProps {
  zone: string;
}

// 給定完整的 GeoJSON 型別
const floodData: FeatureCollection<Polygon, FloodProps> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { zone: "Wenshan Flood Area A" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [121.56, 24.99],
            [121.58, 24.99],
            [121.57, 24.97],
            [121.55, 24.98],
            [121.56, 24.99],
          ],
        ],
      },
    },
  ],
};

const householdData: FeatureCollection<Point, HouseholdProps> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "TP-001",
        district: "Wenshan District",
        vulnerability_score: 5,
        members: 3,
        needs: "Medical Evacuation",
        notes: "Elderly couple needing immediate assistance.",
      },
      geometry: { type: "Point", coordinates: [121.565, 24.985] },
    },
    {
      type: "Feature",
      properties: {
        id: "TP-002",
        district: "Wenshan District",
        vulnerability_score: 2,
        members: 4,
        needs: "Sandbags",
        notes: "Ground floor risk, currently safe.",
      },
      geometry: { type: "Point", coordinates: [121.558, 24.988] },
    },
    {
      type: "Feature",
      properties: {
        id: "TP-003",
        district: "Xinyi District",
        vulnerability_score: 4,
        members: 5,
        needs: "Drinking Water, Generator",
        notes: "Power outage, large family.",
      },
      geometry: { type: "Point", coordinates: [121.57, 24.995] },
    },
  ],
};

const getScoreColor = (score: number) => {
  if (score >= 5) return "#dc2626";
  if (score === 4) return "#ea580c";
  if (score === 3) return "#f59e0b";
  return "#10b981";
};

// Props 型別定義
interface ResultMapProps {
  onFeatureClick: (feature: Feature<Point, HouseholdProps>) => void;
}

export default function ResultMap({ onFeatureClick }: ResultMapProps) {
  // 明確宣告參數型別
  const onEachFeature = (
    feature: Feature<Point, HouseholdProps>,
    layer: Layer,
  ) => {
    layer.bindTooltip(`Score: ${feature.properties.vulnerability_score}`, {
      direction: "top",
    });
    layer.on({
      click: () => onFeatureClick(feature),
    });
  };

  const pointToLayer = (
    feature: Feature<Point, HouseholdProps>,
    latlng: LatLngExpression,
  ) => {
    return L.circleMarker(latlng as L.LatLng, {
      radius: 12,
      fillColor: getScoreColor(feature.properties.vulnerability_score),
      color: "#ffffff",
      weight: 3,
      fillOpacity: 1,
    });
  };

  return (
    <MapContainer
      center={[24.985, 121.565]}
      zoom={14}
      className="w-full h-full"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <GeoJSON
        data={floodData}
        style={{
          color: "#3b82f6",
          weight: 2,
          fillOpacity: 0.15,
          dashArray: "5, 5",
        }}
      />
      {/* 透過型別斷言符合 react-leaflet 底層對原生 GeoJSON 的寬鬆定義，避免 Vercel 報錯 */}
      <GeoJSON
        data={householdData}
        onEachFeature={
          onEachFeature as (feature: Feature, layer: Layer) => void
        }
        pointToLayer={
          pointToLayer as (
            feature: Feature,
            latlng: L.LatLngExpression,
          ) => L.Layer
        }
      />
    </MapContainer>
  );
}
