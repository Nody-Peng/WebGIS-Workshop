const householdData = {
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
