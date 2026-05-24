// 定義 AI 評估後的受災家戶點位
const householdData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "id": "TP-001", "district": "Wenshan", "vulnerability_score": 5, "members": 3, "needs": "Medical Evacuation", "notes": "Elderly couple needing immediate assistance.", "phone": "0912-345-678" },
      "geometry": { "type": "Point", "coordinates": [121.565, 24.985] }
    },
    {
      "type": "Feature",
      "properties": { "id": "TP-002", "district": "Wenshan", "vulnerability_score": 2, "members": 4, "needs": "Sandbags", "notes": "Ground floor risk, currently safe.", "phone": "0922-111-222" },
      "geometry": { "type": "Point", "coordinates": [121.558, 24.988] }
    },
    {
      "type": "Feature",
      "properties": { "id": "TP-003", "district": "Xinyi", "vulnerability_score": 4, "members": 5, "needs": "Drinking Water", "notes": "Power outage, large family.", "phone": "0933-444-555" },
      "geometry": { "type": "Point", "coordinates": [121.570, 25.033] }
    },
    {
      "type": "Feature",
      "properties": { "id": "TP-004", "district": "Daan", "vulnerability_score": 3, "members": 2, "needs": "Food Rations", "notes": "Road blocked, supply running low.", "phone": "0944-555-666" },
      "geometry": { "type": "Point", "coordinates": [121.543, 25.026] }
    },
    {
      "type": "Feature",
      "properties": { "id": "TP-005", "district": "Nangang", "vulnerability_score": 5, "members": 6, "needs": "Rescue Boat, Medical", "notes": "Trapped on the 2nd floor, water rising.", "phone": "0955-666-777" },
      "geometry": { "type": "Point", "coordinates": [121.605, 25.055] }
    },
    {
      "type": "Feature",
      "properties": { "id": "TP-006", "district": "Zhongzheng", "vulnerability_score": 1, "members": 2, "needs": "None (Safe)", "notes": "Reporting in as safe.", "phone": "0966-777-888" },
      "geometry": { "type": "Point", "coordinates": [121.518, 25.032] }
    },
    {
      "type": "Feature",
      "properties": { "id": "TP-007", "district": "Neihu", "vulnerability_score": 4, "members": 4, "needs": "Power Generator", "notes": "Medical equipment requires power.", "phone": "0977-888-999" },
      "geometry": { "type": "Point", "coordinates": [121.590, 25.083] }
    }
  ]
};