"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Link from "next/link";
import type { Feature, Point } from "geojson";
// 引入剛才在 ResultMap 定義好的型別
import type { HouseholdProps } from "./ResultMap";

const ResultMap = dynamic(() => import("./ResultMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-50">
      Loading Taipei Map...
    </div>
  ),
});

export default function SimpleResultPage() {
  // 嚴格定義 state 的型別
  const [selected, setSelected] = useState<Feature<
    Point,
    HouseholdProps
  > | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 5) return "#dc2626";
    if (score === 4) return "#ea580c";
    if (score === 3) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="flex h-screen w-full flex-col md:flex-row bg-slate-50 text-gray-800 font-sans">
      <div className="w-full md:w-2/3 h-[50vh] md:h-screen relative">
        <ResultMap onFeatureClick={setSelected} />
      </div>

      <div className="w-full md:w-1/3 h-[50vh] md:h-screen bg-white shadow-xl z-10 p-6 flex flex-col overflow-y-auto">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold">Disaster Aid Allocation</h1>
          <p className="text-sm text-gray-500 mt-1">
            Taipei City Vulnerability Assessment
          </p>
        </div>

        <div className="flex-grow">
          {selected ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  ID: {selected.properties.id}
                </h2>
                <span
                  className="text-white px-3 py-1 rounded-full font-bold text-lg"
                  style={{
                    backgroundColor: getScoreColor(
                      selected.properties.vulnerability_score,
                    ),
                  }}
                >
                  {selected.properties.vulnerability_score}
                </span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Location
                </p>
                <p className="text-base font-medium">
                  {selected.properties.district}
                </p>
              </div>

              <div
                className="bg-gray-50 p-4 rounded-lg border-l-4"
                style={{
                  borderColor: getScoreColor(
                    selected.properties.vulnerability_score,
                  ),
                }}
              >
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Required Aid
                </p>
                <p
                  className="text-lg font-bold"
                  style={{
                    color: getScoreColor(
                      selected.properties.vulnerability_score,
                    ),
                  }}
                >
                  {selected.properties.needs}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                  Family Members
                </p>
                <p className="text-base font-medium mb-3">
                  {selected.properties.members} people
                </p>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Assessment Notes
                  </p>
                  <p className="text-sm text-gray-600">
                    {selected.properties.notes}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg p-6 mt-10">
              <p>
                Select a household on the map to view detailed AI assessment and
                required aid.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <Link
            href="/simple"
            className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Learn How to Build This &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
