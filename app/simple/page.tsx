"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

// ─── Tile Layer Options ────────────────────────────────────────
export const TILE_LAYERS = {
  light: {
    label: "Light",
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO",
  },
  dark: {
    label: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; CARTO",
  },
  satellite: {
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
  osm: {
    label: "Street",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap",
  },
} as const;

export type TileKey = keyof typeof TILE_LAYERS;

// ─── Tutorial Steps ────────────────────────────────────────────
const tutorialSteps = [
  // ── Step 1 ──
  {
    id: 1,
    title: "The Blank Canvas",
    description:
      "Every WebGIS app starts with a base map. We initialize Leaflet.js and point the camera at Taipei City. The map is empty for now — but that's about to change.",
    conceptCode: `const map = L.map('map').setView([24.985, 121.565], 14);\n\nL.tileLayer('https://...cartocdn.com/light_all/...', {\n  attribution: '© CARTO'\n}).addTo(map);`,
    mission: "Look at the empty map on the right. Click 'Next Step' to inject your first piece of spatial data.",
    defaultJson: `{\n  "type": "FeatureCollection",\n  "features": []\n}`,
    examples: [
      {
        label: "Empty map (default)",
        json: `{\n  "type": "FeatureCollection",\n  "features": []\n}`,
      },
    ],
    showTileSwitcher: false,
  },

  // ── Step 2 ──
  {
    id: 2,
    title: "Your First Marker",
    description:
      "GeoJSON is the language of WebGIS. It bundles a location (geometry) with data (properties) into one object. Here we place a single household on the map.",
    conceptCode: `const data = {\n  "type": "FeatureCollection",\n  "features": [{\n    "type": "Feature",\n    "properties": { "id": "TP-001", "needs": "Sandbags" },\n    "geometry": {\n      "type": "Point",\n      "coordinates": [121.565, 24.985]  // [lng, lat]\n    }\n  }]\n};\n\nL.geoJSON(data).addTo(map);`,
    mission: "Click 'Update Map' to see the green dot appear. Try dragging the coordinates slightly and update again — the dot moves!",
    defaultJson: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "id": "TP-001",\n        "district": "Wenshan",\n        "vulnerability_score": 2,\n        "needs": "Sandbags"\n      },\n      "geometry": {\n        "type": "Point",\n        "coordinates": [121.565, 24.985]\n      }\n    }\n  ]\n}`,
    examples: [
      {
        label: "Household in Wenshan",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 2, "needs": "Sandbags" },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    }\n  ]\n}`,
      },
      {
        label: "Household in Xinyi",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-002", "district": "Xinyi", "vulnerability_score": 1, "needs": "None" },\n      "geometry": { "type": "Point", "coordinates": [121.568, 25.033] }\n    }\n  ]\n}`,
      },
      {
        label: "Hospital location",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "HOSP-01", "name": "NTU Hospital", "type": "Emergency Center" },\n      "geometry": { "type": "Point", "coordinates": [121.540, 25.042] }\n    }\n  ]\n}`,
      },
    ],
    showTileSwitcher: false,
  },

  // ── Step 3 ──
  {
    id: 3,
    title: "Data-Driven Colors",
    description:
      "A dot is just a dot — until it carries meaning. We read the vulnerability_score from each feature's properties and assign a color. This turns raw data into a decision-support tool.",
    conceptCode: `function getColor(score) {\n  if (score >= 5) return '#ef4444'; // Critical\n  if (score === 4) return '#f97316'; // High\n  if (score === 3) return '#eab308'; // Moderate\n  return '#10b981';                  // Safe\n}\n\nL.geoJSON(data, {\n  pointToLayer: (feature, latlng) =>\n    L.circleMarker(latlng, {\n      fillColor: getColor(feature.properties.vulnerability_score),\n      radius: 12, color: '#fff', weight: 2, fillOpacity: 1\n    })\n}).addTo(map);`,
    mission: "Change the vulnerability_score to 5, then click 'Update Map'. The dot turns red — the system flags it as critical!",
    defaultJson: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "id": "TP-001",\n        "district": "Wenshan",\n        "vulnerability_score": 2,\n        "needs": "Sandbags"\n      },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    }\n  ]\n}`,
    examples: [
      {
        label: "Safe household (score 2)",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 2, "needs": "Sandbags" },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    }\n  ]\n}`,
      },
      {
        label: "Critical household (score 5)",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Evacuation" },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    }\n  ]\n}`,
      },
      {
        label: "All four risk levels",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "A", "vulnerability_score": 1, "needs": "None" },\n      "geometry": { "type": "Point", "coordinates": [121.560, 24.982] }\n    },\n    {\n      "type": "Feature",\n      "properties": { "id": "B", "vulnerability_score": 3, "needs": "Water" },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    },\n    {\n      "type": "Feature",\n      "properties": { "id": "C", "vulnerability_score": 4, "needs": "Food" },\n      "geometry": { "type": "Point", "coordinates": [121.570, 24.988] }\n    },\n    {\n      "type": "Feature",\n      "properties": { "id": "D", "vulnerability_score": 5, "needs": "Evacuation" },\n      "geometry": { "type": "Point", "coordinates": [121.575, 24.991] }\n    }\n  ]\n}`,
      },
    ],
    showTileSwitcher: false,
  },

  // ── Step 4 ──
  {
    id: 4,
    title: "Popups & Interactivity",
    description:
      "A map without interaction is just a picture. We attach click events to each marker so decision-makers can tap a dot and instantly see the household's full profile.",
    conceptCode: `L.geoJSON(data, {\n  onEachFeature: (feature, layer) => {\n    const p = feature.properties;\n    layer.bindPopup(\n      \`<b>\${p.id}</b><br>\n       Score: \${p.vulnerability_score}<br>\n       Needs: \${p.needs}\`\n    );\n  }\n}).addTo(map);`,
    mission: "Change 'needs' to 'Evacuation Boat', click 'Update Map', then click the dot. The popup shows your new value!",
    defaultJson: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": {\n        "id": "TP-001",\n        "district": "Wenshan",\n        "vulnerability_score": 5,\n        "needs": "Sandbags"\n      },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    }\n  ]\n}`,
    examples: [
      {
        label: "Single popup",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Sandbags" },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    }\n  ]\n}`,
      },
      {
        label: "Needs: Evacuation Boat",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Evacuation Boat" },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    }\n  ]\n}`,
      },
      {
        label: "Medical supply request",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-007", "district": "Neihu", "vulnerability_score": 4, "needs": "Insulin & Medical Supplies", "residents": 6, "elderly": 2 },\n      "geometry": { "type": "Point", "coordinates": [121.595, 25.065] }\n    }\n  ]\n}`,
      },
    ],
    showTileSwitcher: false,
  },

  // ── Step 5 ──
  {
    id: 5,
    title: "Multiple Points — Real Scale",
    description:
      "One dot is a test. Ten dots is a dataset. This is where WebGIS starts to feel real — you can see patterns, clusters, and priorities emerge from the data.",
    conceptCode: `// GeoJSON supports unlimited features in one array.\n// The map renders all of them automatically.\nconst data = {\n  "type": "FeatureCollection",\n  "features": [\n    { ...household1 },\n    { ...household2 },\n    { ...household3 },\n    // as many as you need\n  ]\n};`,
    mission: "Load the '10 households' example below. Notice how the map auto-zooms to fit all points. Try adding one more household yourself!",
    defaultJson: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Evacuation" },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    },\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-002", "district": "Wenshan", "vulnerability_score": 2, "needs": "Sandbags" },\n      "geometry": { "type": "Point", "coordinates": [121.570, 24.990] }\n    },\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-003", "district": "Xinyi", "vulnerability_score": 4, "needs": "Food & Water" },\n      "geometry": { "type": "Point", "coordinates": [121.568, 25.033] }\n    }\n  ]\n}`,
    examples: [
      {
        label: "3 households (starter)",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Evacuation" },\n      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }\n    },\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-002", "district": "Wenshan", "vulnerability_score": 2, "needs": "Sandbags" },\n      "geometry": { "type": "Point", "coordinates": [121.570, 24.990] }\n    },\n    {\n      "type": "Feature",\n      "properties": { "id": "TP-003", "district": "Xinyi", "vulnerability_score": 4, "needs": "Food & Water" },\n      "geometry": { "type": "Point", "coordinates": [121.568, 25.033] }\n    }\n  ]\n}`,
      },
      {
        label: "10 households across Taipei",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    { "type": "Feature", "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Evacuation" }, "geometry": { "type": "Point", "coordinates": [121.565, 24.985] } },\n    { "type": "Feature", "properties": { "id": "TP-002", "district": "Wenshan", "vulnerability_score": 2, "needs": "Sandbags" }, "geometry": { "type": "Point", "coordinates": [121.570, 24.990] } },\n    { "type": "Feature", "properties": { "id": "TP-003", "district": "Xinyi", "vulnerability_score": 4, "needs": "Food & Water" }, "geometry": { "type": "Point", "coordinates": [121.568, 25.033] } },\n    { "type": "Feature", "properties": { "id": "TP-004", "district": "Daan", "vulnerability_score": 1, "needs": "None" }, "geometry": { "type": "Point", "coordinates": [121.543, 25.026] } },\n    { "type": "Feature", "properties": { "id": "TP-005", "district": "Zhongzheng", "vulnerability_score": 3, "needs": "Water" }, "geometry": { "type": "Point", "coordinates": [121.520, 25.032] } },\n    { "type": "Feature", "properties": { "id": "TP-006", "district": "Neihu", "vulnerability_score": 5, "needs": "Medical" }, "geometry": { "type": "Point", "coordinates": [121.595, 25.065] } },\n    { "type": "Feature", "properties": { "id": "TP-007", "district": "Beitou", "vulnerability_score": 2, "needs": "Sandbags" }, "geometry": { "type": "Point", "coordinates": [121.500, 25.132] } },\n    { "type": "Feature", "properties": { "id": "TP-008", "district": "Shilin", "vulnerability_score": 4, "needs": "Evacuation" }, "geometry": { "type": "Point", "coordinates": [121.525, 25.093] } },\n    { "type": "Feature", "properties": { "id": "TP-009", "district": "Songshan", "vulnerability_score": 3, "needs": "Food" }, "geometry": { "type": "Point", "coordinates": [121.577, 25.050] } },\n    { "type": "Feature", "properties": { "id": "TP-010", "district": "Zhongshan", "vulnerability_score": 1, "needs": "None" }, "geometry": { "type": "Point", "coordinates": [121.532, 25.063] } }\n  ]\n}`,
      },
      {
        label: "Flood crisis scenario",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    { "type": "Feature", "properties": { "id": "FL-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Boat Evacuation", "residents": 8 }, "geometry": { "type": "Point", "coordinates": [121.562, 24.982] } },\n    { "type": "Feature", "properties": { "id": "FL-002", "district": "Wenshan", "vulnerability_score": 5, "needs": "Medical Urgent", "residents": 3 }, "geometry": { "type": "Point", "coordinates": [121.567, 24.987] } },\n    { "type": "Feature", "properties": { "id": "FL-003", "district": "Wenshan", "vulnerability_score": 4, "needs": "Food & Water", "residents": 5 }, "geometry": { "type": "Point", "coordinates": [121.572, 24.992] } },\n    { "type": "Feature", "properties": { "id": "FL-004", "district": "Wenshan", "vulnerability_score": 3, "needs": "Sandbags", "residents": 2 }, "geometry": { "type": "Point", "coordinates": [121.558, 24.978] } },\n    { "type": "Feature", "properties": { "id": "FL-005", "district": "Wenshan", "vulnerability_score": 2, "needs": "Monitoring", "residents": 4 }, "geometry": { "type": "Point", "coordinates": [121.575, 24.995] } }\n  ]\n}`,
      },
    ],
    showTileSwitcher: false,
  },

  // ── Step 6 ──
  {
    id: 6,
    title: "Map Styles — Change the Base",
    description:
      "The base map (tile layer) is the canvas your data sits on. Different styles serve different purposes — satellite for terrain context, dark for high-contrast dashboards, street for navigation.",
    conceptCode: `// Swap the tile URL to change the entire map style:\n\n// Light (default)\n'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png'\n\n// Dark mode\n'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'\n\n// Satellite\n'https://server.arcgisonline.com/ArcGIS/rest/services/\n  World_Imagery/MapServer/tile/{z}/{y}/{x}'\n\n// OpenStreetMap\n'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'`,
    mission: "Use the style switcher on the map to try all four base maps. Notice how the same data looks completely different on satellite vs. dark mode.",
    defaultJson: `{\n  "type": "FeatureCollection",\n  "features": [\n    { "type": "Feature", "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Evacuation" }, "geometry": { "type": "Point", "coordinates": [121.565, 24.985] } },\n    { "type": "Feature", "properties": { "id": "TP-002", "district": "Neihu", "vulnerability_score": 2, "needs": "Sandbags" }, "geometry": { "type": "Point", "coordinates": [121.595, 25.065] } },\n    { "type": "Feature", "properties": { "id": "TP-003", "district": "Shilin", "vulnerability_score": 4, "needs": "Food" }, "geometry": { "type": "Point", "coordinates": [121.525, 25.093] } }\n  ]\n}`,
    examples: [
      {
        label: "3 markers (try all styles)",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    { "type": "Feature", "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Evacuation" }, "geometry": { "type": "Point", "coordinates": [121.565, 24.985] } },\n    { "type": "Feature", "properties": { "id": "TP-002", "district": "Neihu", "vulnerability_score": 2, "needs": "Sandbags" }, "geometry": { "type": "Point", "coordinates": [121.595, 25.065] } },\n    { "type": "Feature", "properties": { "id": "TP-003", "district": "Shilin", "vulnerability_score": 4, "needs": "Food" }, "geometry": { "type": "Point", "coordinates": [121.525, 25.093] } }\n  ]\n}`,
      },
      {
        label: "Dense urban cluster",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    { "type": "Feature", "properties": { "id": "A", "vulnerability_score": 5, "needs": "Evacuation" }, "geometry": { "type": "Point", "coordinates": [121.543, 25.026] } },\n    { "type": "Feature", "properties": { "id": "B", "vulnerability_score": 3, "needs": "Water" }, "geometry": { "type": "Point", "coordinates": [121.545, 25.028] } },\n    { "type": "Feature", "properties": { "id": "C", "vulnerability_score": 1, "needs": "None" }, "geometry": { "type": "Point", "coordinates": [121.541, 25.024] } }\n  ]\n}`,
      },
    ],
    showTileSwitcher: true,
  },

  // ── Step 7 ──
  {
    id: 7,
    title: "Drawing Zones — Polygons",
    description:
      "Points mark locations. Polygons define areas. In disaster response, you need to mark flood zones, evacuation areas, and restricted regions — all of which are polygons.",
    conceptCode: `// A Polygon is just an array of coordinate rings:\n{\n  "type": "Feature",\n  "properties": { "name": "Flood Zone A", "risk": "High" },\n  "geometry": {\n    "type": "Polygon",\n    "coordinates": [[\n      [121.560, 24.980],  // corner 1\n      [121.575, 24.980],  // corner 2\n      [121.575, 24.995],  // corner 3\n      [121.560, 24.995],  // corner 4\n      [121.560, 24.980]   // close the ring (same as corner 1)\n    ]]\n  }\n}`,
    mission: "Load the 'Flood zone + households' example. You'll see a red polygon overlaid with household dots inside it. Try changing the polygon coordinates to resize the zone.",
    defaultJson: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "name": "Flood Zone A", "risk": "High", "zone_type": "flood" },\n      "geometry": {\n        "type": "Polygon",\n        "coordinates": [[\n          [121.558, 24.980],\n          [121.578, 24.980],\n          [121.578, 24.996],\n          [121.558, 24.996],\n          [121.558, 24.980]\n        ]]\n      }\n    }\n  ]\n}`,
    examples: [
      {
        label: "Single flood zone",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "name": "Flood Zone A", "risk": "High", "zone_type": "flood" },\n      "geometry": {\n        "type": "Polygon",\n        "coordinates": [[\n          [121.558, 24.980], [121.578, 24.980],\n          [121.578, 24.996], [121.558, 24.996],\n          [121.558, 24.980]\n        ]]\n      }\n    }\n  ]\n}`,
      },
      {
        label: "Flood zone + households inside",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "name": "Flood Zone A", "risk": "High", "zone_type": "flood" },\n      "geometry": {\n        "type": "Polygon",\n        "coordinates": [[\n          [121.558, 24.980], [121.578, 24.980],\n          [121.578, 24.996], [121.558, 24.996],\n          [121.558, 24.980]\n        ]]\n      }\n    },\n    { "type": "Feature", "properties": { "id": "TP-001", "vulnerability_score": 5, "needs": "Evacuation" }, "geometry": { "type": "Point", "coordinates": [121.565, 24.985] } },\n    { "type": "Feature", "properties": { "id": "TP-002", "vulnerability_score": 3, "needs": "Sandbags" }, "geometry": { "type": "Point", "coordinates": [121.570, 24.990] } },\n    { "type": "Feature", "properties": { "id": "TP-003", "vulnerability_score": 2, "needs": "None" }, "geometry": { "type": "Point", "coordinates": [121.562, 24.988] } }\n  ]\n}`,
      },
      {
        label: "Two zones (flood + evacuation)",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "name": "Flood Zone A", "risk": "High", "zone_type": "flood" },\n      "geometry": {\n        "type": "Polygon",\n        "coordinates": [[\n          [121.558, 24.980], [121.578, 24.980],\n          [121.578, 24.996], [121.558, 24.996],\n          [121.558, 24.980]\n        ]]\n      }\n    },\n    {\n      "type": "Feature",\n      "properties": { "name": "Evacuation Zone B", "risk": "Medium", "zone_type": "evacuation" },\n      "geometry": {\n        "type": "Polygon",\n        "coordinates": [[\n          [121.578, 24.980], [121.595, 24.980],\n          [121.595, 24.996], [121.578, 24.996],\n          [121.578, 24.980]\n        ]]\n      }\n    }\n  ]\n}`,
      },
      {
        label: "Irregular polygon (real shape)",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "name": "Wenshan Flood Basin", "risk": "High", "zone_type": "flood" },\n      "geometry": {\n        "type": "Polygon",\n        "coordinates": [[\n          [121.555, 24.978],\n          [121.568, 24.975],\n          [121.580, 24.982],\n          [121.576, 24.995],\n          [121.560, 24.998],\n          [121.550, 24.990],\n          [121.555, 24.978]\n        ]]\n      }\n    }\n  ]\n}`,
      },
    ],
    showTileSwitcher: true,
  },

  // ── Step 8 ──
  {
    id: 8,
    title: "Your Final Map",
    description:
      "You've learned every core concept of WebGIS — base maps, GeoJSON, data-driven styling, popups, multiple features, tile styles, and spatial zones. Now combine them all into one complete map and export it.",
    conceptCode: `// Everything together:\nL.geoJSON(data, {\n  // Style points by score\n  pointToLayer: (f, latlng) => L.circleMarker(latlng, {\n    fillColor: getColor(f.properties.vulnerability_score),\n    radius: 12, color: '#fff', weight: 2, fillOpacity: 1\n  }),\n  // Style polygons by zone type\n  style: (f) => f.geometry.type === 'Polygon'\n    ? { color: '#ef4444', fillOpacity: 0.15, weight: 2 }\n    : {},\n  // Popups on everything\n  onEachFeature: (f, layer) =>\n    layer.bindPopup(f.properties.name || f.properties.id)\n}).addTo(map);`,
    mission: "This is your complete disaster response map. Customize the data, choose your preferred map style, then click 'Export HTML' to download a standalone file you can open in any browser!",
    defaultJson: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "name": "Wenshan Flood Zone", "risk": "High", "zone_type": "flood" },\n      "geometry": {\n        "type": "Polygon",\n        "coordinates": [[\n          [121.555, 24.978], [121.578, 24.978],\n          [121.578, 24.998], [121.555, 24.998],\n          [121.555, 24.978]\n        ]]\n      }\n    },\n    { "type": "Feature", "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Evacuation Boat" }, "geometry": { "type": "Point", "coordinates": [121.565, 24.985] } },\n    { "type": "Feature", "properties": { "id": "TP-002", "district": "Wenshan", "vulnerability_score": 4, "needs": "Medical" }, "geometry": { "type": "Point", "coordinates": [121.560, 24.990] } },\n    { "type": "Feature", "properties": { "id": "TP-003", "district": "Wenshan", "vulnerability_score": 2, "needs": "Sandbags" }, "geometry": { "type": "Point", "coordinates": [121.572, 24.982] } },\n    { "type": "Feature", "properties": { "id": "TP-004", "district": "Xinyi", "vulnerability_score": 3, "needs": "Food & Water" }, "geometry": { "type": "Point", "coordinates": [121.568, 25.033] } },\n    { "type": "Feature", "properties": { "id": "TP-005", "district": "Neihu", "vulnerability_score": 1, "needs": "None" }, "geometry": { "type": "Point", "coordinates": [121.595, 25.065] } }\n  ]\n}`,
    examples: [
      {
        label: "Complete disaster map",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    {\n      "type": "Feature",\n      "properties": { "name": "Wenshan Flood Zone", "risk": "High", "zone_type": "flood" },\n      "geometry": {\n        "type": "Polygon",\n        "coordinates": [[\n          [121.555, 24.978], [121.578, 24.978],\n          [121.578, 24.998], [121.555, 24.998],\n          [121.555, 24.978]\n        ]]\n      }\n    },\n    { "type": "Feature", "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "needs": "Evacuation Boat" }, "geometry": { "type": "Point", "coordinates": [121.565, 24.985] } },\n    { "type": "Feature", "properties": { "id": "TP-002", "district": "Wenshan", "vulnerability_score": 4, "needs": "Medical" }, "geometry": { "type": "Point", "coordinates": [121.560, 24.990] } },\n    { "type": "Feature", "properties": { "id": "TP-003", "district": "Wenshan", "vulnerability_score": 2, "needs": "Sandbags" }, "geometry": { "type": "Point", "coordinates": [121.572, 24.982] } }\n  ]\n}`,
      },
      {
        label: "10 households + 2 zones",
        json: `{\n  "type": "FeatureCollection",\n  "features": [\n    { "type": "Feature", "properties": { "name": "Flood Zone A", "zone_type": "flood" }, "geometry": { "type": "Polygon", "coordinates": [[[121.555,24.978],[121.578,24.978],[121.578,24.998],[121.555,24.998],[121.555,24.978]]] } },\n    { "type": "Feature", "properties": { "name": "Evacuation Zone B", "zone_type": "evacuation" }, "geometry": { "type": "Polygon", "coordinates": [[[121.578,24.978],[121.600,24.978],[121.600,24.998],[121.578,24.998],[121.578,24.978]]] } },\n    { "type": "Feature", "properties": { "id": "TP-001", "vulnerability_score": 5, "needs": "Evacuation" }, "geometry": { "type": "Point", "coordinates": [121.562, 24.985] } },\n    { "type": "Feature", "properties": { "id": "TP-002", "vulnerability_score": 4, "needs": "Medical" }, "geometry": { "type": "Point", "coordinates": [121.568, 24.990] } },\n    { "type": "Feature", "properties": { "id": "TP-003", "vulnerability_score": 3, "needs": "Food" }, "geometry": { "type": "Point", "coordinates": [121.572, 24.982] } },\n    { "type": "Feature", "properties": { "id": "TP-004", "vulnerability_score": 2, "needs": "Sandbags" }, "geometry": { "type": "Point", "coordinates": [121.565, 24.994] } },\n    { "type": "Feature", "properties": { "id": "TP-005", "vulnerability_score": 1, "needs": "None" }, "geometry": { "type": "Point", "coordinates": [121.558, 24.988] } },\n    { "type": "Feature", "properties": { "id": "TP-006", "vulnerability_score": 5, "needs": "Boat" }, "geometry": { "type": "Point", "coordinates": [121.585, 24.985] } },\n    { "type": "Feature", "properties": { "id": "TP-007", "vulnerability_score": 3, "needs": "Water" }, "geometry": { "type": "Point", "coordinates": [121.590, 24.990] } },\n    { "type": "Feature", "properties": { "id": "TP-008", "vulnerability_score": 4, "needs": "Shelter" }, "geometry": { "type": "Point", "coordinates": [121.582, 24.994] } }\n  ]\n}`,
      },
    ],
    showTileSwitcher: true,
  },
];

