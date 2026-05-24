"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// 動態載入 ResultMap，並且嚴格關閉 ssr
const ResultMap = dynamic(() => import("./ResultMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-100">
      Loading map...
    </div>
  ),
});

export default function SimpleResultPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-slate-50">
      {/* Left Panel: The Map */}
      <div className="w-full md:w-2/3 h-[50vh] md:h-screen relative">
        <ResultMap onFeatureClick={setSelectedFeature} />
      </div>

      {/* Right Panel: The Dashboard Details */}
      <div className="w-full md:w-1/3 h-[50vh] md:h-screen bg-white shadow-xl z-10 p-6 overflow-y-auto">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Disaster Vulnerability Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Simple Mode Final Result • WebGIS Workshop
          </p>
        </div>

        {selectedFeature ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Household ID: {selectedFeature.properties.id || "N/A"}
            </h2>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 uppercase tracking-wider">
                Location
              </p>
              <p className="text-lg font-medium text-gray-900">
                {selectedFeature.properties.district || "Unknown District"}
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 uppercase tracking-wider">
                Vulnerability Score
              </p>
              <p className="text-3xl font-bold text-red-600">
                {selectedFeature.properties.vulnerability_score || 0}{" "}
                <span className="text-lg text-red-400">/ 5</span>
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600 uppercase tracking-wider mb-1">
                Required Aid
              </p>
              <p className="text-md text-gray-800">
                {selectedFeature.properties.aid_type ||
                  "No specific aid requested."}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t">
              <a
                href="/simple"
                className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Build This in Simple Mode &rarr;
              </a>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-2/3 text-center opacity-60">
            <p className="text-lg text-gray-600 mt-4">
              Select a location on the map to view household vulnerability
              details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
