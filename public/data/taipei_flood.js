// 定義淹水潛勢區 (包含文山區與南港區的模擬範圍)
const floodData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "zone": "Wenshan Flood Area A", "hazard_level": "High Risk" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[121.56, 24.99], [121.58, 24.99], [121.57, 24.97], [121.55, 24.98], [121.56, 24.99]]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": { "zone": "Nangang River Overflow", "hazard_level": "Moderate Risk" },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [[121.59, 25.06], [121.62, 25.06], [121.61, 25.04], [121.58, 25.04], [121.59, 25.06]]
        ]
      }
    }
  ]
};