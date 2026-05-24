import Link from "next/link";

export default function SimpleTutorialPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-12 px-6 prose prose-slate lg:prose-lg">
        <h1>Simple Mode: Interactive WebGIS Fundamentals</h1>
        <p className="lead">
          Welcome to the WebGIS workshop. In this module, we will build a
          functional post-disaster aid dashboard using basic HTML, CSS, and
          vanilla JavaScript.
        </p>

        <div className="not-prose my-8">
          <Link
            href="/simple-result"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            View the Final Result Dashboard
          </Link>
        </div>

        <h2>Context & Architecture</h2>
        <p>
          During emergencies, aid is often distributed blindly. We have an AI
          model that assigns a <strong>Vulnerability Score (1 to 5)</strong> to
          affected households. Our goal is to visualize this data spatially. To
          keep things simple and avoid local server configuration (CORS issues),
          we will inject our GeoJSON data directly as JavaScript variables.
        </p>

        <hr />

        <h2>Step 0: Preparation & Downloads</h2>
        <ol>
          <li>
            Create a folder on your computer named <code>webgis-workshop</code>.
          </li>
          <li>Open this folder in your code editor (e.g., VS Code).</li>
          <li>
            Create a new file named <code>index.html</code>.
          </li>
          <li>
            Download the required data files below and place them in the same
            folder:
            <ul>
              <li>
                <a href="/data/taipei_flood.js" download>
                  Download <code>taipei_flood.js</code>
                </a>{" "}
                (Polygon data)
              </li>
              <li>
                <a href="/data/taipei_households.js" download>
                  Download <code>taipei_households.js</code>
                </a>{" "}
                (Point data with AI scores)
              </li>
            </ul>
          </li>
        </ol>

        <h2>Step 1: The HTML Skeleton</h2>
        <p>
          We use <strong>Leaflet.js</strong> to render our map. Copy the
          following code into your <code>index.html</code>. Notice how we link
          our downloaded <code>.js</code> data files in the{" "}
          <code>&lt;head&gt;</code> section.
        </p>

        <pre>
          <code className="language-html">{`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Disaster Aid Dashboard</title>
    
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    
    <style>
        body { margin: 0; display: flex; font-family: sans-serif; height: 100vh; }
        #map { flex: 2; height: 100%; }
        #panel { flex: 1; padding: 24px; background: #f8f9fa; overflow-y: auto; }
        .score-badge { padding: 4px 12px; border-radius: 20px; color: white; font-weight: bold; }
    </style>

    <script src="taipei_flood.js"></script>
    <script src="taipei_households.js"></script>
</head>
<body>
    <div id="map"></div>
    <div id="panel">
        <h2>Household Details</h2>
        <p>Select a location on the map.</p>
        <div id="info-content"></div>
    </div>

    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    
    <script>
        // Code for Step 2 goes here
    </script>
</body>
</html>`}</code>
        </pre>

        <h2>Step 2: Initialize the Map</h2>
        <p>
          Add this inside the bottom <code>&lt;script&gt;</code> tag to wake up
          the map, centered on Taipei City.
        </p>

        <pre>
          <code className="language-javascript">{`// Initialize map (Centered on Taipei Wenshan Area)
const map = L.map('map').setView([24.985, 121.565], 14);

// Add a light-themed basemap
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO'
}).addTo(map);`}</code>
        </pre>

        <h2>Step 3: Data-Driven Styling</h2>
        <p>
          We need to color-code the households based on their vulnerability
          score. Let's create a styling function and add both data layers to the
          map.
        </p>

        <pre>
          <code className="language-javascript">{`// 1. Add Flood Zones (Blue polygons)
L.geoJSON(floodData, {
    style: { color: '#3b82f6', weight: 2, fillOpacity: 0.15, dashArray: '5, 5' }
}).addTo(map);

// 2. Define the AI Score Color logic
function getScoreColor(score) {
    if (score >= 5) return '#dc2626'; // Red (Critical)
    if (score === 4) return '#ea580c'; // Orange
    if (score === 3) return '#f59e0b'; // Yellow
    return '#10b981'; // Green (Safe)
}

// 3. Add Household Points
const householdLayer = L.geoJSON(householdData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 12,
            fillColor: getScoreColor(feature.properties.vulnerability_score),
            color: "#ffffff",
            weight: 2,
            fillOpacity: 1
        });
    }
}).addTo(map);`}</code>
        </pre>

        <h2>Step 4: Interactivity & Dashboard Integration</h2>
        <p>
          Finally, we connect the map to the side panel. When a user clicks a
          circle, we inject that feature's properties into the HTML. Update your{" "}
          <code>householdLayer</code> code to include the{" "}
          <code>onEachFeature</code> function:
        </p>

        <pre>
          <code className="language-javascript">{`L.geoJSON(householdData, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 12,
            fillColor: getScoreColor(feature.properties.vulnerability_score),
            color: "#ffffff", weight: 2, fillOpacity: 1
        });
    },
    // NEW: Add interactions
    onEachFeature: function (feature, layer) {
        layer.on('click', function() {
            const props = feature.properties;
            const panel = document.getElementById('info-content');
            const color = getScoreColor(props.vulnerability_score);
            
            panel.innerHTML = \`
                <h3 style="color: \${color}">ID: \${props.id} (Score: \${props.vulnerability_score})</h3>
                <p><strong>Location:</strong> \${props.district}</p>
                <p><strong>Required Aid:</strong> \${props.needs}</p>
                <p><strong>Members:</strong> \${props.members}</p>
                <hr>
                <p><small>\${props.notes}</small></p>
            \`;
            
            // Pan the map smoothly
            map.flyTo(layer.getLatLng(), 15);
        });
    }
}).addTo(map);`}</code>
        </pre>

        <p>
          <strong>🎉 Success!</strong> Save the file and double-click{" "}
          <code>index.html</code> to open it in your browser. You have built a
          fully functional WebGIS dashboard.
        </p>
      </div>
    </div>
  );
}