// ─── HTML Export ───────────────────────────────────────────────
function generateHtmlSource(activeGeoJson: any, tileKey: TileKey) {
  const tile = TILE_LAYERS[tileKey];
  const safeGeoJson = JSON.stringify(activeGeoJson, null, 2);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My WebGIS Map</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    body { margin: 0; font-family: sans-serif; }
    #map { width: 100vw; height: 100vh; }
    .legend {
      position: fixed; bottom: 24px; right: 16px;
      background: white; border-radius: 10px;
      padding: 12px 16px; box-shadow: 0 2px 12px rgba(0,0,0,.15);
      font-size: 12px; line-height: 1.8;
    }
    .dot { display:inline-block; width:10px; height:10px; border-radius:50%; margin-right:6px; }
  </style>
</head>
<body>
  <div id="map"></div>
  <div class="legend">
    <b>Vulnerability Score</b><br>
    <span class="dot" style="background:#ef4444"></span>Critical (≥5)<br>
    <span class="dot" style="background:#f97316"></span>High (4)<br>
    <span class="dot" style="background:#eab308"></span>Moderate (3)<br>
    <span class="dot" style="background:#10b981"></span>Safe (≤2)
  </div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const map = L.map('map').setView([24.985, 121.565], 13);
    L.tileLayer('${tile.url}', { attribution: '${tile.attribution}' }).addTo(map);

    function getColor(score) {
      if (score >= 5) return '#ef4444';
      if (score === 4) return '#f97316';
      if (score === 3) return '#eab308';
      return '#10b981';
    }

    function getZoneStyle(props) {
      if (props.zone_type === 'evacuation') return { color: '#f97316', fillColor: '#f97316', fillOpacity: 0.12, weight: 2 };
      return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 2 };
    }

    const data = ${safeGeoJson};

    const layer = L.geoJSON(data, {
      pointToLayer: function(feature, latlng) {
        const score = feature.properties.vulnerability_score || 0;
        return L.circleMarker(latlng, {
          radius: 12, fillColor: getColor(score),
          color: '#fff', weight: 2, fillOpacity: 1
        });
      },
      style: function(feature) {
        if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
          return getZoneStyle(feature.properties);
        }
        return {};
      },
      onEachFeature: function(feature, layer) {
        const p = feature.properties;
        if (p.id) {
          layer.bindPopup(
            '<b>' + p.id + '</b>' +
            (p.district ? '<br>District: ' + p.district : '') +
            (p.vulnerability_score !== undefined ? '<br>Score: ' + p.vulnerability_score : '') +
            (p.needs ? '<br>Needs: <b>' + p.needs + '</b>' : '')
          );
        } else if (p.name) {
          layer.bindPopup('<b>' + p.name + '</b>' + (p.risk ? '<br>Risk: ' + p.risk : ''));
        }
      }
    }).addTo(map);

    if (data.features.length > 0) {
      try { map.fitBounds(layer.getBounds(), { padding: [40, 40] }); } catch(e) {}
    }
  </script>
