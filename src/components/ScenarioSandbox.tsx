/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sliders, RefreshCw, AlertTriangle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { LocationData } from '../lib/environmentalEngine';

interface ScenarioSandboxProps {
  treeTarget: number;
  setTreeTarget: (val: number) => void;
  roofArea: number;
  setRoofArea: (val: number) => void;
  location: LocationData;
  customPm25: number;
  setCustomPm25: (val: number) => void;
  customCo: number;
  setCustomCo: (val: number) => void;
  customNo2: number;
  setCustomNo2: (val: number) => void;
  onResetToBaseline: () => void;
  isGenerating: boolean;
}

export const ScenarioSandbox: React.FC<ScenarioSandboxProps> = ({
  treeTarget,
  setTreeTarget,
  roofArea,
  setRoofArea,
  location,
  customPm25,
  setCustomPm25,
  customCo,
  setCustomCo,
  customNo2,
  setCustomNo2,
  onResetToBaseline,
  isGenerating
}) => {
  const [showPollutantOverride, setShowPollutantOverride] = useState(false);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">
            Intervention Parameters &amp; Sensor Calibration
          </h3>
        </div>

        <button
          onClick={onResetToBaseline}
          disabled={isGenerating}
          className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          title="Reset to regional baseline defaults"
        >
          <RefreshCw className="w-3 h-3" />
          Reset Defaults
        </button>
      </div>

      <div className="mt-3.5 space-y-4">
        {/* Tree Target Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Urban Forestry Target (Trees):</span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
              {treeTarget.toLocaleString()} saplings
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="50000"
            step="1000"
            value={treeTarget}
            onChange={(e) => setTreeTarget(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>1,000 (Micro-Forest)</span>
            <span>25,000</span>
            <span>50,000 (Municipal Scale)</span>
          </div>
        </div>

        {/* Roof Catchment Slider */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Rooftop Catchment Area:</span>
            <span className="font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
              {roofArea.toLocaleString()} m²
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={roofArea}
            onChange={(e) => setRoofArea(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
            <span>50 m² (Single Home)</span>
            <span>500 m² (Apartment)</span>
            <span>2,000 m² (Campus / Industrial)</span>
          </div>
        </div>

        {/* Collapsible Sensor Pollutant Overrides */}
        <div className="pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowPollutantOverride(!showPollutantOverride)}
            className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <span>Simulate Custom Sensor Overrides (PM2.5, CO, NO2)</span>
              {customPm25 !== location.baseline_pm25 && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </span>
            {showPollutantOverride ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {showPollutantOverride && (
            <div className="mt-3 space-y-3 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              {/* PM2.5 */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">PM2.5 Concentration:</span>
                  <span className="font-mono font-semibold text-slate-200">{customPm25} µg/m³</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="250"
                  step="1"
                  value={customPm25}
                  onChange={(e) => setCustomPm25(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              {/* CO */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Carbon Monoxide (CO):</span>
                  <span className="font-mono font-semibold text-slate-200">{customCo} ppm</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.1"
                  value={customCo}
                  onChange={(e) => setCustomCo(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* NO2 */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Nitrogen Dioxide (NO2):</span>
                  <span className="font-mono font-semibold text-slate-200">{customNo2} ppm</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.2"
                  step="0.005"
                  value={customNo2}
                  onChange={(e) => setCustomNo2(Number(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
