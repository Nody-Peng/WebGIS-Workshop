"use client";

import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const dummyGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "HH-104",
        district: "Flood Zone A",
        vulnerability_score: 5,
        aid_type: "Medical Supplies & Evacuation",
      },
      geometry: { type: "Point", coordinates: [121.5, 23.8] },
    },
    {
      type: "Feature",
      properties: {
        id: "HH-209",
        district: "Flood Zone B",
        vulnerability_score: 2,
        aid_type: "Drinking Water",
      },
      geometry: { type: "Point", coordinates: [121.6, 23.7] },
    },
  ],
};

const getColor = (score: number) => {
  if (score >= 5) return "#dc2626";
  if (score >= 4) return "#ea580c";
  if (score >= 3) return "#f59e0b";
  return "#10b981";
};

export default function ResultMap({
  onFeatureClick,
}: {
  onFeatureClick: (feature: any) => void;
}) {
  const onEachFeature = (feature: any, layer: any) => {
    layer.on({
      click: () => onFeatureClick(feature),
    });
  };

  const pointToLayer = (feature: any, latlng: any) => {
    return L.circleMarker(latlng, {
      radius: 12,
      fillColor: getColor(feature.properties.vulnerability_score),
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8,
    });
  };

  return (
    <MapContainer
      center={[23.75, 121.55]}
      zoom={10}
      className="w-full h-full"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={dummyGeoJSON as any}
        onEachFeature={onEachFeature}
        pointToLayer={pointToLayer}
      />
    </MapContainer>
  );
}