</body>
</html>`;
}

// ─── Examples Drawer ───────────────────────────────────────────
function ExamplesDrawer({
  examples,
  onLoad,
}: {
  examples: { label: string; json: string }[];
  onLoad: (json: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-slate-800">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-colors"
      >
        <span className="uppercase tracking-widest">Try Examples</span>
        <span
          className="transition-transform duration-200 text-slate-500"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1.5">
          {examples.map((ex) => (
            <button
              key={ex.label}
              onClick={() => {
                onLoad(ex.json);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 hover:border-slate-600 transition-all group"
            >
              <span className="text-xs text-slate-300 group-hover:text-white transition-colors">
                {ex.label}
              </span>
              <span className="float-right text-[10px] text-slate-600 group-hover:text-sky-400 transition-colors">
                Load →
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step Indicator ────────────────────────────────────────────
function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex border-b border-slate-800">
      {Array.from({ length: total }).map((_, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div
            key={i}
            className={`flex-1 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest border-r border-slate-800 last:border-r-0 transition-colors
              ${active ? "bg-sky-600 text-white"
                : done ? "bg-slate-800 text-sky-400"
                : "bg-slate-900 text-slate-600"}`}
          >
            {done ? "✓" : i + 1}
          </div>
        );
      })}
    </div>
  );
}

// ─── Tile Switcher (inside map) ────────────────────────────────
function TileSwitcherOverlay({
  current,
  onChange,
}: {
  current: TileKey;
  onChange: (k: TileKey) => void;
}) {
  return (
    <div className="absolute top-3 right-3 z-[500] flex gap-1 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl p-1">
      {(Object.keys(TILE_LAYERS) as TileKey[]).map((k) => (
        <button
          key={k}
          onClick={() => onChange(k)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all
            ${current === k ? "bg-sky-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"}`}
        >
          {TILE_LAYERS[k].label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function SimpleTutorialPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [jsonInput, setJsonInput] = useState(tutorialSteps[0].defaultJson);
  const [activeGeoJson, setActiveGeoJson] = useState<any>(
    JSON.parse(tutorialSteps[0].defaultJson)
  );
  const [tileKey, setTileKey] = useState<TileKey>("light");
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy");

  const SandboxMap = useMemo(
    () =>
      dynamic(() => import("./SandboxMap"), {
        ssr: false,
        loading: () => (
          <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-500 font-mono text-sm">
            Loading map engine...
          </div>
        ),
      }),
    []
  );

  useEffect(() => {
    const newJson = tutorialSteps[currentStep].defaultJson;
    setJsonInput(newJson);
    setActiveGeoJson(JSON.parse(newJson));
    setErrorMsg("");
  }, [currentStep]);

  const handleRunCode = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (parsed.type !== "FeatureCollection")
        throw new Error("Must be a FeatureCollection.");
      setActiveGeoJson(parsed);
      setErrorMsg("");
    } catch {
      setErrorMsg("Invalid JSON — check for missing commas or brackets.");
    }
  };

  const handleLoadExample = (json: string) => {
    setJsonInput(json);
    try {
      setActiveGeoJson(JSON.parse(json));
      setErrorMsg("");
    } catch {
      setErrorMsg("Invalid JSON in example.");
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateHtmlSource(activeGeoJson, tileKey));
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus("Copy"), 2000);
  };

  const handleDownload = () => {
    const html = generateHtmlSource(activeGeoJson, tileKey);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-webgis-map.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const step = tutorialSteps[currentStep];
  const isLast = currentStep === tutorialSteps.length - 1;

  return (
    <div className="h-screen bg-slate-950 text-slate-200 flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <header className="flex-none flex items-center justify-between px-6 h-12 bg-slate-900 border-b border-slate-800 z-20">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-white tracking-tight">WebGIS Workshop</span>
          <span className="hidden sm:block text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
            / Simple Mode
          </span>
        </div>
        <Link
          href="/simple-result"
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
        >
          View Final Target →
        </Link>
      </header>

      {/* ── Main Layout ── */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">

        {/* ── Left Panel ── */}
        <div className="w-full lg:w-[480px] flex-none flex flex-col bg-slate-900 border-r border-slate-800 overflow-hidden">

          <StepIndicator current={currentStep} total={tutorialSteps.length} />

          {/* Tutorial content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 space-y-5">

              <div>
                <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">
                  Step {step.id} of {tutorialSteps.length}
                </p>
                <h2 className="text-xl font-bold text-white leading-snug">{step.title}</h2>
              </div>

              <p className="text-sm text-slate-400 leading-relaxed">{step.description}</p>

              {/* Code block */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                    Core Concept
                  </span>
                </div>
                <pre className="p-4 text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto m-0 whitespace-pre">
                  {step.conceptCode}
                </pre>
              </div>

              {/* Mission */}
              <div className="border border-sky-500/20 bg-sky-500/5 rounded-xl p-4">
                <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-2">
                  Your Mission
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">{step.mission}</p>
              </div>

              {/* Tile switcher hint for step 6+ */}
              {step.showTileSwitcher && (
                <div className="border border-slate-700/50 bg-slate-800/30 rounded-xl p-3 flex items-start gap-3">
                  <span className="text-base mt-0.5">🗺️</span>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-slate-200 font-semibold">Tip:</span> Use the style switcher in the top-right corner of the map to change the base layer.
                  </p>
                </div>
              )}
            </div>

            {/* Examples Drawer */}
            <ExamplesDrawer
              examples={step.examples}
              onLoad={handleLoadExample}
            />
          </div>

          {/* ── JSON Editor ── */}
          <div className="flex-none border-t border-slate-800 bg-slate-950 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                GeoJSON Editor
              </span>
              {errorMsg && (
                <span className="text-[10px] font-semibold text-red-400 bg-red-400/10 px-2 py-1 rounded-md">
                  {errorMsg}
                </span>
              )}
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={8}
              className="w-full bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/50 resize-none leading-relaxed"
              spellCheck={false}
            />

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-25 disabled:cursor-not-allowed text-slate-300 text-xs font-semibold transition-colors"
              >
                ← Prev
              </button>

              <button
                onClick={handleRunCode}
                className="flex-1 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-widest transition-all"
              >
                ▶ Update Map
              </button>

              {!isLast ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  Export →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Panel: Map ── */}
        <div className="flex-1 relative bg-slate-800 min-h-0">

          {/* Map label */}
          <div className="absolute top-3 left-3 z-[500] bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-1.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Map</p>
          </div>

          {/* Tile switcher */}
          {step.showTileSwitcher && (
            <TileSwitcherOverlay current={tileKey} onChange={setTileKey} />
          )}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 z-[500] bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl p-3 space-y-1.5">
            {[
              { color: "#ef4444", label: "Critical  (≥5)" },
              { color: "#f97316", label: "High Risk (4)" },
              { color: "#eab308", label: "Moderate  (3)" },
              { color: "#10b981", label: "Safe      (≤2)" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full flex-none" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-slate-400 font-mono">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="absolute inset-0">
            <SandboxMap data={activeGeoJson} tileKey={tileKey} />
          </div>
        </div>
      </main>

      {/* ── Export Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4 lg:p-8">
          <div className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-700 flex flex-col overflow-hidden shadow-2xl">

            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-400 font-mono">my-webgis-map.html</span>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
                >
                  ↓ Download HTML
                </button>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
                >
                  {copyStatus}
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-white text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
              <pre className="text-emerald-400 font-mono text-xs leading-relaxed whitespace-pre">
                <code>{generateHtmlSource(activeGeoJson, tileKey)}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}